<script lang="ts">
	// Selections stored here; when backend is ready, use these to fetch and pass data to chart components
	let selectedDataset = $state('');
	let selectedXColumn = $state('');
	let selectedYColumn = $state('');
	let selectedGraphType = $state<'line' | 'bar' | 'scatter'>('line');

	// Hollow placeholder options only (no data behind these)
	const datasetOptions = ['Property assessments', 'Land efficiency', 'Tax by source'];
	const xColumnOptions = ['Year', 'Column A', 'Column B'];
	const yColumnOptions = ['Value', 'Column C', 'Column D'];
	const graphTypeOptions = [
		{ value: 'line', label: 'Line' },
		{ value: 'bar', label: 'Bar' },
		{ value: 'scatter', label: 'Scatter' }
	] as const;
</script>

<div class="charts-page">
	<section class="control-strip">
		<div class="control-group">
			<label for="dataset">Dataset</label>
			<select id="dataset" bind:value={selectedDataset}>
				<option value="">Select dataset</option>
				{#each datasetOptions as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
		</div>
		<div class="control-group">
			<label for="x-column">X axis</label>
			<select id="x-column" bind:value={selectedXColumn}>
				<option value="">Select X column</option>
				{#each xColumnOptions as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
		</div>
		<div class="control-group">
			<label for="y-column">Y axis</label>
			<select id="y-column" bind:value={selectedYColumn}>
				<option value="">Select Y column</option>
				{#each yColumnOptions as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
		</div>
		<div class="control-group">
			<label for="graph-type">Graph type</label>
			<select id="graph-type" bind:value={selectedGraphType}>
				{#each graphTypeOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
	</section>

	<section class="chart-area">
		<!-- Placeholder until LineChart / BarChart / ScatterPlot components are added by others -->
		<p class="chart-placeholder">
			Chart will appear here ({selectedGraphType}). When data is ready, the {selectedGraphType} chart
			component will be rendered here with the selected dataset and columns.
		</p>
	</section>
</div>

<style>
	.charts-page {
		font-family: Georgia, serif;
		font-size: 16px;
		font-weight: 400;
		color: #333;
		background-color: #fff;
		min-height: 100%;
		padding: 1rem;
		box-sizing: border-box;
	}

	.control-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-end;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background-color: #f5f5f5;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.control-group label {
		font-weight: 700;
		font-size: 16px;
		color: #333;
	}

	.control-group select {
		font-family: Georgia, serif;
		font-size: 16px;
		padding: 0.5rem;
		background-color: #fff;
		color: #333;
		border: 1px solid #ccc;
		border-radius: 4px;
		min-width: 160px;
	}

	.chart-area {
		min-height: 300px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chart-placeholder {
		color: #555;
		text-align: center;
		margin: 0;
	}

	@media (max-width: 600px) {
		.control-strip {
			flex-direction: column;
			align-items: stretch;
		}

		.control-group select {
			min-width: 0;
		}
	}
</style>
