<script lang="ts">
    import { onMount, onDestroy} from 'svelte';
    import maplibregl, {Map} from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
    export let center: [number, number] = [-89.3844, 43.0747];
    export let zoom: number = 12;
    export let styleUrl: string = 'https://demotiles.maplibre.org/style.json';


    let mapContainer: HTMLElement;
    let map: Map;
    onMount(() => {
        map = new maplibregl.Map({
            container: mapContainer,
            //default style
            style: styleUrl,
            //Madison coordinates
            center,
            zoom
        });
        //Zoom controls
        map.addControl(new maplibregl.NavigationControl(), 'top-right');
    });
    //prevent memory leaks
    onDestroy(() => {
        if (map) map.remove();
    });

</script>

<div class="map-container" bind:this={mapContainer}></div>

<style>
    .map-container {
        width: 100%;
        height: 100vh;
    }
</style>