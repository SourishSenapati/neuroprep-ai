# 🚀 Final Deployment Guide (Vercel Monorepo)

Your project is set up as a **Monorepo** with two separate deployments on Vercel:
1. **Frontend** (Next.js)
2. **Backend** (Express/Node.js)


## ✅ Step 1: Backend Configuration
1. Go to your Vercel Dashboard -> **backend** project.
2. Click **Settings** -> **Environment Variables**.
3. Add the following:
   - `MONGO_URI`: `mongodb+srv://sourishschemug_db_user:a4r1UIXNpZe16pRA@neuroprep-db.mongodb.net/?retryWrites=true&w=majority`
   - `RAZORPAY_KEY_ID`: `rzp_test_RuBymTWufgW3fT`
   - `RAZORPAY_KEY_SECRET`: `Jtz8G0RYgmWzW5L4xg74THZn`
   - `CORS_ORIGIN`: `https://your-frontend-url.vercel.app` (Replace with your actual Frontend URL)
4. Go to **Deployments** and **Redeploy** to apply changes.
5. **Copy the Backend URL** (e.g., `https://backend-xyz.vercel.app`).


## ✅ Step 2: Frontend Configuration
1. Go to your Vercel Dashboard -> **frontend** project.
2. Click **Settings** -> **Environment Variables**.
3. Add the following:
   - `NEXT_PUBLIC_API_URL`: **Paste your Backend URL here** (e.g., `https://backend-xyz.vercel.app`) – *Important: No trailing slash*
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: `rzp_test_RuBymTWufgW3fT`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: (Your Firebase API Key)
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: (Your Firebase Auth Domain)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: (Your Firebase Project ID)
4. Go to **Deployments** and **Redeploy**.


## 📱 Mobile Optimization Verified
- The app handles mobile layouts automatically (`globals-mobile.css`).
- Touch targets are optimized (44px+).
- Layouts stack strictly for vertical scrolling on phones.


## 🔗 Live URLs
- **Frontend:** [Check Vercel Dashboard for `frontend-*.vercel.app`]
- **Backend:** [Check Vercel Dashboard for `backend-*.vercel.app`]

**Status:** Code is pushed with fix `e7214d1`. Vercel is building now.
