import { json, error as svelteError } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { categories } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    const c = db.select().from(categories).where(eq(categories.id, parseInt(params.id))).get();
    if (!c) throw svelteError(404, 'Not found');
    return json(c);
};
export const PUT: RequestHandler = async ({ params, request }) => {
    const body = await request.json();
    const result = db.update(categories).set(body).where(eq(categories.id, parseInt(params.id))).returning().get();
    return json(result);
};
export const DELETE: RequestHandler = async ({ params }) => {
    db.delete(categories).where(eq(categories.id, parseInt(params.id))).run();
    return json({ success: true });
};
