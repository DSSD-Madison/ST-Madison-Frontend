<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import maplibregl, { type Map } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';

    // Configurable props
    export let center: [number, number] = [-89.3844, 43.0747];
    export let zoom: number = 12;

    let mapContainer: HTMLDivElement;
    let map: Map | null = null;

    onMount(() => {
        map = new maplibregl.Map({
            container: mapContainer,
            center,
            zoom,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: [
                            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        ],
                        tileSize: 256,
                        attribution:
                            '&copy; OpenStreetMap Contributors'
                    }
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm'
                    }
                ]
            } as any // avoids strict TS style type errors
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
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
        height: 100vh;
    }
</style>