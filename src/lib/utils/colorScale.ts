import { scaleQuantile } from 'd3-scale';
import {
    interpolateYlOrRd,
    interpolateBlues,
    interpolateViridis,
    interpolatePlasma
} from 'd3-scale-chromatic';

const INTERPOLATORS: Record<string, (t: number) => string> = {
    YlOrRd: interpolateYlOrRd,
    Blues: interpolateBlues,
    Viridis: interpolateViridis,
    Plasma: interpolatePlasma
};

function computeQuantileStops(
    values: number[],
    colorScheme: string,
    numStops: number
): [number, string][] {
    const clean = values.filter((v) => isFinite(v) && v >= 0);
    if (clean.length === 0) return [];

    const interpolator = INTERPOLATORS[colorScheme] ?? interpolateYlOrRd;
    const min = Math.min(...clean);
    const max = Math.max(...clean);

    const q = scaleQuantile<number>()
        .domain(clean)
        .range(Array.from({ length: numStops }, (_, i) => i));

    // Deduplicate to ensure strictly ascending order — required by MapLibre's interpolate.
    // Duplicate thresholds occur when many features share the same value (e.g. 0 sq ft).
    const raw = [...q.quantiles()];
    const thresholds = raw.filter((v, i) => i === 0 || v > raw[i - 1]);

    const stops: [number, string][] = thresholds.map((v, i) => [
        v,
        interpolator(i / (thresholds.length - 1))
    ]);

    // Append actual max so the legend label reflects the true data range.
    // if (max > thresholds[thresholds.length - 1]) {
    //     stops.push([max, interpolator(1)]);
    // }

    return stops;
}

function computeLogStops(
    values: number[],
    colorScheme: string,
    numStops: number
): [number, string][] {
    // Log scale requires strictly positive values.
    const clean = values.filter((v) => isFinite(v) && v > 0);
    if (clean.length === 0) return [];

    const interpolator = INTERPOLATORS[colorScheme] ?? interpolateYlOrRd;
    const min = Math.min(...clean);
    const max = Math.max(...clean);

    if (min === max) return [[min, interpolator(0.5)]];

    const logMin = Math.log10(min);
    const logMax = Math.log10(max);

    return Array.from({ length: numStops }, (_, i) => {
        const t = i / (numStops - 1);
        return [Math.pow(10, logMin + t * (logMax - logMin)), interpolator(t)];
    });
}

export function computeStops(
    values: number[],
    colorScheme: string,
    scaleType: 'log' | 'quantile',
    numStops = 14
): [number, string][] {
    return scaleType === 'log'
        ? computeLogStops(values, colorScheme, numStops)
        : computeQuantileStops(values, colorScheme, numStops);
}
