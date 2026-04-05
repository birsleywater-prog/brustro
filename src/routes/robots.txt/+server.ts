import { env } from '$env/dynamic/public';

export const GET = async () => {
    const siteUrl = env.PUBLIC_SITE_URL || 'https://birsley.in';

    const robots = `User-agent: *
Allow: /

# Disallow admin routes
Disallow: /admin
Disallow: /admin/*

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml
`;

    return new Response(robots, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=3600'
        }
    });
};
