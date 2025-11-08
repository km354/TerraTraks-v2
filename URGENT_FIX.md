# 🚨 URGENT: Website Not Loading - Diagnostic Guide

If you're seeing the default Next.js page on Vercel, follow these steps **IN ORDER**:

## Step 1: Check Vercel Build Status (MOST IMPORTANT)

1. Go to https://vercel.com/dashboard
2. Click on your TerraTraks project
3. Click on "Deployments" tab
4. Look at the **latest deployment**:
   - ✅ **Green checkmark** = Build succeeded (go to Step 2)
   - ❌ **Red X** = Build failed (go to Step 3)

## Step 2: If Build Succeeded But Page Still Shows Default

### A. Clear Browser Cache
- **Hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- **Try incognito/private mode**
- **Try a different browser**

### B. Check Browser Console
1. Open your Vercel URL
2. Press `F12` to open Developer Tools
3. Click "Console" tab
4. Look for **red errors**
5. Share these errors with me

### C. Check Network Tab
1. In Developer Tools, click "Network" tab
2. Refresh the page
3. Look for any failed requests (red status codes)
4. Check if CSS/JS files are loading

## Step 3: If Build Failed (RED X)

### A. View Build Logs
1. Click on the failed deployment
2. Click "Build Logs" tab
3. Scroll to the bottom
4. Look for error messages (usually in red)
5. **COPY THE ERROR MESSAGE** and share it with me

### Common Build Errors:

#### Error: "Cannot find module" or "Module not found"
- **Fix**: Dependencies might be missing
- **Solution**: Check `package.json` is committed, Vercel will install dependencies automatically

#### Error: "Environment variable not found"
- **Fix**: Missing environment variables
- **Solution**: Go to Vercel → Settings → Environment Variables
- Add missing variables (see Step 4)

#### Error: "TypeScript errors"
- **Fix**: Type errors in code
- **Solution**: Share the error and I'll fix it

#### Error: "Database connection failed"
- **Fix**: `DATABASE_URL` is missing or invalid
- **Solution**: Add `DATABASE_URL` to Vercel environment variables

## Step 4: Set Required Environment Variables

Go to **Vercel → Settings → Environment Variables** and add:

### CRITICAL (Required for app to work):
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
DATABASE_URL=your_database_url
AUTH_SECRET=your_auth_secret
```

### For Authentication:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### For Features:
```
OPENAI_API_KEY=your_openai_key
OPENWEATHER_API_KEY=your_openweather_key
GOOGLE_MAPS_STATIC_API_KEY=your_google_maps_key
```

### For Payments:
```
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
STRIPE_PREMIUM_PRICE_ID=your_price_id
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

**After adding variables:**
1. Click "Redeploy" on the latest deployment
2. Or push a new commit to trigger rebuild

## Step 5: Verify Vercel Project Settings

1. Go to **Vercel → Settings → General**
2. Check:
   - **Framework Preset**: Should be "Next.js"
   - **Root Directory**: Should be `.` (or leave empty)
   - **Build Command**: Should be `next build` (default)
   - **Output Directory**: Should be `.next` (default)
   - **Install Command**: Should be `npm install` (default)

## Step 6: Check GitHub Connection

1. Go to **Vercel → Settings → Git**
2. Verify your GitHub repository is connected
3. Make sure the correct branch is selected (usually `main`)

## Step 7: Try a Manual Redeploy

1. Go to **Vercel → Deployments**
2. Click the **three dots** (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete
5. Check if the site works

## Step 8: Test a Simple Change

If nothing works, let's test if Vercel is building at all:

1. I'll create a simple test page
2. You push it to GitHub
3. Vercel should auto-deploy
4. Check if the test page appears

## What I've Already Fixed

✅ Fixed URL generation in layout metadata  
✅ Removed problematic `force-static` export  
✅ Fixed Google Analytics component  
✅ Made metadata more resilient to missing env vars  
✅ Added proper TypeScript declarations  

## Next Steps

**Please do this NOW:**
1. ✅ Check Vercel build logs (Step 1)
2. ✅ Share the build error (if any)
3. ✅ Set `NEXT_PUBLIC_APP_URL` environment variable
4. ✅ Try redeploying

**Then tell me:**
- What do you see in the build logs?
- Is the build succeeding or failing?
- What's the exact error message?

Once I know the exact error, I can fix it immediately!

## Quick Test

Try accessing these URLs:
- `https://your-project.vercel.app/` (homepage)
- `https://your-project.vercel.app/pricing` (pricing page)

If `/pricing` works but `/` doesn't, it's a homepage-specific issue.
If nothing works, it's a build/deployment issue.

