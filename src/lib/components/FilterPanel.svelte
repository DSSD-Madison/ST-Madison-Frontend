<script lang="ts">
    import {
        EMPTY_PARCEL_FILTERS,
        type ParcelFilterOptions,
        type ParcelFilterState
    } from '$lib/config/parcelFilters';

    type Props = {
        filters: ParcelFilterState;
        filterOptions: ParcelFilterOptions;
        matched?: number;
        total?: number;
        onfilterchange: (filters: ParcelFilterState) => void;
        variant?: 'inline' | 'sidebar';
    };

    let {
        filters,
        filterOptions,
        matched,
        total,
        onfilterchange,
        variant = 'inline'
    }: Props = $props();

    function toggleStringFilter(
        key: 'areaPlanNames' | 'alderDistrictNames' | 'propertyClasses' | 'propertyUses',
        value: string,
        checked: boolean
    ) {
        const current = filters[key];
        const nextValues = checked
            ? [...current, value]
            : current.filter((candidate) => candidate !== value);
        onfilterchange({ ...filters, [key]: nextValues });
    }

    function toggleWard(value: number, checked: boolean) {
        const current = filters.wards;
        const nextValues = checked
            ? [...current, value]
            : current.filter((candidate) => candidate !== value);
        onfilterchange({ ...filters, wards: nextValues });
    }

    function resetFilters() {
        onfilterchange(EMPTY_PARCEL_FILTERS);
    }

    function wardLabel(ward: number): string {
        return `Ward ${ward}`;
    }

    const isSidebar = $derived(variant === 'sidebar');
</script>

{#if isSidebar}
    <div class="filter-sidebar">
        <h2 class="sidebar-heading">Filters</h2>
        <hr class="divider" />

        <div class="filter-sections">
            {#if filterOptions.areaPlanNames.length > 0}
                <div class="filter-section">
                    <p class="section-label">AREA PLANS</p>
                    {#each filterOptions.areaPlanNames as value (value)}
                        <label class="filter-item">
                            <input
                                type="checkbox"
                                checked={filters.areaPlanNames.includes(value)}
                                onchange={(e) =>
                                    toggleStringFilter(
                                        'areaPlanNames',
                                        value,
                                        (e.target as HTMLInputElement).checked
                                    )}
                            />
                            <span class:active={filters.areaPlanNames.includes(value)}>{value}</span>
                        </label>
                    {/each}
                    {#if filterOptions.areaPlanNames.length > 5}
                        <span class="overflow-hint">+ {filterOptions.areaPlanNames.length - 5} more…</span>
                    {/if}
                </div>
                <hr class="divider" />
            {/if}

            {#if filterOptions.alderDistrictNames.length > 0}
                <div class="filter-section">
                    <p class="section-label">ALDER DISTRICTS</p>
                    {#if filters.alderDistrictNames.length === 0}
                        <p class="all-selected">All {filterOptions.alderDistrictNames.length} selected</p>
                    {:else}
                        <p class="some-selected">{filters.alderDistrictNames.length} selected</p>
                    {/if}
                    <div class="scroll-options">
                        {#each filterOptions.alderDistrictNames as value (value)}
                            <label class="filter-item">
                                <input
                                    type="checkbox"
                                    checked={filters.alderDistrictNames.includes(value)}
                                    onchange={(e) =>
                                        toggleStringFilter(
                                            'alderDistrictNames',
                                            value,
                                            (e.target as HTMLInputElement).checked
                                        )}
                                />
                                <span class:active={filters.alderDistrictNames.includes(value)}>{value}</span>
                            </label>
                        {/each}
                    </div>
                </div>
                <hr class="divider" />
            {/if}

            {#if filterOptions.propertyClasses.length > 0}
                <div class="filter-section">
                    <p class="section-label">PROPERTY CLASS</p>
                    {#each filterOptions.propertyClasses as value (value)}
                        <label class="filter-item">
                            <input
                                type="checkbox"
                                checked={filters.propertyClasses.includes(value)}
                                onchange={(e) =>
                                    toggleStringFilter(
                                        'propertyClasses',
                                        value,
                                        (e.target as HTMLInputElement).checked
                                    )}
                            />
                            <span class:active={filters.propertyClasses.includes(value)}>{value}</span>
                        </label>
                    {/each}
                </div>
                <hr class="divider" />
            {/if}

            {#if filterOptions.propertyUses.length > 0}
                <div class="filter-section">
                    <p class="section-label">PROPERTY USE</p>
                    <div class="scroll-options">
                        {#each filterOptions.propertyUses as value (value)}
                            <label class="filter-item">
                                <input
                                    type="checkbox"
                                    checked={filters.propertyUses.includes(value)}
                                    onchange={(e) =>
                                        toggleStringFilter(
                                            'propertyUses',
                                            value,
                                            (e.target as HTMLInputElement).checked
                                        )}
                                />
                                <span class:active={filters.propertyUses.includes(value)}>{value}</span>
                            </label>
                        {/each}
                    </div>
                </div>
                <hr class="divider" />
            {/if}

            {#if filterOptions.wards.length > 0}
                <div class="filter-section">
                    <p class="section-label">WARD</p>
                    {#if filters.wards.length === 0}
                        <p class="all-selected">All</p>
                    {/if}
                    <div class="scroll-options ward-options">
                        {#each filterOptions.wards as value (value)}
                            <label class="filter-item">
                                <input
                                    type="checkbox"
                                    checked={filters.wards.includes(value)}
                                    onchange={(e) =>
                                        toggleWard(value, (e.target as HTMLInputElement).checked)}
                                />
                                <span class:active={filters.wards.includes(value)}>{wardLabel(value)}</span>
                            </label>
                        {/each}
                    </div>
                </div>
                <hr class="divider" />
            {/if}
        </div>

        {#if matched !== undefined && total !== undefined && total > 0}
            <div class="matched-count">
                <span class="matched-number">{matched.toLocaleString()}</span>
                <span class="matched-label">parcels · {((matched / total) * 100).toFixed(0)}% of city</span>
            </div>
        {/if}

        <button type="button" class="reset-link" onclick={resetFilters}>reset filters</button>
    </div>
{:else}
    <details class="filters-panel">
        <summary>Filters</summary>
        <div class="filters">
            <button type="button" class="reset-btn" onclick={resetFilters}>Reset</button>

            <details>
                <summary>Area Plans ({filters.areaPlanNames.length || 'All'})</summary>
                <div class="filter-options">
                    {#each filterOptions.areaPlanNames as value (value)}
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.areaPlanNames.includes(value)}
                                onchange={(e) =>
                                    toggleStringFilter(
                                        'areaPlanNames',
                                        value,
                                        (e.target as HTMLInputElement).checked
                                    )}
                            />
                            <span>{value}</span>
                        </label>
                    {/each}
                </div>
            </details>

            <details>
                <summary>Alder Districts ({filters.alderDistrictNames.length || 'All'})</summary>
                <div class="filter-options">
                    {#each filterOptions.alderDistrictNames as value (value)}
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.alderDistrictNames.includes(value)}
                                onchange={(e) =>
                                    toggleStringFilter(
                                        'alderDistrictNames',
                                        value,
                                        (e.target as HTMLInputElement).checked
                                    )}
                            />
                            <span>{value}</span>
                        </label>
                    {/each}
                </div>
            </details>

            <details>
                <summary>Wards ({filters.wards.length || 'All'})</summary>
                <div class="filter-options">
                    {#each filterOptions.wards as value (value)}
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.wards.includes(value)}
                                onchange={(e) =>
                                    toggleWard(value, (e.target as HTMLInputElement).checked)}
                            />
                            <span>{wardLabel(value)}</span>
                        </label>
                    {/each}
                </div>
            </details>

            <details>
                <summary>Property Class ({filters.propertyClasses.length || 'All'})</summary>
                <div class="filter-options">
                    {#each filterOptions.propertyClasses as value (value)}
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.propertyClasses.includes(value)}
                                onchange={(e) =>
                                    toggleStringFilter(
                                        'propertyClasses',
                                        value,
                                        (e.target as HTMLInputElement).checked
                                    )}
                            />
                            <span>{value}</span>
                        </label>
                    {/each}
                </div>
            </details>

            <details>
                <summary>Property Use ({filters.propertyUses.length || 'All'})</summary>
                <div class="filter-options">
                    {#each filterOptions.propertyUses as value (value)}
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.propertyUses.includes(value)}
                                onchange={(e) =>
                                    toggleStringFilter(
                                        'propertyUses',
                                        value,
                                        (e.target as HTMLInputElement).checked
                                    )}
                            />
                            <span>{value}</span>
                        </label>
                    {/each}
                </div>
            </details>
        </div>
    </details>
{/if}

<style>
    /* ── sidebar variant ── */
    .filter-sidebar {
        display: flex;
        flex-direction: column;
        gap: 0;
        font-family: 'Georgia', serif;
        padding: 1.25rem 1.5rem;
        overflow-y: auto;
    }

    .sidebar-heading {
        font-family: 'Georgia', serif;
        font-style: italic;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text, #fff);
        margin: 0 0 0.5rem;
    }

    .divider {
        border: none;
        border-top: 1.5px dashed rgba(255, 255, 255, 0.2);
        margin: 0.5rem 0;
    }

    .filter-sections {
        display: flex;
        flex-direction: column;
    }

    .filter-section {
        padding: 0.5rem 0;
    }

    .section-label {
        font-size: 0.65rem;
        letter-spacing: 0.08em;
        color: rgba(255, 255, 255, 0.5);
        margin: 0 0 0.35rem;
        font-family: system-ui, sans-serif;
    }

    .all-selected,
    .some-selected {
        font-size: 0.875rem;
        color: var(--color-text, #fff);
        margin: 0 0 0.35rem;
    }

    .filter-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 0.15rem 0;
    }

    .filter-item input[type='checkbox'] {
        accent-color: var(--color-yellow, orange);
        cursor: pointer;
    }

    .filter-item span {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.55);
        line-height: 1.3;
    }

    .filter-item span.active {
        color: var(--color-text, #fff);
    }

    .scroll-options {
        max-height: 140px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    .ward-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        max-height: 120px;
    }

    .overflow-hint {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 0.2rem;
    }

    .matched-count {
        margin-top: 0.25rem;
        line-height: 1.2;
    }

    .matched-number {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        font-family: 'Georgia', serif;
        color: var(--color-text, #fff);
    }

    .matched-label {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.6);
    }

    .reset-link {
        background: none;
        border: none;
        padding: 0;
        margin-top: 0.5rem;
        font-size: 0.8rem;
        font-family: 'Georgia', serif;
        font-style: italic;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        text-decoration: underline;
        text-align: left;
    }

    .reset-link:hover {
        color: var(--color-text, #fff);
    }

    /* ── inline variant ── */
    .filters-panel {
        margin-top: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 6px;
        background: rgba(255, 255, 255, 0.7);
    }

    .filters-panel > summary {
        cursor: pointer;
        font-weight: 600;
        color: #374151;
    }

    .filters {
        margin-top: 8px;
    }

    .reset-btn {
        border: 1px solid #d1d5db;
        background: #fff;
        color: #1f2937;
        border-radius: 6px;
        padding: 2px 8px;
        font-size: 12px;
        cursor: pointer;
    }

    .reset-btn:hover {
        background: #f9fafb;
    }

    details {
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 4px 6px;
        margin-top: 6px;
        background: #fff;
    }

    .filters summary {
        cursor: pointer;
        font-weight: 500;
        color: #374151;
        list-style: none;
    }

    summary::-webkit-details-marker {
        display: none;
    }

    .filter-options {
        margin-top: 6px;
        max-height: 132px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-bottom: 2px;
    }

    .filter-options label {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #1f2937;
        font-size: 13px;
    }

    .filter-options input {
        margin: 0;
    }
</style>
