<script lang="ts">
    import { NUMERIC_METRICS } from '$lib/config/metrics';
    import type { NumericMetric } from '$lib/config/metrics';
    import {
        EMPTY_PARCEL_FILTERS,
        type ParcelFilterState,
        matchesParcelFilters,
        buildParcelFilterOptions
    } from '$lib/config/parcelFilters';
    import FilterPanel from '$lib/components/FilterPanel.svelte';
    import MetricChips from '$lib/components/statistics/MetricChips.svelte';
    import GroupByChips from '$lib/components/statistics/GroupByChips.svelte';
    import type { GroupByKey } from '$lib/components/statistics/GroupByChips.svelte';
    import DistributionChart from '$lib/components/statistics/DistributionChart.svelte';
    import GroupedBoxPlot from '$lib/components/statistics/GroupedBoxPlot.svelte';
    import ScatterChart from '$lib/components/statistics/ScatterChart.svelte';

    let { data } = $props();

    let filters: ParcelFilterState = $state(EMPTY_PARCEL_FILTERS);
    let activeMetric: NumericMetric = $state(
        NUMERIC_METRICS.find((m) => m.key === 'current_total_value') ?? NUMERIC_METRICS[0]
    );
    let groupBy: GroupByKey = $state('alder_district_name');
    let correlateWith: NumericMetric = $state(
        NUMERIC_METRICS.find((m) => m.key === 'tax_rate') ?? NUMERIC_METRICS[1]
    );

    let filtered = $derived(
        data.parcels.filter((p) => matchesParcelFilters(p, filters))
    );
    let filterOptions = $derived(buildParcelFilterOptions(data.parcels));

    function handleCorrelateChange(m: NumericMetric) {
        correlateWith = m;
        if (activeMetric.key === m.key) {
            activeMetric = NUMERIC_METRICS.find((x) => x.key !== m.key) ?? NUMERIC_METRICS[0];
        }
    }
</script>

<div class="stats-page">
    <aside class="sidebar">
        <FilterPanel
            variant="sidebar"
            {filters}
            filterOptions={filterOptions}
            matched={filtered.length}
            total={data.parcels.length}
            onfilterchange={(f) => (filters = f)}
        />
    </aside>

    <main class="main">
        <div class="controls card">
            <MetricChips
                metrics={NUMERIC_METRICS}
                activeKey={activeMetric.key}
                onchange={(m) => {
                    activeMetric = m;
                    if (correlateWith.key === m.key) {
                        correlateWith =
                            NUMERIC_METRICS.find((x) => x.key !== m.key) ?? NUMERIC_METRICS[1];
                    }
                }}
            />
            <GroupByChips active={groupBy} onchange={(k) => (groupBy = k)} />
        </div>

        <DistributionChart parcels={filtered} metric={activeMetric} />

        <div class="bottom-row">
            <GroupedBoxPlot parcels={filtered} metric={activeMetric} {groupBy} />
            <ScatterChart
                parcels={filtered}
                metricY={activeMetric}
                metricX={correlateWith}
                oncorrelatechange={handleCorrelateChange}
            />
        </div>
    </main>
</div>

<style>
    .stats-page {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 1.25rem;
        padding: 1.25rem;
        min-height: calc(100vh - 64px);
        box-sizing: border-box;
        background-color: #0c2340;
    }

    .sidebar {
        align-self: start;
        position: sticky;
        top: calc(64px + 1.25rem);
        max-height: calc(100vh - 64px - 2.5rem);
        overflow-y: auto;
        background-color: var(--color-lower-nav, #fff);
        border-radius: 12px;
    }

    .main {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        min-width: 0;
    }

    .controls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .card {
        background-color: var(--color-lower-nav);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
    }

    .bottom-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
    }

    @media (max-width: 1024px) {
        .bottom-row {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .stats-page {
            grid-template-columns: 1fr;
        }

        .sidebar {
            position: static;
            max-height: none;
        }
    }
</style>
