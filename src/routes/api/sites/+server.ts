import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { query, type Site } from '$lib/server/db';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100'), 1000);
        const offset = parseInt(url.searchParams.get('offset') ?? '0');
        const propertyClass = url.searchParams.get('property_class');

        let sql = `SELECT * FROM gold.sites`;

        if (propertyClass) {
            sql += ` WHERE property_class = '${propertyClass.replace(/'/g, "''")}'`;
        }

        sql += ` LIMIT ${limit} OFFSET ${offset}`;

        const result = await query<Site>(sql);

        return json({
            data: result.rows,
            meta: {
                count: result.rowCount,
                limit,
                offset
            }
        });
    } catch (err) {
        console.error('[API] Error fetching sites:', err);
        throw error(500, {
            message: 'Failed to fetch sites'
        });
    }
};
