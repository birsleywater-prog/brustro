import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { testimonials } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return json(db.select().from(testimonials).all());
};

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const result = db.insert(testimonials).values(body).returning().get();
    return json(result, { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const result = db.update(testimonials)
        .set(data)
        .where(eq(testimonials.id, id))
        .returning()
        .get();

    if (!result) return json({ error: 'Review not found' }, { status: 404 });
    return json(result);
};

export const DELETE: RequestHandler = async ({ request }) => {
    const { id } = await request.json();
    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const result = db.delete(testimonials)
        .where(eq(testimonials.id, id))
        .returning()
        .get();

    if (!result) return json({ error: 'Review not found' }, { status: 404 });
    return json({ success: true });
};
