<script lang="ts">
    import { getContext } from 'svelte';
    import type { BoxplotStats } from '$lib/utils/stats';

    const { xScale, yScale, height } = getContext<{
        xScale: import('svelte/store').Readable<import('d3-scale').ScaleBand<string>>;
        yScale: import('svelte/store').Readable<(v: number) => number>;
        height: import('svelte/store').Readable<number>;
    }>('LayerCake');

    type GroupBox = { group: string; stats: BoxplotStats };
    type Props = { groups: GroupBox[] };
    let { groups }: Props = $props();
</script>

<g class="boxes">
    {#each groups as { group, stats } (group)}
        {@const bw = $xScale.bandwidth()}
        {@const cx = ($xScale(group) ?? 0) + bw / 2}
        {@const whiskerX = ($xScale(group) ?? 0) + bw * 0.35}
        {@const whiskerW = bw * 0.3}
        {@const boxX = ($xScale(group) ?? 0) + bw * 0.2}
        {@const boxW = bw * 0.6}
        {@const yQ1 = $yScale(stats.q1)}
        {@const yMed = $yScale(stats.median)}
        {@const yQ3 = $yScale(stats.q3)}
        {@const yLo = $yScale(stats.whiskerLo)}
        {@const yHi = $yScale(stats.whiskerHi)}

        <!-- whisker line -->
        <line x1={cx} x2={cx} y1={yLo} y2={yHi} stroke="rgba(255,255,255,0.5)" stroke-width="1.5" />
        <!-- whisker caps -->
        <line x1={whiskerX} x2={whiskerX + whiskerW} y1={yLo} y2={yLo} stroke="rgba(255,255,255,0.5)" stroke-width="1.5" />
        <line x1={whiskerX} x2={whiskerX + whiskerW} y1={yHi} y2={yHi} stroke="rgba(255,255,255,0.5)" stroke-width="1.5" />
        <!-- IQR box -->
        <rect
            x={boxX}
            y={yQ3}
            width={boxW}
            height={Math.abs(yQ1 - yQ3)}
            fill="rgba(255,255,255,0.12)"
            stroke="rgba(255,255,255,0.5)"
            stroke-width="1.5"
        />
        <!-- median line -->
        <line
            x1={boxX}
            x2={boxX + boxW}
            y1={yMed}
            y2={yMed}
            stroke="var(--color-yellow)"
            stroke-width="2.5"
        />
    {/each}
</g>
