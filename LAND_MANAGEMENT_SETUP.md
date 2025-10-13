# Land Management Setup Guide

## Overview
This guide will help you set up the Land Management Pro feature with file uploads for images and documents.

## Prerequisites
- ✅ Pro Plan schema already applied (`deploy/pro-plan-schema.sql`)
- ✅ User has Pro subscription in database
- ✅ Supabase project configured

## Step 1: Create Storage Buckets

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard** → Storage
2. **Create two new buckets:**

   **Bucket 1: land-images**
   - Name: `land-images`
   - Public: ✅ Yes (checked)
   - File size limit: 50 MB (recommended)
   - Allowed MIME types: `image/*`

   **Bucket 2: land-documents**
   - Name: `land-documents`
   - Public: ✅ Yes (checked)
   - File size limit: 10 MB (recommended)
   - Allowed MIME types: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`

3. **Set up RLS policies for each bucket:**

   For **land-images** bucket, add these policies:
   ```sql
   -- INSERT policy
   CREATE POLICY "Users can upload their own land images"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'land-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- SELECT policy
   CREATE POLICY "Users can view their own land images"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'land-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- DELETE policy
   CREATE POLICY "Users can delete their own land images"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'land-images' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   For **land-documents** bucket, add these policies:
   ```sql
   -- INSERT policy
   CREATE POLICY "Users can upload their own land documents"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'land-documents' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- SELECT policy
   CREATE POLICY "Users can view their own land documents"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'land-documents' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );

   -- DELETE policy
   CREATE POLICY "Users can delete their own land documents"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'land-documents' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

### Option B: Using SQL Script

Run the `deploy/storage-buckets.sql` file in Supabase SQL Editor.

## Step 2: Verify Setup

1. **Check buckets exist:**
   - Go to Storage in Supabase Dashboard
   - Verify `land-images` and `land-documents` buckets are listed

2. **Check RLS policies:**
   - Click on each bucket
   - Go to "Policies" tab
   - Verify 3 policies exist for each bucket (INSERT, SELECT, DELETE)

## Step 3: Test Upload Functionality

1. **Login as a Pro user**
2. **Navigate to Land Management** (`/dashboard/land-management`)
3. **Select a land** from your list (or add one from the Map page first)
4. **Test each tab:**
   - **Images Tab:** Click "+ Upload Image" and upload a test image
   - **Documents Tab:** Click "+ Upload Document" and upload a test PDF
   - **Crops Tab:** Click "+ Add Crop" and fill in the form

## Features Available

### 🖼️ Images Tab
- Upload land images (JPG, PNG, etc.)
- Add optional captions
- View images in a grid layout
- Delete images with hover button

### 📄 Documents Tab
- Upload documents (PDF, DOC, DOCX, TXT)
- View document details (name, type, size)
- Open documents in new tab
- Delete documents

### 🌱 Crop Tracking Tab
- Add new crops with:
  - Crop name (required)
  - Planting date
  - Expected harvest date
  - Actual harvest date
  - Yield amount and unit
  - Notes
- View all crops for the land
- Track harvest status (Growing/Harvested)
- Delete crops

## Troubleshooting

### Upload fails with "Policy violation"
- **Solution:** Ensure RLS policies are correctly set up for the storage buckets
- Check that the user is authenticated
- Verify the bucket is public

### Images/Documents don't display
- **Solution:** Check that the buckets are set to "Public"
- Verify the public URL is correctly generated
- Check browser console for CORS errors

### Can't see Land Management link
- **Solution:** Ensure user has `subscription_tier = 'pro'` in the profiles table
- Run this SQL to check:
  ```sql
  SELECT id, email, subscription_tier FROM profiles WHERE id = 'YOUR_USER_ID';
  ```
- If tier is 'free', update it:
  ```sql
  UPDATE profiles SET subscription_tier = 'pro', subscription_date = NOW() WHERE id = 'YOUR_USER_ID';
  ```

### No lands showing
- **Solution:** Add land data from the Map page first
- Click on the map to add coordinates
- Fill in the form and submit

## Database Tables

The Land Management feature uses these tables:
- `land_data` - Main land records
- `land_images` - Image metadata
- `land_documents` - Document metadata
- `crop_tracking` - Crop tracking records

All tables have RLS policies that ensure users can only access their own data.

## Storage Structure

Files are organized by user and land:
```
land-images/
  └── {user_id}/
      └── {land_id}/
          └── {timestamp}.{ext}

land-documents/
  └── {user_id}/
      └── {land_id}/
          └── {timestamp}.{ext}
```

This structure ensures:
- Easy identification of file ownership
- Automatic cleanup when users are deleted
- Efficient RLS policy enforcement

## Next Steps

After setup is complete, you can:
1. Test all upload and delete functionality
2. Add more lands from the Map page
3. Track multiple crops per land
4. Upload progress photos and documents
5. Monitor crop yields over time

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase project settings
3. Ensure all SQL scripts have been run
4. Check RLS policies are active
