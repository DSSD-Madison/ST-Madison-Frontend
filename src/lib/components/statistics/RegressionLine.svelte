<script lang="ts">
    import { getContext } from 'svelte';

    const { xScale, yScale, xDomain } = getContext<{
        xScale: import('svelte/store').Readable<(v: number) => number>;
        yScale: import('svelte/store').Readable<(v: number) => number>;
        xDomain: import('svelte/store').Readable<[number, number]>;
    }>('LayerCake');

    type Props = { slope: number; intercept: number };
    let { slope, intercept }: Props = $props();

    let x1 = $derived($xScale($xDomain[0]));
    let x2 = $derived($xScale($xDomain[1]));
    let y1 = $derived($yScale(slope * $xDomain[0] + intercept));
    let y2 = $derived($yScale(slope * $xDomain[1] + intercept));
</script>

<line
    {x1} {y1} {x2} {y2}
    stroke="rgba(255,255,255,0.6)"
    stroke-width="1.5"
    stroke-dasharray="4,3"
/>
