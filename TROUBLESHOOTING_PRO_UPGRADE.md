# Troubleshooting Pro Plan Upgrade Issues

## Problem
After paying for Pro plan upgrade, the user receives confirmation email but the website doesn't reflect the Pro status.

## Root Causes & Solutions

### 1. **Check Backend Service Role Key**

The backend needs the **Supabase Service Role Key** (not the anon key) to bypass RLS policies and update user profiles.

**Action:** Verify your `backend/.env` file has:
```env
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get it:**
1. Go to Supabase Dashboard → Project Settings → API
2. Copy the `service_role` key (NOT the `anon` key)
3. Paste it in your `backend/.env` file

### 2. **Check Backend Logs**

After making a payment, check your backend terminal for these logs:

**✅ Success logs:**
```
🎯 Upgrading user to Pro: <user-id>
✅ Profile updated successfully: [...]
```

**❌ Error logs:**
```
❌ Error updating profile: { code: 'PGRST...' }
```

If you see error logs, the issue is with database permissions.

### 3. **Verify Database Schema**

Make sure the `profiles` table has the subscription columns:

```sql
-- Run this in Supabase SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('subscription_tier', 'subscription_date');
```

**Expected result:**
- `subscription_tier` → `text`
- `subscription_date` → `timestamp with time zone`

If columns are missing, run:
```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_date TIMESTAMPTZ;
```

### 4. **Test the Payment Flow**

#### Step 1: Initiate Payment
```bash
# Check browser console for:
🔍 Initiating payment...
```

#### Step 2: Verify Payment
```bash
# After payment, check console for:
🔍 Verifying payment with reference: <ref>
✅ Payment verification response: { status: 'success', payment_type: 'pro_upgrade' }
🎯 Payment successful! Payment type: pro_upgrade
🔄 Refreshing subscription status...
✅ Subscription refreshed
```

#### Step 3: Check Backend
```bash
# Backend should log:
🎯 Upgrading user to Pro: <user-id>
✅ Profile updated successfully: [{ id: '...', subscription_tier: 'pro', ... }]
```

### 5. **Manual Database Check**

If payment succeeded but Pro status didn't update, manually check the database:

```sql
-- Check user's current subscription
SELECT id, email, subscription_tier, subscription_date 
FROM profiles 
WHERE email = 'your-email@example.com';

-- Check payment record
SELECT * FROM payments 
WHERE user_id = '<your-user-id>' 
ORDER BY created_at DESC 
LIMIT 1;
```

**If payment shows `success` but `subscription_tier` is still `free`:**
```sql
-- Manually update (temporary fix)
UPDATE profiles 
SET subscription_tier = 'pro', 
    subscription_date = NOW() 
WHERE id = '<your-user-id>';
```

### 6. **Common Issues**

| Issue | Cause | Solution |
|-------|-------|----------|
| "Error updating profile" in logs | Wrong Supabase key (using anon instead of service_role) | Use service_role key in backend/.env |
| No backend logs at all | Backend not receiving verify request | Check API URL in frontend/.env |
| Payment status stays "pending" | Paystack webhook not configured | Verify payment manually via verify button |
| Profile updates but frontend doesn't show Pro | Frontend cache issue | Hard refresh (Ctrl+Shift+R) or clear browser cache |

### 7. **Force Subscription Refresh**

If you're Pro in the database but frontend shows Free:

1. **Open browser console** (F12)
2. **Run this code:**
```javascript
// Force refresh subscription
window.location.reload();
```

Or manually trigger refresh:
```javascript
// In browser console
localStorage.clear();
window.location.reload();
```

### 8. **Debugging Checklist**

- [ ] Backend `.env` has `SUPABASE_SERVICE_ROLE` key
- [ ] `profiles` table has `subscription_tier` and `subscription_date` columns
- [ ] Payment record in database shows `payment_status: 'success'`
- [ ] Backend logs show "✅ Profile updated successfully"
- [ ] Frontend console shows "✅ Subscription refreshed"
- [ ] Hard refresh browser (Ctrl+Shift+R)

### 9. **Test in Development**

For testing without real payment:

1. **Backend will use mock mode** if `PAYSTACK_SECRET_KEY` is not set
2. **Click "Upgrade to Pro"**
3. **Copy the mock reference** from the URL
4. **Paste it in "Verify Payment" field**
5. **Click "Verify Payment"**
6. **Check logs** for upgrade confirmation

### 10. **Contact Support Data**

If issue persists, collect this data:

```bash
# 1. Backend logs (last 50 lines)
# 2. Browser console logs (F12 → Console tab)
# 3. Database query results:
SELECT id, email, subscription_tier, subscription_date 
FROM profiles 
WHERE id = '<your-user-id>';

SELECT id, user_id, amount, payment_type, payment_status, payment_reference 
FROM payments 
WHERE user_id = '<your-user-id>' 
ORDER BY created_at DESC 
LIMIT 5;
```

## Quick Fix Summary

**Most common issue:** Backend using wrong Supabase key

**Quick fix:**
1. Go to Supabase Dashboard → Settings → API
2. Copy `service_role` secret key
3. Update `backend/.env`:
   ```env
   SUPABASE_SERVICE_ROLE=<paste-service-role-key-here>
   ```
4. Restart backend server
5. Try payment again

---

**Still having issues?** Check the backend terminal logs and browser console logs for specific error messages.
