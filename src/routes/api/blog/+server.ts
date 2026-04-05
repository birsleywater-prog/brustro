import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { blogPosts } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return json(db.select().from(blogPosts).orderBy(blogPosts.publishedAt).all());
};

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const result = db.insert(blogPosts).values(body).returning().get();
    return json(result, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, url }) => {
    // Assuming ID is passed in the request body for simplicity like the other admin APIs
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const result = db.update(blogPosts)
        .set(data)
        .where(eq(blogPosts.id, id))
        .returning()
        .get();

    if (!result) return json({ error: 'Post not found' }, { status: 404 });
    return json(result);
};

export const DELETE: RequestHandler = async ({ request }) => {
    const { id } = await request.json();
    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const result = db.delete(blogPosts)
        .where(eq(blogPosts.id, id))
        .returning()
        .get();

    if (!result) return json({ error: 'Post not found' }, { status: 404 });
    return json({ success: true });
};
