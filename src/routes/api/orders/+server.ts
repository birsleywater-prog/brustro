import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { orders } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return json(db.select().from(orders).orderBy(orders.createdAt).all());
};
export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const result = db.insert(orders).values(body).returning().get();
    return json(result, { status: 201 });
};

export const PATCH: RequestHandler = async ({ request }) => {
    const { id, status } = await request.json();
    if (!id || !status) {
        return json({ error: 'Missing id or status' }, { status: 400 });
    }
    const result = db.update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        .returning()
        .get();

    if (!result) {
        return json({ error: 'Order not found' }, { status: 404 });
    }
    return json(result);
};
