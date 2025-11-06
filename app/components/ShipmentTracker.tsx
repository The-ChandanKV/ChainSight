import type { Shipment, ShipmentStatus } from '../store/supplyChainStore';
import SimpleMap from './SimpleMap';

interface ShipmentTrackerProps {
  shipment: Shipment;
  onAdvanceStatus: () => void;
}

const statusStages: ShipmentStatus[] = ['Created', 'In Transit', 'Out for Delivery', 'Delivered'];

const getStatusColor = (status: ShipmentStatus) => {
  switch (status) {
    case 'Created':
      return 'bg-blue-500';
    case 'In Transit':
      return 'bg-yellow-500';
    case 'Out for Delivery':
      return 'bg-orange-500';
    case 'Delivered':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getProgressPercentage = (status: ShipmentStatus) => {
  const index = statusStages.indexOf(status);
  return ((index + 1) / statusStages.length) * 100;
};

export default function ShipmentTracker({ shipment, onAdvanceStatus }: ShipmentTrackerProps) {
  const currentStatusIndex = statusStages.indexOf(shipment.status);
  const progress = getProgressPercentage(shipment.status);
  const isDelivered = shipment.status === 'Delivered';

  const handleAdvance = () => {
    console.log('Advancing status for shipment:', shipment.id);
    onAdvanceStatus();
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-blue-300 mb-1">
            {shipment.name} ({shipment.shipmentId})
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              📍 <span className="font-medium text-gray-300">{shipment.origin}</span>
            </span>
            <span className="text-blue-400">→</span>
            <span className="flex items-center gap-1">
              📍 <span className="font-medium text-gray-300">{shipment.destination}</span>
            </span>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(shipment.status)} text-white`}>
          {shipment.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">Shipment Progress</span>
          <span className="text-sm font-medium text-blue-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getStatusColor(shipment.status)} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <div className="flex justify-between items-center relative">
          {/* Connection Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700" style={{ zIndex: 0 }} />
          
          {statusStages.map((stage, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={stage} className="flex flex-col items-center relative" style={{ zIndex: 1 }}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isCompleted
                      ? `${getStatusColor(stage)} text-white shadow-lg`
                      : 'bg-gray-700 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-blue-400/50 scale-110' : ''}`}
                >
                  {isCompleted ? (
                    stage === 'Delivered' ? '✓' : index + 1
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs text-center max-w-[80px] ${isCompleted ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Visual Map */}
        <SimpleMap
          origin={shipment.origin}
          destination={shipment.destination}
          status={shipment.status}
        />

        {/* Shipment Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 h-fit">
          {shipment.eta && (
            <div>
              <p className="text-xs text-gray-400 mb-1">ETA</p>
              <p className="text-sm font-medium text-gray-200">
                {new Date(shipment.eta).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(shipment.eta).toLocaleTimeString()}
              </p>
            </div>
          )}
          {shipment.temperature && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Temperature</p>
              <p className="text-sm font-medium text-gray-200">{shipment.temperature}°C</p>
            </div>
          )}
          {shipment.condition && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Condition</p>
              <p className={`text-sm font-medium ${
                shipment.condition === 'Good' ? 'text-green-400' :
                shipment.condition === 'Fair' ? 'text-yellow-400' :
                shipment.condition === 'Poor' ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {shipment.condition}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-1">Shipment ID</p>
            <p className="text-sm font-medium text-gray-200">{shipment.shipmentId}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {!isDelivered ? (
        <button
          type="button"
          onClick={handleAdvance}
          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 999 }}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Advance to Next Stage
        </button>
      ) : (
        <div className="w-full bg-green-600/20 border-2 border-green-500 text-green-400 font-bold py-4 px-6 rounded-lg text-center">
          ✓ Shipment Delivered Successfully
        </div>
      )}
    </div>
  );
}
