#!/usr/bin/env node
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY in environment.');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function run() {
  console.log('Creating test task...');
  const now = new Date();
  const testTask = {
    title: 'E2E Test Task',
    description: 'Created by E2E script',
    date: now.toISOString().slice(0, 10),
    estimated_minutes: 30,
    created_at: new Date().toISOString(),
  };

  const { data: insertData, error: insertError } = await supabase
    .from('tasks')
    .insert([testTask])
    .select('*')
    .limit(1);

  if (insertError) {
    console.error('Insert error:', insertError);
    process.exit(3);
  }

  const created = insertData?.[0];
  console.log('Inserted task id:', created?.id);

  // Schedule the task for 09:00 today (local time) for 30 minutes
  const dateStr = testTask.date;
  const scheduledStart = new Date(`${dateStr}T09:00:00`).toISOString();
  const scheduledEnd = new Date(`${dateStr}T09:30:00`).toISOString();

  const { data: upd, error: updErr } = await supabase
    .from('tasks')
    .update({ scheduled_start: scheduledStart, scheduled_end: scheduledEnd })
    .eq('id', created.id)
    .select('*')
    .limit(1);

  if (updErr) {
    console.error('Update error:', updErr);
    process.exit(4);
  }

  console.log('Scheduled task:', upd?.[0]?.id, upd?.[0]?.scheduled_start);
  console.log('E2E create-and-schedule test completed successfully.');
}

run().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(99);
});
