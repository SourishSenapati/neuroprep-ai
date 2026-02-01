#  NeuroPrep AI - Next.js Architecture

**Production Deployment:** https://neuroprep-ai.vercel.app  
**Backend API:** https://neuroprep-backend.vercel.app  
**Status:** ✅ Production Ready | **Version:** 2.0.0

---


##  System Architecture


### High-Level Overview


```text
┌─────────────────────────────────────────────────────────────┐
│                      User's Browser                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Next.js    │  │  Framer      │  │    Pyodide      │   │
│  │   Frontend   │  │  Motion      │  │  (WebAssembly)  │   │
│  └──────┬───────┘  └──────────────┘  └─────────────────┘   │
└─────────┼──────────────────────────────────────────────────┘
          │
          │ HTTPS (Vercel Edge Network)
          │
┌─────────▼───────────────────────────────────────────────────┐
│                    Vercel Edge Functions                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes                                          │   │
│  │  - /api/stream (AI Streaming)                        │   │
│  │  - /api/parse-resume (PDF Parsing)                   │   │
│  │  - /api/auth (NextAuth)                              │   │
│  └────────────────────┬─────────────────────────────────┘   │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │ Backend Proxy
                        │
┌───────────────────────▼──────────────────────────────────────┐
│              Backend Server (Node.js + Express)              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │Question Bank│  │  Session     │  │  AI Engine       │   │
│  │Manager      │  │  Manager     │  │  (OpenAI/Claude) │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐                         │
│  │  SQLite     │  │    Redis     │                         │
│  │  Database   │  │  (Optional)  │                         │
│  └─────────────┘  └──────────────┘                         │
└──────────────────────────────────────────────────────────────┘

```text

---


##  Frontend Architecture (Next.js 15)


### Directory Structure


```text
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   ├── interview/
│   │   ├── setup/page.tsx        # Interview configuration
│   │   └── session/page.tsx      # Live interview session
│   ├── dashboard/page.tsx        # Performance analytics
│   ├── pricing/page.tsx          # Subscription plans
│   └── api/                      # API Routes (Edge Functions)
│       ├── stream/route.ts       # AI streaming endpoint
│       ├── parse-resume/route.ts # Resume parser (NEW!)
│       └── auth/[...nextauth]/   # Authentication
│
├── components/                   # React Components
│   ├── ChaosToOrderLanding.tsx   # Animated landing page (NEW!)
│   ├── InterviewSetup.tsx        # Multi-step setup wizard
│   ├── InterviewSession.tsx      # AI chat interface
│   ├── CodeEditor.tsx            # Monaco + Pyodide
│   ├── Dashboard.tsx             # Analytics dashboard
│   └── RegistrationModal.tsx    # Freemium gate
│
├── lib/                          # Utilities
│   ├── useSocket.ts              # Socket.io hook
│   └── cn.ts                     # Class name utilities
│
├── styles/
│   └── globals.css               # Global styles + Tailwind
│
└── public/                       # Static assets

```text


### Key Technologies

| Technology        | Purpose                        | Version | 
| ----------------- | ------------------------------ | ------- | 
| **Next.js**       | React framework with SSR/SSG   | 15.0.3  | 
| **TypeScript**    | Type safety                    | 5.3.3   | 
| **Tailwind CSS**  | Utility-first styling          | 3.4.0   | 
| **Framer Motion** | Animations (Chaos to Order)    | 11.18.2 | 
| **Monaco Editor** | Code editor component          | 4.6.0   | 
| **Pyodide**       | Python in WebAssembly          | 0.25.0  | 
| **Three.js**      | 3D graphics (optional)         | 0.160.1 | 
| **Socket.io**     | Real-time bidirectional events | 4.8.1   | 
| **NextAuth**      | Authentication                 | 4.24.5  | 

---


##  Backend Architecture (Node.js + Express)


### Core Components

**server.js** - Main application entry point

- Express server with middleware (CORS, Helmet, Compression)
- Socket.io for real-time updates
- REST API endpoints
- Session management
- Question bank integration


### API Endpoints

| Endpoint              | Method | Description                         | 
| --------------------- | ------ | ----------------------------------- | 
| `/api/stream`         | POST   | Stream AI interview responses (SSE) | 
| `/api/parse-resume`   | POST   | Parse PDF resume to JSON (NEW!)     | 
| `/api/forge-link`     | POST   | Create new interview session        | 
| `/api/dashboard`      | GET    | User performance analytics          | 
| `/api/question-stats` | GET    | Question bank statistics            | 
| `/health`             | GET    | Health check (Redis, PostgreSQL)    | 


### Database Schema

**SQLite Tables:**


```sql
-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  config JSON,
  transcript JSON,
  created_at TIMESTAMP
);

-- Biometrics
CREATE TABLE biometrics (
  id INTEGER PRIMARY KEY,
  session_id TEXT,
  stress_level REAL,
  heart_rate INTEGER,
  emotion TEXT,
  timestamp TIMESTAMP
);

```text

---


##  Key Features


### 1. **Chaos to Order Landing Page** (NEW!)

**File:** `frontend/components/ChaosToOrderLanding.tsx`

**Visual Metaphor:**

- Floating UI elements start scattered (chaos)
- Smoothly animate into structured grid (order)
- Demonstrates transformation from potential to mastery

**Technical Implementation:**


```tsx
// Chaos variants (random positions)
chaos: (i: number) => ({
  x: Math.random() * 400 - 200,
  y: Math.random() * 400 - 200,
  rotate: Math.random() * 360
}),

// Ordered variants (snap to grid)
ordered: {
  x: 0, y: 0, rotate: 0,
  transition: { type: 'spring' }
}

```text

---


### 2. **Resume Parser Integration** (NEW!)

**Files:**

- `backend/api/parse-resume.js` - Core parsing logic
- `frontend/app/api/parse-resume/route.ts` - Next.js API route

**Features:**

- PDF to text extraction using `pdf-parse`
- Structured data extraction (name, email, role, skills)
- Auto-fill interview setup form
- Error handling:
  - File too large (>5MB)
  - Corrupt PDF
  - Invalid file type

**Usage:**


```typescript
const formData = new FormData();
formData.append("resume", pdfFile);

const response = await fetch("/api/parse-resume", {
  method: "POST",
  body: formData,
});

const { data } = await response.json();
// data: { name, email, role, experienceLevel, skills }

```text

---


### 3. **AI Streaming Interview**

**File:** `frontend/components/InterviewSession.tsx`

**Flow:**

1. User sends message (text or voice)
2. Frontend POSTs to `/api/stream`
3. Backend streams AI response via SSE
4. Frontend renders chunks in real-time
5. Biometrics updated (stress, heart rate)

**Tech Stack:**

- **Streaming:** Server-Sent Events (SSE)
- **AI Models:** OpenAI GPT-4 / Anthropic Claude
- **Voice:** Web Speech API
- **Code Execution:** Pyodide (client-side Python)

---


### 4. **Zero-Latency Offline Neural Core** (NEW!)

**Files:**

- `frontend/lib/local-ai/InferenceEngine.ts`
- `frontend/lib/local-ai/KnowledgeBase.ts`

**Capabilities:**

- **Technology:** Transformer.js + WebAssembly (ONNX Runtime)
- **Model:** `Xenova/all-MiniLM-L6-v2` (Running entirely in-browser)
- **Features:**
  - Semantic analysis of user answers without internet.
  - Generates context-aware follow-up questions from local knowledge graph.
  - Automatic fallback when API/Cloud connection fails.
  - **Privacy First:** No data leaves the device in offline mode.

---


### 5. **Dynamic Question Generation**

**File:** `backend/dist/questionBank.js`

**Capacity:**


```text
Software Engineering: 84,375,000 questions
Civil Engineering:    28,125,000 questions
Mechanical Eng:       28,125,000 questions
Electrical Eng:       28,125,000 questions
Chemical Eng:         28,125,000 questions
─────────────────────────────────────────
TOTAL:               224,625,000+ questions

```text

**Features:**

- Zero repetition guarantee (FNV-1a hash tracking)
- Adaptive difficulty (performance-based)
- Topic diversity enforcement
- Session-level uniqueness tracking

---


##  Deployment


### Vercel Configuration

**Frontend:** `frontend/vercel.json`


```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://neuroprep-backend.vercel.app/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}

```text

**Backend:** `backend/vercel.json`


```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server.js" },
    { "src": "/(.*)", "dest": "/server.js" }
  ]
}

```text


### Environment Variables

**Frontend (.env.local):**


```env
NEXT_PUBLIC_API_URL=https://neuroprep-backend.vercel.app
NEXTAUTH_SECRET=<generate-with-openssl-rand>
NEXTAUTH_URL=https://neuroprep-ai.vercel.app

```text

**Backend (.env):**


```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
CORS_ORIGIN=https://neuroprep-ai.vercel.app
NODE_ENV=production

```text

---


##  Performance Optimizations


### Frontend

- **Code Splitting:** Automatic with Next.js App Router
- **Lazy Loading:** Monaco Editor, Three.js components
- **Image Optimization:** Next/Image component
- **Bundle Size:** Target <500KB (current: ~350KB)


### Backend

- **Streaming:** SSE reduces perceived latency
- **Caching:** Redis for session state
- **Connection Pooling:** PostgreSQL (20 connections)
- **Compression:** Gzip/Brotli for responses

---


## 📊 Architecture Diagram


```mermaid
graph TB
    subgraph Browser[User Browser]
        UI[Next.js Frontend]
        FM[Framer Motion]
        PY[Pyodide WebAssembly]
    end

    subgraph Edge[Vercel Edge Network]
        API[API Routes]
        AUTH[NextAuth]
        PARSE[Resume Parser]
    end

    subgraph Backend[Node.js Backend]
        QB[Question Bank<br/>224M+ Questions]
        SM[Session Manager]
        AI[AI Engine<br/>OpenAI/Claude]
    end

    subgraph Storage[Data Layer]
        DB[(SQLite)]
        REDIS[(Redis Cache)]
    end

    UI -->|HTTPS| API
    API -->|Proxy| QB
    API -->|Proxy| SM
    API -->|Stream SSE| AI
    SM --> DB
    SM --> REDIS
    QB --> DB
    PARSE -->|PDF Parse| API

```text

---


##  Testing Strategy


### Unit Tests

- **Backend:** Jest (31 tests passing)
- **Instant AI Feedback**: Real-time analysis of your answers.
- **Social Login**: Google & LinkedIn Authentication.
- **Payment Integration**: Razorpay (UPI) Support.
- **Coverage:** Target 80%+


### E2E Tests

- **Tool:** Cypress
- **Critical Flows:**
  - Interview setup → session → completion
  - Resume upload → auto-fill
  - Payment flow


### Performance Tests

- **Lighthouse Score:** 90+ (mobile & desktop)
- **Bundle Size:** <500KB
- **Time to Interactive:** <3s

---


##  Links

- **Live Demo:** https://neuroprep-ai.vercel.app
- **GitHub Repo:** https://github.com/SourishSenapati/neuroprep-ai
- **Documentation:** [See /docs folder]
- **Architecture Diagram:** /docs/ARCHITECTURE_DIAGRAM.md

---


##  Author

**Sourish Senapati**  
📧 [sourishsenapati791@gmail.com](mailto:sourishsenapati791@gmail.com)  
🔗 [LinkedIn](https://linkedin.com/in/sourish-senapati)

---


## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

---

**Built with ❤️ using Next.js 15, deployed on Vercel**  
**Hack2Hire 2026 Submission** | **Status:** ✅ Production Ready
