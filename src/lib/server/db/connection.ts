import { DuckDBInstance, type DuckDBConnection } from '@duckdb/node-api';

let instance: DuckDBInstance | null = null;
let isInitialized = false;

/**
 * Get or create the DuckDB singleton instance.
 * Uses in-memory database since we're only querying remote parquet files.
 */
export async function getInstance(): Promise<DuckDBInstance> {
    if (!instance) {
        instance = await DuckDBInstance.create(':memory:');
    }
    return instance;
}

/**
 * Create a new connection from the singleton instance.
 * Each request should get its own connection for isolation.
 */
export async function getConnection(): Promise<DuckDBConnection> {
    const inst = await getInstance();
    return inst.connect();
}

/**
 * Check if the database has been initialized with extensions and views.
 */
export function isDatabaseInitialized(): boolean {
    return isInitialized;
}

/**
 * Mark the database as initialized.
 */
export function markInitialized(): void {
    isInitialized = true;
}

/**
 * Cleanup function for graceful shutdown.
 */
export async function closeInstance(): Promise<void> {
    if (instance) {
        instance = null;
        isInitialized = false;
    }
}
