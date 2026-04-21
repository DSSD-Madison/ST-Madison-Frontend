<script lang="ts">
    import { LayerCake, Svg } from 'layercake';
    import Line from '$lib/components/graphs/Line.svelte';
    import Area from '$lib/components/graphs/Area.svelte';
    import AxisY from '$lib/components/graphs/AxisY.svelte';

    interface Props {
        label: string;
        color: string;
        data: number[] | null;
        years?: number[] | null;
        format?: (v: number) => string;
    }

    let { label, color, data, years = null, format = (v) => String(v) }: Props = $props();

    const chartData = $derived((data ?? []).map((y, x) => ({ x, y })));

    const firstYear = $derived(years?.[0] ?? null);
    const lastYear = $derived(years?.[years.length - 1] ?? null);
</script>

<div class="card">
    <span class="chart-label">{label}</span>
    <div class="chart-container">
        <LayerCake
            padding={{ top: 5, right: 5, bottom: 5, left: 45 }}
            x="x"
            y="y"
            yDomain={[0, null]}
            data={chartData}
        >
            <Svg>
                <AxisY ticks={3} gridlines={true} {format} />
                <Area fill="{color}30" />
                <Line stroke={color} />
            </Svg>
        </LayerCake>
    </div>
    {#if firstYear !== null && lastYear !== null}
        <div class="year-range">
            <span>{firstYear}</span>
            <span>{lastYear}</span>
        </div>
    {/if}
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
        font-family: sans-serif;
    }

    .chart-container :global(.tick line),
    .chart-container :global(.gridline) {
        stroke: rgba(255, 255, 255, 0.2);
    }

    .year-range {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: var(--color-link);
    }
</style>
