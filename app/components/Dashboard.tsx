import { useState, useEffect, useRef } from 'react';
import useSupplyChainStore from "../store/supplyChainStore";
import AddShipmentModal from './AddShipmentModal';
import ShipmentTracker from './ShipmentTracker';

export default function Dashboard() {
  const { shipments, addShipment, advanceStatus, fetchShipments, loading, error } = useSupplyChainStore();

  console.log('Dashboard shipments:', shipments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Scroll animations using Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleElements((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe shipment cards
  useEffect(() => {
    const cards = document.querySelectorAll('.shipment-card');
    cards.forEach((card) => {
      if (observerRef.current) {
        observerRef.current.observe(card);
      }
    });

    return () => {
      cards.forEach((card) => {
        if (observerRef.current) {
          observerRef.current.unobserve(card);
        }
      });
    };
  }, [shipments]);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (headerRef.current) {
        headerRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
        headerRef.current.style.opacity = `${1 - scrolled / 500}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="space-y-8">
      {/* Header with Add Shipment Button - with parallax effect */}
      <div
        ref={headerRef}
        className="flex justify-between items-center scroll-fade-in transition-all duration-500"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          Supply Chain Dashboard
        </h2>
        <button
          onClick={() => onClickAddShipment()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 font-semibold flex items-center gap-2 group"
          type="button"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Shipment
        </button>
      </div>

      {/* Stats Cards - Scroll Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-slide-up">
        <div className="glass-dark p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Shipments</p>
              <p className="text-3xl font-bold text-white mt-1">{shipments.length}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-dark p-6 rounded-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">In Transit</p>
              <p className="text-3xl font-bold text-white mt-1">
                {shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length}
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-dark p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Delivered</p>
              <p className="text-3xl font-bold text-white mt-1">
                {shipments.filter(s => s.status === 'Delivered').length}
              </p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      {shipments.length === 0 ? (
        <div className="glass-dark p-12 rounded-xl text-center border border-white/10 scroll-fade-in transform transition-all duration-500 hover:scale-105">
          <div className="mb-4 animate-float">
            <svg className="w-20 h-20 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-400 text-xl mb-2">No shipments yet</p>
          <p className="text-gray-500 mb-6">Click "Add Shipment" to create your first shipment and start tracking!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold inline-flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              data-index={index}
              className={`shipment-card transition-all duration-700 transform ${visibleElements.has(index)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-10 scale-95'
                }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
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
      {isModalOpen && <AddShipmentModal
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddShipment}
      />}
    </div>
  );
}