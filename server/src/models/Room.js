import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hotel: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80' },
  price: { type: Number, required: true, min: 1 },
  capacity: { type: Number, default: 2 },
  beds: { type: Number, default: 1 },
  rating: { type: Number, default: 4.5 },
  amenities: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Room', roomSchema);
