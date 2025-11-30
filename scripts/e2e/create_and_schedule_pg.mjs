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
    console.log('Connected to DB — inserting test task...');

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const insertText = `INSERT INTO public.tasks (title, description, date, estimated_minutes, created_at)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const insertValues = ['E2E PG Task', 'Inserted by PG E2E runner', dateStr, 30, new Date().toISOString()];

    const insertRes = await client.query(insertText, insertValues);
    const taskId = insertRes.rows[0]?.id;
    console.log('Inserted task id:', taskId);

    // Schedule for 09:00 - 09:30 local
    const scheduledStart = new Date(`${dateStr}T09:00:00`).toISOString();
    const scheduledEnd = new Date(`${dateStr}T09:30:00`).toISOString();

    const updText = `UPDATE public.tasks SET scheduled_start = $1, scheduled_end = $2 WHERE id = $3 RETURNING id, scheduled_start, scheduled_end`;
    const updRes = await client.query(updText, [scheduledStart, scheduledEnd, taskId]);
    console.log('Scheduled task row:', updRes.rows[0]);

    console.log('E2E PG create-and-schedule completed.');
  } catch (err) {
    console.error('E2E PG runner failed:', err.message || err);
    process.exit(2);
  } finally {
    try { await client.end(); } catch (_) {}
  }
}

main().catch((err) => { console.error('Unexpected error:', err); process.exit(99); });
