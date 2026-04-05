import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { join } from 'path';

async function runMigrate() {
    const client = createClient({
        url: 'file:./db/database.sqlite'
    });

    const db = drizzle(client);

    console.log('⏳ Running migrations...');

    await migrate(db, { migrationsFolder: './drizzle/migrations' });

    console.log('✅ Migrations completed!');

    process.exit(0);
}

runMigrate().catch((err) => {
    console.error('❌ Migration failed');
    console.error(err);
    process.exit(1);
});
