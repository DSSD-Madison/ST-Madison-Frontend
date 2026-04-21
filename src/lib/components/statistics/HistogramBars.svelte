<script lang="ts">
    import { getContext } from 'svelte';
    import type { Bin, BoxplotStats } from '$lib/utils/stats';

    const { data, xScale, yScale, height } = getContext<{
        data: import('svelte/store').Readable<Bin[]>;
        xScale: import('svelte/store').Readable<(v: number) => number>;
        yScale: import('svelte/store').Readable<(v: number) => number>;
        height: import('svelte/store').Readable<number>;
    }>('LayerCake');

    type Props = { stats: BoxplotStats };
    let { stats }: Props = $props();
</script>

<g class="histogram-bars">
    {#each $data as b (b.x0)}
        {@const x = $xScale(b.x0)}
        {@const x1 = $xScale(b.x1)}
        {@const w = Math.max(x1 - x - 1, 1)}
        {@const y = $yScale(b.length)}
        {@const barH = $height - y}
        {@const isMedianBin = stats.median >= b.x0 && stats.median < b.x1}
        <rect
            {x}
            {y}
            width={w}
            height={barH}
            fill={isMedianBin ? 'var(--color-yellow)' : 'rgba(255,255,255,0.3)'}
            stroke="rgba(255,255,255,0.08)"
            stroke-width="0.5"
        />
    {/each}
</g>
