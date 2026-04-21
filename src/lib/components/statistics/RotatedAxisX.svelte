<script lang="ts">
    import { getContext } from 'svelte';

    const { xScale, height } = getContext<{
        xScale: import('svelte/store').Readable<import('d3-scale').ScaleBand<string>>;
        height: import('svelte/store').Readable<number>;
    }>('LayerCake');

    type GroupBox = { group: string; stats: unknown };
    type Props = { groups: GroupBox[] };
    let { groups }: Props = $props();
</script>

<g class="axis x-axis-rotated">
    {#each groups as { group } (group)}
        {@const bw = $xScale.bandwidth()}
        {@const x = ($xScale(group) ?? 0) + bw / 2}
        <g transform="translate({x},{$height})">
            <text
                transform="rotate(-45)"
                text-anchor="end"
                dx="-4"
                dy="4"
                font-size="10"
                fill="var(--color-link)"
                font-family="sans-serif"
            >
                {group.length > 20 ? group.slice(0, 18) + '…' : group}
            </text>
        </g>
    {/each}
</g>
