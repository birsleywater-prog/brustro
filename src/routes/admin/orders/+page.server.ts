import { db } from '$lib/db/index';
import { orders } from '$lib/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const all = await db.select().from(orders).orderBy(desc(orders.createdAt)).all();
    return { orders: all };
};
