import 'dotenv/config';
import { supabaseServer } from './utils/supabaseServer.js';

/**
 * Create missing profile for a user
 * Usage: node create-missing-profile.js <user-id-or-email>
 */

const userInput = process.argv[2];

if (!userInput) {
  console.error('❌ Please provide user ID or email');
  console.log('Usage: node create-missing-profile.js <user-id-or-email>');
  process.exit(1);
}

async function createMissingProfile() {
  console.log('🔍 Looking up user:', userInput);
  
  // Check if input is UUID or email
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userInput);
  
  // Get user from auth.users
  const { data: authUsers, error: authError } = await supabaseServer.auth.admin.listUsers();
  
  if (authError) {
    console.error('❌ Error fetching users:', authError);
    process.exit(1);
  }
  
  const user = authUsers.users.find(u => 
    isUUID ? u.id === userInput : u.email === userInput
  );
  
  if (!user) {
    console.error('❌ User not found:', userInput);
    process.exit(1);
  }
  
  console.log('✅ User found:');
  console.log('   ID:', user.id);
  console.log('   Email:', user.email);
  console.log('   Full Name:', user.user_metadata?.full_name || 'N/A');
  console.log('');
  
  // Check if profile already exists
  const { data: existingProfile } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (existingProfile) {
    console.log('ℹ️  Profile already exists:');
    console.log('   Subscription Tier:', existingProfile.subscription_tier);
    console.log('   Full Name:', existingProfile.full_name);
    console.log('');
    console.log('✅ No action needed!');
    process.exit(0);
  }
  
  console.log('📝 Creating profile...');
  
  // Create profile (with or without full_name depending on schema)
  const profileData = {
    id: user.id,
    email: user.email,
    subscription_tier: 'free'
  };
  
  // Add full_name if user has it in metadata
  if (user.user_metadata?.full_name) {
    profileData.full_name = user.user_metadata.full_name;
  }
  
  const { data: newProfile, error: profileError } = await supabaseServer
    .from('profiles')
    .insert([profileData])
    .select()
    .single();
  
  if (profileError) {
    console.error('❌ Error creating profile:', profileError);
    process.exit(1);
  }
  
  console.log('✅ Profile created successfully!');
  console.log('   ID:', newProfile.id);
  console.log('   Email:', newProfile.email);
  console.log('   Full Name:', newProfile.full_name);
  console.log('   Subscription Tier:', newProfile.subscription_tier);
  console.log('');
  console.log('🎉 Done! User can now log in and use the app.');
}

createMissingProfile().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
