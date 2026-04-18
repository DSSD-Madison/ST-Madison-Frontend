<script lang="ts">
    interface Props {
        label: string;
        color: string;
        data: number[] | null;
    }

    let { label, color, data }: Props = $props();

    function buildPath(points: number[]): string {
        if (points.length < 2) return '';
        const xMin = 10,
            xMax = 190,
            yMin = 10,
            yMax = 90;
        const min = Math.min(...points);
        const max = Math.max(...points);
        const ySpan = max - min || 1;
        return points
            .map((v, i) => {
                const x = xMin + (i / (points.length - 1)) * (xMax - xMin);
                const y = yMax - ((v - min) / ySpan) * (yMax - yMin);
                return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');
    }
</script>

<div class="chart-box">
    <span class="chart-label">{label}</span>
    <svg viewBox="0 0 200 100" class="line-chart">
        <line x1="10" y1="90" x2="190" y2="90" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
        <line x1="10" y1="10" x2="10" y2="90" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
        {#if data}
            <path d={buildPath(data)} fill="none" stroke={color} stroke-width="2" />
        {/if}
    </svg>
</div>

<style>
    .chart-box {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .chart-label {
        font-size: 0.75rem;
        color: rgba(249, 249, 249, 0.55);
    }

    .line-chart {
        width: 100%;
        height: auto;
        display: block;
    }
</style>
