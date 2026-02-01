# NeuroPrep AI - System Architecture


## High-Level Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Next.js    │  │  Socket.io   │  │    Pyodide       │  │
│  │   Frontend   │  │   Client     │  │  (WebAssembly)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
└─────────┼──────────────────┼──────────────────────────────┘
          │                  │
          │ HTTP/REST        │ WebSocket
          │                  │
┌─────────▼──────────────────▼──────────────────────────────┐
│                    Backend Server (Node.js)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │   Express    │  │  Socket.io   │  │  Vercel AI SDK   │ │
│  │   REST API   │  │   Server     │  │   (Streaming)    │ │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘ │
└─────────┼──────────────────┼───────────────────┼──────────┘
          │                  │                   │
          │                  │                   │
    ┌─────▼─────┐      ┌────▼────┐        ┌────▼─────┐
    │PostgreSQL │      │  Redis  │        │ OpenAI/  │
    │ Database  │      │ Pub/Sub │        │ Claude   │
    └───────────┘      └─────────┘        └──────────┘

```text


## Component Architecture


### Frontend (Next.js 15 App Router)


#### Directory Structure

```text
frontend/
├── app/
│   ├── layout.tsx              # Root layout with providers

│   ├── page.tsx                # Main interview interface

│   ├── providers.tsx           # Context providers

│   ├── globals.css             # Global styles

│   └── api/
│       └── auth/[...nextauth]/ # Authentication routes

├── components/
│   ├── InterviewSession.tsx    # AI chat interface

│   ├── StressMonitor.tsx       # Real-time stress tracking

│   └── CodeEditor.tsx          # Monaco + Pyodide

└── lib/
    ├── useSocket.ts            # Socket.io hook

    └── cn.ts                   # Utility functions

```text


#### Key Technologies


- **Next.js 15**: App Router, Server Components, Server Actions
- **React 18**: Concurrent features, Suspense
- **Tailwind CSS**: Utility-first styling with custom theme
- **Monaco Editor**: VS Code editor component
- **Pyodide**: Python interpreter in WebAssembly
- **Socket.io Client**: Real-time bidirectional communication
- **NextAuth**: Authentication framework
- **Recharts**: Data visualization


#### Data Flow


1. User interacts with UI components
2. State managed via React hooks (useState, useEffect)
3. API calls to backend via fetch
4. Real-time updates via Socket.io
5. Code execution in Pyodide (client-side)


### Backend (Node.js + Express)


#### Core Components

**server.js** - Main application file

- Express server setup
- Middleware configuration (CORS, Helmet, compression)
- Socket.io server initialization
- Redis pub/sub setup
- PostgreSQL connection pool
- API route handlers
- Error handling


#### API Endpoints


##### POST /api/question


- Generate interview question based on topic/category
- Retrieve RAG context from knowledge base
- Apply adaptive difficulty based on stress level
- Store question in Redis/PostgreSQL


##### POST /api/stream


- Stream AI responses using Vercel AI SDK
- Server-Sent Events (SSE) for real-time streaming
- Adaptive prompting based on stress level
- RAG context injection


##### POST /api/session


- Create/update interview session
- Store session data in Redis (cache) and PostgreSQL (persistent)


##### GET /api/session/:sessionId


- Retrieve session data
- Check Redis first, fallback to PostgreSQL


##### POST /api/execute


- Code execution endpoint (stub for server-side execution)
- Publishes execution events via Redis pub/sub


##### GET /health


- Health check endpoint
- Returns status of all services


#### Socket.io Events


##### Client → Server


- `join-session`: Join interview session room
- `stress-update`: Update stress level
- `code-execution`: Broadcast code execution


##### Server → Client


- `session-joined`: Confirmation of session join
- `stress-updated`: Stress level changed
- `code-executed`: Code execution result


### Database Schema


#### PostgreSQL Tables


##### sessions


- `id` (PK): Session identifier
- `user_id`: User identifier
- `data`: JSONB session data
- `created_at`, `updated_at`: Timestamps


##### questions


- `id` (PK): Question identifier
- `session_id` (FK): Associated session
- `topic`, `category`: Question metadata
- `difficulty`: 1-10 scale
- `content`, `context`: Question data


##### responses


- `id` (PK): Response identifier
- `question_id` (FK): Associated question
- `user_response`: User's answer
- `ai_feedback`: AI evaluation
- `score`: 0-100 performance score
- `stress_level`: Stress at time of response


##### code_executions


- `id` (PK): Execution identifier
- `session_id` (FK): Associated session
- `code`, `language`: Code details
- `output`, `error`: Execution results
- `execution_time_ms`: Performance metric


#### performance_metrics


- `id` (PK): Metric identifier
- `session_id` (FK): Associated session
- `metric_name`, `metric_value`: Metric data
- `timestamp`: When metric recorded


### Redis Architecture


#### Key Patterns


##### Session Cache

```text
session:{sessionId} → JSON session data (TTL: 24h)
session:{sessionId}:stress → Current stress level (TTL: 1h)
session:{sessionId}:question:{questionId} → Question data (TTL: 1h)

```text


##### Pub/Sub Channels

```text
interview-events → Broadcast session events

```text


#### Use Cases


- Session state caching (reduce DB load)
- Real-time stress level tracking
- Cross-instance communication (pub/sub)
- Rate limiting counters


### AI Integration


#### Vercel AI SDK


##### Streaming Pipeline


1. Client sends message array
2. Backend constructs adaptive prompt
3. Injects RAG context from knowledge base
4. Calls OpenAI/Claude via Vercel AI SDK
5. Streams response chunks via SSE
6. Client renders incrementally


##### Model Selection


- **GPT-4**: Primary model for complex reasoning
- **GPT-3.5-turbo**: Faster responses for simple queries
- **Claude-3-opus**: Alternative for long-form explanations
- **Claude-3-sonnet**: Balanced performance/cost


#### RAG Knowledge Base


##### Structure

```javascript
RAG_KNOWLEDGE_BASE = {
  quantum: [
    {
      topic: "Quantum Entanglement",
      abstract: "...",
      difficulty: 9,
      questions: [...]
    }
  ],
  ml: [...],
  algorithms: [...],
  physics: [...]
}

```text


##### Retrieval Process


1. User selects topic/category
2. Fuzzy match against knowledge base
3. Retrieve relevant abstract + sample questions
4. Inject into system prompt
5. Generate contextual interview question


#### Adaptive Prompting


##### Stress-Based Adaptation


- **High Stress (7-10)**: Simplify, use analogies, provide hints
- **Moderate Stress (4-6)**: Balanced rigor and clarity
- **Low Stress (0-3)**: Challenge with advanced concepts


##### Implementation

```javascript
function generateAdaptivePrompt(topic, stressLevel, difficulty) {
  const basePrompt = "You are an elite PhD-level interviewer...";

  if (stressLevel > 7) {
    return basePrompt + "Simplify and provide guidance...";
  } else if (stressLevel > 4) {
    return basePrompt + "Balance rigor with clarity...";
  } else {
    return basePrompt + "Challenge with advanced concepts...";
  }
}

```text


### Code Execution (Pyodide)


#### Architecture


##### Client-Side Execution


- Pyodide loaded from CDN (jsdelivr)
- Python interpreter runs in WebAssembly
- Execution happens in browser (zero server latency)
- Sandboxed environment (security)


##### Initialization

```javascript
const pyodide = await loadPyodide({
  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
});
await pyodide.loadPackage(['numpy', 'scipy']);

```text


##### Execution Flow


1. User writes Python code in Monaco Editor
2. Click "Execute" button
3. Redirect stdout to StringIO
4. Run code in Pyodide
5. Capture output/errors
6. Display in terminal component


##### Supported Libraries


- Standard library (full)
- NumPy, SciPy (scientific computing)
- Matplotlib (visualization)
- Pandas (data analysis)


### Security Architecture


#### Backend Security


##### Helmet.js Headers


- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security


##### Rate Limiting


- 100 requests per 15 minutes per IP
- Prevents abuse and DDoS


##### Input Validation


- Zod schemas for all API inputs
- Type-safe validation
- Automatic error responses


##### CORS Configuration


- Whitelist specific origins
- Credentials support
- Preflight handling


#### Frontend Security


##### NextAuth


- JWT-based sessions
- Secure cookie storage
- CSRF protection


##### Code Execution Sandboxing


- Pyodide runs in isolated context
- No file system access
- No network access
- Memory limits enforced


##### Environment Variables


- Public vars prefixed with NEXT_PUBLIC_
- Server-side vars never exposed
- Validation on startup


### Performance Optimization


#### Frontend


##### Code Splitting


- Automatic with Next.js App Router
- Dynamic imports for heavy components
- Monaco Editor lazy loaded


##### Image Optimization


- Next.js Image component
- Automatic WebP conversion
- Responsive images


##### Caching


- Static assets cached at CDN
- API responses cached in browser
- Service worker for offline support


#### Backend


##### Connection Pooling


- PostgreSQL: 20 max connections
- Redis: Persistent connections
- Reuse across requests


##### Compression


- Gzip/Brotli for responses
- Reduces bandwidth by 70%+


##### Streaming


- SSE for AI responses
- Reduces perceived latency
- Better UX for long responses


### Scalability


#### Horizontal Scaling


##### Stateless Backend


- Session state in Redis/PostgreSQL
- No in-memory state
- Load balancer compatible


##### Redis Pub/Sub


- Cross-instance communication
- Broadcast events to all servers
- Consistent state across instances


##### Database Replication


- Read replicas for queries
- Write to primary
- Automatic failover


#### Vertical Scaling


##### Resource Allocation


- CPU: 2+ cores for AI streaming
- Memory: 2GB+ for Pyodide operations
- Disk: SSD for database


### Monitoring & Observability


#### Metrics


##### Application Metrics


- Request rate, latency, errors
- WebSocket connections
- AI streaming performance


##### Infrastructure Metrics


- CPU, memory, disk usage
- Database connections
- Redis memory usage


#### Logging


##### Structured Logging

```javascript
console.log({
  level: 'info',
  message: 'Session created',
  sessionId: '...',
  userId: '...',
  timestamp: Date.now()
});

```text


##### Log Aggregation


- Vercel logs (built-in)
- CloudWatch (AWS)
- Stackdriver (GCP)


### Deployment Architecture


#### Vercel (Serverless)


##### Vercel Frontend


- Edge Network (CDN)
- Automatic HTTPS
- Zero-config deployment


##### Vercel Backend


- Serverless Functions
- Auto-scaling
- Cold start optimization


#### Docker (Container)


##### Multi-Stage Builds


- Builder stage: Install deps, compile
- Runner stage: Minimal runtime image
- Reduces image size by 80%+


##### Orchestration


- Docker Compose (development)
- Kubernetes (production)
- Auto-scaling based on load


### Future Enhancements


#### WebNN Integration


- Browser-native ML inference
- Stress detection from webcam
- Real-time emotion analysis


#### Advanced


- Vector database (Pinecone/Weaviate)
- Semantic search over arXiv papers
- Dynamic knowledge base updates


#### Collaborative Features


- Multi-user sessions
- Peer code review
- Live interviewer mode


#### Analytics Dashboard


- Performance trends over time
- Weak areas identification
- Personalized study plans

---

**Architecture Version**: 1.0
**Last Updated**: 2024
**Maintained By**: xAI Engineering Team
