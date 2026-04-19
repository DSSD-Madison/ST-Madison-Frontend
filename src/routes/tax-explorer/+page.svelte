<script lang="ts">
    import ExpandDown from '~icons/lets-icons/expand-down';

    import AssessmentsTable from './AssessmentsTable.svelte';
    import LandEfficiencyTable from './LandEfficiencyTable.svelte';
    import BreakdownBarChart from './BreakdownBarChart.svelte';
    import PropertySearch from './PropertySearch.svelte';
    import PropertyDetailsDropdown from './PropertyDetailsDropdown.svelte';
    import TrendChart from './TrendChart.svelte';

    import assessmentsMock from '$lib/mock/parcel-assessments.json';
    import landEfficiencyMock from '$lib/mock/parcel-land-efficiency.json';
    import trendsMock from '$lib/mock/parcel-trends.json';
    import taxBreakdownMock from '$lib/mock/parcel-tax-breakdown.json';
    import propertyDetailsMock from '$lib/mock/parcel-property-details.json';

    const barColors: Record<string, string> = {
        City: '#5b9bd5',
        School: '#e07070',
        County: '#5bad5b',
        MATC: '#9b7dd4'
    };

    let groupMode = $state<'group' | 'year'>('group');
    let dropdownOpen = $state(false);

    let assessments = $state(assessmentsMock);
    let propertyDetails = $state(propertyDetailsMock);
    let landEfficiency = $state(landEfficiencyMock);
    let trends = $state(trendsMock);
    let taxBreakdown = $state(taxBreakdownMock.sources);
    let taxBreakdownYears = $state(taxBreakdownMock.years);

    async function handleSearch(address: string) {
        // TODO: fetch parcel data from backend API using address
        // assessments = await fetchAssessments(address);
        // landEfficiency = await fetchLandEfficiency(address);
        // trends = await fetchTrends(address);
        // taxBreakdown = await fetchTaxBreakdown(address);
        console.log('searching for:', address);
    }
</script>

<div class="page">
    <h1>Tax Explorer</h1>

    <div class="search-section">
        <label for="address">Find a Property</label>
        <div class="search-row">
            <PropertySearch onsearch={handleSearch} />
            <div class="dropdown-anchor">
                <button class="dropdown-btn" onclick={() => (dropdownOpen = !dropdownOpen)}>
                    Property Details <ExpandDown
                        class="property-details-icon {dropdownOpen ? 'rotated' : ''}"
                    />
                </button>
                <PropertyDetailsDropdown open={dropdownOpen} data={propertyDetails} />
            </div>
        </div>
    </div>

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
                color="#4a9e4a"
                data={trends?.effectiveTaxRate ?? null}
            />
            <TrendChart label="Net Taxes" color="#c84b4b" data={trends?.netTaxes ?? null} />
            <TrendChart
                label="Assessed Value"
                color="#4a72c8"
                data={trends?.assessedValue ?? null}
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

<style>
    .page {
        padding: 2rem;
    }

    h1 {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 1.25rem;
    }

    h2 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.75rem;
    }

    .search-section {
        margin-bottom: 1.75rem;
    }

    .search-section label {
        display: block;
        font-size: 0.85rem;
        color: rgba(249, 249, 249, 0.55);
        margin-bottom: 0.4rem;
    }

    .search-row {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
    }

    .dropdown-anchor {
        position: relative;
    }

    .dropdown-btn {
        padding: 0.45rem 0.75rem;
        border: 1.5px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        background: transparent;
        color: var(--color-text);
        font-family: inherit;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .dropdown-btn :global(svg) {
        transition: transform 0.3s ease;
    }

    .dropdown-btn :global(.rotated) {
        transform: rotate(180deg);
    }

    .tables-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
        margin-bottom: 1.75rem;
    }

    .section {
        margin-bottom: 1.5rem;
    }

    /* Breakdown */
    .breakdown-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 0.75rem;
    }

    .breakdown-header h2 {
        margin: 0;
    }

    .toggle-group {
        display: flex;
        gap: 0.5rem;
    }

    .toggle-btn {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.25rem 0.6rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        background: transparent;
        font-family: inherit;
        font-size: 0.8rem;
        cursor: pointer;
        color: rgba(249, 249, 249, 0.55);
    }

    .toggle-btn.active {
        border-color: rgba(255, 255, 255, 0.45);
        color: var(--color-text);
    }

    .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(249, 249, 249, 0.3);
    }

    .toggle-btn.active .dot {
        background: #5b9bd5;
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
</style>
