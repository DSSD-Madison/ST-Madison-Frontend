<script lang="ts">
    import { LayerCake, Svg } from 'layercake';
    import { scaleBand } from 'd3-scale';
    import Column from '$lib/components/graphs/Column.svelte';
    import AxisX from '$lib/components/graphs/AxisX.svelte';

    interface Props {
        label: string;
        bars: number[];
        color?: string;
        colors?: string[];
        xLabels?: (string | number)[];
    }

    let { label, bars, color = '#5b9bd5', colors, xLabels = [2021, 2022, 2023, 2024] }: Props =
        $props();

    const chartData = $derived(bars.map((y, i) => ({ x: String(xLabels[i] ?? i), y })));
    const fill = $derived(colors ?? color);
</script>

<div class="card">
    <span class="chart-label">{label}</span>
    <div class="chart-container">
        <LayerCake
            padding={{ top: 5, right: 5, bottom: 20, left: 5 }}
            x="x"
            y="y"
            xScale={scaleBand().padding(0.2)}
            yDomain={[0, null]}
            data={chartData}
        >
            <Svg>
                <AxisX gridlines={false} tickMarks={true} />
                <Column {fill} />
            </Svg>
        </LayerCake>
    </div>
</div>

<style>
    .card {
        background-color: var(--color-lower-nav);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .chart-label {
        font-size: 0.8rem;
        color: var(--color-link);
    }

    .chart-container {
        width: 100%;
        height: 120px;
    }

    .chart-container :global(.tick text) {
        fill: rgba(249, 249, 249, 0.45);
        font-size: 10px;
    }

    .chart-container :global(.tick line) {
        stroke: rgba(255, 255, 255, 0.1);
    }
</style>
