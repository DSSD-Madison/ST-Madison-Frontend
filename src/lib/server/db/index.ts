// Connection management
export { getConnection, getInstance, closeInstance } from './connection';

// Initialization
export { initializeDatabase } from './setup';

// Query utilities
export { query, queryStream, execute } from './queries';
export type { QueryResult } from './queries';

// Types
export type {
    Site,
    TaxRoll,
    AlderDistrict,
    AreaPlan,
    Parcel,
    Street,
    NeighborhoodAverage,
    AlderDistrictAverage,
    PropertyClassAverage
} from './types';
