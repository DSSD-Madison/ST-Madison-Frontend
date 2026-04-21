import type { ParcelTileProperties } from '$lib/api';

export type Bin = {
    x0: number;
    x1: number;
    length: number;
    isMedianBin: boolean;
};

export type BoxplotStats = {
    n: number;
    min: number;
    max: number;
    q1: number;
    median: number;
    q3: number;
    iqr: number;
    whiskerLo: number;
    whiskerHi: number;
    outliers: number[];
};

export type GroupedBoxStats = BoxplotStats & { group: string };

function sortedQuantile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const idx = p * (sorted.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function boxplotStats(values: number[]): BoxplotStats {
    const finite = values.filter((v) => isFinite(v));
    if (finite.length === 0) {
        return { n: 0, min: 0, max: 0, q1: 0, median: 0, q3: 0, iqr: 0, whiskerLo: 0, whiskerHi: 0, outliers: [] };
    }
    const sorted = [...finite].sort((a, b) => a - b);
    const q1 = sortedQuantile(sorted, 0.25);
    const median = sortedQuantile(sorted, 0.5);
    const q3 = sortedQuantile(sorted, 0.75);
    const iqr = q3 - q1;
    const fenceLo = q1 - 1.5 * iqr;
    const fenceHi = q3 + 1.5 * iqr;
    const inliers = sorted.filter((v) => v >= fenceLo && v <= fenceHi);
    const outliers = sorted.filter((v) => v < fenceLo || v > fenceHi);
    return {
        n: sorted.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        q1,
        median,
        q3,
        iqr,
        whiskerLo: inliers.length > 0 ? inliers[0] : q1,
        whiskerHi: inliers.length > 0 ? inliers[inliers.length - 1] : q3,
        outliers
    };
}

export function bin(values: number[], opts?: { thresholds?: number; log?: boolean }): Bin[] {
    const thresholds = opts?.thresholds ?? 30;
    const useLog = opts?.log ?? false;
    const finite = values.filter((v) => isFinite(v) && (!useLog || v > 0));
    if (finite.length === 0) return [];

    const med = sortedQuantile([...finite].sort((a, b) => a - b), 0.5);

    if (useLog) {
        const logMin = Math.log10(Math.min(...finite));
        const logMax = Math.log10(Math.max(...finite));
        if (logMin === logMax) return [];
        const step = (logMax - logMin) / thresholds;
        const bins: Bin[] = Array.from({ length: thresholds }, (_, i) => ({
            x0: Math.pow(10, logMin + i * step),
            x1: Math.pow(10, logMin + (i + 1) * step),
            length: 0,
            isMedianBin: false
        }));
        for (const v of finite) {
            const idx = Math.min(Math.floor((Math.log10(v) - logMin) / step), thresholds - 1);
            bins[idx].length++;
        }
        const medIdx = Math.min(Math.floor((Math.log10(med) - logMin) / step), thresholds - 1);
        bins[medIdx].isMedianBin = true;
        return bins;
    } else {
        const minV = Math.min(...finite);
        const maxV = Math.max(...finite);
        if (minV === maxV) return [];
        const step = (maxV - minV) / thresholds;
        const bins: Bin[] = Array.from({ length: thresholds }, (_, i) => ({
            x0: minV + i * step,
            x1: minV + (i + 1) * step,
            length: 0,
            isMedianBin: false
        }));
        for (const v of finite) {
            const idx = Math.min(Math.floor((v - minV) / step), thresholds - 1);
            bins[idx].length++;
        }
        const medIdx = Math.min(Math.floor((med - minV) / step), thresholds - 1);
        bins[medIdx].isMedianBin = true;
        return bins;
    }
}

export function groupValues(
    rows: Partial<ParcelTileProperties>[],
    groupKey: keyof ParcelTileProperties,
    metricKey: keyof ParcelTileProperties
): Map<string, number[]> {
    const map = new Map<string, number[]>();
    for (const row of rows) {
        const groupRaw = row[groupKey];
        const val = row[metricKey];
        if (groupRaw == null || val == null || !isFinite(Number(val))) continue;
        const group = typeof groupRaw === 'number' ? `Ward ${groupRaw}` : String(groupRaw);
        const bucket = map.get(group);
        if (bucket) {
            bucket.push(Number(val));
        } else {
            map.set(group, [Number(val)]);
        }
    }
    return map;
}

export function groupedBoxStats(
    rows: Partial<ParcelTileProperties>[],
    groupKey: keyof ParcelTileProperties,
    metricKey: keyof ParcelTileProperties
): GroupedBoxStats[] {
    const grouped = groupValues(rows, groupKey, metricKey);
    const result: GroupedBoxStats[] = [];
    for (const [group, values] of grouped) {
        result.push({ group, ...boxplotStats(values) });
    }
    return result.sort((a, b) => a.median - b.median);
}

export function pearsonR(xs: number[], ys: number[]): number {
    const n = xs.length;
    if (n === 0) return 0;
    const meanX = xs.reduce((s, v) => s + v, 0) / n;
    const meanY = ys.reduce((s, v) => s + v, 0) / n;
    let num = 0, sdX = 0, sdY = 0;
    for (let i = 0; i < n; i++) {
        const dx = xs[i] - meanX;
        const dy = ys[i] - meanY;
        num += dx * dy;
        sdX += dx * dx;
        sdY += dy * dy;
    }
    const denom = Math.sqrt(sdX * sdY);
    return denom === 0 ? 0 : num / denom;
}

export function subsample<T>(items: T[], n: number, seed: number): T[] {
    if (items.length <= n) return items;
    // deterministic Fisher-Yates partial shuffle with a simple LCG
    const copy = items.slice();
    let s = seed >>> 0;
    for (let i = 0; i < n; i++) {
        s = (Math.imul(1664525, s) + 1013904223) >>> 0;
        const j = i + (s % (copy.length - i));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
}

export function linearRegression(xs: number[], ys: number[]): { slope: number; intercept: number } {
    const n = xs.length;
    if (n === 0) return { slope: 0, intercept: 0 };
    const meanX = xs.reduce((s, v) => s + v, 0) / n;
    const meanY = ys.reduce((s, v) => s + v, 0) / n;
    let num = 0, denom = 0;
    for (let i = 0; i < n; i++) {
        const dx = xs[i] - meanX;
        num += dx * (ys[i] - meanY);
        denom += dx * dx;
    }
    const slope = denom === 0 ? 0 : num / denom;
    return { slope, intercept: meanY - slope * meanX };
}
