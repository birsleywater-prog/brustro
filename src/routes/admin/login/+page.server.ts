import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies, locals }) => {
        const data = await request.formData();
        const password = data.get('password');

        if (password === locals.adminPassword) {
            cookies.set('admin_session', 'authenticated', {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
            throw redirect(303, '/admin');
        }

        return fail(401, { error: 'Invalid admin password' });
    }
};
