# Troubleshooting Quick Reference

Fast solutions for common issues.

## Installation Issues

### "npm: command not found"
**Problem**: Node.js not installed
**Solution**: https://nodejs.org/ - Download & install LTS

### "npm install" fails
**Problem**: Connection or permission issue
**Solution**: 
- Try: `npm install --legacy-peer-deps`
- Or: `npm cache clean --force` then retry

### "node_modules" conflicts
**Problem**: Corrupted dependencies
**Solution**: 
```bash
rm -r node_modules package-lock.json
npm install
```

---

## Runtime Issues

### "Cannot find module '@supabase/supabase-js'"
**Problem**: Dependencies not installed
**Solution**: `npm install`

### Port 5173 already in use
**Problem**: Another app using the port
**Solution**: 
```bash
npm run dev -- --port 5174  # Use different port
# Or kill the process using 5173
```

### "VITE_SUPABASE_URL is not defined"
**Problem**: Missing .env.local file
**Solution**: 
1. Create `.env.local` in project root
2. Paste values from `.env.example`
3. Fill in actual Supabase credentials
4. Restart `npm run dev`

---

## Authentication Issues

### "Invalid login credentials"
**Problem**: Wrong email/password
**Solution**: 
- Check email spelling
- Password is case-sensitive
- Try signing up with different email

### "User already exists"
**Problem**: Email already registered
**Solution**: 
- Use different email
- Or sign in if you already have account

### "Email confirmation required"
**Problem**: New account needs to be verified
**Solution**: 
- Check spam folder for confirmation email
- May need to resend email from Supabase dashboard

### Cannot sign up at all
**Problem**: Email auth not enabled in Supabase
**Solution**:
1. Go to Supabase Project → Authentication
2. Click "Providers"
3. Confirm "Email" is toggled ON

---

## Database Issues

### "Permission denied" error
**Problem**: Row Level Security policies blocking access
**Solution**:
1. Go to Supabase → SQL Editor
2. Re-run the RLS policy SQL script from SUPABASE_SETUP.md
3. Verify policies appear in Policies tab
4. Hard refresh app (Ctrl+Shift+R)

### "Relation does not exist"
**Problem**: Table doesn't exist in database
**Solution**:
1. Go to Supabase → SQL Editor
2. Run the complete table creation SQL from SUPABASE_SETUP.md
3. Check tables appear in Table Editor
4. Refresh app

### Messages don't send
**Problem**: Insert policy blocked or DB error
**Solution**:
1. Check console (F12) for error details
2. Verify sender_id matches current user
3. Check receiver exists in users table
4. Verify RLS insert policy is set correctly

### "Row Level Security violated"
**Problem**: RLS policy blocking operation
**Solution**:
1. Verify you're trying to access own data
2. Check auth.uid() matches the user id
3. Review RLS policies in Supabase
4. Test with different user if needed

---

## Real-time Issues

### Messages not auto-updating
**Problem**: Real-time subscription not working
**Solution**:
1. Check Supabase Realtime is enabled
2. Go to Realtime tab, verify tables enabled
3. Hard refresh browser (Ctrl+Shift+R)
4. Try in incognito window
5. Check browser console for errors

### Online status not updating
**Problem**: Subscription to users table failed
**Solution**:
1. Verify users table has Realtime enabled
2. Check online status update API call succeeds
3. Check browser console
4. Hard refresh and try again

### "Connection failed" in chat
**Problem**: WebSocket connection lost
**Solution**:
1. Check internet connection
2. Refresh page or restart app
3. Check Supabase status page
4. Try on different browser

---

## Performance Issues

### App loads slowly
**Problem**: Large bundle or slow database
**Solution**:
1. Check network tab (F12) for large files
2. Verify Supabase isn't timing out
3. Try `npm run build` to check bundle size
4. Consider pagination optimization

### Feed freezes when loading
**Problem**: Too many users rendering at once
**Solution**:
- Already implemented pagination
- Click "Load More" to gradually load users
- Check browser console for memory issues

---

## Build & Deployment Issues

### "npm run build" fails
**Problem**: TypeScript or build error
**Solution**:
1. Check error message in terminal
2. Common: Missing component exports
3. Run `npm run build` locally to debug
4. Check tsconfig.json is correct

### Build succeeds but nothing shows
**Problem**: dist/ folder empty or index.html not found
**Solution**:
1. Check `dist/` folder exists
2. Verify `dist/index.html` exists
3. Delete `.next` or `.cache` folders if any
4. Try: `npm run build` again

### Deployed app shows blank page
**Problem**: Environment variables not set on server
**Solution**:
1. Check deployment platform settings
2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
3. Trigger redeploy after setting variables
4. Check browser console for errors

### "Cannot POST /auth/signup" on deployed app
**Problem**: Frontend trying to use backend endpoint
**Solution**:
- Our app only uses Supabase (no backend needed)
- Check deployment platform is serving index.html
- Verify routing is configured for SPAs

---

## UI/UX Issues

### Mobile UI looks broken
**Problem**: Not clearing mobile cache
**Solution**:
- Hard refresh: Ctrl+Shift+R (Chrome) or Cmd+Shift+R (Mac)
- Close browser completely and reopen
- Clear browser cache (DevTools settings)

### Buttons not responsive
**Problem**: Mobile event handling
**Solution**:
- Check z-index in console (overlapping elements)
- Try on different browser
- Clear cache and reload

### Chat messages overlap
**Problem**: CSS conflict or Tailwind not loaded
**Solution**:
1. Check `src/index.css` is imported in main.tsx
2. Verify Tailwind config has correct content paths
3. Run `npm run build` to check for errors
4. Hard refresh browser

---

## Code/Development Issues

### TypeScript errors in IDE
**Problem**: Pylance or VS Code intellisense issue
**Solution**:
1. Restart VS Code
2. Check tsconfig.json points to correct paths
3. Reload window (Cmd+Shift+P → Developer: Reload Window)
4. Verify all imports use @ alias correctly

### "Cannot find module @/components"
**Problem**: Path alias not configured
**Solution**:
- Already configured in vite.config.ts
- Check file actually exists
- Try restarting dev server

### Component doesn't update when props change
**Problem**: Unnecessary re-renders or memo
**Solution**:
- Check dependencies in useEffect
- Verify state updates trigger re-renders
- Remove React.memo if causing issues

---

## General Debugging Tips

### Check Browser Console (F12)
- Red errors are usually the problem
- Look for "Uncaught" errors
- Network tab shows failed requests

### Check Network Tab (F12)
- Look for 500 errors (server issues)
- 401/403 are permission errors
- Check response for error details

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click "Logs" (bottom left)
3. Look for SQL errors or permission issues
4. Check Auth Logs for signup failures

### Test with incognito/private window
- Clears all cache and cookies
- Helps identify cache issues
- Useful for auth debugging

### Try with test account
- Create fresh test account
- Test from different browser
- Helps isolate user-specific issues

---

## Quick Fixes (Try These First)

1. **Hard Refresh**: Ctrl+Shift+R (clears cache)
2. **Restart Dev Server**: Stop `npm run dev`, run again
3. **Check .env.local**: Verify credentials are correct
4. **Check Network**: Make sure internet is connected
5. **Check Console**: F12 → Console tab for errors
6. **Clear node_modules**: `rm -r node_modules && npm install`

---

## Getting Help

1. **Most issues** - See the full README.md
2. **Supabase questions** - Check SUPABASE_SETUP.md
3. **Code questions** - See PROJECT_STRUCTURE.md
4. **Deployment** - See DEPLOYMENT.md
5. **Still stuck?** - Check browser console for specific error

Good luck! 🚀
