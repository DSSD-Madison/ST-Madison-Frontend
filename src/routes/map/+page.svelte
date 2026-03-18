<script lang="ts">
    import Map from '$lib/components/Map.svelte';
    import MetricPicker from '$lib/components/MetricPicker.svelte';
    import type { MetricConfig } from '$lib/config/metrics';
    import { PUBLIC_TILE_ADDRESS } from '$env/static/public';

    let activeMetric: MetricConfig | null = $state(null);
</script>

<div class="map-page">
    <Map tileAddress={PUBLIC_TILE_ADDRESS || null} {activeMetric} />
    <MetricPicker {activeMetric} onchange={(m) => (activeMetric = m)} />
</div>

<style>
    .map-page {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
