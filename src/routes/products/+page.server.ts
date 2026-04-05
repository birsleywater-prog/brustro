import { db } from '$lib/db/index';
import { products, categories } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const allProducts = await db.select().from(products).orderBy(products.sortOrder).all();
    const allCategories = await db.select().from(categories).all();
    return { products: allProducts, categories: allCategories };
};
