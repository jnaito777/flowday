#!/usr/bin/env node
import { Client } from 'pg';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Missing DATABASE_URL. Set the Postgres connection string in env var DATABASE_URL.');
    process.exit(1);
  }

  const taskId = process.env.TASK_ID;
  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    let res;
    if (taskId) {
      res = await client.query('DELETE FROM public.tasks WHERE id = $1 RETURNING id, title', [taskId]);
    } else {
      // delete the most recent E2E PG Task (by title)
      const sel = await client.query("SELECT id FROM public.tasks WHERE title = $1 ORDER BY created_at DESC LIMIT 1", ['E2E PG Task']);
      if (!sel.rows.length) {
        console.log('No E2E PG Task rows found to delete.');
        process.exit(0);
      }
      const idToDelete = sel.rows[0].id;
      res = await client.query('DELETE FROM public.tasks WHERE id = $1 RETURNING id, title', [idToDelete]);
    }
    if (!res.rows.length) {
      console.log('No rows were deleted.');
      process.exit(0);
    }
    console.log('Deleted rows:');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Delete failed:', err.message || err);
    process.exit(2);
  } finally {
    try { await client.end(); } catch (_) {}
  }
}

main().catch((err) => { console.error('Unexpected error:', err); process.exit(99); });
