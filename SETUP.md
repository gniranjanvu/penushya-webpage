# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Penushya Portfolio Website.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Storage Buckets Setup](#storage-buckets-setup)
- [Authentication Setup](#authentication-setup)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

1. **Node.js** 18+ installed
2. **Supabase Account** - Sign up for free at [supabase.com](https://supabase.com)
3. **Git** installed

---

## Database Setup

### Step 1: Create a New Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Choose a name (e.g., "penushya-portfolio")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest to your location
4. Click "Create new project" and wait for it to initialize

### Step 2: Run Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Open the `database-schema.sql` file from this repository
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **Run** to execute the schema

This will create all necessary tables, policies, and default data.

---

## Storage Buckets Setup

The application requires two storage buckets for file uploads:

### 1. Create "resumes" Bucket

1. In Supabase Dashboard, go to **Storage** → **New Bucket**
2. Configure the bucket:
   - **Name**: `resumes`
   - **Public bucket**: ✅ Yes (check this box)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `application/pdf`
3. Click **Create Bucket**

#### Set Bucket Policies for "resumes"

After creating the bucket, set up access policies:

1. Click on the `resumes` bucket
2. Go to **Policies** tab
3. Click **New Policy** and select **Custom policy**

**Policy 1: Public Read Access**
```sql
-- Allow public to read/download resumes
CREATE POLICY "Public can view resumes"
ON storage.objects FOR SELECT
USING ( bucket_id = 'resumes' );
```

**Policy 2: Authenticated Upload**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Authenticated Delete**
```sql
-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete resumes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes' 
  AND auth.role() = 'authenticated'
);
```

### 2. Create "images" Bucket

1. In Supabase Dashboard, go to **Storage** → **New Bucket**
2. Configure the bucket:
   - **Name**: `images`
   - **Public bucket**: ✅ Yes (check this box)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
3. Click **Create Bucket**

#### Set Bucket Policies for "images"

**Policy 1: Public Read Access**
```sql
-- Allow public to view images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );
```

**Policy 2: Authenticated Upload**
```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Authenticated Delete**
```sql
-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

**Policy 4: Authenticated Update**
```sql
-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

---

## Authentication Setup

### Create Admin User

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **Add User** → **Create new user**
3. Fill in the details:
   - **Email**: Your admin email (e.g., `admin@example.com`)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Yes (check this box)
4. Click **Create User**

This user will have full admin access to the dashboard.

---

## Environment Variables

### Step 1: Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Find and copy:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

### Step 2: Configure Local Environment

1. In the project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   
   # EmailJS Configuration (Optional - for contact form)
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

3. Save the file

**⚠️ Important**: Never commit the `.env` file to version control!

---

## Troubleshooting

### Common Issues

#### ❌ "Bucket not found" Error

**Problem**: The storage bucket hasn't been created.

**Solution**: 
1. Go to Supabase Dashboard → Storage
2. Verify both `resumes` and `images` buckets exist
3. Make sure they are marked as **Public**
4. Check that the policies are set up correctly

#### ❌ "Failed to load resume" / "Failed to upload"

**Problem**: Missing storage policies or incorrect configuration.

**Solution**:
1. Check that the bucket is public
2. Verify all storage policies are created (see above)
3. Make sure your user is authenticated when uploading

#### ❌ "Invalid input syntax for type date"

**Problem**: Empty date fields being sent to the database.

**Solution**: This has been fixed in the codebase. Make sure you're using the latest version.

#### ❌ Row Level Security (RLS) Errors

**Problem**: Database tables have RLS enabled but policies are missing.

**Solution**: 
1. Run the `database-schema.sql` file completely
2. Make sure all RLS policies were created successfully
3. Check the SQL Editor for any errors during execution

#### ❌ Authentication Issues

**Problem**: Can't log in to admin dashboard.

**Solution**:
1. Verify the user exists in Authentication → Users
2. Check that "Auto Confirm User" was enabled
3. Try resetting the password from the Supabase Dashboard
4. Verify your `.env` file has the correct Supabase credentials

---

## Verification Checklist

Before running the application, verify:

- [ ] Database schema executed successfully
- [ ] `resumes` bucket created and marked as public
- [ ] `images` bucket created and marked as public  
- [ ] Storage policies created for both buckets
- [ ] Admin user created in Authentication
- [ ] `.env` file configured with correct credentials
- [ ] Dependencies installed (`npm install`)

Once all steps are complete, run:

```bash
npm run dev
```

Visit `http://localhost:5173/admin/login` to access the admin panel.

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## Need Help?

If you encounter issues not covered here:

1. Check the browser console for error messages
2. Review Supabase logs in Dashboard → Logs
3. Verify environment variables are loaded correctly
4. Open an issue on GitHub with detailed error information

---

Made with ❤️ for the Penushya Portfolio Website
