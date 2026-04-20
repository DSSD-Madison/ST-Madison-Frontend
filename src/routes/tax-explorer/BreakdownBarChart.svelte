<script lang="ts">
    import { LayerCake, Svg } from 'layercake';
    import { scaleBand } from 'd3-scale';
    import Column from '$lib/components/graphs/Column.svelte';
    import AxisX from '$lib/components/graphs/AxisX.svelte';
    import AxisY from '$lib/components/graphs/AxisY.svelte';

    function compactDollar(v: number): string {
        if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
        return `$${v.toFixed(0)}`;
    }

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
            padding={{ top: 5, right: 5, bottom: 20, left: 40 }}
            x="x"
            y="y"
            xScale={scaleBand().padding(0.2)}
            yDomain={[0, null]}
            data={chartData}
        >
            <Svg>
                <AxisY ticks={3} gridlines={true} format={compactDollar} />
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
        fill: var(--color-link);
        font-size: 10px;
    }

    .chart-container :global(.tick line),
    .chart-container :global(.gridline) {
        stroke: rgba(255, 255, 255, 0.2);
    }
</style>
