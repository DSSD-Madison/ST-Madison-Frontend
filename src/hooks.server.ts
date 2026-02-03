import type { Handle } from '@sveltejs/kit';
import { initializeDatabase } from '$lib/server/db';

let dbInitPromise: Promise<void> | null = null;

export const handle: Handle = async ({ event, resolve }) => {
    // Lazy initialization - only init on first actual request
    if (!dbInitPromise) {
        dbInitPromise = initializeDatabase().catch((error) => {
            console.error('[DuckDB] Failed to initialize:', error);
            dbInitPromise = null; // Allow retry on next request
            throw error;
        });
    }

    // Wait for initialization before handling request
    await dbInitPromise;

    return resolve(event);
};
