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
    import type { MetricConfig } from '$lib/config/metrics';
    import type { ParcelTileProperties } from '$lib/api';
    import Tooltip from '$lib/components/Tooltip.svelte';

    type Props = {
        center?: [number, number];
        zoom?: number;
        tileAddress?: string | null;
        activeMetric?: MetricConfig | null;
    };

    let {
        center = [-89.3844, 43.0747],
        zoom = 12,
        tileAddress = null,
        activeMetric = null
    }: Props = $props();

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

    function formatMetricValue(value: unknown, metric: MetricConfig): string {
        const num = typeof value === 'number' ? value : parseFloat(String(value));
        if (isNaN(num)) return '—';
        if (metric.type === 'categorical') return String(value);
        switch (metric.format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0
                }).format(num);
            case 'percent':
                return num.toFixed(2) + '%';
            default:
                return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function buildFillColor(metric: MetricConfig): any {
        if (metric.type === 'numeric') {
            const stops: (number | string)[] = [];
            for (const [value, color] of metric.stops) {
                stops.push(value, color);
            }
            return ['interpolate', ['linear'], ['coalesce', ['get', metric.key], 0], ...stops];
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

        currentMap.setPaintProperty('parcel-fill', 'fill-color', buildFillColor(metric));
        currentMap.setPaintProperty('parcel-fill', 'fill-opacity', METRIC_FILL_OPACITY);
        currentMap.setLayoutProperty('parcel-outline', 'visibility', 'none');
    }

    $effect(() => {
        if (map) {
            applyMetricStyle(map, activeMetric);
        }
    });

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

        const fillColor = activeMetric ? buildFillColor(activeMetric) : DEFAULT_FILL_COLOR;
        const fillOpacity = activeMetric ? METRIC_FILL_OPACITY : DEFAULT_FILL_OPACITY;

        const parcelFillLayer: FillLayerSpecification = {
            id: 'parcel-fill',
            type: 'fill',
            source: PARCEL_SOURCE_ID,
            'source-layer': PARCEL_SOURCE_LAYER,
            paint: {
                'fill-color': fillColor,
                'fill-opacity': fillOpacity
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
    }
</style>
