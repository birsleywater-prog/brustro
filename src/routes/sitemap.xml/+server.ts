import { db } from '$lib/db/index';
import { products, categories, blogPosts } from '$lib/db/schema';
import { env } from '$env/dynamic/public';

export async function GET() {
    const baseUrl = env.PUBLIC_SITE_URL || 'https://birsley.in';
    const pages = ['', '/about', '/products', '/categories', '/contact', '/blog'];

    const allProducts = await db.select().from(products);
    const allCategories = await db.select().from(categories);
    const allPosts = await db.select().from(blogPosts);

    const urls = [
        ...pages.map(p => `${baseUrl}${p}`),
        ...allProducts.map(p => `${baseUrl}/products/${p.slug}`),
        ...allCategories.map(c => `${baseUrl}/products?category=${c.slug}`),
        ...allPosts.map(p => `${baseUrl}/blog/${p.slug}`)
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml' }
    });
}
