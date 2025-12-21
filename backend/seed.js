import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import MasteryPath from './models/MasteryPath.js';

dotenv.config();

const paths = [
  {
    title: "Industry-Aligned Training",
    slug: "universal-placement",
    description: "This program is designed to prepare engineering students for campus recruitment and entry-level professional roles by focusing on universally applicable competencies such as aptitude, logical reasoning, analytical thinking, and problem-solving. The curriculum supports students from all engineering branches and prepares them for opportunities across IT, core engineering, consulting, analytics, and research-driven roles.",
    companyTags: ["All Industries", "IT", "Core Engineering", "Consulting"],
    difficulty: "All Levels",
    salaryRange: "₹3.5-25 LPA",
    icon: "🎓",
    skills: ["Aptitude", "Reasoning", "Problem Solving", "Analytical Thinking"]
  },
  {
    title: "Universal Placement Preparation",
    slug: "placement-ready",
    description: "Develop aptitude, logical reasoning, and problem-solving skills essential for engineering placements across IT, core engineering, consulting, analytics, and R&D roles.",
    companyTags: ["TCS", "Infosys", "L&T", "Consulting Firms"],
    difficulty: "Beginner to Intermediate",
    salaryRange: "₹3.5-15 LPA",
    icon: "💼",
    skills: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Technical Fundamentals"]
  },
  {
    title: "Advanced Analytical & Coding Skills",
    slug: "analytical-coding",
    description: "Strengthen structured thinking and coding fundamentals required for technical, analytical, and emerging engineering careers—regardless of branch or background.",
    companyTags: ["Google", "Amazon", "Fractal", "Tech Startups"],
    difficulty: "Intermediate to Advanced",
    salaryRange: "₹8-45 LPA",
    icon: "💻",
    skills: ["DSA", "Problem Solving", "System Design", "Algorithmic Thinking"]
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
    await connectDB();
    
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
