import type { Route } from "./+types/dashboard";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - ChainSight" },
    { name: "description", content: "Supply Chain Dashboard" },
  ];
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="p-8 pt-28">        
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
