import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: ({ cookies }) => {
        cookies.delete('admin_session', { path: '/' });
        throw redirect(303, '/admin/login');
    }
};
