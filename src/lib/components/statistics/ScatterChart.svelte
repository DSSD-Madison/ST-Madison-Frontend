<script lang="ts">
    import { LayerCake, Svg, Html } from 'layercake';
    import { scaleLog, scaleLinear } from 'd3-scale';
    import type { NumericMetric } from '$lib/config/metrics';
    import type { ParcelTileProperties } from '$lib/api';
    import { pearsonR, linearRegression, subsample } from '$lib/utils/stats';
    import { formatStop } from '$lib/utils/formatting';
    import { NUMERIC_METRICS } from '$lib/config/metrics';
    import AxisX from '$lib/components/graphs/AxisX.svelte';
    import AxisY from '$lib/components/graphs/AxisY.svelte';
    import ScatterPoints from './ScatterPoints.svelte';
    import RegressionLine from './RegressionLine.svelte';

    type Props = {
        parcels: Partial<ParcelTileProperties>[];
        metricY: NumericMetric;
        metricX: NumericMetric;
        oncorrelatechange: (m: NumericMetric) => void;
    };

    let { parcels, metricY, metricX, oncorrelatechange }: Props = $props();

    type Point = { x: number; y: number };

    let allPoints = $derived.by<Point[]>(() => {
        const pts: Point[] = [];
        for (const p of parcels) {
            const xv = p[metricX.key] as number | null;
            const yv = p[metricY.key] as number | null;
            if (xv == null || !isFinite(xv) || xv <= 0) continue;
            if (yv == null || !isFinite(yv) || yv <= 0) continue;
            pts.push({ x: xv, y: yv });
        }
        return pts;
    });

    let points = $derived.by<Point[]>(() => {
        if (allPoints.length <= 5000) return allPoints;
        const seed =
            metricX.key.split('').reduce((s, c) => s + c.charCodeAt(0), 0) +
            metricY.key.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
        return subsample(allPoints, 5000, seed);
    });

    let r = $derived(pearsonR(points.map((p) => p.x), points.map((p) => p.y)));
    let reg = $derived(linearRegression(points.map((p) => p.x), points.map((p) => p.y)));

    let xExtent = $derived.by<[number, number]>(() => {
        if (points.length === 0) return [0, 1];
        const xs = points.map((p) => p.x);
        return [Math.min(...xs), Math.max(...xs)];
    });
    let yExtent = $derived.by<[number, number]>(() => {
        if (points.length === 0) return [0, 1];
        const ys = points.map((p) => p.y);
        return [Math.min(...ys), Math.max(...ys)];
    });

    let xScaleInst = $derived(metricX.scaleType === 'log' ? scaleLog() : scaleLinear());
    let yScaleInst = $derived(metricY.scaleType === 'log' ? scaleLog() : scaleLinear());

    let correlateOptions = $derived(NUMERIC_METRICS.filter((m) => m.key !== metricY.key));

    function rColor(rVal: number): string {
        const abs = Math.abs(rVal);
        if (abs > 0.7) return '#4ade80';
        if (abs > 0.4) return 'var(--color-yellow)';
        return 'var(--color-link)';
    }

    function handleCorrelateChange(e: Event) {
        const key = (e.target as HTMLSelectElement).value;
        const found = NUMERIC_METRICS.find((m) => m.key === key);
        if (found) oncorrelatechange(found);
    }
</script>

<div class="chart-card">
    <div class="chart-header">
        <div class="chart-title">Correlation — {metricY.label}</div>
        <div class="correlate-control">
            <span class="ctrl-label">vs.</span>
            <select value={metricX.key} onchange={handleCorrelateChange}>
                {#each correlateOptions as m (m.key)}
                    <option value={m.key}>{m.label}</option>
                {/each}
            </select>
        </div>
    </div>
    {#if points.length < 2}
        <div class="empty">Not enough data</div>
    {:else}
        <div class="chart-wrap">
            <LayerCake
                x={(d: Point) => d.x}
                y={(d: Point) => d.y}
                xScale={xScaleInst}
                yScale={yScaleInst}
                xDomain={xExtent}
                yDomain={yExtent}
                data={points}
                padding={{ top: 16, right: 16, bottom: 40, left: 60 }}
            >
                <Svg>
                    <AxisX ticks={4} gridlines={true} tickMarks={true} format={(v: number) => formatStop(v, metricX.format)} />
                    <AxisY ticks={4} gridlines={true} format={(v: number) => formatStop(v, metricY.format)} />
                    <ScatterPoints />
                    <RegressionLine slope={reg.slope} intercept={reg.intercept} />
                </Svg>
                <Html>
                    <div class="pearson-badge" style="color: {rColor(r)}">
                        r = {r.toFixed(3)}
                        {#if allPoints.length > 5000}
                            <span class="subsample-note">(n={points.length.toLocaleString()} sampled)</span>
                        {/if}
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

    .chart-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
    }

    .chart-title {
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--color-link);
    }

    .correlate-control {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .ctrl-label {
        font-size: 0.8rem;
        color: var(--color-link);
    }

    select {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        color: var(--color-text);
        font-size: 0.8rem;
        padding: 3px 8px;
        font-family: inherit;
        cursor: pointer;
    }

    .chart-wrap {
        width: 100%;
        height: 320px;
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

    .pearson-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(12, 35, 64, 0.8);
        border-radius: 6px;
        padding: 4px 10px;
        font-size: 0.8rem;
        font-weight: 700;
        font-family: sans-serif;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
    }

    .subsample-note {
        font-size: 0.65rem;
        opacity: 0.7;
        font-weight: 400;
    }
</style>
