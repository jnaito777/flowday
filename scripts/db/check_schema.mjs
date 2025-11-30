#!/usr/bin/env node
import { Client } from 'pg';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Missing DATABASE_URL. Set the Postgres connection string in env var DATABASE_URL.');
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('Connected — running schema checks on `public.tasks`...');

    const cols = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'tasks'
      ORDER BY ordinal_position
    `);

    console.log('\nColumns:');
    console.log(JSON.stringify(cols.rows, null, 2));

    const pk = await client.query(`
      SELECT a.attname as column_name
      FROM   pg_index i
      JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE  i.indrelid = 'public.tasks'::regclass AND i.indisprimary;
    `);
    console.log('\nPrimary key columns:');
    console.log(JSON.stringify(pk.rows.map(r => r.column_name), null, 2));

    const fks = await client.query(`
      SELECT
        tc.constraint_name, kcu.column_name, ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='tasks' AND tc.table_schema='public';
    `);
    console.log('\nForeign keys:');
    console.log(JSON.stringify(fks.rows, null, 2));

    const notnulls = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='tasks' AND is_nullable='NO'
    `);
    console.log('\nNot-null columns:');
    console.log(JSON.stringify(notnulls.rows.map(r => r.column_name), null, 2));

    const counts = await client.query(`
      SELECT
        (SELECT count(*) FROM public.tasks) as total_tasks,
        (SELECT count(*) FROM public.tasks WHERE scheduled_start IS NOT NULL) as scheduled_count,
        (SELECT count(*) FROM public.tasks WHERE completed = true) as completed_count
    `);
    console.log('\nCounts:');
    console.log(JSON.stringify(counts.rows[0], null, 2));

    const recent = await client.query(`SELECT id, title, user_id, scheduled_start FROM public.tasks ORDER BY created_at DESC LIMIT 10`);
    console.log('\nRecent tasks:');
    console.log(JSON.stringify(recent.rows, null, 2));

    console.log('\nSchema checks completed.');
  } catch (err) {
    console.error('Schema check failed:', err.message || err);
    process.exit(2);
  } finally {
    try { await client.end(); } catch (_) {}
  }
}

main().catch((err) => { console.error('Unexpected error:', err); process.exit(99); });
