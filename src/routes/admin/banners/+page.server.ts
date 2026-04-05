import { db } from '$lib/db/index';
import { banners } from '$lib/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const all = await db.select().from(banners).orderBy(banners.sortOrder).all();
    return { banners: all };
};
