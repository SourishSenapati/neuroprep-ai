import mongoose from 'mongoose';

const masteryPathSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  companyTags: [{ type: String }],
  difficulty: { type: String },
  salaryRange: { type: String },
  icon: { type: String },
  skills: [{ type: String }]
}, {
  timestamps: true,
});

export default mongoose.model('MasteryPath', masteryPathSchema);
