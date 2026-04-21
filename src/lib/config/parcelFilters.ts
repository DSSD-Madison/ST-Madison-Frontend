import type { ParcelTileProperties } from '$lib/api';

export type ParcelFilterState = {
    areaPlanNames: string[];
    alderDistrictNames: string[];
    wards: number[];
    propertyClasses: string[];
    propertyUses: string[];
};

export type ParcelFilterOptions = {
    areaPlanNames: string[];
    alderDistrictNames: string[];
    wards: number[];
    propertyClasses: string[];
    propertyUses: string[];
};

export const EMPTY_PARCEL_FILTERS: ParcelFilterState = {
    areaPlanNames: [],
    alderDistrictNames: [],
    wards: [],
    propertyClasses: [],
    propertyUses: []
};

export const EMPTY_PARCEL_FILTER_OPTIONS: ParcelFilterOptions = {
    areaPlanNames: [],
    alderDistrictNames: [],
    wards: [],
    propertyClasses: [],
    propertyUses: []
};

function uniqueSortedStrings(values: string[]): string[] {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function uniqueSortedNumbers(values: number[]): number[] {
    return [...new Set(values)].sort((a, b) => a - b);
}

export function normalizeParcelFilters(filters: ParcelFilterState): ParcelFilterState {
    return {
        areaPlanNames: uniqueSortedStrings(filters.areaPlanNames),
        alderDistrictNames: uniqueSortedStrings(filters.alderDistrictNames),
        wards: uniqueSortedNumbers(filters.wards),
        propertyClasses: uniqueSortedStrings(filters.propertyClasses),
        propertyUses: uniqueSortedStrings(filters.propertyUses)
    };
}

export function isParcelFilterStateEmpty(filters: ParcelFilterState): boolean {
    return (
        filters.areaPlanNames.length === 0 &&
        filters.alderDistrictNames.length === 0 &&
        filters.wards.length === 0 &&
        filters.propertyClasses.length === 0 &&
        filters.propertyUses.length === 0
    );
}

export function matchesParcelFilters(
    properties: Partial<ParcelTileProperties> | undefined,
    filters: ParcelFilterState
): boolean {
    if (!properties) return false;

    if (
        filters.areaPlanNames.length > 0 &&
        (typeof properties.area_plan_name !== 'string' ||
            !filters.areaPlanNames.includes(properties.area_plan_name))
    ) {
        return false;
    }

    if (
        filters.alderDistrictNames.length > 0 &&
        (typeof properties.alder_district_name !== 'string' ||
            !filters.alderDistrictNames.includes(properties.alder_district_name))
    ) {
        return false;
    }

    if (
        filters.wards.length > 0 &&
        (typeof properties.ward !== 'number' || !filters.wards.includes(properties.ward))
    ) {
        return false;
    }

    if (
        filters.propertyClasses.length > 0 &&
        (typeof properties.property_class !== 'string' ||
            !filters.propertyClasses.includes(properties.property_class))
    ) {
        return false;
    }

    if (
        filters.propertyUses.length > 0 &&
        (typeof properties.property_use !== 'string' ||
            !filters.propertyUses.includes(properties.property_use))
    ) {
        return false;
    }

    return true;
}

export function buildParcelFilterOptions(
    propertiesList: Array<Partial<ParcelTileProperties> | undefined>
): ParcelFilterOptions {
    const areaPlanNames: string[] = [];
    const alderDistrictNames: string[] = [];
    const wards: number[] = [];
    const propertyClasses: string[] = [];
    const propertyUses: string[] = [];

    for (const properties of propertiesList) {
        if (!properties) continue;

        if (typeof properties.area_plan_name === 'string') areaPlanNames.push(properties.area_plan_name);
        if (typeof properties.alder_district_name === 'string') {
            alderDistrictNames.push(properties.alder_district_name);
        }
        if (typeof properties.ward === 'number') wards.push(properties.ward);
        if (typeof properties.property_class === 'string') propertyClasses.push(properties.property_class);
        if (typeof properties.property_use === 'string') propertyUses.push(properties.property_use);
    }

    return {
        areaPlanNames: uniqueSortedStrings(areaPlanNames),
        alderDistrictNames: uniqueSortedStrings(alderDistrictNames),
        wards: uniqueSortedNumbers(wards),
        propertyClasses: uniqueSortedStrings(propertyClasses),
        propertyUses: uniqueSortedStrings(propertyUses)
    };
}
