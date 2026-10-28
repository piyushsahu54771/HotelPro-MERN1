import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import Room from './models/Room.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'HotelPro API' }));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const port = process.env.PORT || 5000;
try {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro');
  if (await Room.countDocuments() === 0) {
    await Room.insertMany([
      { name: 'Deluxe City View', hotel: 'The Grand Palace', city: 'Mumbai', price: 4999, rating: 4.8, capacity: 2, beds: 1, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80', description: 'A peaceful, spacious room with elegant interiors, a plush king bed and beautiful city views.', amenities: ['Free Wi-Fi', 'Breakfast', 'Air conditioning'] },
      { name: 'Ocean Suite', hotel: 'Ocean View Resort', city: 'Goa', price: 6499, rating: 4.9, capacity: 3, beds: 2, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', description: 'Wake up to coastal views in this light-filled suite, designed for a relaxing escape.', amenities: ['Sea view', 'Pool access', 'Breakfast'] },
      { name: 'Mountain Retreat', hotel: 'Mountain Bliss', city: 'Manali', price: 3999, rating: 4.7, capacity: 2, beds: 1, image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80', description: 'A cozy hideaway with warm finishes, fresh mountain air and scenic surroundings.', amenities: ['Mountain view', 'Free Wi-Fi', 'Heating'] },
      { name: 'Premium King Room', hotel: 'City Lights Hotel', city: 'Bengaluru', price: 3499, rating: 4.6, capacity: 2, beds: 1, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80', description: 'Contemporary comfort with premium bedding, thoughtful details and easy city access.', amenities: ['Free Wi-Fi', 'Workspace', 'Room service'] },
      { name: 'Garden Family Room', hotel: 'Palm Garden Stay', city: 'Jaipur', price: 4299, rating: 4.7, capacity: 4, beds: 2, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', description: 'A bright family room with generous space and a calm garden-facing setting.', amenities: ['Garden view', 'Breakfast', 'Family friendly'] },
      { name: 'Executive Studio', hotel: 'The Urban House', city: 'Delhi', price: 5299, rating: 4.8, capacity: 2, beds: 1, image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80', description: 'A polished studio for business and leisure with a work area and modern amenities.', amenities: ['Workspace', 'Free Wi-Fi', 'Coffee maker'] }
    ]);
    console.log('Inserted starter room listings.');
  }
  app.listen(port, () => console.log(`HotelPro API listening on ${port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
