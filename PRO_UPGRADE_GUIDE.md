# 🌟 Pro Plan Upgrade Guide

## How to Upgrade to Pro

### **Method 1: With Paystack (Real Payment)**

1. **Go to Payments Page**
   - Navigate to Dashboard → Payments

2. **Click "Upgrade to Pro"**
   - Price: KES 2,999 (one-time payment)
   - You'll be redirected to Paystack

3. **Complete Payment**
   - Use Paystack test card: `4084084084084081`
   - CVV: `408`
   - Expiry: Any future date
   - PIN: `0000`

4. **After Payment**
   - You'll be redirected back to the app
   - Click **"Verify Payment"** button
   - You'll see success message
   - Page will auto-reload

5. **Confirm Upgrade**
   - Check the badge at top of Payments page
   - Should show: **⭐ PRO MEMBER**

---

### **Method 2: Mock Mode (No Paystack Keys)**

If backend has no Paystack keys configured:

1. **Go to Payments Page**
   - Navigate to Dashboard → Payments

2. **Click "Upgrade to Pro"**
   - A payment reference will appear immediately
   - No redirect happens

3. **Click "Verify Payment"**
   - Payment is instantly verified
   - Success message appears
   - Page auto-reloads

4. **Confirm Upgrade**
   - Badge shows: **⭐ PRO MEMBER**

---

## ✅ How to Verify You're Pro

### **Visual Indicators:**

1. **Payments Page**
   - Top right badge: **⭐ PRO MEMBER** (purple gradient)

2. **Map Page**
   - 🛰️ Satellite button works (no alert)
   - No "PRO" badge on satellite button

3. **Insights Page**
   - Download PDF button is green (not gray)
   - No "PRO" badge on download button

4. **Assistant Page**
   - Shows "AI Assistant is for Free Users" message
   - Lists your Pro features

---

## 🐛 Troubleshooting

### **Issue: Payment completed but still showing Free**

**Solution:**
1. Go to Payments page
2. Look for the payment reference in the status box
3. Click **"Verify Payment"** button
4. Wait for success message
5. Page will reload automatically

### **Issue: No payment reference showing**

**Check:**
1. Open browser console (F12)
2. Look for errors
3. Check if backend is running: `http://localhost:5000`
4. Verify `.env` has correct API URL

### **Issue: Verify button does nothing**

**Solution:**
1. Check browser console for errors
2. Ensure you're logged in
3. Try refreshing the page
4. Click "Upgrade to Pro" again

### **Issue: Pro features still locked**

**Solution:**
1. **Hard refresh**: Ctrl + Shift + R (or Cmd + Shift + R on Mac)
2. **Clear cache**: Browser settings → Clear cache
3. **Log out and log back in**
4. **Check database**: Go to Supabase → profiles table → check `subscription_tier`

---

## 🔍 Manual Database Check

If issues persist, check the database directly:

1. **Go to Supabase Dashboard**
2. **Open SQL Editor**
3. **Run this query:**

```sql
SELECT id, email, subscription_tier, subscription_date 
FROM profiles 
WHERE id = 'your-user-id';
```

4. **Check the result:**
   - `subscription_tier` should be `'pro'`
   - `subscription_date` should have a timestamp

5. **If still 'free', manually update:**

```sql
UPDATE profiles 
SET subscription_tier = 'pro', 
    subscription_date = NOW() 
WHERE id = 'your-user-id';
```

---

## 🔧 Backend Verification

Check if the payment was recorded:

```sql
SELECT * FROM payments 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC 
LIMIT 5;
```

Should show:
- `payment_type`: `'pro_upgrade'`
- `payment_status`: `'success'`
- `amount`: `2999`

---

## 📊 Test Pro Features

### **1. ESRI Satellite View**
- Go to: Dashboard → Map
- Click: 🛰️ Satellite button
- **Expected**: Map switches to satellite imagery
- **Free users**: See alert message

### **2. PDF Download**
- Go to: Dashboard → Insights
- Enter soil data and generate insights
- Click: "Download PDF" button
- **Expected**: PDF downloads automatically
- **Free users**: See alert message

### **3. AI Assistant (Should be blocked)**
- Go to: Dashboard → Assistant
- **Expected**: See "AI Assistant is for Free Users" message
- **Free users**: Can chat normally

---

## 🎯 Quick Fix Commands

### **Force subscription refresh in browser console:**

```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

### **Check current subscription status:**

```javascript
// In browser console:
fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + (await supabase.auth.getSession()).data.session.access_token
  }
}).then(r => r.json()).then(console.log);
```

---

## 💡 Common Mistakes

1. **Not clicking "Verify Payment"**
   - Payment completes but verification needed
   - Always click the verify button

2. **Not waiting for page reload**
   - After verification, page reloads automatically
   - Wait 2 seconds

3. **Using old cached data**
   - Browser might cache old subscription status
   - Hard refresh: Ctrl + Shift + R

4. **Database not updated**
   - Check if SQL migration ran successfully
   - Verify `subscription_tier` column exists

---

## 🎉 Success Checklist

- [ ] Payment completed (real or mock)
- [ ] Clicked "Verify Payment"
- [ ] Saw success message
- [ ] Page reloaded automatically
- [ ] Badge shows "⭐ PRO MEMBER"
- [ ] Satellite view works
- [ ] PDF download works
- [ ] AI Assistant shows Pro message

---

## 📞 Still Having Issues?

1. **Check all services are running:**
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   ```

2. **Check database migration:**
   - Verify `deploy/pro-plan-schema.sql` was executed
   - Check for errors in Supabase logs

3. **Check browser console:**
   - Press F12
   - Look for red errors
   - Share error messages for debugging

4. **Check backend logs:**
   - Look at terminal running backend
   - Check for payment verification errors

---

## 🚀 You're All Set!

Once you see **⭐ PRO MEMBER** badge, you have full access to:
- ✅ ESRI Satellite Maps
- ✅ PDF Downloads
- ✅ Land Management (coming soon)
- ✅ Crop Tracking (coming soon)
- ✅ Document Storage (coming soon)

Enjoy your Pro features! 🎊
