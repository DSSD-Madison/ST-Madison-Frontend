<script lang="ts">
    import { LayerCake, Svg } from 'layercake';
    import Line from '$lib/components/graphs/Line.svelte';
    import Area from '$lib/components/graphs/Area.svelte';

    interface Props {
        label: string;
        color: string;
        data: number[] | null;
    }

    let { label, color, data }: Props = $props();

    const chartData = $derived((data ?? []).map((y, x) => ({ x, y })));
</script>

<div class="chart-box">
    <span class="chart-label">{label}</span>
    <div class="chart-container">
        <LayerCake padding={{ top: 5, right: 5, bottom: 5, left: 5 }} x="x" y="y" data={chartData}>
            <Svg>
                <Area fill="{color}30" />
                <Line stroke={color} />
            </Svg>
        </LayerCake>
    </div>
</div>

<style>
    .chart-box {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .chart-label {
        font-size: 0.75rem;
        color: rgba(249, 249, 249, 0.55);
    }

    .chart-container {
        width: 100%;
        height: 80px;
    }
</style>
