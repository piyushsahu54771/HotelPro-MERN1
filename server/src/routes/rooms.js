import { Router } from 'express';
import Room from '../models/Room.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = { active: true };
    if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };
    if (req.query.maxPrice) filter.price = { $lte: Number(req.query.maxPrice) };
    if (req.query.guests) filter.capacity = { $gte: Number(req.query.guests) };
    const rooms = await Room.find(filter).sort({ rating: -1 });
    res.json({ rooms });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id, active: true });
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    res.json({ room });
  } catch (e) { next(e); }
});
export default router;
