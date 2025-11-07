import { useState, useEffect } from 'react';
import useSupplyChainStore from "../store/supplyChainStore";
import AddShipmentModal from './AddShipmentModal';
import ShipmentTracker from './ShipmentTracker';

export default function Dashboard() {
  const { shipments, addShipment, advanceStatus, fetchShipments, loading, error } = useSupplyChainStore();
  
  console.log('Dashboard shipments:', shipments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const onClickAddShipment = () => {
    console.log('Opening Add Shipment Modal', isModalOpen);
    setIsModalOpen(true);
  }

  const handleAddShipment = async (formData: any) => {
    await addShipment({
      shipmentId: formData.shipmentId,
      name: `Shipment ${formData.shipmentId}`,
      origin: formData.origin,
      destination: formData.destination,
      status: formData.status,
      eta: formData.eta || undefined,
      temperature: formData.temperature || undefined,
      condition: formData.condition || undefined,
    });
    setIsModalOpen(false);
  };

  const testAdvance = (id: string) => {
    console.log('TEST: Advancing shipment', id);
    advanceStatus(id);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Shipment Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Supply Chain Dashboard
        </h2>
        <button
          onClick={() => onClickAddShipment()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Shipment
        </button>
      </div>

      {/* Shipments List */}
      {shipments.length === 0 ? (
        <div className="glass-dark p-12 rounded-xl text-center border border-white/10">
          <div className="mb-4">
            <svg className="w-20 h-20 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-400 text-xl mb-2">No shipments yet</p>
          <p className="text-gray-500 mb-6">Click "Add Shipment" to create your first shipment and start tracking!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Shipment
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {shipments.map((shipment, index) => (
            <div
              key={shipment.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ShipmentTracker
                shipment={shipment}
                onAdvanceStatus={() => advanceStatus(shipment.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Shipment Modal */}
      {isModalOpen&&<AddShipmentModal
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddShipment}
      />}
    </div>
  );
}