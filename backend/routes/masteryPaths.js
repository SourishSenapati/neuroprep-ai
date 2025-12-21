import express from 'express';
import MasteryPath from '../models/MasteryPath.js';

const router = express.Router();

// @route   GET /api/mastery-paths
// @desc    Get all mastery paths
router.get('/', async (req, res) => {
  try {
    const paths = await MasteryPath.find({});
    res.json(paths);
  } catch (error) {
    console.error('Error fetching mastery paths:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
