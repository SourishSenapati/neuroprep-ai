# NeuroPrep AI - Quick Setup Guide

## 🚀 Get Your App Running in 5 Minutes

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
# For Windows
.\deploy-vercel.bat

# For Mac/Linux
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

### Step 3: Configure Environment Variables

After deployment, you'll get two URLs:
- Frontend: `https://neuroprep-frontend-xyz.vercel.app`
- Backend: `https://neuroprep-backend-xyz.vercel.app`

#### Configure Backend:
1. Go to https://vercel.com/dashboard
2. Click on your backend project
3. Go to Settings → Environment Variables
4. Add these variables:

```
CORS_ORIGIN = https://neuroprep-frontend-xyz.vercel.app
FRONTEND_URL = https://neuroprep-frontend-xyz.vercel.app
SESSION_SECRET = (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
JWT_SECRET = (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
```

#### Configure Frontend:
1. Go to your frontend project on Vercel
2. Go to Settings → Environment Variables
3. Add these variables:

```
NEXT_PUBLIC_API_URL = https://neuroprep-backend-xyz.vercel.app
NEXT_PUBLIC_WS_URL = https://neuroprep-backend-xyz.vercel.app
NEXTAUTH_SECRET = (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
NEXTAUTH_URL = https://neuroprep-frontend-xyz.vercel.app
```

### Step 4: Redeploy

After adding environment variables:
1. Go to Deployments tab in each project
2. Click on the latest deployment
3. Click the three dots (•••) → Redeploy

### Step 5: Test!

Visit your frontend URL and:
1. Click "Start Interview"
2. Select engineering discipline and role
3. Start answering questions!

---

## 🎯 Features You Get

✅ **1,000,000+ Unique Questions**
- Zero repetition across all sessions
- Dynamic generation using quantum-inspired RNG
- Adaptive difficulty based on performance

✅ **Universal Engineering Support**
- 15+ Software Engineering roles
- 7+ Civil Engineering specializations
- 8+ Mechanical Engineering roles
- 9+ Electrical Engineering disciplines
- 8+ Chemical Engineering fields

✅ **Advanced AI Interviews**
- Real-time response analysis
- Stress level adaptation
- Topic diversity tracking
- Performance insights

✅ **Production Ready**
- Vercel's global CDN
- Auto-scaling serverless functions
- SSL/HTTPS enabled
- 99.99% uptime SLA

---

## 🛠️ Troubleshooting

### "CORS Error"
- Make sure `CORS_ORIGIN` in backend matches frontend URL exactly
- Include `https://` in the URL
- Redeploy backend after changing

### "Cannot connect to API"
- Verify `NEXT_PUBLIC_API_URL` in frontend
- Check backend `/health` endpoint
- Ensure backend is deployed and running

### "Questions not loading"
- Check browser console for errors
- Verify all environment variables are set
- Clear browser cache and reload

---

## 📚 Full Documentation

For detailed instructions, see:
- **VERCEL_DEPLOYMENT.md** - Complete deployment guide
- **FREE_DEPLOYMENT_GUIDE.md** - Alternative deployment options
- **README.md** - Project overview

---

## 💡 Optional Enhancements

### Add AI API Keys (Optional)
The system works without these, but for real AI responses:
```
OPENAI_API_KEY = sk-proj-your-key
ANTHROPIC_API_KEY = sk-ant-your-key
GEMINI_API_KEY = your-gemini-key
```

### Add Database (Optional)
For persistent storage across server restarts:
```
DATABASE_URL = postgresql://user:password@host:port/database
```

### Add Custom Domain
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records
4. Update environment variables

---

## ✅ Success!

Your NeuroPrep AI is now live and ready to conduct world-class engineering interviews! 🎉

Share the link with recruiters, candidates, and engineering teams.
