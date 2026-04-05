import { db } from '$lib/db/index';
import { contacts } from '$lib/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const all = await db.select().from(contacts).orderBy(desc(contacts.createdAt)).all();
    return { contacts: all };
};
