
// Local Knowlege Base "Weights" for the Offline Neural Core
// Structured as: Content -> Embedding (simulated or pre-calculated) -> Response Concepts

export const INTERVIEW_CONCEPTS: Record<string, { patterns: string[], responses: string[], followups: string[] }> = {
    "scalability": {
        patterns: ["scale", "scaling", "high traffic", "load balancer", "millions of users", "throughput", "latency"],
        responses: [
            "Scalability is indeed the cornerstone of modern distribute systems.",
            "Handling high concurrency requires a robust architectural strategy.",
            "Vertical scaling has limits; horizontal is usually the path forward."
        ],
        followups: [
            "How would you handle the 'thundering herd' problem in this scenario?",
            "What specific database sharding strategy would you employ here?",
            "How does your caching strategy impact the overall system consistency?"
        ]
    },
    "database": {
        patterns: ["sql", "nosql", "database", "mongo", "postgres", "acid", "cap theorem", "sharding", "replication"],
        responses: [
            "The data layer is often the bottleneck. Good choice focusing on that.",
            "Data consistency vs. availability is the classic trade-off here.",
            "Persistence durability is key for financial or critical data."
        ],
        followups: [
            "In the event of a network partition, how does your system recover?",
            "Would you choose eventual consistency or strong consistency for this feature, and why?",
            "How do you handle schema migrations with zero downtime?"
        ]
    },
    "security": {
        patterns: ["auth", "security", "oauth", "encryption", "hashing", "salt", "https", "attack", "ddos"],
        responses: [
            "Security cannot be an afterthought; it must be baked in.",
            "Zero-trust architecture is becoming the industry standard.",
            "Protecting user data is paramount."
        ],
        followups: [
            "How would you secure the inter-service communication in this microservices mesh?",
            "What is your strategy for handling secrets management in production?",
            "How do you mitigate against sophisticated SQL injection or XSS attacks here?"
        ]
    },
    "frontend": {
        patterns: ["react", "component", "state", "redux", "css", "dom", "rendering", "paint", "vital"],
        responses: [
            "Client-side performance directly correlates to user retention.",
            "Managing state in large applications is a non-trivial engineering challenge.",
            "The critical rendering path must be optimized."
        ],
        followups: [
             "How do you prevent unnecessary re-renders in a complex component tree?",
             "What strategy do you use for code-splitting to minimize initial bundle size?",
             "How would you handle offline-first capabilities for this application?"
        ]
    },
    "behavioral_conflict": {
        patterns: ["conflict", "disagreement", "team", "argument", "different opinion", "clash", "manager"],
        responses: [
            "Conflicts are inevitable in healthy engineering teams.",
            "Navigating interpersonal friction shows emotional intelligence.",
            "It's important to separate ideas from egos."
        ],
        followups: [
            "How did you ensure the relationship remained constructive after the resolution?",
            "Looking back, would you have handled that situation differently?",
            "How do you handle a teammate who is consistently underperforming?"
        ]
    },
    "behavioral_failure": {
        patterns: ["fail", "failure", "mistake", "error", "bug", "outage", "production incident"],
        responses: [
            "Failure is often the best teacher in engineering.",
            "A blameless post-mortem culture is vital for growth.",
            "Ownership involves admitting mistakes early and fixing them."
        ],
        followups: [
            "What specific process change did you implement to prevent recurrence?",
            "How did you communicate this incident to stakeholders?",
            "Tell me about a time you took a calculated risk that didn't pay off."
        ]
    },
    "testing": {
        patterns: ["test", "unit test", "integration", "e2e", "qa", "coverage", "mock", "stub", "tdd"],
        responses: [
            "Tests are the documentation that never lies.",
            "High coverage doesn't always equal high quality, but it's a good start.",
            "Shift-left testing reduces the cost of bugs significantly."
        ],
        followups: [
            "What is your philosophy on mocking vs. using real dependencies in tests?",
            "How do you handle flaky tests in your CI/CD pipeline?",
            "Describe a time when a test saved you from a critical regression."
        ]
    },
    "microservices": {
        patterns: ["microservice", "monolith", "service", "grpc", "message queue", "kafka", "rabbitmq", "event driven"],
        responses: [
            "Microservices solve organizational scaling issues but introduce operational complexity.",
            "Distributed tracing becomes non-negotiable in this architecture.",
            "Event-driven architecture decouples services effectively."
        ],
        followups: [
            "How do you handle distributed transactions (Sagas vs 2PC)?",
            "What criteria do you use to split a monolith into services?",
            "How do you manage data consistency across boundaries?"
        ]
    },
    "api_design": {
        patterns: ["api", "rest", "graphql", "endpoint", "status code", "idempotency", "versioning", "json"],
        responses: [
            "A well-designed API is intuitive and predictable.",
            "GraphQL offers flexibility but requires careful query complexity management.",
            "Idempotency is crucial for reliable payment or state-changing APIs."
        ],
        followups: [
            "How do you handle API versioning without breaking existing clients?",
            "When would you choose gRPC over REST related to performance?",
            "How do you design for pagination in a high-volume dataset?"
        ]
    },
    "generic": {
        patterns: [],
        responses: [
            "That's a valid perspective. Let's dig deeper.",
            "I see where you're coming from. Elaborate on the impact.",
            "Interesting approach. How does that scale?",
            "Good point. But what about the edge cases?"
        ],
        followups: [
            "Could you elaborate on the trade-offs of that decision?",
            "What was the most challenging part of implementing that?",
            "How would you explain this to a non-technical stakeholder?",
            "What alternatives did you consider before choosing this path?"
        ]
    }
};

export const SYSTEM_PROMPTS = {
   intro: "Welcome. I am the Offline Neural Core. While our cloud uplinks are recalibrating, I will be conducting your assessment locally. Let's begin. Tell me about a challenging engineering problem you solved recently.",
   error: "Neural link unstable. Let's pivot. What are your core strengths as an engineer?"
}
