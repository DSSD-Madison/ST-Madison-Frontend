<script lang="ts">
	import { metrics, type MetricConfig } from '$lib/config/metrics';
    import {
        EMPTY_PARCEL_FILTERS,
        type ParcelFilterOptions,
        type ParcelFilterState
    } from '$lib/config/parcelFilters';
    import { formatStop } from '$lib/utils/formatting';
    import HistogramLegend from '$lib/components/HistogramLegend.svelte';

	type Props = {
		activeMetric: MetricConfig | null;
		computedStops: Record<string, [number, string][]>;
		computedValues: Record<string, number[]>;
		filters: ParcelFilterState;
		filterOptions: ParcelFilterOptions;
		onchange: (metric: MetricConfig | null) => void;
		onfilterchange: (filters: ParcelFilterState) => void;
	};

	let {
		activeMetric,
		computedStops,
		computedValues,
		filters,
		filterOptions,
		onchange,
		onfilterchange
	}: Props = $props();

    function gradientCss(stops: [number, string][], scaleType: 'log' | 'quantile'): string {
        if (stops.length < 2) return stops.map(([, c]) => c).join(', ');
        const min = stops[0][0];
        const max = stops.at(-1)![0];
        const logMin = scaleType === 'log' ? Math.log10(Math.max(min, Number.EPSILON)) : 0;
        const logMax = scaleType === 'log' ? Math.log10(max) : 0;
        return stops
            .map(([v, c]) => {
                const pct =
                    scaleType === 'log'
                        ? ((Math.log10(Math.max(v, Number.EPSILON)) - logMin) / (logMax - logMin)) * 100
                        : ((v - min) / (max - min)) * 100;
                return `${c} ${pct.toFixed(1)}%`;
            })
            .join(', ');
    }

	const numericMetrics = metrics.filter((m) => m.type === 'numeric');
	const categoricalMetrics = metrics.filter((m) => m.type === 'categorical');

	function handleSelect(event: Event) {
		const value = (event.target as HTMLSelectElement).value;
		if (!value) {
			onchange(null);
			return;
		}
		const found = metrics.find((m) => m.key === value) ?? null;
		onchange(found);
	}

	function toggleStringFilter(
		key: 'areaPlanNames' | 'alderDistrictNames' | 'propertyClasses' | 'propertyUses',
		value: string,
		checked: boolean
	) {
		const current = filters[key];
		const nextValues = checked
			? [...current, value]
			: current.filter((candidate) => candidate !== value);
		onfilterchange({
			...filters,
			[key]: nextValues
		});
	}

	function toggleWard(value: number, checked: boolean) {
		const current = filters.wards;
		const nextValues = checked ? [...current, value] : current.filter((candidate) => candidate !== value);
		onfilterchange({
			...filters,
			wards: nextValues
		});
	}

	function resetFilters() {
		onfilterchange(EMPTY_PARCEL_FILTERS);
	}

	function selectedLabel(selected: number | string): string {
		return typeof selected === 'number' ? `Ward ${selected}` : selected;
	}
</script>

<div class="metric-picker">
	<select value={activeMetric?.key ?? ''} onchange={handleSelect}>
		<option value="">None (default)</option>
		<optgroup label="Numeric">
			{#each numericMetrics as metric (metric.key)}
				<option value={metric.key}>{metric.label}</option>
			{/each}
		</optgroup>
		<optgroup label="Categorical">
			{#each categoricalMetrics as metric (metric.key)}
				<option value={metric.key}>{metric.label}</option>
			{/each}
		</optgroup>
	</select>

	<details class="filters-panel">
		<summary>
			Filters
		</summary>
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
								onchange={(event) =>
									toggleStringFilter(
										'areaPlanNames',
										value,
										(event.target as HTMLInputElement).checked
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
								onchange={(event) =>
									toggleStringFilter(
										'alderDistrictNames',
										value,
										(event.target as HTMLInputElement).checked
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
								onchange={(event) => toggleWard(value, (event.target as HTMLInputElement).checked)}
							/>
							<span>{selectedLabel(value)}</span>
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
								onchange={(event) =>
									toggleStringFilter(
										'propertyClasses',
										value,
										(event.target as HTMLInputElement).checked
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
								onchange={(event) =>
									toggleStringFilter(
										'propertyUses',
										value,
										(event.target as HTMLInputElement).checked
									)}
							/>
							<span>{value}</span>
						</label>
					{/each}
				</div>
			</details>
		</div>
	</details>

	{#if activeMetric}
		<div class="legend">
			{#if activeMetric.type === 'numeric'}
				{@const stops = computedStops[activeMetric.key] ?? []}
				{@const values = computedValues[activeMetric.key] ?? []}
				<div class="gradient-bar">
					<HistogramLegend {values} {stops} scaleType={activeMetric.scaleType} />
					<div
						class="gradient"
						style="background: linear-gradient(to right, {gradientCss(stops, activeMetric.scaleType)});"
					></div>
					<div class="gradient-labels">
						<span title={stops[0] ? String(stops[0][0]) : undefined}>{stops[0] ? formatStop(stops[0][0], activeMetric.format) : '…'}</span>
						<span title={stops.at(-1) ? String(stops.at(-1)![0]) : undefined}>{stops.at(-1) ? formatStop(stops.at(-1)![0], activeMetric.format) : '…'}</span>
					</div>
				</div>
			{:else}
				<div class="category-list">
					{#each Object.entries(activeMetric.categories) as [name, color] (name)}
						<div class="category-item">
							<span class="swatch" style="background: {color};"></span>
							<span class="category-label">{name}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.metric-picker {
		position: absolute;
		top: 12px;
		left: 12px;
		z-index: 10;
		background: rgba(171, 180, 192, 0.5);
		border-radius: 8px;
		border: 1px solid rgba(148, 163, 184, 0.4);
		padding: 10px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		font-family: system-ui, sans-serif;
		font-size: 13px;
		max-width: 280px;
		max-height: min(75vh, 720px);
		overflow: auto;
	}

	select {
		width: 100%;
		padding: 6px 8px;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 13px;
		font-family: inherit;
		background: #fff;
		cursor: pointer;
	}

	select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
	}

	.legend {
		margin-top: 8px;
	}

	.filters {
		margin-top: 8px;
	}

	.filters-panel {
		margin-top: 10px;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		padding: 6px;
		background: rgba(255, 255, 255, 0.7);
	}

	.filters-panel > summary {
		cursor: pointer;
		font-weight: 500;
		color: #374151;
		font-weight: 600;
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
	}

	.filter-options input {
		margin: 0;
	}

	.gradient-bar {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.gradient {
		height: 10px;
		border-radius: 3px;
		width: 100%;
	}

	.gradient-labels {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		color: #555;
	}

	.category-list {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.category-item {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.category-label {
		color: #333;
		font-size: 12px;
	}

	.parcel-count {
		margin-top: 10px;
		color: #4b5563;
		font-weight: 500;
	}
</style>
