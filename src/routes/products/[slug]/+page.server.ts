import { db } from '$lib/db/index';
import { products } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const product = await db.select().from(products).where(eq(products.slug, params.slug)).get();
    if (!product) throw error(404, 'Product not found');

    // Get related products (same category, excluding current)
    const relatedResults = product.categoryId
        ? await db.select().from(products)
            .where(eq(products.categoryId, product.categoryId))
            .limit(5)
            .all()
        : [];

    const related = relatedResults.filter(p => p.id !== product.id).slice(0, 4);

    return { product, related };
};
