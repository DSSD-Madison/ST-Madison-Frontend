import type { ParcelTileProperties } from '$lib/api';

export type NumericMetric = {
    key: keyof ParcelTileProperties;
    label: string;
    type: 'numeric';
    format: 'currency' | 'number' | 'percent';
    colorScheme: string;
    scaleType: 'log' | 'quantile';
};

export type CategoricalMetric = {
    key: keyof ParcelTileProperties;
    label: string;
    type: 'categorical';
    categories: Record<string, string>;
    fallbackColor: string;
};

export type MetricConfig = NumericMetric | CategoricalMetric;

export const metrics: MetricConfig[] = [
    {
        key: 'current_total_value',
        label: 'Total Assessed Value',
        type: 'numeric',
        format: 'currency',
        colorScheme: 'YlOrRd',
        scaleType: 'log'
    },
    {
        key: 'land_value_per_sqft_lot',
        label: 'Land Value per Sq Ft',
        type: 'numeric',
        format: 'currency',
        colorScheme: 'YlOrRd',
        scaleType: 'log'
    },
    {
        key: 'net_taxes',
        label: 'Net Taxes',
        type: 'numeric',
        format: 'currency',
        colorScheme: 'YlOrRd',
        scaleType: 'log'
    },
    {
        key: 'total_living_area',
        label: 'Total Living Area (sq ft)',
        type: 'numeric',
        format: 'number',
        colorScheme: 'Blues',
        scaleType: 'log'
    },
    {
        key: 'lot_size',
        label: 'Lot Size (sq ft)',
        type: 'numeric',
        format: 'number',
        colorScheme: 'Blues',
        scaleType: 'log'
    },
    {
        key: 'land_value_alignment_index',
        label: 'Land Value Alignment Index',
        type: 'numeric',
        format: 'number',
        colorScheme: 'YlOrRd',
        scaleType: 'quantile'
    },
    {
        key: 'tax_rate',
        label: 'Effective Tax Rate',
        type: 'numeric',
        format: 'percent',
        colorScheme: 'YlOrRd',
        scaleType: 'quantile'
    },
    {
        key: 'net_taxes_per_sqft_lot',
        label: 'Net Taxes /sqft',
        type: 'numeric',
        format: 'currency',
        colorScheme: 'YlOrRd',
        scaleType: 'log'
    },
    {
        key: 'land_share_property',
        label: 'Land Share',
        type: 'numeric',
        format: 'percent',
        colorScheme: 'YlOrRd',
        scaleType: 'quantile'
    },
    {
        key: 'property_class',
        label: 'Property Class',
        type: 'categorical',
        categories: {
            Residential: '#3b82f6',
            Commercial: '#ef4444',
            Manufacturing: '#a855f7',
            Agricultural: '#22c55e',
            Undeveloped: '#eab308',
            'Ag Forest': '#15803d',
            Forest: '#166534',
            Other: '#6b7280'
        },
        fallbackColor: '#9ca3af'
    },
    {
        key: 'zoning_all',
        label: 'Zoning',
        type: 'categorical',
        categories: {
            SR: '#93c5fd',
            TR: '#60a5fa',
            DR: '#3b82f6',
            NMX: '#f97316',
            TSS: '#fb923c',
            CC: '#ef4444',
            EC: '#dc2626',
            IL: '#a855f7',
            IG: '#9333ea',
            SE: '#22c55e',
            CN: '#fbbf24',
            CI: '#f59e0b',
            PD: '#14b8a6',
            PR: '#10b981',
            UA: '#6b7280',
            A: '#4ade80'
        },
        fallbackColor: '#9ca3af'
    }
];

export const NUMERIC_METRICS = metrics.filter((m): m is NumericMetric => m.type === 'numeric');
