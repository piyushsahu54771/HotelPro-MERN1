import { Router } from 'express';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.use(protect, adminOnly);
router.get('/stats', async (_req, res, next) => {
  try {
    const [rooms, bookings, customers, revenue] = await Promise.all([
      Room.countDocuments(), Booking.countDocuments({ status: { $ne: 'cancelled' } }), User.countDocuments({ role: 'guest' }),
      Booking.aggregate([{ $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);
    res.json({ rooms, bookings, customers, revenue: revenue[0]?.total || 0 });
  } catch (e) { next(e); }
});
router.get('/bookings', async (_req, res, next) => {
  try { res.json({ bookings: await Booking.find().populate('room user', 'name email hotel city').sort({ createdAt: -1 }) }); }
  catch (e) { next(e); }
});
router.patch('/bookings/:id', async (req, res, next) => {
  try {
    const allowed = ['pending', 'confirmed', 'cancelled'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid booking status.' });
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('room user', 'name email hotel city');
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ booking });
  } catch (e) { next(e); }
});
router.post('/rooms', async (req, res, next) => {
  try {
    const { name, hotel, city, price } = req.body;
    if (!name || !hotel || !city || !Number(price)) return res.status(400).json({ message: 'Name, hotel, city and price are required.' });
    res.status(201).json({ room: await Room.create(req.body) });
  } catch (e) { next(e); }
});
router.patch('/rooms/:id', async (req, res, next) => {
  try { const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!room) return res.status(404).json({ message: 'Room not found.' }); res.json({ room }); }
  catch (e) { next(e); }
});
router.delete('/rooms/:id', async (req, res, next) => {
  try { const room = await Room.findByIdAndUpdate(req.params.id, { active: false }, { new: true }); if (!room) return res.status(404).json({ message: 'Room not found.' }); res.json({ message: 'Room hidden from public listings.' }); }
  catch (e) { next(e); }
});
export default router;
