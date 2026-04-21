<script lang="ts">
    import { LayerCake, Svg, Html } from 'layercake';
    import { scaleLog, scaleLinear } from 'd3-scale';
    import type { NumericMetric } from '$lib/config/metrics';
    import type { ParcelTileProperties } from '$lib/api';
    import { bin, boxplotStats } from '$lib/utils/stats';
    import { formatStop } from '$lib/utils/formatting';
    import AxisX from '$lib/components/graphs/AxisX.svelte';
    import AxisY from '$lib/components/graphs/AxisY.svelte';
    import HistogramBars from './HistogramBars.svelte';
    import BoxPlotOverlay from './BoxPlotOverlay.svelte';

    type Props = {
        parcels: Partial<ParcelTileProperties>[];
        metric: NumericMetric;
    };

    let { parcels, metric }: Props = $props();

    let values = $derived(
        parcels
            .map((p) => p[metric.key] as number | null)
            .filter((v): v is number => v != null && isFinite(v) && v > 0)
    );

    let useLog = $derived(metric.scaleType === 'log');
    let bins = $derived(bin(values, { thresholds: 30, log: useLog }));
    let stats = $derived(boxplotStats(values));

    let xDomain = $derived<[number, number]>(
        bins.length > 0 ? [bins[0].x0, bins[bins.length - 1].x1] : [0, 1]
    );
    let yMax = $derived(Math.max(...bins.map((b) => b.length), 1));

    let xScaleInstance = $derived(
        useLog ? scaleLog() : scaleLinear()
    );

    function fmtX(v: number): string {
        return formatStop(v, metric.format);
    }
</script>

<div class="chart-card">
    <div class="chart-title">Distribution — {metric.label}</div>
    {#if values.length === 0}
        <div class="empty">No data</div>
    {:else}
        <div class="chart-wrap">
            <LayerCake
                x={(d: { x0: number; x1: number; length: number }) => d.x0}
                y={(d: { x0: number; x1: number; length: number }) => d.length}
                xScale={xScaleInstance}
                {xDomain}
                yDomain={[0, yMax]}
                data={bins}
                padding={{ top: 36, right: 20, bottom: 36, left: 52 }}
            >
                <Svg>
                    <AxisX ticks={5} gridlines={true} tickMarks={true} format={fmtX} />
                    <AxisY ticks={4} gridlines={true} format={(v: number) => v.toLocaleString()} />
                    <HistogramBars {stats} />
                    <BoxPlotOverlay {stats} />
                </Svg>
                <Html>
                    <div class="stats-readout">
                        <div class="stat-item">
                            <span class="stat-label">N</span>
                            <span class="stat-value">{stats.n.toLocaleString()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Median</span>
                            <span class="stat-value">{fmtX(stats.median)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">IQR</span>
                            <span class="stat-value">{fmtX(stats.q1)} – {fmtX(stats.q3)}</span>
                        </div>
                    </div>
                </Html>
            </LayerCake>
        </div>
    {/if}
</div>

<style>
    .chart-card {
        background: var(--color-lower-nav);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .chart-title {
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--color-link);
    }

    .chart-wrap {
        width: 100%;
        height: 260px;
    }

    .chart-wrap :global(.tick text) {
        fill: var(--color-link);
        font-size: 10px;
        font-family: sans-serif;
    }

    .chart-wrap :global(.tick line),
    .chart-wrap :global(.gridline) {
        stroke: rgba(255, 255, 255, 0.15);
    }

    .empty {
        color: var(--color-link);
        font-size: 0.85rem;
        padding: 2rem 0;
        text-align: center;
    }

    .stats-readout {
        position: absolute;
        top: 4px;
        right: 4px;
        display: flex;
        gap: 12px;
        background: rgba(12, 35, 64, 0.75);
        border-radius: 6px;
        padding: 4px 8px;
        pointer-events: none;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1px;
    }

    .stat-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-link);
        font-family: sans-serif;
    }

    .stat-value {
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--color-text);
        font-family: sans-serif;
        white-space: nowrap;
    }
</style>
