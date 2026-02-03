import { getConnection } from './connection';
import { initializeDatabase } from './setup';

export interface QueryResult<T = Record<string, unknown>> {
    rows: T[];
    rowCount: number;
    columnNames: string[];
}

/**
 * Execute a query and return typed results.
 * Ensures database is initialized before querying.
 */
export async function query<T = Record<string, unknown>>(sql: string): Promise<QueryResult<T>> {
    await initializeDatabase();

    const connection = await getConnection();

    try {
        const reader = await connection.runAndReadAll(sql);
        // Use getRowObjectsJson() to ensure BigInt values are converted to JSON-safe types
        const rows = reader.getRowObjectsJson() as T[];
        const columnNames = reader.columnNames();

        return {
            rows,
            rowCount: rows.length,
            columnNames
        };
    } finally {
        connection.closeSync();
    }
}

/**
 * Execute a query and stream results in chunks.
 * Useful for large result sets.
 */
export async function* queryStream<T = Record<string, unknown>>(
    sql: string
): AsyncGenerator<T[], void, unknown> {
    await initializeDatabase();

    const connection = await getConnection();

    try {
        const result = await connection.stream(sql);

        for await (const chunk of result.yieldRowObjectJson()) {
            yield chunk as T[];
        }
    } finally {
        connection.closeSync();
    }
}

/**
 * Execute a query that doesn't return results (DDL, etc.).
 */
export async function execute(sql: string): Promise<void> {
    await initializeDatabase();

    const connection = await getConnection();

    try {
        await connection.run(sql);
    } finally {
        connection.closeSync();
    }
}
