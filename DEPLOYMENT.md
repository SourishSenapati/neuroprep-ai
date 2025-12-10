# NeuroPrep AI - Deployment & Testing Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites

```bash
npm install -g vercel
vercel login
```

### Deploy Full Stack

```bash
# From root directory
npm run deploy:vercel
```

### Deploy Separately

```bash
# Backend only
npm run deploy:backend

# Frontend only
npm run deploy:frontend
```

### Environment Variables (Vercel Dashboard)

Set these in Vercel project settings:

**Backend:**

- `OPENAI_API_KEY` - OpenAI API key (sk-proj-...)
- `ANTHROPIC_API_KEY` - Anthropic API key (sk-ant-...)
- `REDIS_URL` - Upstash Redis URL (redis://...)
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Frontend URL (<https://your-app.vercel.app>)
- `NODE_ENV` - production

**Frontend:**

- `NEXT_PUBLIC_API_URL` - Backend URL (<https://your-backend.vercel.app>)
- `NEXT_PUBLIC_WS_URL` - WebSocket URL (same as API URL)
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Frontend URL

## 🧪 Testing Suite

### Backend Unit Tests (Jest)

```bash
# Run all backend tests
npm run test:jest

# Watch mode
cd backend
npm test -- --watch

# Coverage report
npm run test:jest
```

**Test Coverage:**

- ✅ RAG context retrieval
- ✅ Adaptive difficulty adjustment (stress > 7)
- ✅ Grok-style response analysis
- ✅ LLM cheat detection
- ✅ Neural resilience calculation
- ✅ Session insights generation

### E2E Tests (Cypress)

```bash
# Headless mode
npm run test:e2e

# Interactive mode
npm run test:e2e:open
```

**E2E Test Scenarios:**

1. **Full Caltech Interview Simulation**
   - Start session with caltech-phd mode
   - Grant camera permissions (mocked)
   - Answer quantum physics question
   - Verify technical score > 90
   - Execute Python code with Pyodide
   - Verify numpy import and print(42)
   - End session and check neural resilience > 85

2. **Pyodide Code Execution**
   - Load code editor
   - Type: `import numpy; print(42)`
   - Run code
   - Assert output contains "42"

3. **Neural Reset Trigger**
   - Set stress level > 8
   - Verify breathing overlay appears
   - Check 4-7-8 breathing instructions

4. **Cheat Detection**
   - Submit LLM-style response
   - Verify authenticity warning appears
   - Check flag in session data

### Database Seeding

```bash
# Seed Caltech/MIT sample data
npm run seed:db

# Or manually
psql $DATABASE_URL -f backend/seed.sql
```

**Seeded Data:**

- 3 test users (Caltech PhD, MIT AI, Standard)
- 3 sample sessions with biometrics
- 2 detailed responses (GW merger, quantum error correction)
- 5 institutional benchmarks

## 📊 Monitoring & Logs

### Vercel Logs

```bash
# Real-time logs
vercel logs --follow

# Backend logs
vercel logs backend --follow

# Frontend logs
vercel logs frontend --follow
```

### Console Monitoring

```javascript
// Frontend: Check WebSocket connection
console.log('Socket connected:', socket.connected);

// Backend: Monitor AI streaming
console.log('Streaming question:', { sessionId, mode, stressLevel });
```

### Health Checks

```bash
# Backend health
curl https://your-backend.vercel.app/api/health

# Expected: {"status":"ok","redis":"connected","db":"connected"}
```

## 🔍 Verification Checklist

### Pre-Deploy

- [ ] All environment variables set in Vercel
- [ ] Database schema deployed (schema.sql)
- [ ] Redis instance running (Upstash recommended)
- [ ] API keys valid (OpenAI/Anthropic)

### Post-Deploy

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] WebSocket connection established
- [ ] Camera permissions work
- [ ] Pyodide loads and executes Python
- [ ] AI streaming generates questions
- [ ] Response analysis returns scores
- [ ] Session data persists to database

### Test Scenarios

```bash
# 1. Start development servers
npm run dev

# 2. Run unit tests
npm run test:jest

# 3. Run E2E tests
npm run test:e2e

# 4. Seed database
npm run seed:db

# 5. Deploy to Vercel
npm run deploy:vercel
```

## 🐛 Troubleshooting

### Vercel Build Fails

```bash
# Check build logs
vercel logs --build

# Common fixes:
# - Verify package.json scripts
# - Check TypeScript errors
# - Ensure all dependencies installed
```

### Socket.io Not Connecting

```bash
# Verify CORS settings in backend
CORS_ORIGIN=https://your-frontend.vercel.app

# Check WebSocket URL in frontend
NEXT_PUBLIC_WS_URL=https://your-backend.vercel.app
```

### Pyodide Not Loading

```bash
# Check COOP/COEP headers in vercel.json
# Verify CDN access to jsdelivr.net
# Clear browser cache
```

### Database Connection Error

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Verify SSL mode
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

## 📈 Performance Benchmarks

**Expected Metrics:**

- First byte: < 200ms
- AI streaming first chunk: < 500ms
- Response analysis: 2-5s
- Code execution (Pyodide): < 1s
- WebSocket latency: < 50ms

## 🔒 Security Checklist

- [ ] Environment variables not committed
- [ ] API keys stored in Vercel secrets
- [ ] CORS properly configured
- [ ] Rate limiting enabled (100 req/15min)
- [ ] Input validation with Zod
- [ ] Helmet security headers
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (React escaping)

## 📝 CI/CD Pipeline (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run test:jest
      - run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

**Ready to Deploy!** 🎉

Run `npm run deploy:vercel` and your NeuroPrep AI will be live in minutes.
