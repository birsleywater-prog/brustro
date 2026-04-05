import { db } from '$lib/db/index';
import { products, banners, testimonials, blogPosts } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const featuredProducts = await db
        .select()
        .from(products)
        .where(eq(products.isFeatured, true))
        .orderBy(products.sortOrder)
        .all();

    const activeBanners = await db
        .select()
        .from(banners)
        .where(eq(banners.isActive, true))
        .orderBy(banners.sortOrder)
        .all();

    const activeTestimonials = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.isActive, true))
        .all();

    const recentPosts = await db
        .select()
        .from(blogPosts)
        .orderBy(blogPosts.publishedAt)
        .limit(3)
        .all();

    return {
        featuredProducts,
        banners: activeBanners,
        testimonials: activeTestimonials,
        recentPosts
    };
};
