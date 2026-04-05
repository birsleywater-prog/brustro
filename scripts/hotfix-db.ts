import { createClient } from '@libsql/client';

async function runHotfix() {
    const client = createClient({
        url: 'file:./db/database.sqlite'
    });

    console.log('⏳ Adding background_image column to banners table...');

    try {
        await client.execute('ALTER TABLE banners ADD COLUMN background_image text;');
        console.log('✅ background_image column added!');
    } catch (err: any) {
        if (err.message.includes('duplicate column name')) {
            console.log('ℹ️ Column background_image already exists.');
        } else {
            console.error('❌ Hotfix failed');
            console.error(err);
        }
    }

    process.exit(0);
}

runHotfix().catch((err) => {
    console.error('❌ Hotfix failed');
    console.error(err);
    process.exit(1);
});
