import { json } from '@sveltejs/kit';
import { db } from '$lib/db/index';
import { banners, products } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const activeBanners = db.select().from(banners).where(eq(banners.isActive, true)).orderBy(banners.sortOrder).all();
    const featuredProducts = db.select().from(products).where(eq(products.isFeatured, true)).orderBy(products.sortOrder).all();
    return json({ banners: activeBanners, featuredProducts });
};

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const result = db.insert(banners).values(body).returning().get();
    return json(result, { status: 201 });
};
