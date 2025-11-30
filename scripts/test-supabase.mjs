import 'dotenv/config';

async function main() {
  try {
    const { createClient } = await import('@supabase/supabase-js');

    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error('Supabase env vars not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      process.exit(1);
    }

    const supabase = createClient(url, key);

    console.log('Fetching one unscheduled task (no user filter)...');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .is('scheduled_start', null)
      .limit(1);

    if (error) {
      console.error('Error querying tasks:', error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('No unscheduled tasks found (or access restricted).');
      process.exit(0);
    }

    const task = data[0];
    console.log('Found task:', task.id, task.title || task);

    const start = new Date();
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

    console.log('Attempting to schedule task for 1 hour from now...');
    const { error: upError, data: upData } = await supabase
      .from('tasks')
      .update({ scheduled_start: start.toISOString(), scheduled_end: end.toISOString() })
      .eq('id', task.id)
      .select()
      .single();

    if (upError) {
      console.error('Update failed:', upError);
      process.exit(1);
    }

    console.log('Update successful. New record:', upData);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

main();
