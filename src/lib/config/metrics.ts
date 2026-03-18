export type NumericMetric = {
	key: string;
	label: string;
	type: 'numeric';
	format: 'currency' | 'number' | 'percent';
	stops: [number, string][];
};

export type CategoricalMetric = {
	key: string;
	label: string;
	type: 'categorical';
	categories: Record<string, string>;
	fallbackColor: string;
};

export type MetricConfig = NumericMetric | CategoricalMetric;

const RAMP_YELLOW_RED = [
	'#ffffb2',
	'#fed976',
	'#feb24c',
	'#fd8d3c',
	'#fc4e2a',
	'#e31a1c',
	'#b10026'
];

const RAMP_BLUE = [
	'#eff3ff',
	'#c6dbef',
	'#9ecae1',
	'#6baed6',
	'#3182bd',
	'#08519c'
];

export const metrics: MetricConfig[] = [
	{
		key: 'current_total_value',
		label: 'Total Assessed Value',
		type: 'numeric',
		format: 'currency',
		stops: [
			[0, RAMP_YELLOW_RED[0]],
			[100_000, RAMP_YELLOW_RED[1]],
			[200_000, RAMP_YELLOW_RED[2]],
			[400_000, RAMP_YELLOW_RED[3]],
			[700_000, RAMP_YELLOW_RED[4]],
			[1_000_000, RAMP_YELLOW_RED[5]],
			[2_000_000, RAMP_YELLOW_RED[6]]
		]
	},
	{
		key: 'land_value_per_sqft_lot',
		label: 'Land Value per Sq Ft',
		type: 'numeric',
		format: 'currency',
		stops: [
			[0, RAMP_YELLOW_RED[0]],
			[5, RAMP_YELLOW_RED[1]],
			[15, RAMP_YELLOW_RED[2]],
			[30, RAMP_YELLOW_RED[3]],
			[50, RAMP_YELLOW_RED[4]],
			[80, RAMP_YELLOW_RED[5]],
			[150, RAMP_YELLOW_RED[6]]
		]
	},
	{
		key: 'net_taxes',
		label: 'Net Taxes',
		type: 'numeric',
		format: 'currency',
		stops: [
			[0, RAMP_YELLOW_RED[0]],
			[2_000, RAMP_YELLOW_RED[1]],
			[4_000, RAMP_YELLOW_RED[2]],
			[6_000, RAMP_YELLOW_RED[3]],
			[10_000, RAMP_YELLOW_RED[4]],
			[15_000, RAMP_YELLOW_RED[5]],
			[25_000, RAMP_YELLOW_RED[6]]
		]
	},
	{
		key: 'total_living_area',
		label: 'Total Living Area (sq ft)',
		type: 'numeric',
		format: 'number',
		stops: [
			[0, RAMP_BLUE[0]],
			[800, RAMP_BLUE[1]],
			[1_500, RAMP_BLUE[2]],
			[2_500, RAMP_BLUE[3]],
			[4_000, RAMP_BLUE[4]],
			[6_000, RAMP_BLUE[5]]
		]
	},
	{
		key: 'lot_size',
		label: 'Lot Size (sq ft)',
		type: 'numeric',
		format: 'number',
		stops: [
			[0, RAMP_BLUE[0]],
			[3_000, RAMP_BLUE[1]],
			[6_000, RAMP_BLUE[2]],
			[10_000, RAMP_BLUE[3]],
			[20_000, RAMP_BLUE[4]],
			[50_000, RAMP_BLUE[5]]
		]
	},
	{
		key: 'land_value_alignment_index',
		label: 'Land Value Alignment Index',
		type: 'numeric',
		format: 'number',
		stops: [
			[0, RAMP_YELLOW_RED[0]],
			[0.5, RAMP_YELLOW_RED[1]],
			[1.0, RAMP_YELLOW_RED[2]],
			[1.5, RAMP_YELLOW_RED[3]],
			[2.0, RAMP_YELLOW_RED[4]],
			[3.0, RAMP_YELLOW_RED[5]],
			[5.0, RAMP_YELLOW_RED[6]]
		]
	},
	{
		key: 'tax_rate',
		label: 'Effective Tax Rate',
		type: 'numeric',
		format: 'percent',
		stops: [
			[0, RAMP_YELLOW_RED[0]],
			[0.5, RAMP_YELLOW_RED[1]],
			[1.0, RAMP_YELLOW_RED[2]],
			[1.5, RAMP_YELLOW_RED[3]],
			[2.0, RAMP_YELLOW_RED[4]],
			[2.5, RAMP_YELLOW_RED[5]],
			[3.5, RAMP_YELLOW_RED[6]]
		]
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
