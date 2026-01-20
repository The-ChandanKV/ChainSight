import { useState } from 'react';
import { useNavigate } from 'react-router';

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    action: () => void;
}

export default function QuickActionsButton() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const actions: QuickAction[] = [
        {
            id: 'new-shipment',
            label: 'New Shipment',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
            action: () => navigate('/dashboard'),
        },
        {
            id: 'ai-insights',
            label: 'AI Analysis',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-600',
            action: () => navigate('/ai-insights'),
        },
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
            action: () => navigate('/dashboard'),
        },
        {
            id: 'home',
            label: 'Home',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            color: 'from-orange-500 to-orange-600',
            action: () => navigate('/'),
        },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Action buttons */}
            <div
                className={`absolute bottom-16 right-0 flex flex-col-reverse gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                {actions.map((action, index) => (
                    <button
                        key={action.id}
                        onClick={() => {
                            action.action();
                            setIsOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group`}
                        style={{
                            transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                        }}
                    >
                        <span className="group-hover:scale-110 transition-transform">{action.icon}</span>
                        <span className="font-medium whitespace-nowrap">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Main FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center ${isOpen ? 'rotate-45' : ''
                    }`}
            >
                <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Ripple effect */}
            {isOpen && (
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                </div>
            )}
        </div>
    );
}
