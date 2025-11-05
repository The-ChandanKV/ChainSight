import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl animate-slideDown rounded-2xl max-w-4xl w-[90%]">
      <Link 
        to="/" 
        className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] transform perspective-1000"
      >
        ChainSight
      </Link>
      <div className="flex items-center space-x-6">
        <Link 
          to="/" 
          className="relative px-4 py-2 text-white hover:text-blue-300 transition-all duration-300 group"
        >
          <span className="relative z-10">Home</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
        </Link>
        <Link 
          to="/dashboard" 
          className="relative px-4 py-2 text-white hover:text-blue-300 transition-all duration-300 group"
        >
          <span className="relative z-10">Dashboard</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
        </Link>
        <a 
          href="#" 
          className="relative px-4 py-2 text-white hover:text-blue-300 transition-all duration-300 group"
        >
          <span className="relative z-10">AI Insights</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
        </a>
      </div>
    </nav>
  );
}
