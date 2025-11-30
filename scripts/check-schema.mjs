import 'dotenv/config';

async function checkSchema() {
  try {
    const { createClient } = await import('@supabase/supabase-js');

    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error('Supabase env vars not set');
      process.exit(1);
    }

    const supabase = createClient(url, key);

    console.log('Checking tasks table schema...\n');

    // Try to fetch info_schema directly
    const { data, error } = await supabase.rpc('query', {
      query: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tasks' ORDER BY ordinal_position;`,
    });

    if (error) {
      console.log('RPC method not available, attempting direct query...');
      
      // Try a simple select to see if columns exist
      const { error: err1 } = await supabase
        .from('tasks')
        .select('description')
        .limit(0);

      const { error: err2 } = await supabase
        .from('tasks')
        .select('category')
        .limit(0);

      console.log('description column:', err1 ? '❌ NOT FOUND' : '✓ EXISTS');
      console.log('category column:', err2 ? '❌ NOT FOUND' : '✓ EXISTS');

      if (err1 || err2) {
        console.log('\nMissing columns detected. Run Supabase migrations to add them.');
        console.log('SQL to add columns:');
        console.log('  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;');
        console.log('  ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT;');
      } else {
        console.log('\n✓ All expected columns present!');
      }
    } else {
      console.log('Table columns:');
      data?.forEach((col) => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message || err);
  }
}

checkSchema();
