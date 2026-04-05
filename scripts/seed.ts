import { initDb, seedDb } from '../src/lib/db/index';

async function runSeed() {
    console.log('⏳ Seeding database...');

    await initDb();
    await seedDb();

    console.log('✅ Seeding completed!');

    process.exit(0);
}

runSeed().catch((err) => {
    console.error('❌ Seeding failed');
    console.error(err);
    process.exit(1);
});
