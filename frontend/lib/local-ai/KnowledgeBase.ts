
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
    "generic": {
        patterns: [],
        responses: [
            "That's a valid perspective.",
            "I see where you're coming from.",
            "Interesting approach."
        ],
        followups: [
            "Could you elaborate on the trade-offs of that decision?",
            "What was the most challenging part of implementing that?",
            "How would you explain this to a non-technical stakeholder?"
        ]
    }
};

export const SYSTEM_PROMPTS = {
   intro: "Welcome. I am the Offline Neural Core. While our cloud uplinks are recalibrating, I will be conducting your assessment locally. Let's begin. Tell me about a challenging engineering problem you solved recently.",
   error: "Neural link unstable. Let's pivot. What are your core strengths as an engineer?"
}
