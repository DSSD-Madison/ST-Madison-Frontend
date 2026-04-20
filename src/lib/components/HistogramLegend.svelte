<script lang="ts">
    import { LayerCake, Svg } from 'layercake';
    import { scaleLinear, scaleLog } from 'd3-scale';
    import Column from '$lib/components/graphs/Column.svelte';

    type Bin = { x0: number; x1: number; count: number };

    type Props = {
        values: number[];
        stops: [number, string][];
        scaleType: 'log' | 'quantile';
        numBins?: number;
    };

    let { values, stops, scaleType, numBins = 24 }: Props = $props();

    function getColorForValue(value: number, stops: [number, string][]): string {
        for (let i = stops.length - 1; i >= 0; i--) {
            if (value >= stops[i][0]) return stops[i][1];
        }
        return stops[0][1];
    }

    function buildBins(
        values: number[],
        stops: [number, string][],
        scaleType: 'log' | 'quantile',
        numBins: number
    ): Bin[] {
        if (stops.length < 2) return [];
        const min = stops[0][0];
        const max = stops.at(-1)![0];
        if (min >= max) return [];

        const clean =
            scaleType === 'log' ? values.filter((v) => v > 0) : values.filter((v) => v >= 0);

        const logMin = scaleType === 'log' ? Math.log10(min) : 0;
        const logMax = scaleType === 'log' ? Math.log10(max) : 0;

        const edges = Array.from({ length: numBins + 1 }, (_, i) => {
            const t = i / numBins;
            return scaleType === 'log'
                ? Math.pow(10, logMin + t * (logMax - logMin))
                : min + t * (max - min);
        });

        const bins: Bin[] = Array.from({ length: numBins }, (_, i) => ({
            x0: edges[i],
            x1: edges[i + 1],
            count: 0
        }));

        for (const v of clean) {
            const t =
                scaleType === 'log'
                    ? (Math.log10(v) - logMin) / (logMax - logMin)
                    : (v - min) / (max - min);
            const idx = Math.max(0, Math.min(numBins - 1, Math.floor(t * numBins)));
            bins[idx].count++;
        }

        return bins;
    }

    const bins = $derived(buildBins(values, stops, scaleType, numBins));
    const fills = $derived(
        bins.map((b) => {
            const center =
                scaleType === 'log' ? Math.sqrt(b.x0 * b.x1) : (b.x0 + b.x1) / 2;
            return getColorForValue(center, stops);
        })
    );
    const maxCount = $derived(Math.max(...bins.map((b) => b.count), 1));
    const xScale = $derived(scaleType === 'log' ? scaleLog() : scaleLinear());
</script>

{#if bins.length > 0}
    <div class="histogram">
        <LayerCake
            data={bins}
            x={(d: Bin) => [d.x0, d.x1]}
            y="count"
            yDomain={[0, maxCount]}
            padding={{ top: 1, right: 0, bottom: 0, left: 0 }}
            {xScale}
        >
            <Svg>
                <Column fill={fills} strokeWidth={0}/>
            </Svg>
        </LayerCake>
    </div>
{/if}

<style>
    .histogram {
        width: 100%;
        height: 36px;
    }
</style>
