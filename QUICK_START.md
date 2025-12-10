# NeuroPrep AI - Quick Start (10 Minutes to Live)

## 🚀 Fastest Path to Production

### Prerequisites (5 min)
```bash
# 1. Install Node.js 18+
node -v  # Verify 18.x or higher

# 2. Install Vercel CLI
npm install -g vercel

# 3. Clone/navigate to project
cd ai-interviewer
```

### Environment Setup (2 min)
```bash
# Backend .env
cat > backend/.env << EOF
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=sk-proj-your-key
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379
EOF

# Frontend .env.local
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOF
```

### Install & Run (2 min)
```bash
# Install all dependencies
npm install

# Start dev servers (backend:3001, frontend:3000)
npm run dev
```

### Test Locally (1 min)
```bash
# Open browser
open http://localhost:3000

# Click "Start Interview Session"
# Select "Caltech PhD" mode
# Grant camera permissions
# Answer question → See AI analysis
```

### Deploy to Vercel (< 1 min)
```bash
# Login to Vercel
vercel login

# Deploy (auto-detects config)
npm run deploy:vercel

# Set environment variables in Vercel dashboard
# - OPENAI_API_KEY
# - DATABASE_URL (Supabase)
# - REDIS_URL (Upstash)
```

## ✅ Verification Checklist

- [ ] `npm run dev` starts both servers
- [ ] Frontend loads at localhost:3000
- [ ] Backend health check: `curl localhost:3001/api/health`
- [ ] Camera permissions granted
- [ ] AI generates question
- [ ] Code editor executes Python
- [ ] Deployed to Vercel successfully

## 🐛 Quick Fixes

**Port already in use:**
```bash
# Kill process on port 3001
npx kill-port 3001
```

**Dependencies fail:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Vercel deploy fails:**
```bash
# Check build logs
vercel logs --build

# Redeploy
vercel --prod --force
```

## 📚 Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Run tests: `npm run test:jest && npm run test:e2e`
- Seed database: `npm run seed:db`
- Configure Stripe for payments
- Enable analytics (Mixpanel)

---

**You're live in 10 minutes!** 🎉
