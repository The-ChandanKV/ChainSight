import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chainsight';

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export type ShipmentStatus = 'Created' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export interface IShipment {
  _id?: string;
  shipmentId: string;
  name: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta?: string;
  temperature?: string;
  condition?: string;
  originCoords?: [number, number];
  destinationCoords?: [number, number];
  currentProgress?: number;
}

const shipmentSchema = new mongoose.Schema<IShipment>({
  shipmentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['Created', 'In Transit', 'Out for Delivery', 'Delivered'],
    default: 'Created'
  },
  eta: String,
  temperature: String,
  condition: String,
  originCoords: [Number],
  destinationCoords: [Number],
  currentProgress: Number,
}, {
  timestamps: true
});

export const ShipmentModel = mongoose.model<IShipment>('Shipment', shipmentSchema);
