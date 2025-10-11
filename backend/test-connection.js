import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

dotenv.config();

console.log('🔍 Testing SoilGuard-AI Connections...\n');

// 1. Check environment variables
console.log('1️⃣ Environment Variables:');
const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE', 'PAYSTACK_SECRET_KEY'];
const missing = requiredVars.filter(v => !process.env[v] || process.env[v].includes('YOUR_'));
if (missing.length > 0) {
  console.log(`   ❌ Missing or placeholder: ${missing.join(', ')}`);
  console.log('   ⚠️  Update backend/.env with real keys from Supabase dashboard\n');
} else {
  console.log('   ✅ All required variables set\n');
}

// 2. Test Supabase connection
console.log('2️⃣ Supabase Connection:');
try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE,
    { auth: { persistSession: false } }
  );
  
  // Try to query profiles table
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  
  if (error) {
    if (error.message.includes('relation "public.profiles" does not exist')) {
      console.log('   ⚠️  Database tables not created yet');
      console.log('   📝 Run deploy/schema.sql in Supabase SQL Editor\n');
    } else {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  } else {
    console.log('   ✅ Connected to Supabase successfully');
    console.log('   ✅ Database tables exist\n');
  }
} catch (e) {
  console.log(`   ❌ Connection failed: ${e.message}\n`);
}

// 3. Test Paystack API
console.log('3️⃣ Paystack API:');
try {
  const response = await axios.get('https://api.paystack.co/bank', {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
  });
  console.log('   ✅ Paystack API key is valid\n');
} catch (e) {
  if (e.response?.status === 401) {
    console.log('   ❌ Invalid Paystack secret key\n');
  } else {
    console.log('   ⚠️  Could not verify Paystack (network issue or rate limit)\n');
  }
}

console.log('✨ Connection test complete!\n');
console.log('Next steps:');
console.log('1. Fix any ❌ or ⚠️  issues above');
console.log('2. Run: npm run dev (in backend folder)');
console.log('3. Run: npm run dev (in frontend folder)\n');
