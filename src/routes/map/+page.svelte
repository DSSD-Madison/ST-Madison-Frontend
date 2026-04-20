<script lang="ts">
    import Map from '$lib/components/Map.svelte';
    import MetricPicker from '$lib/components/MetricPicker.svelte';
    import type { MetricConfig } from '$lib/config/metrics';
    import {
        EMPTY_PARCEL_FILTER_OPTIONS,
        EMPTY_PARCEL_FILTERS,
        type ParcelFilterOptions,
        type ParcelFilterState
    } from '$lib/config/parcelFilters';
    import { PUBLIC_TILE_ADDRESS } from '$env/static/public';

    let activeMetric: MetricConfig | null = $state(null);
    let computedStops: Record<string, [number, string][]> = $state({});
    let computedValues: Record<string, number[]> = $state({});
    let parcelFilters: ParcelFilterState = $state(EMPTY_PARCEL_FILTERS);
    let parcelFilterOptions: ParcelFilterOptions = $state(EMPTY_PARCEL_FILTER_OPTIONS);
</script>

<div class="map-page">
    <Map
        tileAddress={PUBLIC_TILE_ADDRESS || null}
        {activeMetric}
        filters={parcelFilters}
        oncomputedstops={(s: Record<string, [number, string][]>) => (computedStops = s)}
        oncomputedvalues={(v: Record<string, number[]>) => (computedValues = v)}
        onfilteroptions={(options: ParcelFilterOptions) => (parcelFilterOptions = options)}
    />
    <MetricPicker
        {activeMetric}
        {computedStops}
        {computedValues}
        filters={parcelFilters}
        filterOptions={parcelFilterOptions}
        onchange={(m: MetricConfig | null) => (activeMetric = m)}
        onfilterchange={(next: ParcelFilterState) => (parcelFilters = next)}
    />
</div>

<style>
    .map-page {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
