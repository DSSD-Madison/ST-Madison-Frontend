// Types for parquet file schemas
// These are based on the notebook examples provided

export interface Site {
    site_parcel_id: string;
    parcel_address: string;
    property_class: string;
    property_use: string;
    area_name: string;
    alder_district_name: string;
    bedrooms: number;
    full_baths: number;
    half_baths: number;
    total_living_area: number;
    lot_size: number;
    current_total_value: number;
    total_taxes: number;
    tax_rate: number;
    land_value_per_sqft_lot: number;
    // Geometry fields for MapLibre
    latitude?: number;
    longitude?: number;
    geometry?: string;
}

export interface TaxRoll {
    parcel_id: string;
    tax_year: number;
    assessed_value_land: number;
    assessed_value_improvement: number;
    total_assessed_value: number;
    county_tax: number;
    city_tax: number;
    school_tax: number;
    matc_tax: number;
    gross_tax: number;
    net_tax: number;
}

export interface AlderDistrict {
    district_id: number;
    district_name: string;
    alder_name?: string;
    geometry?: string;
}

export interface AreaPlan {
    plan_id: string;
    plan_name: string;
    geometry?: string;
}

export interface Parcel {
    parcel_id: string;
    address: string;
    owner_name?: string;
    assessed_value?: number;
    geometry?: string;
}

export interface Street {
    street_id: string;
    street_name: string;
    street_type?: string;
    geometry?: string;
}

// Aggregation result types from notebook examples
export interface NeighborhoodAverage {
    area_name: string;
    home_count: number;
    avg_home_value: number;
    avg_tax_bill: number;
    avg_tax_rate: number;
    avg_land_value_sqft: number;
}

export interface AlderDistrictAverage {
    district: string;
    avg_home_value: number;
    avg_tax_bill: number;
    avg_tax_rate: number;
    avg_land_value_sqft: number;
}

export interface PropertyClassAverage {
    property_class: string;
    avg_value: number;
    avg_tax_bill: number;
    avg_tax_rate: number;
    avg_land_value_sqft: number;
}
