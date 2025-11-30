import 'dotenv/config';

async function runMigrations() {
  try {
    const { createClient } = await import('@supabase/supabase-js');

    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY required to run migrations');
      console.error('Set this environment variable with your Supabase service role key');
      process.exit(1);
    }

    console.log('Connecting to Supabase with service role...\n');
    const supabase = createClient(url, serviceKey);

    const migrations = [
      {
        name: 'Add description column to tasks',
        sql: 'ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;',
      },
      {
        name: 'Add category column to tasks',
        sql: 'ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT;',
      },
      {
        name: 'Add estimated_minutes column if missing',
        sql: 'ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER NOT NULL DEFAULT 30;',
      },
    ];

    for (const migration of migrations) {
      console.log(`Running: ${migration.name}`);
      const { error } = await supabase.rpc('exec', { query: migration.sql });

      if (error) {
        console.error(`  ❌ Failed: ${error.message}`);
        console.error(`  Trying raw SQL approach...`);

        // Try using the query in a different way
        const res = await fetch(`${url}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: migration.sql }),
        });

        if (!res.ok) {
          console.error(`  ❌ Migration failed. You may need to run this manually in Supabase SQL editor:`);
          console.error(`  ${migration.sql}`);
        } else {
          console.log(`  ✓ Migration applied`);
        }
      } else {
        console.log(`  ✓ Migration applied`);
      }
    }

    console.log('\nMigrations complete. Run `node scripts/check-schema.mjs` to verify.');
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

runMigrations();
