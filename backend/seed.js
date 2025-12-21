import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import MasteryPath from './models/MasteryPath.js';

dotenv.config();

const paths = [
  {
    title: "TCS NQT Mastery",
    slug: "tcs-nqt",
    description: "Master the TCS National Qualifier Test pattern with focused preparation for mass recruitment drives",
    companyTags: ["TCS", "Infosys", "Wipro", "Cognizant"],
    difficulty: "Beginner",
    salaryRange: "₹3.5-5 LPA",
    icon: "🎓",
    skills: ["Aptitude", "Reasoning", "Coding", "Verbal"]
  },
  {
    title: "Infosys Specialist",
    slug: "infosys-specialist",
    description: "Crack Infosys HackWithInfy and Power Programmer with advanced DSA and problem-solving skills",
    companyTags: ["Infosys", "HCL", "Tech Mahindra", "Wipro"],
    difficulty: "Intermediate",
    salaryRange: "₹7-12 LPA",
    icon: "💻",
    skills: ["DSA", "Problem Solving", "System Design", "OOP"]
  },
  {
    title: "Product Engineer",
    slug: "product-engineer",
    description: "Comprehensive preparation for product-based companies with focus on system design and scalability",
    companyTags: ["Amazon", "Flipkart", "Google", "Microsoft"],
    difficulty: "Advanced",
    salaryRange: "₹15-45 LPA",
    icon: "🚀",
    skills: ["System Design", "DSA", "Behavioral", "Architecture"]
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
