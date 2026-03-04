<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import maplibregl, { type Map } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';

    // Configurable props
    export let center: [number, number] = [-89.3844, 43.0747];
    export let zoom: number = 12;

    let mapContainer: HTMLDivElement;
    let map: Map | null = null;
    //Get mapbox token from .env
    const mapboxToken = import.meta.env.MAPBOX_API_KEY;

    onMount(() => {
        map = new maplibregl.Map({
            container: mapContainer,
            center,
            zoom,
            style: 'mapbox://styles/mapbox/light-v11',

            transformRequest: (url, resourceType) => {
                if (resourceType === 'Style' || resourceType === 'Source' || resourceType === 'Tile') {
                    // Check if the URL is a mapbox URL
                    if (url.startsWith('mapbox://')) {
                        const mapboxUrl = new URL(url.replace('mapbox://', 'https://api.mapbox.com/'));
                        mapboxUrl.searchParams.set('access_token', mapboxToken);
                        return {
                            url: mapboxUrl.toString()
                        };
                    }
                }
                return { url }; // Return the original URL for non-mapbox requests
            }
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
        height: 100%;
    }
</style>
