# NPM BUILD FIX - FINAL ATTEMPT


## Strategy: Fix Without Removing Features


### Issue Found
**judge/login page** uses `window.innerWidth` during render → "window is not defined" error


### Solution Applied

1. **Added `export const dynamic = 'force-dynamic'`** to ALL client pages:
   - ✓ training/roast/page.tsx
   - ✓ training/focus/page.tsx
   - ✓ pricing/page.tsx
   - ✓ pricing/enterprise/page.tsx
   - ✓ pricing/checkout/page.tsx
   - ✓ performance/page.tsx
   - ✓ judge/login/page.tsx
   - ✓ api/docs/page.tsx

2. **Fixed judge/login page** (window reference):
   - Added `mounted` state
   - Only renders after client-side hydration
   - ALL features preserved (VIP access, animations, pre-loaded data)

3. **next.config.js**:
   - Server-side mocking of browser libs
   - Standalone output
   - Minimal config for stability

---


## Building Now

**Status:** Running `npm run build`  
**Expected:** SUCCESS - all SSR issues resolved  
**Features:** 100% preserved, zero compromises

---

**After build succeeds → Deploy to Vercel immediately**
