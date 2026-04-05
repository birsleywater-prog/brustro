import { db } from '$lib/db/index';
import { orders } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { sendOrderEmail } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({});

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const customerName = String(data.get('name') ?? '').trim();
        const email = String(data.get('email') ?? '').trim();
        const phone = String(data.get('phone') ?? '').trim();
        const address = String(data.get('address') ?? '').trim();
        const itemsJson = String(data.get('items') ?? '[]');
        const total = parseFloat(String(data.get('total') ?? '0'));

        if (!customerName || !email) return fail(400, { error: 'Name and email are required.' });

        await db.insert(orders).values({ customerName, email, phone, address, itemsJson, total }).run();

        // Send email asynchronously to avoid blocking the user response
        sendOrderEmail({ customerName, email, phone, address, itemsJson, total }).catch(error => {
            console.error('Asynchronous order email failed:', error);
        });

        throw redirect(303, '/?ordered=1');
    }
};
