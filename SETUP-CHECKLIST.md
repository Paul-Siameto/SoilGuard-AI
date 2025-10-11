# SoilGuard-AI Setup Checklist

## ✅ Completed
- [x] Project structure created
- [x] npm packages installed (frontend & backend)
- [x] Environment files created with keys
- [x] Paystack keys configured

## ⚠️ CRITICAL FIX REQUIRED

### Backend Service Role Key Issue
**Problem:** Your `backend/.env` currently has the **anon** key in `SUPABASE_SERVICE_ROLE`, but it needs the **service_role** key.

**How to fix:**
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/llisneffrartzjawbals
2. Click **Settings** → **API**
3. Find the **service_role** key (NOT the anon key)
4. Copy it and replace line 2 in `backend/.env`:
   ```
   SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...service_role...
   ```

**Why this matters:** The backend needs elevated permissions to bypass RLS policies when verifying auth tokens and managing data.

---

## 🔧 Required Setup Steps

### 1. Apply Database Schema
**Status:** ⏳ Needs verification

Run the SQL schema to create tables:
1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/llisneffrartzjawbals/sql
2. Copy contents of `deploy/schema.sql`
3. Paste and run in SQL Editor
4. Verify tables created: `profiles`, `land_data`, `payments`

### 2. Enable Google OAuth (Optional)
If you want Google login:
1. Supabase Dashboard → Authentication → Providers
2. Enable Google OAuth
3. Add authorized redirect URL: `https://llisneffrartzjawbals.supabase.co/auth/v1/callback`

---

## 🚀 Running the Application

### Backend
```powershell
cd "c:\Users\dsalaash\Desktop\PLP\Hackathons\SoilGuard AI\SoilGuard-AI\backend"
npm run dev
```
Expected output: `Server running on http://localhost:5000`

### Frontend
Open a new terminal:
```powershell
cd "c:\Users\dsalaash\Desktop\PLP\Hackathons\SoilGuard AI\SoilGuard-AI\frontend"
npm run dev
```
Expected output: `Local: http://localhost:5173/`

---

## ✅ Verification Tests

### Test 1: Backend Health Check
With backend running, visit: http://localhost:5000/health
Expected: `{"ok":true}`

### Test 2: Signup Flow
1. Visit http://localhost:5173
2. Click "Sign up"
3. Enter username, email, password
4. Submit
5. Check Supabase dashboard → Authentication → Users (should see new user)
6. Check Table Editor → profiles (should see profile row)

### Test 3: Add Land Point
1. After login, go to Map page
2. Click "+ Add Land" button
3. Fill form: name, latitude (e.g., -1.286389), longitude (e.g., 36.817223), soil health
4. Submit
5. Marker should appear on map
6. Refresh page - marker persists

### Test 4: AI Insights
1. Go to Insights page
2. Enter pH: 6.5, Moisture: 30, Crop: maize
3. Click Generate
4. Should see mock advice text

### Test 5: Payments (Mock Mode)
1. Go to Payments page
2. Enter amount: 1000
3. Click "Donate"
4. Should see reference and "Pending (mock)" status
5. Click "Verify Payment"
6. Status updates to "success"

---

## 🐛 Common Issues & Fixes

### Issue: "Missing Bearer token" error
**Fix:** Ensure `SUPABASE_SERVICE_ROLE` is the service_role key, not anon key

### Issue: "relation does not exist" error
**Fix:** Run `deploy/schema.sql` in Supabase SQL Editor

### Issue: CORS errors in browser console
**Fix:** Verify `FRONTEND_ORIGIN=http://localhost:5173` in `backend/.env`

### Issue: Map not showing
**Fix:** 
1. Check browser console for errors
2. Ensure `leaflet` CSS is imported in `src/index.css`
3. Try adding a land point with valid coordinates

### Issue: "Invalid token" on protected routes
**Fix:** 
1. Logout and login again
2. Check Supabase project is active
3. Verify anon key in `frontend/.env` matches Supabase dashboard

---

## 📝 Current Configuration

### Frontend (.env)
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ VITE_PAYSTACK_PUBLIC_KEY
- ✅ VITE_BACKEND_URL

### Backend (.env)
- ✅ SUPABASE_URL
- ⚠️ SUPABASE_SERVICE_ROLE (needs service_role key)
- ✅ PAYSTACK_SECRET_KEY
- ✅ PAYSTACK_PUBLIC_KEY
- ✅ PORT
- ✅ FRONTEND_ORIGIN

---

## 🎯 Next Steps

1. **Fix service_role key** in `backend/.env`
2. **Run schema.sql** in Supabase
3. **Start backend**: `npm run dev` in backend folder
4. **Start frontend**: `npm run dev` in frontend folder
5. **Test signup** and verify profile creation
6. **Test map CRUD** operations

Once all tests pass, your app is ready! 🎉
