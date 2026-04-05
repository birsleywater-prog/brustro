import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { products } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const all = db.select().from(products).orderBy(products.sortOrder).all();
    return json(all);
};

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const result = db.insert(products).values(body).returning().get();
    return json(result, { status: 201 });
};
