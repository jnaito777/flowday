import 'dotenv/config';

async function main() {
  try {
    const { createClient } = await import('@supabase/supabase-js');

    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error('Supabase env vars not set. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      process.exit(1);
    }

    // Use service key if available for unrestricted access; otherwise use anon key
    const adminKey = serviceKey || key;
    const supabase = createClient(url, adminKey);

    console.log('Testing Supabase task scheduling...\n');

    // Try to sign up or use a test account
    const timestamp = Math.floor(Date.now() / 1000);
    const testEmail = `flowday-test-${timestamp}@gmail.com`;
    const testPassword = 'TestPassword123!';

    console.log('1. Attempting to sign up test user:', testEmail);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: undefined,
      },
    });

    if (signUpError && signUpError.message !== 'User already registered') {
      console.error('Sign up error:', signUpError.message);
      process.exit(1);
    }

    let userId;
    if (signUpData?.user) {
      userId = signUpData.user.id;
      console.log('✓ Test user created:', userId);

      // Set session immediately for newly created user
      if (signUpData?.session) {
        await supabase.auth.setSession({
          access_token: signUpData.session.access_token,
          refresh_token: signUpData.session.refresh_token,
        });
        console.log('✓ Session set for new user');
      }
    } else {
      console.log('(User may already exist or other response)');
      userId = signUpData?.user?.id;
    }

    // If no userId, try sign in
    if (!userId) {
      console.log('\n2. Attempting to sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (signInError) {
        console.error('Sign in failed:', signInError.message);
        process.exit(1);
      }

      userId = signInData.user.id;
      console.log('✓ Signed in as:', userId);

      await supabase.auth.setSession({
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
      });
    } else {
      console.log('\n2. Session configured for authenticated requests');
    }

    // Insert a test unscheduled task
    console.log('\n3. Inserting test unscheduled task...');
    const { data: insertData, error: insertError } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: 'Test Task - ' + Date.now(),
        estimated_minutes: 60,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert failed:', insertError);
      process.exit(1);
    }

    const task = insertData;
    console.log('✓ Task created:', task.id, '-', task.title);

    // Schedule the task
    const start = new Date();
    const end = new Date(start.getTime() + task.estimated_minutes * 60 * 1000);

    console.log('\n4. Scheduling task from', start.toISOString(), 'to', end.toISOString());
    const { error: updateError, data: updateData } = await supabase
      .from('tasks')
      .update({
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
      })
      .eq('id', task.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update failed:', updateError);
      process.exit(1);
    }

    console.log('✓ Task scheduled successfully!');
    console.log('  scheduled_start:', updateData.scheduled_start);
    console.log('  scheduled_end:', updateData.scheduled_end);

    console.log('\n✓ All tests passed! DB writes and scheduling verified.');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err.message || err);
    process.exit(1);
  }
}

main();
