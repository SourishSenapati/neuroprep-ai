---
description: Fix Project, Upgrade Webpack, and Deploy for Free
---

# Fix Project, Upgrade Webpack, and Deploy for Free

## Phase 1: Environment Setup & Dependencies

1. Create `.env` file for backend from `.env.example`
2. Create `.env.local` file for frontend
3. Upgrade Next.js and all dependencies to latest versions
4. Install any missing dependencies

## Phase 2: Fix Authentication & 5 Free Attempts

1. Verify backend attempt tracking is working (`/api/attempts`)
2. Ensure database is properly initialized with SQLite
3. Test the 5 free attempts mechanism
4. Verify authentication flow (email/password + social login)

## Phase 3: Fix Compilation & Runtime Errors

1. Run `npm run build` in frontend to check for TypeScript/build errors
2. Fix any webpack configuration issues
3. Fix any Next.js 15 compatibility issues
4. Test local development with `npm run dev`

## Phase 4: Deployment to Vercel (Free)

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy backend: `cd backend && vercel`
4. Deploy frontend: `cd frontend && vercel`
5. Configure environment variables in Vercel dashboard
6. Test production deployment

## Phase 5: Alternative Free Hosting Options

If Vercel doesn't work:

- **Railway.app** - Free tier with 500 hours/month
- **Render.com** - Free tier with auto-sleep
- **Netlify** - Free tier for frontend
- **Fly.io** - Free tier for backend

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] 5 free attempts tracked correctly
- [ ] Authentication works (signup/login)
- [ ] Deployed to production
- [ ] Live URL accessible
