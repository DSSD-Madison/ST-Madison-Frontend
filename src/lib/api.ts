import { PUBLIC_API_URL } from '$env/static/public';

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

export async function fetchParcel(address: string): Promise<ParcelData> {
    const url = `${PUBLIC_API_URL}/parcel/${encodeURIComponent(address)}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch parcel: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<ParcelData>;
}
