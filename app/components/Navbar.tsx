import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { NotificationBell } from './NotificationSystem';
import { ThemeToggle } from './ThemeToggle';
import CommandPalette from './CommandPalette';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/ai-insights', label: 'AI Insights' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl animate-slideDown rounded-2xl max-w-5xl w-[95%] md:w-[90%]">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] transform flex items-center gap-2"
        >
          <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#logo-gradient)" />
            <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logo-gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="hidden sm:inline">ChainSight</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${isActive(link.to)
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-white hover:text-blue-300'
                }`}
            >
              <span className="relative z-10">{link.label}</span>
              {!isActive(link.to) && (
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              )}
              {isActive(link.to) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Command Palette (Desktop) */}
          <div className="hidden lg:block">
            <CommandPalette />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationBell />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-md md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="backdrop-blur-xl bg-gray-900/95 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {navLinks.map((link, index) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-6 py-4 border-b border-white/10 last:border-0 transition-all duration-300 ${isActive(link.to)
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-white hover:bg-white/5'
                }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label === 'Home' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )}
              {link.label === 'Dashboard' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
              {link.label === 'AI Insights' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
              <span className="font-medium">{link.label}</span>
              {isActive(link.to) && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
              )}
            </Link>
          ))}

          {/* Mobile Quick Actions */}
          <div className="p-4 bg-white/5">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Shipment
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/10 text-white text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
