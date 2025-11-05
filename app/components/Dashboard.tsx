import useSupplyChainStore from "../store/supplyChainStore";

export default function Dashboard() {
  const { shipments, addShipment, updateStatus } = useSupplyChainStore();

  const handleAdd = () => {
    const id = Date.now();
    addShipment({
      id,
      name: `Shipment ${id}`,
      origin: "Bangalore",
      destination: "Mumbai",
      status: "In Transit",
    });
  };

  return (
    <div className="glass-dark p-6 rounded-xl shadow-2xl mt-6 border border-white/10">
      <button
        onClick={handleAdd}
        className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
      >
        ✨ Add Dummy Shipment
      </button>

      {shipments.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No shipments yet. Add one to get started!</p>
      ) : (
        <ul className="space-y-4">
          {shipments.map((s, index) => (
            <li
              key={s.id}
              className="glass p-4 rounded-lg flex justify-between items-center transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div>
                <p className="font-semibold text-lg text-blue-300">{s.name}</p>
                <p className="text-sm text-gray-300 mt-1 flex items-center gap-2">
                  <span>📍 {s.origin}</span>
                  <span className="text-blue-400">→</span>
                  <span>📍 {s.destination}</span>
                </p>
              </div>
              <button
                onClick={() =>
                  updateStatus(
                    s.id,
                    s.status === "In Transit" ? "Delivered" : "In Transit"
                  )
                }
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-110 ${
                  s.status === "Delivered"
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-yellow-600 hover:bg-yellow-500"
                }`}
              >
                {s.status === "Delivered" ? "✓ " : "🚚 "}
                {s.status}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
