import { useState, useEffect } from 'react';

interface Route {
    id: string;
    origin: { name: string; x: number; y: number };
    destination: { name: string; x: number; y: number };
    status: 'active' | 'delayed' | 'completed';
    progress: number;
}

const globalRoutes: Route[] = [
    {
        id: '1',
        origin: { name: 'Shanghai', x: 82, y: 42 },
        destination: { name: 'Los Angeles', x: 18, y: 40 },
        status: 'active',
        progress: 0.6,
    },
    {
        id: '2',
        origin: { name: 'Rotterdam', x: 50, y: 32 },
        destination: { name: 'New York', x: 25, y: 38 },
        status: 'active',
        progress: 0.3,
    },
    {
        id: '3',
        origin: { name: 'Singapore', x: 76, y: 55 },
        destination: { name: 'Dubai', x: 58, y: 45 },
        status: 'delayed',
        progress: 0.45,
    },
    {
        id: '4',
        origin: { name: 'Mumbai', x: 65, y: 48 },
        destination: { name: 'London', x: 48, y: 32 },
        status: 'completed',
        progress: 1,
    },
    {
        id: '5',
        origin: { name: 'Tokyo', x: 88, y: 40 },
        destination: { name: 'Sydney', x: 90, y: 72 },
        status: 'active',
        progress: 0.8,
    },
];

export default function GlobalMap() {
    const [routes, setRoutes] = useState(globalRoutes);
    const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
    const [activeShipments, setActiveShipments] = useState(0);

    useEffect(() => {
        // Animate progress
        const interval = setInterval(() => {
            setRoutes((prev) =>
                prev.map((route) => ({
                    ...route,
                    progress:
                        route.status === 'completed'
                            ? 1
                            : route.progress >= 1
                                ? 0
                                : route.progress + 0.002,
                }))
            );
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setActiveShipments(routes.filter((r) => r.status === 'active').length);
    }, [routes]);

    const getStatusColor = (status: Route['status']) => {
        switch (status) {
            case 'active':
                return '#3b82f6';
            case 'delayed':
                return '#f59e0b';
            case 'completed':
                return '#10b981';
        }
    };

    const getPointOnPath = (route: Route) => {
        const x = route.origin.x + (route.destination.x - route.origin.x) * route.progress;
        const y = route.origin.y + (route.destination.y - route.origin.y) * route.progress;
        return { x, y };
    };

    return (
        <div className="glass-dark rounded-2xl p-6 border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Global Supply Chain
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Real-time shipment tracking worldwide</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm text-gray-400">{activeShipments} Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-sm text-gray-400">{routes.filter((r) => r.status === 'delayed').length} Delayed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-400">{routes.filter((r) => r.status === 'completed').length} Completed</span>
                    </div>
                </div>
            </div>

            <div className="relative aspect-[2/1] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-white/5">
                {/* World map background - simplified */}
                <svg
                    viewBox="0 0 100 50"
                    className="absolute inset-0 w-full h-full opacity-20"
                    preserveAspectRatio="none"
                >
                    {/* Continents simplified paths */}
                    <path
                        d="M15,25 Q20,20 25,25 L30,22 Q35,28 40,25 L45,30 Q50,25 55,30 L60,25 Q65,30 70,28 L75,32 Q80,28 85,30"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.3"
                        opacity="0.5"
                    />
                    <path
                        d="M10,35 Q15,32 20,38 L25,35 Q30,40 35,38"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.3"
                        opacity="0.5"
                    />
                    <path
                        d="M45,35 Q50,30 55,35 L60,32 Q65,38 70,35"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.3"
                        opacity="0.5"
                    />
                    <path
                        d="M85,60 Q88,55 92,62"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="0.3"
                        opacity="0.5"
                    />
                </svg>

                {/* Grid overlay */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '5% 10%'
                }} />

                {/* Routes */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <defs>
                        {routes.map((route) => (
                            <linearGradient key={`grad-${route.id}`} id={`gradient-${route.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={getStatusColor(route.status)} stopOpacity="0.2" />
                                <stop offset={`${route.progress * 100}%`} stopColor={getStatusColor(route.status)} stopOpacity="1" />
                                <stop offset={`${route.progress * 100}%`} stopColor={getStatusColor(route.status)} stopOpacity="0.2" />
                                <stop offset="100%" stopColor={getStatusColor(route.status)} stopOpacity="0.2" />
                            </linearGradient>
                        ))}
                    </defs>

                    {routes.map((route) => {
                        const midX = (route.origin.x + route.destination.x) / 2;
                        const midY = Math.min(route.origin.y, route.destination.y) - 10;
                        const point = getPointOnPath(route);

                        return (
                            <g
                                key={route.id}
                                onMouseEnter={() => setHoveredRoute(route.id)}
                                onMouseLeave={() => setHoveredRoute(null)}
                                className="cursor-pointer"
                            >
                                {/* Route path */}
                                <path
                                    d={`M ${route.origin.x} ${route.origin.y} Q ${midX} ${midY} ${route.destination.x} ${route.destination.y}`}
                                    fill="none"
                                    stroke={`url(#gradient-${route.id})`}
                                    strokeWidth={hoveredRoute === route.id ? '0.8' : '0.4'}
                                    strokeDasharray={route.status === 'delayed' ? '2,1' : 'none'}
                                    className="transition-all duration-300"
                                />

                                {/* Origin point */}
                                <circle
                                    cx={route.origin.x}
                                    cy={route.origin.y}
                                    r={hoveredRoute === route.id ? 2 : 1.5}
                                    fill={getStatusColor(route.status)}
                                    className="transition-all duration-300"
                                />

                                {/* Destination point */}
                                <circle
                                    cx={route.destination.x}
                                    cy={route.destination.y}
                                    r={hoveredRoute === route.id ? 2 : 1.5}
                                    fill={getStatusColor(route.status)}
                                    opacity={0.5}
                                    className="transition-all duration-300"
                                />

                                {/* Moving shipment indicator */}
                                {route.status !== 'completed' && (
                                    <>
                                        <circle
                                            cx={point.x}
                                            cy={point.y - (Math.sin((route.origin.x - point.x) / (route.destination.x - route.origin.x) * Math.PI) * 10)}
                                            r="1.5"
                                            fill={getStatusColor(route.status)}
                                        >
                                            <animate
                                                attributeName="opacity"
                                                values="1;0.5;1"
                                                dur="1s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                        <circle
                                            cx={point.x}
                                            cy={point.y - (Math.sin((route.origin.x - point.x) / (route.destination.x - route.origin.x) * Math.PI) * 10)}
                                            r="3"
                                            fill="none"
                                            stroke={getStatusColor(route.status)}
                                            strokeWidth="0.3"
                                            opacity="0.5"
                                        >
                                            <animate
                                                attributeName="r"
                                                values="1.5;4;1.5"
                                                dur="1.5s"
                                                repeatCount="indefinite"
                                            />
                                            <animate
                                                attributeName="opacity"
                                                values="0.5;0;0.5"
                                                dur="1.5s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    </>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Hover info tooltip */}
                {hoveredRoute && (
                    <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-white/10 animate-fadeInUp">
                        {(() => {
                            const route = routes.find((r) => r.id === hoveredRoute);
                            if (!route) return null;
                            return (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getStatusColor(route.status) }}
                                        />
                                        <span className="text-white font-semibold capitalize">{route.status}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        {route.origin.name} → {route.destination.name}
                                    </p>
                                    <p className="text-blue-400 text-sm mt-1">
                                        Progress: {Math.round(route.progress * 100)}%
                                    </p>
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}
