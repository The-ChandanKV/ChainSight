import { create } from "zustand";
import axios from "axios";

export type ShipmentStatus = 'Created' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export interface Shipment {
  id: string; // Changed from number to string for MongoDB ObjectId
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

interface SupplyChainState {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
  fetchShipments: () => Promise<void>;
  addShipment: (shipment: Omit<Shipment, 'id'>) => Promise<void>;
  updateStatus: (id: string, status: ShipmentStatus) => Promise<void>; // Changed id to string
  advanceStatus: (id: string) => Promise<void>; // Changed id to string
}

const statusOrder: ShipmentStatus[] = ['Created', 'In Transit', 'Out for Delivery', 'Delivered'];

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

const useSupplyChainStore = create<SupplyChainState>((set, get) => ({
  shipments: [],
  loading: false,
  error: null,

  fetchShipments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shipments`);
      set({ shipments: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
      set({ error: 'Failed to fetch shipments', loading: false });
    }
  },

  addShipment: async (shipmentData) => {
    console.log('Adding shipment:', shipmentData);
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/shipments`, shipmentData);
      console.log('API response:', response.data);
      set((state) => {
        const newShipments = [response.data, ...state.shipments];
        console.log('New shipments array:', newShipments);
        return {
          shipments: newShipments,
          loading: false
        };
      });
    } catch (error) {
      console.error('Failed to add shipment:', error);
      set({ error: 'Failed to add shipment', loading: false });
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/shipments/${id}/status`, { status });
      set((state) => ({
        shipments: state.shipments.map((s) =>
          s.id === id ? response.data : s
        ),
      }));
    } catch (error) {
      console.error('Failed to update shipment status:', error);
      set({ error: 'Failed to update shipment status' });
    }
  },

  advanceStatus: async (id) => {
    const { shipments, updateStatus } = get();
    const shipment = shipments.find((s) => s.id === id);
    if (!shipment) return;

    const currentIndex = statusOrder.indexOf(shipment.status);
    const nextIndex = Math.min(currentIndex + 1, statusOrder.length - 1);
    const nextStatus = statusOrder[nextIndex];

    await updateStatus(id, nextStatus);
  },
}));

export default useSupplyChainStore;
