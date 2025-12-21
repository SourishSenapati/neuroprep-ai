import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/auth/sync
// @desc    Sync Firebase User with MongoDB
router.post('/sync', async (req, res) => {
  const { uid, email, name } = req.body;

  try {
    let user = await User.findById(uid);

    if (!user) {
      // Create new user if they don't exist
      user = new User({
        _id: uid, // Use Firebase UID
        name: name || "Anonymous User",
        email: email,
        stats: { xp: 0, level: 1, streak: 0 },
        isPro: false
      });
      await user.save();
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
