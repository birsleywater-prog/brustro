import { db } from '$lib/db/index';
import { blogPosts } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, params.slug)).get();
    if (!post) throw error(404, 'Article not found');
    return { post };
};
