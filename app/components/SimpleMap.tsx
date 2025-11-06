interface SimpleMapProps {
  origin: string;
  destination: string;
  status: string;
}

export default function SimpleMap({ origin, destination, status }: SimpleMapProps) {
  // Mock coordinates for Indian cities
  const cityCoords: Record<string, { x: number; y: number }> = {
    'Mumbai': { x: 20, y: 50 },
    'Delhi': { x: 50, y: 20 },
    'Bangalore': { x: 30, y: 70 },
    'Chennai': { x: 45, y: 75 },
    'Kolkata': { x: 70, y: 40 },
    'Hyderabad': { x: 40, y: 60 },
    'Pune': { x: 25, y: 55 },
    'Ahmedabad': { x: 15, y: 35 },
    'Jaipur': { x: 35, y: 25 },
    'Lucknow': { x: 55, y: 30 },
  };

  const getCoords = (city: string) => {
    const normalized = Object.keys(cityCoords).find(
      key => key.toLowerCase() === city.toLowerCase()
    );
    return normalized ? cityCoords[normalized] : { x: 50, y: 50 };
  };

  const originCoords = getCoords(origin);
  const destinationCoords = getCoords(destination);

  // Calculate progress position based on status
  const getProgress = () => {
    switch (status) {
      case 'Created': return 0;
      case 'In Transit': return 0.5;
      case 'Out for Delivery': return 0.8;
      case 'Delivered': return 1;
      default: return 0;
    }
  };

  const progress = getProgress();
  const currentX = originCoords.x + (destinationCoords.x - originCoords.x) * progress;
  const currentY = originCoords.y + (destinationCoords.y - originCoords.y) * progress;

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
      <h4 className="text-sm font-medium text-gray-400 mb-3">Route Visualization</h4>
      <svg viewBox="0 0 100 100" className="w-full h-48 bg-gray-800/30 rounded-lg">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Route line */}
        <line
          x1={originCoords.x}
          y1={originCoords.y}
          x2={destinationCoords.x}
          y2={destinationCoords.y}
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth="2"
          strokeDasharray="4 2"
        />

        {/* Progress line */}
        <line
          x1={originCoords.x}
          y1={originCoords.y}
          x2={currentX}
          y2={currentY}
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />

        {/* Origin marker */}
        <circle
          cx={originCoords.x}
          cy={originCoords.y}
          r="3"
          fill="rgb(34, 197, 94)"
          stroke="white"
          strokeWidth="1"
        />
        <text
          x={originCoords.x}
          y={originCoords.y - 5}
          fontSize="4"
          fill="white"
          textAnchor="middle"
          className="font-semibold"
        >
          {origin}
        </text>

        {/* Destination marker */}
        <circle
          cx={destinationCoords.x}
          cy={destinationCoords.y}
          r="3"
          fill="rgb(239, 68, 68)"
          stroke="white"
          strokeWidth="1"
        />
        <text
          x={destinationCoords.x}
          y={destinationCoords.y - 5}
          fontSize="4"
          fill="white"
          textAnchor="middle"
          className="font-semibold"
        >
          {destination}
        </text>

        {/* Current position (animated truck) */}
        {progress < 1 && (
          <>
            <circle
              cx={currentX}
              cy={currentY}
              r="2.5"
              fill="rgb(234, 179, 8)"
              className="animate-pulse"
            />
            <text
              x={currentX}
              y={currentY + 6}
              fontSize="6"
              textAnchor="middle"
            >
              🚚
            </text>
          </>
        )}

        {/* Delivered checkmark */}
        {progress === 1 && (
          <text
            x={destinationCoords.x}
            y={destinationCoords.y + 6}
            fontSize="6"
            textAnchor="middle"
          >
            ✓
          </text>
        )}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>🟢 Origin</span>
        <span>🔴 Destination</span>
      </div>
    </div>
  );
}
