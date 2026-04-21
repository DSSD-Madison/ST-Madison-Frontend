import type { MetricConfig } from "$lib/config/metrics";

export function formatStop(value: number, format: string): string {
    if (format === 'currency') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    }
    if (format === 'percent') {
        return `${(value * 100).toFixed(2)}%`;
    }
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(value);
}

export function formatMetricValue(value: unknown, metric: MetricConfig): string {
    if (metric.type === 'categorical') return String(value);
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(num)) return '—';
    return formatStop(num, metric.format);
}
