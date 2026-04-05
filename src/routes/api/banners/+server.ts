import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { banners } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const allBanners = db.select().from(banners).orderBy(banners.sortOrder).all();
    return json(allBanners);
};

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const result = db.insert(banners).values(body).returning().get();
    return json(result, { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const result = db.update(banners)
        .set(data)
        .where(eq(banners.id, id))
        .returning()
        .get();

    if (!result) return json({ error: 'Banner not found' }, { status: 404 });
    return json(result);
};

export const DELETE: RequestHandler = async ({ request, params }) => {
    // Some implementations might pass ID in body, others in params.
    // Given the previous pattern, we'll try body first.
    let id: number | undefined;
    try {
        const body = await request.json();
        id = body.id;
    } catch (e) {
        // ignore
    }

    if (!id) return json({ error: 'Missing ID' }, { status: 400 });

    const result = db.delete(banners)
        .where(eq(banners.id, id))
        .returning()
        .get();

    if (!result) return json({ error: 'Banner not found' }, { status: 404 });
    return json({ success: true });
};
