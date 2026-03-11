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

    // Configurable props
    export let center: [number, number] = [-89.3844, 43.0747];
    export let zoom: number = 12;
    export let tileAddress: string | null = null;

    let mapContainer: HTMLDivElement;
    let map: Map | null = null;

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
                'fill-color': '#1d4ed8',
                'fill-opacity': 0.14
            }
        };

        const parcelOutlineLayer: LineLayerSpecification = {
            id: 'parcel-outline',
            type: 'line',
            source: PARCEL_SOURCE_ID,
            'source-layer': PARCEL_SOURCE_LAYER,
            paint: {
                'line-color': '#1e3a8a',
                'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10,
                    0.3,
                    14,
                    1.2,
                    17,
                    2.2
                ],
                'line-opacity': 0.75
            }
        };

        currentMap.addSource(PARCEL_SOURCE_ID, parcelSource);
        currentMap.addLayer(parcelFillLayer);
        currentMap.addLayer(parcelOutlineLayer);
    }

    onMount(() => {
        if (tileAddress) {
            ensurePmtilesProtocol();
            ensureArchive(tileAddress);
        } else {
            console.warn('Parcel tile address is not configured; the parcel overlay will not be shown.');
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

<style>
    .map-container {
        width: 100%;
        height: 100%;
    }
</style>
