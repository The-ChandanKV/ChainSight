import { Link } from "react-router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: '🔗',
    title: 'Blockchain Security',
    description: 'Immutable tracking with Ethereum/Polygon smart contracts',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🤖',
    title: 'AI Analytics',
    description: 'ML-powered delay predictions with 94%+ accuracy',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '📊',
    title: 'Real-time Data',
    description: 'Live visualization of supply chain metrics',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: '🌍',
    title: 'Global Tracking',
    description: 'Monitor shipments worldwide in real-time',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    description: 'Instant notifications for delays and anomalies',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: '📈',
    title: 'Risk Analysis',
    description: 'Comprehensive risk scoring for every shipment',
    color: 'from-indigo-500 to-blue-500',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '50K+', label: 'Shipments Tracked' },
  { value: '94.2%', label: 'Prediction Accuracy' },
  { value: '<100ms', label: 'Response Time' },
];

const testimonials = [
  {
    quote: "ChainSight transformed our supply chain visibility. We now predict delays before they happen.",
    author: "Sarah Chen",
    role: "VP Operations, TechCorp",
    avatar: "👩‍💼",
  },
  {
    quote: "The blockchain integration gives our clients unmatched trust and transparency.",
    author: "Michael Roberts",
    role: "CEO, LogiFlow",
    avatar: "👨‍💼",
  },
  {
    quote: "AI-powered insights helped us reduce delays by 40% in just 3 months.",
    author: "Emily Watson",
    role: "Supply Chain Director, GlobalTrade",
    avatar: "👩‍🔬",
  },
];

export default function Index() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="Live.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay with Gradient */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />

      {/* Animated Gradient Orbs */}
      <div
        className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-3xl z-10 transition-all duration-1000 ease-out"
        style={{
          left: `${mousePosition.x * 0.02}px`,
          top: `${mousePosition.y * 0.02}px`,
        }}
      />
      <div
        className="fixed right-0 bottom-0 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl z-10 transition-all duration-1000 ease-out"
        style={{
          right: `${mousePosition.x * 0.01}px`,
          bottom: `${mousePosition.y * 0.01}px`,
        }}
      />

      {/* Content */}
      <div className="relative z-20">
        <Navbar />

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 px-4 pt-20">
          {/* Badge */}
          <div className="animate-fadeInUp">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-300">Now with AI Analytics</span>
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg animate-fadeInUp">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Supply Chain
            </span>
            <br />
            <span className="text-white">Intelligence</span>
          </h1>

          <p className="text-gray-300 max-w-2xl text-lg md:text-xl drop-shadow-md animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Blockchain-powered, AI-driven supply chain tracker — visualizing logistics with <span className="text-blue-400 font-semibold">transparency</span> & <span className="text-purple-400 font-semibold">intelligence</span>.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/dashboard"
              className="relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden group transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-600 transition-all duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Go to Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              to="/ai-insights"
              className="px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-300 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Insights
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 w-full max-w-4xl animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-4"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Powerful <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Features</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Everything you need to manage, track, and optimize your global supply chain operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="glass p-6 rounded-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Trusted by <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Industry Leaders</span>
              </h2>
            </div>

            <div className="glass p-8 md:p-12 rounded-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 text-6xl text-white/10">"</div>

              <div className="relative z-10">
                <p className="text-xl md:text-2xl text-gray-200 italic mb-8 leading-relaxed">
                  "{testimonials[activeTestimonial].quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonials[activeTestimonial].author}</p>
                    <p className="text-gray-400 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'w-8 bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass p-12 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Supply Chain?
                </h2>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                  Join thousands of companies using ChainSight to track, predict, and optimize their logistics operations.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Free
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#footer-logo-gradient)" />
                  <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="footer-logo-gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6" />
                      <stop offset="1" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-xl font-bold text-white">ChainSight</span>
              </div>

              <div className="flex items-center gap-6">
                <a href="https://github.com/The-ChandanKV/ChainSight" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>

              <p className="text-gray-500 text-sm">
                © 2024 ChainSight. Built with ❤️ using React, Blockchain & AI
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
