<script lang="ts">
	import { metrics, type MetricConfig } from '$lib/config/metrics';

	type Props = {
		activeMetric: MetricConfig | null;
		onchange: (metric: MetricConfig | null) => void;
	};

	let { activeMetric, onchange }: Props = $props();

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

	function formatStop(value: number, format: string): string {
		if (format === 'currency') {
			return value >= 1_000_000
				? `$${(value / 1_000_000).toFixed(1)}M`
				: value >= 1_000
					? `$${(value / 1_000).toFixed(0)}k`
					: `$${value}`;
		}
		if (format === 'percent') {
			return `${value}%`;
		}
		return value >= 1_000 ? `${(value / 1_000).toFixed(0)}k` : `${value}`;
	}
</script>

<div class="metric-picker">
	<select value={activeMetric?.key ?? ''} onchange={handleSelect}>
		<option value="">None (default)</option>
		<optgroup label="Numeric">
			{#each numericMetrics as metric}
				<option value={metric.key}>{metric.label}</option>
			{/each}
		</optgroup>
		<optgroup label="Categorical">
			{#each categoricalMetrics as metric}
				<option value={metric.key}>{metric.label}</option>
			{/each}
		</optgroup>
	</select>

	{#if activeMetric}
		<div class="legend">
			{#if activeMetric.type === 'numeric'}
				<div class="gradient-bar">
					<div
						class="gradient"
						style="background: linear-gradient(to right, {activeMetric.stops
							.map(([, c]) => c)
							.join(', ')});"
					></div>
					<div class="gradient-labels">
						<span>{formatStop(activeMetric.stops[0][0], activeMetric.format)}</span>
						<span
							>{formatStop(
								activeMetric.stops[activeMetric.stops.length - 1][0],
								activeMetric.format
							)}</span
						>
					</div>
				</div>
			{:else}
				<div class="category-list">
					{#each Object.entries(activeMetric.categories) as [name, color]}
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
