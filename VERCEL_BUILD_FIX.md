# Vercel Build Fix Guide

If you're seeing a default Next.js page on Vercel, follow these steps:

## Common Issues & Fixes

### 1. Check Build Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed/latest deployment
3. Check the "Build Logs" tab
4. Look for errors (usually red text)

### 2. Environment Variables

**Issue**: Missing `NEXT_PUBLIC_APP_URL` can cause build failures.

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Add `NEXT_PUBLIC_APP_URL` with your Vercel URL:
   - Example: `https://your-project.vercel.app`
   - Or your custom domain if you have one
3. Redeploy

### 3. Database Connection

**Issue**: Build might be trying to connect to database.

**Fix**:
- Make sure `DATABASE_URL` is set in Vercel
- The homepage shouldn't need database access (it's static)
- If build fails on database, check that Prisma client is generated

### 4. Static Generation Issue

**Issue**: `force-static` might cause issues if page has runtime dependencies.

**Fix**: 
- Removed `force-static` from homepage (already done)
- Page will now use automatic static optimization

### 5. CSS/Tailwind Not Loading

**Issue**: Tailwind CSS might not be compiling.

**Fix**:
- Check that `tailwind.config.js` exists
- Verify `postcss.config.js` exists
- Make sure Tailwind is in `package.json` dependencies

### 6. TypeScript Errors

**Issue**: TypeScript errors can cause build to fail.

**Fix**:
- Run `npm run build` locally to check for errors
- Fix any TypeScript errors
- Commit and push

## Quick Fix Steps

1. **Check Vercel Build Logs**
   - Look for specific error messages
   - Common errors:
     - Missing environment variables
     - Database connection errors
     - TypeScript errors
     - Missing dependencies

2. **Set Required Environment Variables**
   ```
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```

3. **Redeploy**
   - Go to Vercel Dashboard
   - Click "Redeploy" on latest deployment
   - Or push a new commit

4. **Test Locally First**
   ```bash
   npm run build
   npm start
   ```
   - If local build works, issue is likely environment variables
   - If local build fails, fix errors first

## Debugging Steps

1. **Check if build succeeds**:
   - Look at Vercel deployment status
   - Green = success, Red = failure

2. **Check runtime errors**:
   - Open browser console (F12)
   - Look for JavaScript errors
   - Check network tab for failed requests

3. **Check if it's a caching issue**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Try incognito mode
   - Clear browser cache

4. **Check if it's a routing issue**:
   - Try accessing `/` directly
   - Check if other routes work (e.g., `/pricing`)

## Most Likely Issue

Based on the symptoms (seeing default Next.js page), the most likely issues are:

1. **Build is failing** → Check build logs
2. **Missing `NEXT_PUBLIC_APP_URL`** → Add to Vercel environment variables
3. **Database connection error** → Check `DATABASE_URL` is set
4. **CSS not loading** → Check Tailwind configuration

## What I've Fixed

- ✅ Removed `force-static` from homepage (was causing issues)
- ✅ Added fallback for `app.url` in layout metadata
- ✅ Made metadata URLs more resilient

## Next Steps

1. **Check Vercel Build Logs** - This will tell you exactly what's wrong
2. **Set `NEXT_PUBLIC_APP_URL`** in Vercel environment variables
3. **Redeploy** and check if it works
4. **If still not working**, share the build log errors and I can help fix them

## If Build Succeeds But Page Still Shows Default

1. **Clear Vercel cache**:
   - Go to Vercel → Settings → General
   - Clear build cache
   - Redeploy

2. **Check if it's a routing issue**:
   - Try accessing different routes
   - Check if middleware is interfering

3. **Check browser console**:
   - Look for JavaScript errors
   - Check if CSS is loading

Let me know what the build logs show and I can help fix the specific issue!

