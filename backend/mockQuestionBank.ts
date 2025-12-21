/**
 * Mock Question Bank for NeuroPrep AI
 * Provides hardcoded, high-quality technical questions for offline mode/demos.
 */

// 50+ Unique technical questions for randomly selected roles
const TECH_QUESTIONS = {
  'Software Engineer': [
    "Explain the difference between a process and a thread. How do they share resources?",
    "What is the time complexity of searching in a balanced Binary Search Tree (BST)? Why?",
    "Describe the concept of 'idempotency' in REST APIs. Why is it important?",
    "How does Garbage Collection working in languages like Java or Python?",
    "What is a race condition? How would you prevent it in a multi-threaded application?",
    "Explain the SOLID principles. Pick one and give a concrete example.",
    "What is the difference between TCP and UDP? When would you use one over the other?",
    "How does a hash map work under the hood? How are collisions handled?",
    "What is the difference between composition and inheritance? Which do you prefer and why?",
    "Explain the concept of Dependency Injection. What problem does it solve?",
    "What is a deadlock? What are the necessary conditions for a deadlock to occur?",
    "Describe the difference between optimistic and pessimistic locking.",
    "How does HTTPS work? Briefly explain the handshake process.",
    "What is the CAP theorem? Can you truly achieve all three properties?",
    "Explain the difference between vertical and horizontal scaling.",
    "What is a simplified explanation of Big O notation?",
    "How do you handle error handling in a large scale application?",
    "What are the benefits of using a Message Queue in a distributed system?",
    "Explain the Model-View-Controller (MVC) architectural pattern.",
    "What is the difference between an abstract class and an interface?",
    "How does database indexing work? What are the trade-offs?",
    "What is a closure in programming?",
    "Explain the concept of 'pure functions'.",
    "What is the difference between synchronous and asynchronous programming?",
    "How do you prevent SQL injection attacks?",
    "What is Cross-Site Scripting (XSS)? How do you mitigate it?",
    "Explain the concept of containerization (e.g., Docker).",
    "What is Continuous Integration/Continuous Deployment (CI/CD)?",
    "How does a load balancer work?",
    "What is the difference between SQL and NoSQL databases?",
    "Explain the concept of microservices architecture.",
    "What is a Singleton pattern? When is it a bad idea?",
    "How do you manage state in a stateless protocol like HTTP?",
    "What is the difference between authentication and authorization?",
    "Explain the concept of 'Lazy Loading'.",
    "What is memoization? When should it be used?",
    "How does a Bloom filter work?",
    "What is the difference between a stack and a heap in memory management?",
    "Explain the concept of 'Eventual Consistency'.",
    "What is a callback function?",
    "How do you design a URL shortening service (like bit.ly)?",
    "What is the difference between `==` and `===` (or equivalent in your language)?",
    "Explain the concept of polylmorphism.",
    "What is a dynamic programming approach?",
    "How do you optimize a slow database query?",
    "What is a semantic versioning?",
    "Explain the concept of 'Technical Debt'.",
    "What is code refactoring vs rewriting?",
    "How do you ensure code quality in a team?",
    "What is the difference between unit testing and integration testing?",
    "Explain the concept of 'Recursion'.",
    "What is a 'memory leak'? How do you detect it?"
  ],
  'Frontend Engineer': [
    "Explain the browser's critical rendering path.",
    "What is the Virtual DOM? How does it improve performance?",
    "Describe the difference between `var`, `let`, and `const` in JavaScript.",
    "What is the Event Loop in JavaScript? How does it handle async operations?",
    "Explain the concept of 'hoisting' in JavaScript.",
    "What is the difference between CSS Flexbox and Grid? When to use which?",
    "How do you optimize frontend performance (Core Web Vitals)?",
    "What is Progressive Enhancement vs Graceful Degradation?",
    "Explain the Box Model in CSS.",
    "What is a Promise in JavaScript? How does it compare to callbacks?",
    "How does `this` keyword work in JavaScript?",
    "What is the difference between LocalStorage, SessionStorage, and Cookies?",
    "Explain the concept of 'Closures' in JavaScript with a practical example.",
    "What is Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)?",
    "How do you handle state management in a complex React/Vue/Angular app?",
    "What is Prop Drilling? How do you avoid it?",
    "Explain the concept of 'debouncing' and 'throttling'.",
    "What is a standard way to avoid CORS issues?",
    "How does CSS specificity work?",
    "What is the difference between `px`, `em`, `rem`, `vh`, and `vw`?",
    "Explain Accessibility (a11y) in web development. key attributes?",
    "What is the purpose of `useEffect` in React (or lifecycle methods)?",
    "How do you prevent re-renders in React?",
    "What is semantic HTML? Why is it important?",
    "Explain the concept of Hydration in SSR frameworks.",
    "What is the difference between deep copy and shallow copy?",
    "How do Service Workers enable PWA features?",
    "What is the difference between `null` and `undefined`?",
    "Explain how JavaScript prototypal inheritance works.",
    "What is a Higher-Order Component (HOC)?",
    "How do you debug memory leaks in a browser?",
    "What is the difference between HTTP/1.1 and HTTP/2?",
    "Explain the concept of 'Code Splitting'.",
    "What is a CSS Preprocessor (Sass/Less)? Pros/Cons?",
    "How do you handle form validation secure and user-friendly?",
    "What is the Shadow DOM?",
    "Explain the concept of 'Tree Shaking'.",
    "What is the difference between Arrow Functions and Regular Functions?",
    "How do you manage CSS scalability (BEM, CSS Modules, Tailwind)?",
    "What is the purpose of the `key` prop in lists?",
    "Explain the concept of Jamstack.",
    "How do WebSockets differ from HTTP requests?",
    "What is Lazy Loading for images/components?",
    "Explain the concept of Micro-Frontends.",
    "How do you verify cross-browser compatibility?",
    "What is TypeScript? Benefits over JavaScript?",
    "Explain the Context API.",
    "What is 'event bubbling' and 'capturing'?",
    "How do you ensure your site is SEO friendly?",
    "What is WebAssembly (Wasm)?"
  ],
  'Backend Engineer': [
    "Explain the ACID properties in databases.",
    "What is database normalization? What are the forms?",
    "Difference between SQL (Relational) and NoSQL (Document/Key-Value) databases.",
    "How do you handle database migrations safely in production?",
    "What is Connection Pooling? Why is it important?",
    "Explain the concept of Sharding vs Partitioning.",
    "How does caching (Redis/Memcached) improve backend performance? Strategies?",
    "What is the difference between REST and GraphQL?",
    "Explain the concept of WebSockets. typical use cases?",
    "How do you secure a REST API? (OAuth, JWT, Rate Limiting)",
    "What is the difference between Horizontal and Vertical scaling?",
    "Explain the underlying mechanism of HTTPS/SSL.",
    "How do you design a database schema for a social media app?",
    "What is an index? detailed explanation of B-Tree vs Hash index.",
    "Explain the SAGA pattern for distributed transactions.",
    "What is a reverse proxy (Nginx)? What is its purpose?",
    "How do you handle background jobs/queues?",
    "What is the N+1 problem in ORMs? How to fix it?",
    "Explain Microservices vs Monolith architecture trade-offs.",
    "How does a Message Broker (RabbitMQ/Kafka) work?",
    "What is Event Sourcing?",
    "Difference between Process and Thread in OS context.",
    "How to handle concurrency control (optimistic vs pessimistic)?",
    "What is gRPC? Benefits over REST?",
    "Explain CAP Theorem and PACELC Theorem.",
    "How do you implement Rate Limiting?",
    "What is Dependency Injection? Why use it in backend services?",
    "Explain the concept of 'Idempotency' in writes.",
    "How do you monitor and observe backend services (Logging/Tracing)?",
    "What is Consistent Hashing?",
    "Explain the difference between TCP and UDP headers.",
    "How do you handle API versioning?",
    "What is a Dead Letter Queue (DLQ)?",
    "Explain the concept of 'soft delete'.",
    "What is the 3-tier architecture?",
    "How do you efficiently store and query geospatial data?",
    "What is Structured Logging?",
    "Explain the concept of 'Service Mesh'.",
    "How do you prevent 'SQL Injection' and 'NoSQL Injection'?",
    "What is a Circuit Breaker pattern?",
    "Difference between Long Polling and WebSockets.",
    "How does an API Gateway work?",
    "What is Database Replication (Master-Slave vs Multi-Master)?",
    "Explain 'Data Consistency' models (Strong, Eventual, Causal).",
    "How do you handle large file uploads?",
    "What is serverless architecture? Pros/Cons?",
    "Explain the concept of 'Blue-Green Deployment'.",
    "What is 'Canary Deployment'?",
    "How do you debug a high-latency issue in production?",
    "Explain the concept of 'Backpressure'."
  ],
  'DevOps Engineer': [
    "Explain the concept of Infrastructure as Code (IaC).",
    "What is the difference between Docker and a Virtual Machine?",
    "How does Kubernetes manage container orchestration? (Pods, Services, Deployments)",
    "What is the difference between CI (Continuous Integration) and CD (Continuous Delivery/Deployment)?",
    "Explain the GitOps workflow.",
    "What is 'Immutable Infrastructure'?",
    "How do you implement Zero Downtime Deployment?",
    "Explain the concept of 'Observability' (Logs, Metrics, Traces).",
    "What is a Service Mesh (e.g., Istio)? Why use it?",
    "How do you secure a Kubernetes cluster?",
    "What is Ansible/Puppet/Chef? Difference from Terraform?",
    "Explain the Blue-Green deployment strategy.",
    "What is a Reverse Proxy? How does it differ from a Load Balancer?",
    "How do you manage secrets in production (Vault, K8s Secrets)?",
    "What is 'Drift Detection' in IaC?",
    "Explain the concept of SLI, SLO, and SLA.",
    "How do you troubleshoot a crashing pod in Kubernetes?",
    "What represents 'Chaos Engineering'?",
    "Explain the difference between vertical and horizontal pod autoscaling.",
    "What is a 'StatefulSet' in Kubernetes?",
    "How does DNS resolution work? (A records, CNAME, etc.)",
    "What is a CDN? How does it configure caching?",
    "Explain the concept of 'Shift Left' security.",
    "What is 'network policy' in Kubernetes?",
    "How do you back up and restore a distributed database?",
    "Explain the typical ELK/EFK stack.",
    "What is 'Serverless' computing from an ops perspective?",
    "How do you monitor cloud costs?",
    "What is the difference between orchestration and choreography?",
    "Explain the 12-Factor App methodology.",
    "What is a 'bastion host' or 'jump box'?",
    "How do you handle log rotation?",
    "What uses does 'strace' or 'tcpdump' have in debugging?",
    "Explain the concept of 'sidecar' pattern.",
    "What is 'configuration drift'?",
    "How do you manage multi-cloud environments?",
    "What is 'Git flow' vs 'Trunk-based development'?",
    "Explain 'Canary Analysis'.",
    "What is a 'build artifact'?",
    "How do you implement disaster recovery (DR)?",
    "What is prometheus? How does it scrape metrics?",
    "Explain 'Ingress' vs 'Egress' traffic.",
    "What is a 'DaemonSet'?",
    "How do you harden a Linux server?",
    "What is 'automated rollback'?",
    "Explain the concept of 'idempotency' in Ansible/Terraform.",
    "What is 'provisioning' vs 'configuration'?",
    "How do you handle SSL/TLS certificate renewal automation?",
    "What is 'latency' vs 'throughput'?",
    "Explain 'Alert Fatigue' and how to avoid it."
  ],
  'Fullstack Engineer': [
    "How do you decide between SSR (Server Side Rendering) and SPA (Single Page Application)?",
    "Explain how you would architect a real-time chat application.",
    "What is the difference between SQL and NoSQL? How to choose?",
    "How do you handle Authentication (JWT vs Cookies)?",
    "Component lifecycle in React (or similar frontend framework).",
    "How to prevent N+1 query problems in backend?",
    "Explain CORS and how to configure it.",
    "What is GraphQL? Pros and Cons vs REST.",
    "How do you optimize critical rendering path?",
    "Explain the concept of Microservices vs Monolith.",
    "How do you handle state management across client and server?",
    "What is ACID compliance?",
    "Explain responsive design principles.",
    "How do you design a scalable API?",
    "What is the importance of semantic HTML?",
    "How do you implement caching (Client side vs Server side)?",
    "What are WebSockets?",
    "How do you secure user data (Encryption, Hashing)?",
    "What is docker? Why use it in development?",
    "Explain CI/CD pipeline benefits.",
    "How do you handle form validation and error reporting?",
    "What is the Virtual DOM?",
    "How do you debug a slow loading page?",
    "What is a 'race condition'?",
    "Explain the concept of 'middleware'.",
    "How do you handle file uploads?",
    "What is 'lazy loading'?",
    "Explain 'debouncing' and 'throttling'.",
    "How do you manage database migrations?",
    "What is OAuth 2.0?",
    "Explain the difference between PUT and PATCH.",
    "How do you maximize accessibility (a11y)?",
    "What is a CDN?",
    "Explain 'Eventual Consistency'.",
    "How do you handle errors in async code?",
    "What is 'Dependency Injection'?",
    "Explain 'Serverless' functions.",
    "How do you improve database query performance?",
    "What is 'Redux' or state management pattern?",
    "Explain 'Cross-Site Request Forgery' (CSRF).",
    "What is 'Unit Testing' vs 'E2E Testing'?",
    "How do you structure a large codebase?",
    "What is 'Progressive Web App' (PWA)?",
    "Explain 'Hydration' in React/Next.js.",
    "What is 'Polyfill'?",
    "How do you handle multi-language support (i18n)?",
    "What is 'Mobile First' design?",
    "Explain 'Web Web Vitals'.",
    "How do you secure API keys?",
    "What is 'Headless CMS'?"
  ]
};

export class MockQuestionBank {
  constructor() {
    this.usedQuestions = new Set();
  }

  getTopicForRole(role) {
    // Normalize role to match keys
    const r = role.toLowerCase();
    if (r.includes('frontend')) return 'Frontend Engineer';
    if (r.includes('backend')) return 'Backend Engineer';
    if (r.includes('devops') || r.includes('sre')) return 'DevOps Engineer';
    if (r.includes('fullstack')) return 'Fullstack Engineer';
    // Default
    return 'Software Engineer';
  }

  getNextQuestion(role) {
    const key = this.getTopicForRole(role);
    const questions = TECH_QUESTIONS[key] || TECH_QUESTIONS['Software Engineer'];
    
    // Filter out used questions
    const available = questions.filter(q => !this.usedQuestions.has(q));
    
    if (available.length === 0) {
      // Loop back if all used? Or just pick random used one (should ideally reset)
      // User said "Pick a random UNUSED". If all used, we must reuse or reset.
      // Let's reset purely for robustness, or just pick random from full list.
      const index = Math.floor(Math.random() * questions.length);
      return { text: questions[index] };
    }

    const index = Math.floor(Math.random() * available.length);
    const question = available[index];
    this.usedQuestions.add(question);
    
    return { text: question };
  }
}

/**
 * Simulates human-like typing stream
 * @param {string} text - Full text to stream
 * @param {function} onChunk - Callback for each chunk
 * @param {number} baseDelay - Base delay in ms
 */
export async function streamMockResponse(text, onChunk, baseDelay = 30) {
  // Split by words or small groups of chars for realistic effect
  const words = text.split(/(\s+)/); // Keep delimiters
  
  for (const word of words) {
    onChunk(word);
    
    // Calculate punctuation delay
    let delay = baseDelay;
    if (['.', '!', '?', ':'].some(char => word.includes(char))) {
      delay += 100; // Pause after sentence/clause
    } else if (word.includes(',')) {
      delay += 50;
    }
    
    // Add randomness
    delay += Math.random() * 20;

    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

export const mockQuestionBank = new MockQuestionBank();
