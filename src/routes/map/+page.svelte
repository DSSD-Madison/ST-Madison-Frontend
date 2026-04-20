<script lang="ts">
    import Map from '$lib/components/Map.svelte';
    import MetricPicker from '$lib/components/MetricPicker.svelte';
    import type { MetricConfig } from '$lib/config/metrics';
    import { PUBLIC_TILE_ADDRESS } from '$env/static/public';

    let activeMetric: MetricConfig | null = $state(null);
    let computedStops: Record<string, [number, string][]> = $state({});
    let computedValues: Record<string, number[]> = $state({});
</script>

<div class="map-page">
    <Map
        tileAddress={PUBLIC_TILE_ADDRESS || null}
        {activeMetric}
        oncomputedstops={(s) => (computedStops = s)}
        oncomputedvalues={(v) => (computedValues = v)}
    />
    <MetricPicker {activeMetric} {computedStops} {computedValues} onchange={(m) => (activeMetric = m)} />
</div>

<style>
    .map-page {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
