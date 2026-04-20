<script lang="ts">
	import { metrics, type MetricConfig } from '$lib/config/metrics';
    import { formatStop } from '$lib/utils/formatting';
    import HistogramLegend from '$lib/components/HistogramLegend.svelte';

	type Props = {
		activeMetric: MetricConfig | null;
		computedStops: Record<string, [number, string][]>;
		computedValues: Record<string, number[]>;
		onchange: (metric: MetricConfig | null) => void;
	};

	let { activeMetric, computedStops, computedValues, onchange }: Props = $props();

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
		background: rgba(255, 255, 255, 0.95);
		border-radius: 8px;
		padding: 10px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		font-family: system-ui, sans-serif;
		font-size: 13px;
		max-width: 220px;
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
</style>
