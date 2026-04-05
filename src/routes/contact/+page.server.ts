import { db } from '$lib/db/index';
import { contacts } from '$lib/db/schema';
import { fail } from '@sveltejs/kit';
import { sendEnquiryEmail } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({});

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const name = String(data.get('name') ?? '').trim();
        const email = String(data.get('email') ?? '').trim();
        const phone = String(data.get('phone') ?? '').trim();
        const message = String(data.get('message') ?? '').trim();

        if (!name || !email || !message) {
            return fail(400, { error: 'Name, email and message are required.' });
        }

        await db.insert(contacts).values({ name, email, phone, message }).run();

        // Send email asynchronously to avoid blocking the user response
        sendEnquiryEmail({ name, email, phone, message }).catch(error => {
            console.error('Asynchronous enquiry email failed:', error);
        });

        return { success: true };
    }
};
