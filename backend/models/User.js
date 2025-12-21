import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Firebase UID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  stats: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 }
  },
  isPro: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
