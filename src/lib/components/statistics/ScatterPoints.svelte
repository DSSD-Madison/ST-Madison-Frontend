<script lang="ts">
    import { getContext } from 'svelte';

    const { data, xGet, yGet } = getContext<{
        data: import('svelte/store').Readable<{ x: number; y: number }[]>;
        xGet: import('svelte/store').Readable<(d: { x: number; y: number }) => number>;
        yGet: import('svelte/store').Readable<(d: { x: number; y: number }) => number>;
    }>('LayerCake');
</script>

<g class="scatter-points">
    {#each $data as d, i (i)}
        <circle
            cx={$xGet(d)}
            cy={$yGet(d)}
            r="3"
            fill="rgba(255,181,73,0.22)"
            stroke="rgba(255,181,73,0.5)"
            stroke-width="0.5"
        />
    {/each}
</g>
