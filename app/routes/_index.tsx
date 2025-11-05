import { Link } from "react-router";
import Navbar from "../components/Navbar";

export default function Index() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/Live.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-400 drop-shadow-lg animate-fadeInUp animate-float">
            Welcome to ChainSight
          </h1>
          <p className="text-gray-200 max-w-2xl text-lg md:text-xl drop-shadow-md animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Blockchain-powered AI-driven Supply Chain Tracker — visualizing logistics with transparency & intelligence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/dashboard"
              className="relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden group transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-600 transition-all duration-300"></span>
              <span className="relative z-10 flex items-center gap-2">
                Go to Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
          
          {/* Floating Cards with Glass Effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <div className="glass p-6 rounded-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="text-xl font-bold text-blue-300 mb-2">Blockchain</h3>
              <p className="text-gray-300 text-sm">Immutable tracking with distributed ledger technology</p>
            </div>
            <div className="glass p-6 rounded-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-bold text-blue-300 mb-2">AI Analytics</h3>
              <p className="text-gray-300 text-sm">Smart insights powered by machine learning</p>
            </div>
            <div className="glass p-6 rounded-xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-blue-300 mb-2">Real-time Data</h3>
              <p className="text-gray-300 text-sm">Live visualization of supply chain metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
