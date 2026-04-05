import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
    const { pathname } = event.url;

    if (!env.ADMIN_PASSWORD) {
        console.warn('WARNING: ADMIN_PASSWORD environment variable is not set.');
    }

    // Protect all admin routes except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const session = event.cookies.get('admin_session');
        if (session !== 'authenticated') {
            throw redirect(303, '/admin/login');
        }
    }

    // Handle admin login check
    if (pathname === '/admin/login' && event.request.method === 'POST') {
        // Handled by the page action
    }

    // Expose ADMIN_PASSWORD to server-side forms
    event.locals.adminPassword = env.ADMIN_PASSWORD || '';

    return resolve(event);
};
