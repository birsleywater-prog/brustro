import { db } from '$lib/db/index';
import { testimonials } from '$lib/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const reviews = await db.select().from(testimonials).all();
    return {
        reviews
    };
};
