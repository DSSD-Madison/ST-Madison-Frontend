<script lang="ts">
    interface Source {
        label: string;
        values: number[];
    }

    interface Props {
        years: number[];
        sources: Source[];
        colors: Record<string, string>;
    }

    let { years, sources, colors }: Props = $props();

    const chartX = 30;
    const chartRight = 460;
    const chartTop = 10;
    const chartBottom = 90;
    const chartWidth = $derived(chartRight - chartX);
    const chartHeight = chartBottom - chartTop;

    const globalMax = $derived(Math.max(...sources.flatMap((s) => s.values)));
    const groupWidth = $derived(chartWidth / years.length);
    const barWidth = 14;
    const barGap = 3;
    const clusterWidth = $derived(sources.length * barWidth + (sources.length - 1) * barGap);

    function barX(yearIndex: number, sourceIndex: number): number {
        const groupStart = chartX + yearIndex * groupWidth;
        const clusterStart = groupStart + (groupWidth - clusterWidth) / 2;
        return clusterStart + sourceIndex * (barWidth + barGap);
    }

    function barY(value: number): number {
        return chartBottom - (value / globalMax) * chartHeight;
    }

    function barH(value: number): number {
        return (value / globalMax) * chartHeight;
    }

    function yearLabelX(yearIndex: number): number {
        return chartX + yearIndex * groupWidth + groupWidth / 2;
    }
</script>

<svg viewBox="0 0 480 110" class="year-chart">
    <!-- Axes -->
    <line
        x1={chartX}
        y1={chartBottom}
        x2={chartRight}
        y2={chartBottom}
        stroke="#ccc"
        stroke-width="1"
    />
    <line x1={chartX} y1={chartTop} x2={chartX} y2={chartBottom} stroke="#ccc" stroke-width="1" />

    <!-- Bars -->
    {#each years as year, i (year)}
        {#each sources as source, j (source.label)}
            <rect
                x={barX(i, j)}
                y={barY(source.values[i])}
                width={barWidth}
                height={barH(source.values[i])}
                fill={colors[source.label]}
                opacity="0.85"
            />
        {/each}
        <!-- Year label -->
        <text x={yearLabelX(i)} y="105" text-anchor="middle" font-size="9" fill="#666">{year}</text>
    {/each}
</svg>

<style>
    .year-chart {
        width: 100%;
        height: auto;
        display: block;
    }
</style>
