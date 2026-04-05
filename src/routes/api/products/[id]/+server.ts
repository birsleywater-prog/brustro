import { json, error as svelteError } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { products } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    const p = db.select().from(products).where(eq(products.id, parseInt(params.id))).get();
    if (!p) throw svelteError(404, 'Not found');
    return json(p);
};

export const PUT: RequestHandler = async ({ params, request }) => {
    const body = await request.json();
    const result = db.update(products).set(body).where(eq(products.id, parseInt(params.id))).returning().get();
    return json(result);
};

export const DELETE: RequestHandler = async ({ params }) => {
    db.delete(products).where(eq(products.id, parseInt(params.id))).run();
    return json({ success: true });
};
