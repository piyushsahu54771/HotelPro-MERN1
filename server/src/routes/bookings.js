import { Router } from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.post('/', async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests, guestName, guestPhone } = req.body;
    const start = new Date(checkIn), end = new Date(checkOut), now = new Date();
    if (!roomId || !checkIn || !checkOut || !guestName?.trim()) return res.status(400).json({ message: 'Complete all required booking fields.' });
    if (Number.isNaN(+start) || Number.isNaN(+end) || start < new Date(now.toDateString()) || end <= start) return res.status(400).json({ message: 'Choose valid future check-in and check-out dates.' });
    const room = await Room.findOne({ _id: roomId, active: true });
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    const guestCount = Number(guests || 1);
    if (guestCount < 1 || guestCount > room.capacity) return res.status(400).json({ message: `This room supports up to ${room.capacity} guests.` });
    const conflict = await Booking.findOne({ room: roomId, status: { $ne: 'cancelled' }, checkIn: { $lt: end }, checkOut: { $gt: start } });
    if (conflict) return res.status(409).json({ message: 'This room is not available for those dates.' });
    const nights = Math.ceil((end - start) / 86400000);
    const booking = await Booking.create({ user: req.user._id, room: room._id, checkIn: start, checkOut: end, guests: guestCount, totalAmount: nights * room.price, guestName: guestName.trim(), guestPhone });
    res.status(201).json({ booking: await booking.populate('room'), message: 'Booking created successfully.' });
  } catch (e) { next(e); }
});
router.get('/my', async (req, res, next) => {
  try { res.json({ bookings: await Booking.find({ user: req.user._id }).populate('room').sort({ createdAt: -1 }) }); }
  catch (e) { next(e); }
});
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (booking.checkIn <= new Date()) return res.status(400).json({ message: 'A booking cannot be cancelled after check-in begins.' });
    booking.status = 'cancelled'; await booking.save(); res.json({ booking, message: 'Booking cancelled.' });
  } catch (e) { next(e); }
});
export default router;
