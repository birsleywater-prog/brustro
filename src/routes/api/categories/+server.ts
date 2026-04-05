import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { categories } from '$lib/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    return json(db.select().from(categories).all());
};
export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const result = db.insert(categories).values(body).returning().get();
    return json(result, { status: 201 });
};
