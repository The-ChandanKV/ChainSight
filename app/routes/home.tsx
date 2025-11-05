import { Link } from "react-router";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="p-8">
        <h2 className="text-3xl font-semibold mb-4">Welcome to ChainSight</h2>
        <p className="text-gray-400 mb-6">
          Real-time blockchain-based supply chain visualization and AI analytics.
        </p>
        <Link
          to="/dashboard"
          className="bg-blue-600 px-6 py-3 rounded text-white hover:bg-blue-500 inline-block"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
