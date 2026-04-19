<script lang="ts">
    import { LayerCake, Svg, stack } from 'layercake';
    import { scaleBand, scaleOrdinal } from 'd3-scale';
    import ColumnStacked from '$lib/components/graphs/ColumnStacked.svelte';
    import AxisX from '$lib/components/graphs/AxisX.svelte';

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

    const keys = $derived(sources.map((s) => s.label));

    const rowData = $derived(
        years.map((year, i) => {
            const row: Record<string, string | number> = { year: String(year) };
            sources.forEach((s) => {
                row[s.label] = s.values[i];
            });
            return row;
        })
    );

    const stackedData = $derived(stack(rowData, keys));
    const flatData = $derived(stackedData.flat());

    const maxY = $derived(
        Math.max(...years.map((_, i) => sources.reduce((sum, s) => sum + s.values[i], 0)))
    );

    const zRange = $derived(keys.map((k) => colors[k]));
</script>

<div class="chart-container">
    <LayerCake
        padding={{ top: 5, right: 5, bottom: 20, left: 5 }}
        x={(d: any) => d.data.year}
        y={(d: any) => d}
        z="key"
        xScale={scaleBand().padding(0.1)}
        zScale={scaleOrdinal()}
        zDomain={keys}
        {zRange}
        yDomain={[0, maxY]}
        data={stackedData}
        {flatData}
    >
        <Svg>
            <AxisX gridlines={false} tickMarks={true} />
            <ColumnStacked />
        </Svg>
    </LayerCake>
</div>

<style>
    .chart-container {
        width: 100%;
        height: 130px;
    }

    .chart-container :global(.tick text) {
        fill: rgba(249, 249, 249, 0.55);
    }

    .chart-container :global(.tick line) {
        stroke: rgba(255, 255, 255, 0.15);
    }
</style>
