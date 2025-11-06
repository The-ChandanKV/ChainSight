import { create } from "zustand";

export type ShipmentStatus = 'Created' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export interface Shipment {
  id: number;
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
  addShipment: (shipment: Shipment) => void;
  updateStatus: (id: number, status: ShipmentStatus) => void;
  advanceStatus: (id: number) => void;
}

const statusOrder: ShipmentStatus[] = ['Created', 'In Transit', 'Out for Delivery', 'Delivered'];

const useSupplyChainStore = create<SupplyChainState>((set) => ({
  shipments: [],
  addShipment: (shipment) =>
    set((state) => ({ shipments: [...state.shipments, shipment] })),
  updateStatus: (id, status) =>
    set((state) => ({
      shipments: state.shipments.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    })),
  advanceStatus: (id) =>
    set((state) => ({
      shipments: state.shipments.map((s) => {
        if (s.id === id) {
          const currentIndex = statusOrder.indexOf(s.status);
          const nextIndex = Math.min(currentIndex + 1, statusOrder.length - 1);
          return { ...s, status: statusOrder[nextIndex] };
        }
        return s;
      }),
    })),
}));

export default useSupplyChainStore;
