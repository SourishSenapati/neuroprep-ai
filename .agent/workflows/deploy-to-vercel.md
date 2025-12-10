---
description: Deploy NeuroPrep AI to Vercel for Free
---

# Deploy to Vercel - Complete Workflow

This workflow will guide you through deploying NeuroPrep AI to Vercel completely free.

## Prerequisites

- Git installed
- Node.js installed
- GitHub account
- Vercel account (free)

---

## Step 1: Push to GitHub

// turbo
```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit everything
git commit -m "NeuroPrep AI - Production Ready v2.0"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/neuroprep-ai.git
git branch -M main
git push -u origin main
```

---

## Step 2: Install Vercel CLI

// turbo
```bash
npm install -g vercel
```

---

## Step 3: Login to Vercel

```bash
vercel login
```

Follow the browser prompts to authenticate.

---

## Step 4: Deploy Backend

```bash
cd backend
vercel --prod
```

When prompted:
- Project name: `neuroprep-backend`
- Link to existing project? `N`
- Override settings? `N`

**Important**: Copy the deployment URL (e.g., `https://neuroprep-backend-abc123.vercel.app`)

---

## Step 5: Configure Backend Environment Variables

Go to https://vercel.com/dashboard

1. Click on `neuroprep-backend` project
2. Go to Settings → Environment Variables
3. Add these variables for **Production**:

```
NODE_ENV=production
PORT=5000
SESSION_SECRET=<generate-secret>
JWT_SECRET=<generate-secret>
CORS_ORIGIN=<will-add-after-frontend-deployed>
FRONTEND_URL=<will-add-after-frontend-deployed>
```

To generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step 6: Deploy Frontend

```bash
cd ../frontend
vercel --prod
```

When prompted:
- Project name: `neuroprep-frontend`
- Link to existing project? `N`
- Override settings? `N`

**Important**: Copy the deployment URL (e.g., `https://neuroprep-frontend-xyz789.vercel.app`)

---

## Step 7: Configure Frontend Environment Variables

In Vercel Dashboard:

1. Click on `neuroprep-frontend` project
2. Go to Settings → Environment Variables
3. Add these variables for **Production**:

```
NEXT_PUBLIC_API_URL=https://neuroprep-backend-abc123.vercel.app
NEXT_PUBLIC_WS_URL=https://neuroprep-backend-abc123.vercel.app
NEXTAUTH_SECRET=<generate-secret>
NEXTAUTH_URL=https://neuroprep-frontend-xyz789.vercel.app
NEXT_PUBLIC_TFJS_BACKEND=webgpu
NEXT_PUBLIC_ENABLE_GAUSSIAN_SPLATS=true
```

---

## Step 8: Update Backend CORS Settings

Go back to `neuroprep-backend` project:

1. Go to Settings → Environment Variables
2. Update these variables:

```
CORS_ORIGIN=https://neuroprep-frontend-xyz789.vercel.app
FRONTEND_URL=https://neuroprep-frontend-xyz789.vercel.app
```

---

## Step 9: Redeploy Both Projects

### Redeploy Backend
1. Go to `neuroprep-backend` → Deployments
2. Click on latest deployment
3. Click three dots (•••) → Redeploy

### Redeploy Frontend
1. Go to `neuroprep-frontend` → Deployments
2. Click on latest deployment
3. Click three dots (•••) → Redeploy

---

## Step 10: Verify Deployment

### Test Backend Health
```bash
curl https://neuroprep-backend-abc123.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": 1234567890,
  "services": {...}
}
```

### Test Question Stats
```bash
curl https://neuroprep-backend-abc123.vercel.app/api/question-stats
```

Expected response:
```json
{
  "totalPatterns": 75,
  "estimatedCombinations": 84375000,
  "message": "NeuroPrep AI can generate over 1 million unique questions per engineering discipline"
}
```

### Test Frontend
Visit: `https://neuroprep-frontend-xyz789.vercel.app`

You should see:
- NeuroPrep AI landing page
- "Start Interview" button
- Role selection dropdown

---

## Step 11: Start an Interview

1. Click "Start Interview"
2. Select engineering discipline
3. Select role (e.g., "Software Engineer")
4. Choose difficulty (1-10)
5. Click "Begin Session"
6. Answer the first question!

---

## Optional Step 12: Add Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Update environment variables with new domain
5. Redeploy

---

## Troubleshooting

### CORS Error
- Verify `CORS_ORIGIN` in backend matches frontend URL exactly
- Include `https://` in the URL
- Redeploy backend

### API Connection Failed
- Check `NEXT_PUBLIC_API_URL` in frontend env vars
- Test backend `/health` endpoint
- Check Vercel logs for errors

### Questions Not Loading
- Verify backend is deployed and accessible
- Check browser console for errors
- Test `/api/question-stats` endpoint

---

## Optional Enhancements

### Add AI API Keys (Optional)
In backend environment variables:
```
OPENAI_API_KEY=sk-proj-your-key
ANTHROPIC_API_KEY=sk-ant-your-key
GEMINI_API_KEY=your-gemini-key
```

### Add Database (Optional)
Use Vercel Postgres or other provider:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### Add Redis (Optional)
For distributed sessions:
```
REDIS_URL=redis://user:password@host:port
```

---

## Success Checklist

- [ ] GitHub repository created and pushed
- [ ] Vercel CLI installed
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Backend environment variables configured
- [ ] Frontend environment variables configured
- [ ] CORS settings updated
- [ ] Both projects redeployed
- [ ] Backend health check passes
- [ ] Question stats endpoint works
- [ ] Frontend loads successfully
- [ ] Can start interview session
- [ ] Questions generate correctly
- [ ] No console errors

---

## 🎉 Congratulations!

Your NeuroPrep AI is now live and ready to conduct world-class engineering interviews!

**Your URLs**:
- Frontend: `https://neuroprep-frontend-xyz789.vercel.app`
- Backend API: `https://neuroprep-backend-abc123.vercel.app`

Share with your team and start interviewing!

---

## Next Steps

1. **Test thoroughly** - Try different roles and difficulties
2. **Monitor performance** - Check Vercel analytics
3. **Gather feedback** - Ask users for improvements
4. **Add features** - Custom domains, AI keys, database
5. **Share** - Tell others about NeuroPrep AI!

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. See full documentation in `VERCEL_DEPLOYMENT.md`
4. Check browser console for errors

---

**Deployment Complete!** 🚀
