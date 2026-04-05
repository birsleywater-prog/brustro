import { db } from '../src/lib/db/index';
import { siteSettings } from '../src/lib/db/schema';

async function check() {
    try {
        console.log('Checking site_settings table...');
        const settings = await db.select().from(siteSettings);
        console.log('Table exists. Current settings:', settings);
    } catch (error) {
        console.error('Table does not exist or error querying:', error);
    }
    process.exit(0);
}

check();
