<script lang="ts">
    import { LayerCake, Svg } from 'layercake';
    import { scaleBand } from 'd3-scale';
    import type { NumericMetric } from '$lib/config/metrics';
    import type { ParcelTileProperties } from '$lib/api';
    import type { GroupByKey } from './GroupByChips.svelte';
    import { groupValues, boxplotStats, type BoxplotStats } from '$lib/utils/stats';
    import { formatStop } from '$lib/utils/formatting';
    import AxisY from '$lib/components/graphs/AxisY.svelte';
    import Boxes from './Boxes.svelte';
    import RotatedAxisX from './RotatedAxisX.svelte';

    type Props = {
        parcels: Partial<ParcelTileProperties>[];
        metric: NumericMetric;
        groupBy: GroupByKey;
    };

    let { parcels, metric, groupBy }: Props = $props();

    type GroupBox = { group: string; stats: BoxplotStats };

    let groups = $derived.by<GroupBox[]>(() => {
        if (groupBy === 'none') return [];
        const map = groupValues(
            parcels,
            groupBy as keyof ParcelTileProperties,
            metric.key as keyof ParcelTileProperties
        );
        const result: GroupBox[] = [];
        for (const [group, vals] of map) {
            if (vals.length < 5) continue;
            result.push({ group, stats: boxplotStats(vals) });
        }
        return result.sort((a, b) => a.stats.median - b.stats.median);
    });

    let groupLabels = $derived(groups.map((g) => g.group));

    let yExtent = $derived.by<[number, number]>(() => {
        if (groups.length === 0) return [0, 1];
        const all = groups.flatMap((g) => [g.stats.whiskerLo, g.stats.whiskerHi]);
        return [Math.min(...all), Math.max(...all)];
    });

    let xScaleInst = $derived(scaleBand().paddingInner(0.2).paddingOuter(0.1));

    function fmtY(v: number): string {
        return formatStop(v, metric.format);
    }
</script>

<div class="chart-card">
    <div class="chart-title">
        {metric.label} by {groupBy === 'none' ? '—' : groupBy.replace(/_/g, ' ')}
    </div>
    {#if groupBy === 'none'}
        <div class="empty">Select a group-by dimension above</div>
    {:else if groups.length === 0}
        <div class="empty">No data</div>
    {:else}
        <div class="chart-wrap">
            <LayerCake
                x={(d: GroupBox) => d.group}
                y={(d: GroupBox) => d.stats.median}
                xScale={xScaleInst}
                xDomain={groupLabels}
                yDomain={yExtent}
                data={groups}
                padding={{ top: 16, right: 16, bottom: 80, left: 64 }}
            >
                <Svg>
                    <AxisY ticks={4} gridlines={true} format={fmtY} />
                    <RotatedAxisX {groups} />
                    <Boxes {groups} />
                </Svg>
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
        height: 340px;
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
</style>
