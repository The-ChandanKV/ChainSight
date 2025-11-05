import { create } from "zustand";

interface Shipment {
  id: number;
  name: string;
  origin: string;
  destination: string;
  status: string;
}

interface SupplyChainState {
  shipments: Shipment[];
  addShipment: (shipment: Shipment) => void;
  updateStatus: (id: number, status: string) => void;
}

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
}));

export default useSupplyChainStore;
