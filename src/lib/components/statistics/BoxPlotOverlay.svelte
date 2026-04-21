<script lang="ts">
    import { getContext } from 'svelte';
    import type { BoxplotStats } from '$lib/utils/stats';

    const { xScale, height } = getContext<{
        xScale: import('svelte/store').Readable<(v: number) => number>;
        height: import('svelte/store').Readable<number>;
    }>('LayerCake');

    type Props = { stats: BoxplotStats };
    let { stats }: Props = $props();

    const BOX_H = 10;
    const OFFSET = 18;

    let y = $derived(-OFFSET);
    let boxY = $derived(y - BOX_H / 2);
    let xLo = $derived($xScale(stats.whiskerLo));
    let xQ1 = $derived($xScale(stats.q1));
    let xMed = $derived($xScale(stats.median));
    let xQ3 = $derived($xScale(stats.q3));
    let xHi = $derived($xScale(stats.whiskerHi));
</script>

<g class="box-plot-overlay">
    <!-- whisker line -->
    <line x1={xLo} x2={xHi} y1={y} y2={y} stroke="rgba(255,255,255,0.6)" stroke-width="1.5" />
    <!-- whisker caps -->
    <line x1={xLo} x2={xLo} y1={boxY} y2={boxY + BOX_H} stroke="rgba(255,255,255,0.6)" stroke-width="1.5" />
    <line x1={xHi} x2={xHi} y1={boxY} y2={boxY + BOX_H} stroke="rgba(255,255,255,0.6)" stroke-width="1.5" />
    <!-- IQR box -->
    <rect
        x={xQ1}
        y={boxY}
        width={xQ3 - xQ1}
        height={BOX_H}
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(255,255,255,0.6)"
        stroke-width="1.5"
    />
    <!-- median tick -->
    <line x1={xMed} x2={xMed} y1={boxY} y2={boxY + BOX_H} stroke="var(--color-yellow)" stroke-width="2.5" />
    <!-- outlier dots -->
    {#each stats.outliers.slice(0, 40).map((v, i) => [v, i]) as v (v[1])}
        <circle cx={$xScale(v[0])} cy={y} r="2" fill="rgba(255,181,73,0.5)" />
    {/each}
</g>
