import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is missing inside .env.local');
    }

    console.log('⏳ Connecting to Neon via HTTP...');
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log('🚀 Running migrations...');
    await migrate(db, { migrationsFolder: './lib/db/migrations' });

    console.log('✅ Migrations completed successfully! Check your Neon Console.');
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});