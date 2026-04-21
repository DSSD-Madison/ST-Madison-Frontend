import { PUBLIC_STATS_ADDRESS } from '$env/static/public';
import type { ParcelTileProperties } from '$lib/api';

export const load = async ({ fetch }) => {
    const res = await fetch(PUBLIC_STATS_ADDRESS);
    const parcels: Partial<ParcelTileProperties>[] = await res.json();
    return { parcels };
};
