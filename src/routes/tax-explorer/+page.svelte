<script lang="ts">
    import ExpandDown from '~icons/lets-icons/expand-down';

    import AssessmentsTable from './AssessmentsTable.svelte';
    import LandEfficiencyTable from './LandEfficiencyTable.svelte';
    import BreakdownBarChart from './BreakdownBarChart.svelte';
    import PropertySearch from './PropertySearch.svelte';
    import PropertyDetailsDropdown from './PropertyDetailsDropdown.svelte';
    import TrendChart from './TrendChart.svelte';

    import { fetchParcel } from '$lib/api';
    import type { AssessmentsData, LandEfficiencyData, TrendsData, PropertyDetailsData } from '$lib/api';

    const barColors: Record<string, string> = {
        City: '#ffb549',
        School: '#f9f9f9',
        County: '#A7C6ED',
        MATC: '#6A89B0'
    };

    let groupMode = $state<'group' | 'year'>('group');
    let dropdownOpen = $state(false);
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
        <div class="dropdown-anchor">
            <button class="dropdown-btn" onclick={() => (dropdownOpen = !dropdownOpen)}>
                Property Details <ExpandDown
                    class="property-details-icon {dropdownOpen ? 'rotated' : ''}"
                />
            </button>
            <PropertyDetailsDropdown open={dropdownOpen} data={propertyDetails} />
        </div>
    </div>

    {#if error}
        <div class="error-banner">{error}</div>
    {/if}

    <div class="content" class:loading>
    <div class="tables-row">
        <AssessmentsTable data={assessments} />
        <LandEfficiencyTable data={landEfficiency} />
    </div>

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
                format={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`}
            />
            <TrendChart
                label="Assessed Value"
                color="#A7C6ED"
                data={trends?.assessedValue ?? null}
                years={trends?.years ?? null}
                format={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`}
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

        .dropdown-anchor {
            width: 100%;
        }

        .dropdown-btn {
            width: 100%;
            justify-content: space-between;
        }
    }

    .search-field label {
        display: block;
        font-size: 0.8rem;
        color: var(--color-link);
        margin-bottom: 0.4rem;
    }

    .dropdown-anchor {
        position: relative;
        flex-shrink: 0;
    }

    .dropdown-btn {
        padding: 0.6rem 1rem;
        border: none;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--color-text);
        font-family: inherit;
        font-size: 0.875rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        white-space: nowrap;
        transition: background 0.15s;
    }

    .dropdown-btn:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    .dropdown-btn :global(svg) {
        transition: transform 0.3s ease;
    }

    .dropdown-btn :global(.rotated) {
        transform: rotate(180deg);
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
        background: #385A8A;
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
        transition: background 0.15s, color 0.15s;
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
