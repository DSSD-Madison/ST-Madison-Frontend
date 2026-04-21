<script module lang="ts">
    import maplibreglModule from 'maplibre-gl';
    import { PMTiles, Protocol } from 'pmtiles';

    const PARCEL_SOURCE_ID = 'parcels';
    const PARCEL_SOURCE_LAYER = 'parcels';
    const protocol = new Protocol();
    const registeredArchives: Record<string, true> = {};

    let protocolRegistered = false;

    function ensurePmtilesProtocol() {
        if (protocolRegistered) {
            return;
        }

        maplibreglModule.addProtocol('pmtiles', protocol.tile);
        protocolRegistered = true;
    }

    function ensureArchive(tileAddress: string) {
        if (registeredArchives[tileAddress]) {
            return;
        }

        protocol.add(new PMTiles(tileAddress));
        registeredArchives[tileAddress] = true;
    }
</script>

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import maplibregl, {
        type FillLayerSpecification,
        type LineLayerSpecification,
        type Map,
        type VectorSourceSpecification
    } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { metrics, type MetricConfig } from '$lib/config/metrics';
    import {
        buildParcelFilterOptions,
        EMPTY_PARCEL_FILTERS,
        normalizeParcelFilters,
        type ParcelFilterOptions,
        type ParcelFilterState
    } from '$lib/config/parcelFilters';
    import { computeStops } from '$lib/utils/colorScale';
    import type { ParcelTileProperties } from '$lib/api';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import { formatMetricValue } from '$lib/utils/formatting';

    type Props = {
        center?: [number, number];
        zoom?: number;
        tileAddress?: string | null;
        activeMetric?: MetricConfig | null;
        filters?: ParcelFilterState;
        oncomputedstops?: (stops: Record<string, [number, string][]>) => void;
        oncomputedvalues?: (values: Record<string, number[]>) => void;
        onfilteroptions?: (options: ParcelFilterOptions) => void;
    };

    let {
        center = [-89.3844, 43.0747],
        zoom = 12,
        tileAddress = null,
        activeMetric = null,
        filters = EMPTY_PARCEL_FILTERS,
        oncomputedstops,
        oncomputedvalues,
        onfilteroptions
    }: Props = $props();

    let computedStops = $state<Record<string, [number, string][]>>({});

    let mapContainer: HTMLDivElement;
    let map: Map | null = $state(null);

    let tooltipX = $state(0);
    let tooltipY = $state(0);
    let tooltipVisible = $state(false);
    let tooltipAddress = $state<string | null>(null);
    let tooltipMetricLabel = $state<string | null>(null);
    let tooltipMetricValue = $state<string | null>(null);
    let tooltipPropertyUse = $state<string | null>(null);

    const DEFAULT_FILL_COLOR = '#1d4ed8';
    const DEFAULT_FILL_OPACITY = 0.14;
    const METRIC_FILL_OPACITY = 0.7;

    function buildAnyExpression(field: string, values: Array<string | number>): unknown[] {
        return ['any', ...values.map((value) => ['==', ['get', field], value])];
    }

    function buildLayerFilterExpression(state: ParcelFilterState): unknown[] | null {
        const normalized = normalizeParcelFilters(state);
        const conditions: unknown[] = [];

        if (normalized.areaPlanNames.length > 0) {
            conditions.push(buildAnyExpression('area_plan_name', normalized.areaPlanNames));
        }
        if (normalized.alderDistrictNames.length > 0) {
            conditions.push(buildAnyExpression('alder_district_name', normalized.alderDistrictNames));
        }
        if (normalized.wards.length > 0) {
            conditions.push(buildAnyExpression('ward', normalized.wards));
        }
        if (normalized.propertyClasses.length > 0) {
            conditions.push(buildAnyExpression('property_class', normalized.propertyClasses));
        }
        if (normalized.propertyUses.length > 0) {
            conditions.push(buildAnyExpression('property_use', normalized.propertyUses));
        }

        if (conditions.length === 0) {
            return null;
        }

        return ['all', ...conditions];
    }

    function applyLayerFilters(currentMap: Map, state: ParcelFilterState) {
        if (!currentMap.getLayer('parcel-fill') || !currentMap.getLayer('parcel-outline')) {
            return;
        }

        const filterExpression = buildLayerFilterExpression(state) as maplibregl.FilterSpecification | null;
        currentMap.setFilter('parcel-fill', filterExpression);
        currentMap.setFilter('parcel-outline', filterExpression);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function buildFillColor(metric: MetricConfig, stops: [number, string][]): any {
        if (metric.type === 'numeric') {
            if (stops.length === 0) return DEFAULT_FILL_COLOR;
            return [
                'interpolate',
                ['linear'],
                ['coalesce', ['get', metric.key], 0],
                ...stops.flatMap(([v, c]) => [v, c])
            ];
        }

        // categorical
        const pairs: string[] = [];
        for (const [category, color] of Object.entries(metric.categories)) {
            pairs.push(category, color);
        }
        return ['match', ['get', metric.key], ...pairs, metric.fallbackColor];
    }

    function applyMetricStyle(currentMap: Map, metric: MetricConfig | null) {
        if (!currentMap.getLayer('parcel-fill')) return;

        if (!metric) {
            currentMap.setPaintProperty('parcel-fill', 'fill-color', DEFAULT_FILL_COLOR);
            currentMap.setPaintProperty('parcel-fill', 'fill-opacity', DEFAULT_FILL_OPACITY);
            currentMap.setLayoutProperty('parcel-outline', 'visibility', 'visible');
            return;
        }

        const stops = metric.type === 'numeric' ? (computedStops[metric.key] ?? []) : [];
        if (metric.type === 'numeric' && stops.length === 0) return;

        currentMap.setPaintProperty('parcel-fill', 'fill-color', buildFillColor(metric, stops));
        currentMap.setPaintProperty('parcel-fill', 'fill-opacity', METRIC_FILL_OPACITY);
        currentMap.setLayoutProperty('parcel-outline', 'visibility', 'none');
    }

    $effect(() => {
        if (map) {
            applyMetricStyle(map, activeMetric);
        }
    });

    // Re-apply style once stops are computed (computedStops changes trigger this effect)
    $effect(() => {
        void computedStops;
        if (map && activeMetric) {
            applyMetricStyle(map, activeMetric);
        }
    });

    $effect(() => {
        if (!map) return;

        applyLayerFilters(map, filters);
    });

    function computeAllStops(currentMap: Map) {
        if (!currentMap.getSource(PARCEL_SOURCE_ID)) {
            return;
        }

        const allFeatures = currentMap.querySourceFeatures(PARCEL_SOURCE_ID, {
            sourceLayer: PARCEL_SOURCE_LAYER
        });

        const allProperties = allFeatures.map((f) => f.properties as Partial<ParcelTileProperties> | undefined);

        const nextStops: Record<string, [number, string][]> = {};
        const nextValues: Record<string, number[]> = {};
        for (const metric of metrics) {
            if (metric.type !== 'numeric') continue;
            const vals = allFeatures
                .map((f) => f.properties?.[metric.key])
                .filter((v): v is number => typeof v === 'number');
            nextStops[metric.key] = computeStops(vals, metric.colorScheme, metric.scaleType);
            nextValues[metric.key] = vals;
        }
        computedStops = nextStops;
        oncomputedstops?.(nextStops);
        oncomputedvalues?.(nextValues);
        onfilteroptions?.(buildParcelFilterOptions(allProperties));
    }

    function addParcelLayers(currentMap: Map) {
        if (!tileAddress || currentMap.getSource(PARCEL_SOURCE_ID)) {
            return;
        }

        ensurePmtilesProtocol();
        ensureArchive(tileAddress);

        const parcelSource: VectorSourceSpecification = {
            type: 'vector',
            url: `pmtiles://${tileAddress}`
        };

        const parcelFillLayer: FillLayerSpecification = {
            id: 'parcel-fill',
            type: 'fill',
            source: PARCEL_SOURCE_ID,
            'source-layer': PARCEL_SOURCE_LAYER,
            paint: {
                'fill-color': DEFAULT_FILL_COLOR,
                'fill-opacity': DEFAULT_FILL_OPACITY
            }
        };

        const parcelOutlineLayer: LineLayerSpecification = {
            id: 'parcel-outline',
            type: 'line',
            source: PARCEL_SOURCE_ID,
            'source-layer': PARCEL_SOURCE_LAYER,
            paint: {
                'line-color': '#1e3a8a',
                'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.3, 14, 1.2, 17, 2.2],
                'line-opacity': 0.75
            }
        };

        currentMap.addSource(PARCEL_SOURCE_ID, parcelSource);
        currentMap.addLayer(parcelFillLayer);
        currentMap.addLayer(parcelOutlineLayer);
        applyLayerFilters(currentMap, filters);

        currentMap.once('idle', () => computeAllStops(currentMap));

        currentMap.on('mousemove', 'parcel-fill', (e) => {
            const features = currentMap.queryRenderedFeatures(e.point, { layers: ['parcel-fill'] });
            if (!features.length) return;

            const props = features[0].properties as ParcelTileProperties;
            currentMap.getCanvas().style.cursor = 'pointer';
            tooltipX = e.originalEvent.clientX;
            tooltipY = e.originalEvent.clientY;
            tooltipAddress = typeof props.parcel_address === 'string' ? props.parcel_address : null;
            tooltipPropertyUse =
                typeof props.property_use === 'string'
                    ? props.property_use
                    : typeof props.property_class === 'string'
                      ? props.property_class
                      : null;

            if (activeMetric) {
                tooltipMetricLabel = activeMetric.label;
                tooltipMetricValue = formatMetricValue(
                    props[activeMetric.key],
                    activeMetric
                );
            } else {
                tooltipMetricLabel = null;
                tooltipMetricValue = null;
            }

            tooltipVisible = true;
        });

        currentMap.on('mouseleave', 'parcel-fill', () => {
            currentMap.getCanvas().style.cursor = '';
            tooltipVisible = false;
        });
    }

    onMount(() => {
        if (tileAddress) {
            ensurePmtilesProtocol();
            ensureArchive(tileAddress);
        } else {
            console.warn(
                'Parcel tile address is not configured; the parcel overlay will not be shown.'
            );
        }

        const initializedMap = new maplibregl.Map({
            container: mapContainer,
            center,
            zoom,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
        });

        initializedMap.on('load', () => {
            addParcelLayers(initializedMap);
        });

        map = initializedMap;

        initializedMap.addControl(new maplibregl.NavigationControl(), 'top-right');
    });

    onDestroy(() => {
        if (map) {
            map.remove();
            map = null;
        }
    });
</script>

<div bind:this={mapContainer} class="map-container"></div>
<Tooltip
    x={tooltipX}
    y={tooltipY}
    visible={tooltipVisible}
    address={tooltipAddress}
    metricLabel={tooltipMetricLabel}
    metricValue={tooltipMetricValue}
    propertyUse={tooltipPropertyUse}
/>

<style>
    .map-container {
        width: 100%;
        height: 100%;
        flex: 1;
    }
</style>
