import { getConnection, isDatabaseInitialized, markInitialized } from './connection';
import { GCS_KEY_ID, GCS_SECRET } from '$env/static/private';

const GOLD_VIEWS = [
    { name: 'alder_districts', file: 'fact_alder_districts.parquet' },
    { name: 'area_plans', file: 'fact_area_plans.parquet' },
    { name: 'sites', file: 'fact_sites.parquet' }
] as const;

const SILVER_VIEWS = [
    { name: 'parcels', file: 'fact_parcels.parquet' },
    { name: 'streets', file: 'fact_streets.parquet' },
    { name: 'tax_roll', file: 'fact_tax_roll.parquet' }
] as const;

/**
 * Escape single quotes in strings for SQL.
 */
function escapeString(str: string): string {
    return str.replace(/'/g, "''");
}

/**
 * Initialize DuckDB with httpfs extension and GCS credentials.
 * This should be called once at server startup.
 */
export async function initializeDatabase(): Promise<void> {
    if (isDatabaseInitialized()) {
        return;
    }

    const connection = await getConnection();

    try {
        // Install and load httpfs extension
        await connection.run('INSTALL httpfs');
        await connection.run('LOAD httpfs');

        // Create GCS credentials secret
        await connection.run(`
			CREATE OR REPLACE PERSISTENT SECRET gcs_credentials (
				TYPE gcs,
				KEY_ID '${escapeString(GCS_KEY_ID)}',
				SECRET '${escapeString(GCS_SECRET)}'
			)
		`);

        // Create schemas for organization
        await connection.run('CREATE SCHEMA IF NOT EXISTS gold');
        await connection.run('CREATE SCHEMA IF NOT EXISTS silver');

        // Create views for gold bucket
        for (const view of GOLD_VIEWS) {
            await connection.run(`
				CREATE OR REPLACE VIEW gold.${view.name} AS
				SELECT * FROM 'gs://stmsn-gold/${view.file}'
			`);
        }

        // Create views for silver bucket
        for (const view of SILVER_VIEWS) {
            await connection.run(`
				CREATE OR REPLACE VIEW silver.${view.name} AS
				SELECT * FROM 'gs://stmsn-silver/${view.file}'
			`);
        }

        markInitialized();
        console.log('[DuckDB] Database initialized successfully');
    } finally {
        connection.closeSync();
    }
}
