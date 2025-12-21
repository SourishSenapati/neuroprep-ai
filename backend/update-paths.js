import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://sourishschemug_db_user:a4r1UIXNpZe16pRA@neuroprep-db.4lhua3l.mongodb.net/?appName=NeuroPrep-DB';

const MasteryPathSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  companyTags: [String],
  difficulty: String,
  salaryRange: String,
  icon: String,
  skills: [String]
});

const MasteryPath = mongoose.model('MasteryPath', MasteryPathSchema);

const newPaths = [
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
  }
];

async function updateDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Delete old paths with TCS/Infosys/Product mentions
    await MasteryPath.deleteMany({
      slug: { $in: ['universal-placement', 'placement-ready', 'analytical-coding', 'tcs-nqt', 'infosys-specialist', 'product-engineer'] }
    });
    console.log('Deleted old paths');
    
    // Insert new paths
    await MasteryPath.insertMany(newPaths);
    console.log('Inserted new universal engineering paths');
    
    console.log('Database updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateDatabase();
