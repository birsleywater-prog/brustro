import { db } from '$lib/db/index';
import { categories } from '$lib/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const all = await db.select().from(categories).all();
    return { categories: all };
};
