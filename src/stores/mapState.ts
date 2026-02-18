import { writable } from 'svelte/store';

export type Metric = 'net_taxes_per_sqft' | 'total_property_value' | 'land_value_per_sqft';

export interface MetricOption {
	value: Metric;
	label: string;
}

export const METRIC_OPTIONS: MetricOption[] = [
	{ value: 'net_taxes_per_sqft', label: 'Net Taxes per Sq Ft' },
	{ value: 'total_property_value', label: 'Total Property Value' },
	{ value: 'land_value_per_sqft', label: 'Land Value per Sq Ft' }
];

export const selectedMetric = writable<Metric>('net_taxes_per_sqft');
export const alternativeMetric1 = writable<Metric>('total_property_value')
export const alternativeMetric2 = writable<Metric>('land_value_per_sqft')
