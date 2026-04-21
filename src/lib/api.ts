import { PUBLIC_API_URL } from '$env/static/public';

export interface ParcelTileProperties {
    site_parcel_id: string | null;
    parcel_id: string | null;
    parcel_year: number | null;
    parcel_address: string | null;
    full_address: string | null;
    property_class: string | null;
    property_use: string | null;
    zoning_all: string | null;
    area_name: string | null;
    alder_district_name: string | null;
    area_plan_name: string | null;
    ward: number | null;
    bedrooms: number | null;
    full_baths: number | null;
    half_baths: number | null;
    total_living_area: number | null;
    lot_size: number | null;
    total_dwelling_units: number | null;
    current_land_value: number | null;
    current_improvement_value: number | null;
    current_total_value: number | null;
    net_taxes: number | null;
    total_taxes: number | null;
    tax_rate: number | null;
    net_taxes_per_sqft_lot: number | null;
    total_taxes_per_sqft_lot: number | null;
    land_value_per_sqft_lot: number | null;
    total_net_taxes_city: number | null;
    current_total_land_value_city: number | null;
    current_total_value_city: number | null;
    land_share_property: number | null;
    land_share_city: number | null;
    total_share_city: number | null;
    land_total_ratio_city: number | null;
    land_value_alignment_index: number | null;
    land_value_shift_taxes: number | null;
}

export interface AssessmentsData {
    landValue: string | null;
    improvementValue: string | null;
    totalAssessedValue: string | null;
    netTaxes: string | null;
    lotSize: string | null;
}

export interface LandEfficiencyData {
    landValuePerSqft: string | null;
    netTaxesPerSqft: string | null;
    landShareOfProperty: string | null;
    landValueAlignmentIndex: string | null;
}

export interface TrendsData {
    years: number[];
    effectiveTaxRate: number[];
    netTaxes: number[];
    assessedValue: number[];
}

export interface TaxBreakdownData {
    years: number[];
    sources: { label: string; values: number[] }[];
}

export interface PropertyDetailsData {
    propertyClass: string;
    propertyUse: string;
    yearBuilt: number | null;
    bedrooms: number | null;
    fullBaths: number | null;
    halfBaths: number | null;
    totalLivingArea: string | null;
    homeStyle: string | null;
    multiStory: boolean | null;
}

export interface ParcelData {
    assessments: AssessmentsData;
    landEfficiency: LandEfficiencyData;
    trends: TrendsData;
    taxBreakdown: TaxBreakdownData;
    propertyDetails: PropertyDetailsData;
}

export async function searchAddresses(query: string): Promise<string[]> {
    const url = `${PUBLIC_API_URL}/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json() as Promise<string[]>;
}

export async function fetchParcel(address: string): Promise<ParcelData> {
    const url = `${PUBLIC_API_URL}/parcel/${encodeURIComponent(address)}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch parcel: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<ParcelData>;
}
