import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MasteryPath from './models/MasteryPath.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sourishschemug_db_user:a4r1UIXNpZe16pRA@neuroprep-db.4lhua3l.mongodb.net/?appName=NeuroPrep-DB';

const paths = [
  {
    title: "Logic & Precision",
    slug: "logic-precision",
    description: "The essential toolkit for every engineer who values accuracy over approximation. Master the core logic and critical thinking that supports every engineering discipline, from circuits to concrete. Patterns change, but logic doesn't. Develop the problem-solving intuition that cracks exams and fixes engines alike.",
    companyTags: ["All Industries", "R&D", "Product Design", "Field Services"],
    difficulty: "All Levels",
    salaryRange: "₹3.5-25 LPA",
    icon: "🎯",
    skills: ["Critical Thinking", "Precision Engineering", "Core Logic", "Problem-Solving Intuition"]
  },
  {
    title: "Complexity Decoded",
    slug: "complexity-decoded",
    description: "Learn to navigate high-level friction, entropy, and edge cases in any system you design. Tackle the toughest problems in the industry. Whether optimizing algorithms or infrastructure, learn to build what hasn't been built yet. Go beyond the surface. Gain the deep technical expertise required to innovate, patent, and pioneer new technologies.",
    companyTags: ["Product Companies", "R&D Labs", "Innovation Centers", "Patents"],
    difficulty: "Intermediate to Expert",
    salaryRange: "₹8-45 LPA",
    icon: "🧩",
    skills: ["System Design", "Edge Case Analysis", "Deep Tech", "Innovation"]
  },
  {
    title: "Total Versatility",
    slug: "total-versatility",
    description: "Prepare for a dynamic future. Equip yourself to work in R&D, operations, product design, or field services. Be the engineer who thrives anywhere. Gain the versatility to design products, manage services, and solve real-world crises. Don't just fit a job description. Prepare for a career that bridges the gap between abstract theory and tangible human impact.",
    companyTags: ["Any Industry", "Operations", "Product Design", "Crisis Management"],
    difficulty: "All Levels",
    salaryRange: "₹4-30 LPA",
    icon: "🌐",
    skills: ["Adaptive Engineering", "Versatility", "Impact-Driven", "Real-World Problem Solving"]
  },
  {
    title: "Career-Ready Skill Development",
    slug: "transferable-skills",
    description: "Build transferable, job-ready skills that employers value across product-based, service-based, and multidisciplinary engineering roles.",
    companyTags: ["Product Companies", "Service Companies", "Startups", "MNCs"],
    difficulty: "All Levels",
    salaryRange: "₹4-30 LPA",
    icon: "🚀",
    skills: ["Communication", "Teamwork", "Adaptability", "Professional Skills"]
  },
  {
    title: "Startup Specialist",
    slug: "startup-specialist",
    description: "Full-stack expertise for fast-paced startup environments with modern tech stacks",
    companyTags: ["Razorpay", "CRED", "Swiggy", "Zomato"],
    difficulty: "Intermediate",
    salaryRange: "₹12-30 LPA",
    icon: "⚡",
    skills: ["React", "Node.js", "MongoDB", "DevOps"]
  },
  {
    title: "Quantitative Finance",
    slug: "quantitative-finance",
    description: "High-frequency trading and quantitative roles requiring strong mathematical and coding skills",
    companyTags: ["Tower Research", "Optiver", "Deutsche Bank", "Goldman Sachs"],
    difficulty: "Expert",
    salaryRange: "₹25-60 LPA",
    icon: "📊",
    skills: ["Probability", "C++", "Algorithms", "Math"]
  },
  {
    title: "Mechanical Engineering",
    slug: "mechanical",
    description: "Core mechanical roles in design, manufacturing, thermal, and automotive sectors",
    companyTags: ["L&T", "Tata Motors", "Mahindra", "Ashok Leyland"],
    difficulty: "All Levels",
    salaryRange: "₹4-15 LPA",
    icon: "⚙️",
    skills: ["CAD/CAM", "Thermodynamics", "Machine Design", "Manufacturing"]
  },
  {
    title: "Civil Engineering",
    slug: "civil",
    description: "Structural design, construction management, and infrastructure development roles",
    companyTags: ["L&T Construction", "Afcons", "Shapoorji", "GMR"],
    difficulty: "All Levels",
    salaryRange: "₹3.5-12 LPA",
    icon: "🏗️",
    skills: ["RCC Design", "Structural Analysis", "Surveying", "Construction Mgmt"]
  },
  {
    title: "Electrical Engineering",
    slug: "electrical",
    description: "Power systems, control engineering, and automation roles in energy sector",
    companyTags: ["Tata Power", "NTPC", "ABB", "Siemens"],
    difficulty: "All Levels",
    salaryRange: "₹4-14 LPA",
    icon: "⚡",
    skills: ["Power Systems", "Control Systems", "Machines", "Automation"]
  },
  {
    title: "Data & ML Engineering",
    slug: "data-ml",
    description: "Data science, machine learning, and AI roles in analytics companies",
    companyTags: ["Fractal", "Mu Sigma", "Tiger Analytics", "LatentView"],
    difficulty: "Intermediate",
    salaryRange: "₹8-25 LPA",
    icon: "🤖",
    skills: ["Python", "ML", "Deep Learning", "Big Data"]
  },
  {
    title: "DevOps & SRE",
    slug: "devops-sre",
    description: "Cloud infrastructure, reliability engineering, and automation for fintech companies",
    companyTags: ["Zerodha", "PhonePe", "Paytm", "Razorpay"],
    difficulty: "Intermediate",
    salaryRange: "₹10-28 LPA",
    icon: "☁️",
    skills: ["Kubernetes", "AWS", "CI/CD", "Monitoring"]
  },
  {
    title: "Mobile Development",
    slug: "mobile",
    description: "Native and cross-platform mobile app development for consumer tech companies",
    companyTags: ["Ola", "Myntra", "CRED", "PhonePe"],
    difficulty: "Intermediate",
    salaryRange: "₹8-22 LPA",
    icon: "📱",
    skills: ["Kotlin", "Swift", "React Native", "Flutter"]
  },
  {
    title: "GATE & PSU Preparation",
    slug: "gate-psu",
    description: "Comprehensive GATE, ESE, and PSU exam preparation for all engineering branches",
    companyTags: ["ISRO", "DRDO", "BHEL", "NTPC"],
    difficulty: "All Levels",
    salaryRange: "₹6-18 LPA",
    icon: "🏛️",
    skills: ["GATE Syllabus", "ESE Pattern", "Technical Core", "GA"]
  }
];

const seedDB = async () => {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    
    try {
        await MasteryPath.deleteMany({});
        await MasteryPath.insertMany(paths);
        console.log('Mastery Paths Seeded Successfully');
    } catch (error) {
        console.error('Seed Error:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedDB();
