# NeuroPrep AI - System Architecture Diagram

## Visual Architecture

```mermaid
graph TB
    subgraph Client[" Client Browser"]
        UI["Next.js Frontend<br/>React 19 + TypeScript"]
        FM["Framer Motion<br/>Chaos→Order Animation"]
        Monaco["Monaco Editor<br/>VS Code Component"]
        Pyodide["Pyodide WebAssembly<br/>Python Execution"]
    end
    
    subgraph Edge[" Vercel Edge Network"]
        CDN["Global CDN<br/>Static Assets"]
        EdgeAPI["Edge Functions<br/>API Routes"]
        SSR["Server-Side Rendering"]
    end
    
    subgraph API[" API Layer Next.js"]
        Stream["POST /api/stream<br/>AI Streaming SSE"]
        Resume["POST /api/parse-resume<br/>PDF→JSON Extraction"]
        Auth["POST /api/auth<br/>NextAuth.js"]
    end
    
    subgraph Backend["️ Backend Server Node.js + Express"]
        QB["Question Bank Manager<br/>224M+ Unique Questions<br/>FNV-1a Hash Tracking"]
        SM["Session Manager<br/>In-Memory + Persistence"]
        AIEngine["AI Engine<br/>OpenAI GPT-4<br/>Anthropic Claude"]
        ResParser["Resume Parser<br/>pdf-parse Library<br/>NLP Extraction"]
        Socket["Socket.io Server<br/>Real-time Biometrics"]
    end
    
    subgraph Storage[" Data Layer"]
        SQLite["SQLite Database<br/>Users, Sessions<br/>Biometrics, Responses"]
        Redis["Redis Cache Optional<br/>Session State<br/>Pub/Sub Events"]
    end
    
    subgraph External[" External Services"]
        OpenAI["OpenAI API<br/>GPT-4 Turbo"]
        Claude["Anthropic API<br/>Claude 3 Opus/Sonnet"]
        Stripe["Stripe API<br/>Payments"]
    end
    
    %% Client connections
    UI -->|HTTPS| CDN
    UI -->|API Calls| EdgeAPI
    UI -->|WebSocket| Socket
    Monaco --> Pyodide
    FM --> UI
    
    %% Edge to API
    CDN --> SSR
    EdgeAPI --> Stream
    EdgeAPI --> Resume
    EdgeAPI --> Auth
    
    %% API to Backend
    Stream -->|Proxy| AIEngine
    Resume -->|Proxy| ResParser
    Auth -->|Session| SM
    
    %% Backend internal
    AIEngine --> QB
    AIEngine --> SM
    ResParser --> SM
    Socket --> SM
    
    %% Backend to Storage
    SM --> SQLite
    SM --> Redis
    QB --> SQLite
    
    %% External services
    AIEngine -->|API Call| OpenAI
    AIEngine -->|API Call| Claude
    Backend --> Stripe
    
    %% Styling
    classDef clientClass fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#fff
    classDef edgeClass fill:#50C878,stroke:#2D7A4A,stroke-width:2px,color:#fff
    classDef apiClass fill:#FF6B6B,stroke:#C93A3A,stroke-width:2px,color:#fff
    classDef backendClass fill:#9B59B6,stroke:#6C3483,stroke-width:2px,color:#fff
    classDef storageClass fill:#F39C12,stroke:#B8750A,stroke-width:2px,color:#fff
    classDef externalClass fill:#34495E,stroke:#1C2833,stroke-width:2px,color:#fff
    
    class UI,FM,Monaco,Pyodide clientClass
    class CDN,EdgeAPI,SSR edgeClass
    class Stream,Resume,Auth apiClass
    class QB,SM,AIEngine,ResParser,Socket backendClass
    class SQLite,Redis storageClass
    class OpenAI,Claude,Stripe externalClass
```

---

## Data Flow Diagrams

### 1. Interview Session Flow

```mermaid
sequenceDiagram
    participant U as User Browser
    participant F as Next.js Frontend
    participant A as API Route /api/stream
    participant B as Backend AIEngine
    participant O as OpenAI/Claude
    participant DB as SQLite
    
    U->>F: Start Interview (role, difficulty)
    F->>A: POST /api/stream {messages, config}
    A->>B: Proxy request
    B->>DB: Save session
    B->>O: Stream AI prompt
    O-->>B: Chunk 1
    B-->>A: SSE: data: {content: "Hello"}
    A-->>F: Stream chunk
    F-->>U: Render incrementally
    O-->>B: Chunk 2, 3, ...
    B-->>A: SSE: data: {content: "..."}
    A-->>F: Continue streaming
    F-->>U: Update UI
    O-->>B: [DONE]
    B-->>A: SSE: [DONE]
    A-->>F: Close stream
    B->>DB: Save transcript
```

### 2. Resume Upload & Auto-Fill Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend Components
    participant A as API /parse-resume
    participant P as Resume Parser
    participant S as InterviewSetup
    
    U->>F: Upload resume.pdf
    F->>F: Validate (type, size)
    F->>A: POST FormData {resume: file}
    A->>A: Convert to Buffer
    A->>P: parseResume(buffer, fileName)
    P->>P: pdf-parse extraction
    P->>P: NLP pattern matching
    P-->>A: {name, role, skills, experience}
    A-->>F: JSON response
    F->>S: Auto-fill form fields
    S-->>U: Show pre-filled setup
    U->>S: Adjust & Start
```

### 3. Question Generation Flow

```mermaid
flowchart TD
    Start[User Starts Session] --> GetConfig[Retrieve Config<br/>Role, Difficulty, Topic]
    GetConfig --> CheckHistory[Check Session History<br/>Previous Questions]
    CheckHistory --> Generate[Generate Question<br/>QuestionBankManager]
    Generate --> Hash[Calculate FNV-1a Hash]
    Hash --> CheckDupe{Duplicate?}
    CheckDupe -->|Yes| Retry[Retry Counter++]
    Retry --> MaxRetries{Max Retries<br/>1000?}
    MaxRetries -->|No| Generate
    MaxRetries -->|Yes| Fallback[Use Fallback Question]
    CheckDupe -->|No| AdaptDiff[Adapt Difficulty<br/>Based on Performance]
    AdaptDiff --> Stream[Stream to User]
    Fallback --> Stream
    Stream --> SaveDB[Save to Database]
    SaveDB --> End[Complete]
```

---

## Component Architecture

### Frontend Component Hierarchy

```mermaid
graph TD
    Root[app/layout.tsx<br/>Root Layout] --> Providers[Providers Wrapper]
    Providers --> Page[app/page.tsx<br/>Landing Page]
    Providers --> Interview[app/interview/*]
    
    Page --> Chaos[ChaosToOrderLanding<br/>Animated Hero NEW!]
    
    Interview --> Setup[InterviewSetup<br/>Multi-Step Form]
    Interview --> Session[InterviewSession<br/>AI Chat Interface]
    
    Setup --> Upload[Resume Upload NEW!<br/>PDF Drag & Drop]
    Setup --> RoleSelect[Role Selection<br/>40+ Engineering Fields]
    Setup --> Difficulty[Difficulty Slider<br/>1-10 Scale]
    
    Session --> Chat[Chat Messages<br/>User + AI]
    Session --> Bio[Biometric Display<br/>Stress, HR, Emotion]
    Session --> CodeEd[CodeEditor<br/>Monaco + Pyodide]
    Session --> Voice[Voice Controls<br/>Speech Synthesis/Recognition]
    
    CodeEd --> Monaco[Monaco Editor<br/>Syntax Highlighting]
    CodeEd --> PyEngine[Pyodide Engine<br/>Python Execution]
```

### Backend Module Architecture

```mermaid
graph LR
    Server[server.js<br/>Express App] --> Routes[API Routes]
    Server --> Socket[Socket.io]
    Server --> Middleware[Middleware<br/>CORS, Helmet, Rate Limit]
    
    Routes --> QuestionAPI[/api/question]
    Routes --> StreamAPI[/api/stream]
    Routes --> ParseAPI[/api/parse-resume NEW!]
    Routes --> DashboardAPI[/api/dashboard]
    
    QuestionAPI --> QB[questionBank.ts<br/>FNV-1a Hash<br/>224M Combos]
    StreamAPI --> AI[aiEngine.js<br/>OpenAI/Claude]
    ParseAPI --> Parser[parse-resume.js<br/>pdf-parse + NLP NEW!]
    DashboardAPI --> DB[database.js<br/>SQLite Queries]
    
    Socket --> SessionMgr[sessionManager.ts<br/>In-Memory State]
    
    QB --> DB
    AI --> DB
    SessionMgr --> DB
    Parser --> DB
```

---

## Technology Stack Breakdown

### Frontend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 | React framework, SSR/SSG, API routes |
| **Language** | TypeScript 5.3 | Type safety, developer experience |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS, responsive design |
| **Animations** | Framer Motion 11.18 | Chaos→Order metaphor, smooth transitions |
| **Code Editor** | Monaco Editor 4.6 | VS Code component, syntax highlighting |
| **Python Runtime** | Pyodide 0.25 | WebAssembly Python interpreter |
| **3D Graphics** | Three.js 0.160 | 3D visualizations (optional) |
| **Real-time** | Socket.io Client 4.8 | Bi-directional WebSocket events |
| **Auth** | NextAuth 4.24 | Authentication, session management |
| **State Management** | React Hooks + Zustand | Local & global state |

### Backend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 20+ | JavaScript server runtime |
| **Framework** | Express 4.18 | Web framework, middleware |
| **Language** | TypeScript 5.3 | Type safety, maintainability |
| **AI Integration** | OpenAI API, Anthropic | Question generation, evaluation |
| **Resume Parsing** | pdf-parse 1.1 | PDF text extraction **(NEW!)** |
| **Database** | SQLite 3 | Embedded SQL database |
| **Cache** | Redis (optional) | Session caching, pub/sub |
| **Real-time** | Socket.io Server 4.8 | WebSocket server |
| **Validation** | Zod 3.22 | Runtime type validation |
| **Security** | Helmet, CORS | HTTP headers, cross-origin |
| **Payment** | Stripe 14.25 | Subscription billing |

---

## Deployment Architecture

```mermaid
graph TB
    subgraph Internet[" Internet"]
        User1[User Device 1]
        User2[User Device 2]
        UserN[User Device N]
    end
    
    subgraph Vercel[" Vercel Platform"]
        subgraph Frontend["Frontend Deployment"]
            EdgeFront[Edge Network<br/>Global CDN]
            NextFunc[Next.js<br/>Serverless Functions]
        end
        
        subgraph BackendV["Backend Deployment"]
            EdgeBack[Edge Network]
            NodeFunc[Node.js<br/>Serverless Functions]
        end
    end
    
    subgraph Services[" External Services"]
        OpenAISvc[OpenAI API<br/>gpt-4-turbo]
        ClaudeSvc[Anthropic API<br/>claude-3-opus]
        StripeSvc[Stripe API<br/>Billing]
    end
    
    subgraph Data[" Data Storage"]
        SQLiteDB[(SQLite<br/>File-based)]
        RedisDB[(Redis Labs<br/>Optional)]
    end
    
    User1 -->|HTTPS| EdgeFront
    User2 -->|HTTPS| EdgeFront
    UserN -->|HTTPS| EdgeFront
    
    EdgeFront --> NextFunc
    NextFunc -->|Proxy /api/*| EdgeBack
    EdgeBack --> NodeFunc
    
    NodeFunc --> OpenAISvc
    NodeFunc --> ClaudeSvc
    NodeFunc --> StripeSvc
    NodeFunc --> SQLiteDB
    NodeFunc --> RedisDB
    
    classDef userClass fill:#3498DB,stroke:#2874A6
    classDef vercelClass fill:#000000,stroke:#333333,color:#fff
    classDef serviceClass fill:#E74C3C,stroke:#C0392B
    classDef dataClass fill:#F39C12,stroke:#D68910
    
    class User1,User2,UserN userClass
    class EdgeFront,NextFunc,EdgeBack,NodeFunc vercelClass
    class OpenAISvc,ClaudeSvc,StripeSvc serviceClass
    class SQLiteDB,RedisDB dataClass
```

---

## Security Architecture

```mermaid
graph TD
    Request[Incoming Request] --> HTTPS{HTTPS?}
    HTTPS -->|No| Reject[Reject: 403]
    HTTPS -->|Yes| CORS{Valid Origin?}
    CORS -->|No| Reject
    CORS -->|Yes| RateLimit{Rate Limit OK?}
    RateLimit -->|No| Reject429[Reject: 429]
    RateLimit -->|Yes| Auth{Authenticated?}
    Auth -->|Required + No| Reject401[Reject: 401]
    Auth -->|Yes/Optional| Validate{Input Valid?}
    Validate -->|No| Reject400[Reject: 400]
    Validate -->|Yes| FileCheck{File Upload?}
    FileCheck -->|Yes| SizeCheck{Size OK?}
    SizeCheck -->|No| Reject413[Reject: 413]
    SizeCheck -->|Yes| TypeCheck{Type OK?}
    TypeCheck -->|No| Reject415[Reject: 415]
    TypeCheck -->|Yes| Process
    FileCheck -->|No| Process[Process Request]
    Process --> Sanitize[Sanitize Input<br/>XSS Prevention]
    Sanitize --> Execute[Execute Logic]
    Execute --> Response[Return Response]
```

---

## Performance Metrics

### Frontend Optimization

```mermaid
pie title Bundle Size Distribution (Target <500KB)
    "Next.js Core" : 120
    "React + ReactDOM" : 80
    "Framer Motion" : 60
    "Monaco Editor Lazy" : 0
    "Pyodide Lazy" : 0
    "Three.js Lazy" : 0
    "Other Dependencies" : 90
```

### Backend Performance

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Question Generation | <50ms | ~30ms |  Exceeded |
| AI Streaming (First Token) | <500ms | ~400ms |  Met |
| Database Query | <10ms | ~5ms |  Exceeded |
| Resume Parsing | <2s | ~1.5s |  Met |
| Session Creation | <100ms | ~80ms |  Met |

---

## Future Enhancements

```mermaid
timeline
    title NeuroPrep AI Roadmap
    2025 Q1 : Resume Parser Integration (DONE)
           : Chaos→Order Landing Page (DONE)
           : Mobile Responsiveness
    2025 Q2 : Offline Mode (PWA)
           : Multi-language Support
           : Voice Cloning (ElevenLabs)
    2025 Q3 : Video Interview Mode
           : Screen Sharing
           : Collaborative Sessions
    2025 Q4 : Enterprise Features
           : White-label Solution
           : Analytics Dashboard
```

---

## Diagram Export

To convert this Mermaid diagram to PNG:

1. **Online Tool:** <https://mermaid.live>
2. **CLI Tool:** `mmdc -i ARCHITECTURE_DIAGRAM.md -o architecture.png`
3. **VS Code Extension:** Mermaid Preview

---

**Architecture Version:** 2.0  
**Last Updated:** December 2025  
**Maintained By:** NeuroPrep AI Team
