<script lang="ts">
    import AssessmentsTable from './AssessmentsTable.svelte';
    import LandEfficiencyTable from './LandEfficiencyTable.svelte';
    import BreakdownBarChart from './BreakdownBarChart.svelte';
    import PropertySearch from './PropertySearch.svelte';
    import PropertyDetailsDropdown from './PropertyDetailsDropdown.svelte';
    import TrendChart from './TrendChart.svelte';

    import { fetchParcel } from '$lib/api';
    import type {
        AssessmentsData,
        LandEfficiencyData,
        TrendsData,
        PropertyDetailsData
    } from '$lib/api';

    const barColors: Record<string, string> = {
        City: '#ffb549',
        School: '#f9f9f9',
        County: '#A7C6ED',
        MATC: '#6A89B0'
    };

    let groupMode = $state<'group' | 'year'>('group');
    let loading = $state(false);
    let error = $state<string | null>(null);

    let assessments = $state<AssessmentsData | null>(null);
    let propertyDetails = $state<PropertyDetailsData | null>(null);
    let landEfficiency = $state<LandEfficiencyData | null>(null);
    let trends = $state<TrendsData | null>(null);
    let taxBreakdown = $state<{ label: string; values: number[] }[]>([]);
    let taxBreakdownYears = $state<number[]>([]);

    async function handleSearch(address: string) {
        loading = true;
        error = null;
        try {
            const data = await fetchParcel(address);
            assessments = data.assessments;
            landEfficiency = data.landEfficiency;
            trends = data.trends;
            taxBreakdown = data.taxBreakdown.sources;
            taxBreakdownYears = data.taxBreakdown.years;
            propertyDetails = data.propertyDetails;
        } catch (e) {
            error = e instanceof Error ? e.message : 'An unexpected error occurred.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="page">
    <h1>Tax Explorer</h1>

    <div class="search-card">
        <div class="search-field">
            <label for="address">Find a Property</label>
            <PropertySearch onsearch={handleSearch} />
        </div>
        <PropertyDetailsDropdown data={propertyDetails} />
    </div>

    {#if error}
        <div class="error-banner">{error}</div>
    {/if}

    <div class="content" class:loading>
        <div class="tables-row">
            <AssessmentsTable data={assessments} />
            <LandEfficiencyTable data={landEfficiency} />
        </div>

        {#if trends === null && taxBreakdown.length === 0}
            <div class="charts-placeholder">
                <p>Search for a property to see a graphical breakdown of trends and tax distribution.</p>
            </div>
        {:else}
            <!-- Trends -->
            <div class="section">
                <h2>Trends</h2>
                <div class="trends-row">
                    <TrendChart
                        label="Effective Tax Rate"
                        color="#ffb549"
                        data={trends?.effectiveTaxRate ?? null}
                        years={trends?.years ?? null}
                        format={(v) => v.toFixed(4)}
                    />
                    <TrendChart
                        label="Net Taxes"
                        color="#A7C6ED"
                        data={trends?.netTaxes ?? null}
                        years={trends?.years ?? null}
                        format={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`)}
                    />
                    <TrendChart
                        label="Assessed Value"
                        color="#A7C6ED"
                        data={trends?.assessedValue ?? null}
                        years={trends?.years ?? null}
                        format={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`)}
                    />
                </div>
            </div>

            <!-- Breakdown by Group -->
            <div class="section">
                <div class="breakdown-header">
                    <h2>Breakdown by Group</h2>
                    <div class="toggle-group">
                        <button
                            class="toggle-btn"
                            class:active={groupMode === 'group'}
                            onclick={() => (groupMode = 'group')}
                        >
                            <span class="dot blue"></span> By Group
                        </button>
                        <button
                            class="toggle-btn"
                            class:active={groupMode === 'year'}
                            onclick={() => (groupMode = 'year')}
                        >
                            <span class="dot gray"></span> By Year
                        </button>
                    </div>
                </div>
                {#if groupMode === 'group'}
                    <div class="bar-charts-row">
                        {#each taxBreakdown as group (group.label)}
                            <BreakdownBarChart
                                label={group.label}
                                bars={group.values}
                                color={barColors[group.label]}
                                xLabels={taxBreakdownYears}
                            />
                        {/each}
                    </div>
                {:else}
                    <div class="bar-charts-row">
                        {#each taxBreakdownYears as year, i (year)}
                            <BreakdownBarChart
                                label={String(year)}
                                bars={taxBreakdown.map((s) => s.values[i])}
                                colors={taxBreakdown.map((s) => barColors[s.label])}
                                xLabels={taxBreakdown.map((s) => s.label)}
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .page {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem 2.5rem;
    }

    h1 {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 1.5rem;
        letter-spacing: -0.01em;
    }

    h2 {
        font-size: 1.35rem;
        font-weight: 700;
        margin: 0 0 1rem;
        letter-spacing: -0.01em;
    }

    /* Search card */
    .search-card {
        background-color: var(--color-lower-nav);
        border-radius: 12px;
        padding: 1.5rem 2rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: flex-end;
        margin-bottom: 2rem;
        min-width: 280px;
    }

    .search-field {
        flex: 1;
        min-width: 0;
    }

    @media (max-width: 768px) {
        .search-card {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .search-field label {
        display: block;
        font-size: 0.8rem;
        color: var(--color-link);
        margin-bottom: 0.4rem;
    }

    .error-banner {
        background: rgba(255, 100, 80, 0.15);
        border: 1px solid rgba(255, 100, 80, 0.4);
        border-radius: 8px;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        color: #ffb4ab;
        margin-bottom: 1.5rem;
    }

    .content {
        transition: opacity 0.15s;
    }

    .content.loading {
        opacity: 0.4;
        pointer-events: none;
    }

    /* Data cards row */
    .tables-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
        .tables-row {
            grid-template-columns: 1fr;
        }
    }

    .section {
        margin-bottom: 2rem;
    }

    .charts-placeholder {
        background-color: var(--color-lower-nav);
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        color: var(--color-link);
        font-size: 0.875rem;
        font-style: italic;
        margin-bottom: 2rem;
    }

    .charts-placeholder p {
        margin: 0;
    }

    /* Breakdown */
    .breakdown-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .breakdown-header h2 {
        margin: 0;
    }

    .toggle-group {
        display: flex;
        background: #385a8a;
        border-radius: 999px;
        padding: 4px;
    }

    .toggle-btn {
        padding: 0.3rem 1rem;
        border: none;
        border-radius: 999px;
        background: transparent;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        color: var(--color-link);
        transition:
            background 0.15s,
            color 0.15s;
    }

    .toggle-btn.active {
        background: var(--color-yellow);
        color: var(--color-main-nav);
        font-weight: 600;
    }

    .dot {
        display: none;
    }

    .trends-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
    }

    .bar-charts-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }

    @media (max-width: 1280px) {
        .bar-charts-row {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 1024px) {
        .trends-row {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 768px) {
        .trends-row,
        .bar-charts-row {
            grid-template-columns: 1fr;
        }
    }
</style>
