import mongoose from 'mongoose';

const activitySchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  location: { type: String, default: 'India' }
}, {
  timestamps: true,
});

export default mongoose.model('Activity', activitySchema);
