<script lang="ts">
    interface Props {
        label: string;
        bars: number[];
        color: string;
    }

    let { label, bars, color }: Props = $props();

    const max = $derived(Math.max(...bars));
    function barHeight(v: number) {
        return (v / max) * 65;
    }
</script>

<div class="bar-chart-box">
    <span class="chart-label">{label}</span>
    <svg viewBox="0 0 120 80" class="bar-chart">
        <line x1="10" y1="70" x2="110" y2="70" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
        <line x1="10" y1="5" x2="10" y2="70" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
        {#each bars as h, i (i)}
            <rect
                x={15 + i * 24}
                y={70 - barHeight(h)}
                width="16"
                height={barHeight(h)}
                fill={color}
                opacity="0.85"
            />
        {/each}
    </svg>
</div>

<style>
    .bar-chart-box {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .chart-label {
        font-size: 0.75rem;
        color: rgba(249, 249, 249, 0.55);
    }

    .bar-chart {
        width: 100%;
        height: auto;
        display: block;
    }
</style>
