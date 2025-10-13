import 'dotenv/config';
import { supabaseServer } from './utils/supabaseServer.js';

/**
 * Test script to verify Pro upgrade functionality
 * Usage: node test-pro-upgrade.js <user-email-or-id>
 */

const userInput = process.argv[2];

if (!userInput) {
  console.error('❌ Please provide user email or ID as argument');
  console.log('Usage: node test-pro-upgrade.js user@example.com');
  console.log('   or: node test-pro-upgrade.js c5cff058-a40c-4ae7-ad47-d9f9ab2ac4af');
  process.exit(1);
}

async function testProUpgrade() {
  console.log('🔍 Testing Pro upgrade for:', userInput);
  console.log('');

  // Step 1: Check if service role key is configured
  console.log('📋 Step 1: Checking Supabase configuration...');
  if (!process.env.SUPABASE_URL) {
    console.error('❌ SUPABASE_URL not found in .env');
    process.exit(1);
  }
  if (!process.env.SUPABASE_SERVICE_ROLE) {
    console.error('❌ SUPABASE_SERVICE_ROLE not found in .env');
    console.log('💡 Get it from: Supabase Dashboard → Settings → API → service_role key');
    process.exit(1);
  }
  console.log('✅ Supabase URL:', process.env.SUPABASE_URL);
  console.log('✅ Service role key configured (length:', process.env.SUPABASE_SERVICE_ROLE.length, 'chars)');
  console.log('');

  // Step 2: Find user by email or ID
  console.log('📋 Step 2: Finding user...');
  
  // Check if input looks like UUID (user ID) or email
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userInput);
  
  let query = supabaseServer
    .from('profiles')
    .select('id, email, subscription_tier, subscription_date');
  
  if (isUUID) {
    console.log('   Searching by ID...');
    query = query.eq('id', userInput);
  } else {
    console.log('   Searching by email...');
    query = query.eq('email', userInput);
  }
  
  const { data: profiles, error: findError } = await query;

  if (findError) {
    console.error('❌ Error finding user:', findError);
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.error('❌ User not found with', isUUID ? 'ID:' : 'email:', userInput);
    process.exit(1);
  }

  const user = profiles[0];
  console.log('✅ User found:');
  console.log('   ID:', user.id);
  console.log('   Email:', user.email);
  console.log('   Current tier:', user.subscription_tier);
  console.log('   Subscription date:', user.subscription_date || 'N/A');
  console.log('');

  // Step 3: Check if already Pro
  if (user.subscription_tier === 'pro') {
    console.log('ℹ️  User is already Pro. Testing update anyway...');
  }

  // Step 4: Test profile update
  console.log('📋 Step 3: Testing profile update (upgrading to Pro)...');
  const { data: updateResult, error: updateError } = await supabaseServer
    .from('profiles')
    .update({
      subscription_tier: 'pro',
      subscription_date: new Date().toISOString()
    })
    .eq('id', user.id)
    .select();

  if (updateError) {
    console.error('❌ Error updating profile:', updateError);
    console.log('');
    console.log('🔧 Possible fixes:');
    console.log('1. Verify you are using the SERVICE_ROLE key (not anon key)');
    console.log('2. Check if profiles table exists');
    console.log('3. Verify subscription_tier and subscription_date columns exist');
    process.exit(1);
  }

  console.log('✅ Profile updated successfully!');
  console.log('   New tier:', updateResult[0].subscription_tier);
  console.log('   Subscription date:', updateResult[0].subscription_date);
  console.log('');

  // Step 5: Verify the update
  console.log('📋 Step 4: Verifying update...');
  const { data: verifyResult, error: verifyError } = await supabaseServer
    .from('profiles')
    .select('subscription_tier, subscription_date')
    .eq('id', user.id)
    .single();

  if (verifyError) {
    console.error('❌ Error verifying update:', verifyError);
    process.exit(1);
  }

  console.log('✅ Verification successful!');
  console.log('   Current tier:', verifyResult.subscription_tier);
  console.log('   Subscription date:', verifyResult.subscription_date);
  console.log('');

  // Summary
  console.log('🎉 SUCCESS! Pro upgrade is working correctly!');
  console.log('');
  console.log('📝 Summary:');
  console.log('   User ID:', user.id);
  console.log('   Email:', user.email);
  console.log('   Status: Upgraded to Pro ✅');
  console.log('');
  console.log('💡 Next steps:');
  console.log('   1. Refresh the frontend (Ctrl+Shift+R)');
  console.log('   2. Check that Pro features are now accessible');
  console.log('   3. If still showing Free, check browser console for errors');
}

testProUpgrade().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
