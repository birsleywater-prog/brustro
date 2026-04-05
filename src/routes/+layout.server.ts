import { db, initDb, seedDb } from '$lib/db/index';
import type { LayoutServerLoad } from './$types';

let initialized = false;

export const load: LayoutServerLoad = async () => {
    if (!initialized) {
        await initDb();
        await seedDb();
        initialized = true;
    }
    return {};
};
