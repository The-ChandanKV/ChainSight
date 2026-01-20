import { useState, useEffect } from 'react';

interface StatItem {
    id: string;
    label: string;
    value: number;
    target: number;
    prefix?: string;
    suffix?: string;
    color: string;
    trend: 'up' | 'down' | 'neutral';
    trendValue: string;
}

export default function LiveStatsWidget() {
    const [stats, setStats] = useState<StatItem[]>([
        {
            id: 'active',
            label: 'Active Shipments',
            value: 0,
            target: 1247,
            color: 'text-blue-400',
            trend: 'up',
            trendValue: '+12.5%',
        },
        {
            id: 'delivered',
            label: 'Delivered Today',
            value: 0,
            target: 89,
            color: 'text-green-400',
            trend: 'up',
            trendValue: '+8.3%',
        },
        {
            id: 'ontime',
            label: 'On-Time Rate',
            value: 0,
            target: 94.7,
            suffix: '%',
            color: 'text-purple-400',
            trend: 'up',
            trendValue: '+2.1%',
        },
        {
            id: 'revenue',
            label: 'Revenue',
            value: 0,
            target: 284500,
            prefix: '$',
            color: 'text-yellow-400',
            trend: 'up',
            trendValue: '+15.2%',
        },
    ]);

    // Animate counters on mount
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setStats((prev) =>
                prev.map((stat) => ({
                    ...stat,
                    value: Math.round(stat.target * easeOut * 10) / 10,
                }))
            );

            if (step >= steps) {
                clearInterval(timer);
                setStats((prev) =>
                    prev.map((stat) => ({
                        ...stat,
                        value: stat.target,
                    }))
                );
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStats((prev) =>
                prev.map((stat) => {
                    if (stat.id === 'active') {
                        return {
                            ...stat,
                            target: stat.target + Math.floor(Math.random() * 3) - 1,
                            value: stat.target + Math.floor(Math.random() * 3) - 1,
                        };
                    }
                    if (stat.id === 'delivered') {
                        return {
                            ...stat,
                            target: stat.target + (Math.random() > 0.7 ? 1 : 0),
                            value: stat.target + (Math.random() > 0.7 ? 1 : 0),
                        };
                    }
                    return stat;
                })
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const formatNumber = (num: number, prefix?: string, suffix?: string) => {
        if (num >= 1000000) {
            return `${prefix || ''}${(num / 1000000).toFixed(1)}M${suffix || ''}`;
        }
        if (num >= 1000) {
            return `${prefix || ''}${(num / 1000).toFixed(1)}K${suffix || ''}`;
        }
        return `${prefix || ''}${num.toLocaleString()}${suffix || ''}`;
    };

    return (
        <div className="glass-dark rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Live Statistics
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-gray-400">Real-time</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 group"
                    >
                        <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <p className={`text-2xl font-bold ${stat.color} transition-all duration-300`}>
                                {formatNumber(stat.value, stat.prefix, stat.suffix)}
                            </p>
                            <div
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${stat.trend === 'up'
                                        ? 'bg-green-500/20 text-green-400'
                                        : stat.trend === 'down'
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                    }`}
                            >
                                {stat.trend === 'up' && (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                )}
                                {stat.trend === 'down' && (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                )}
                                {stat.trendValue}
                            </div>
                        </div>

                        {/* Mini sparkline */}
                        <div className="mt-3 h-8 flex items-end gap-0.5">
                            {Array.from({ length: 12 }).map((_, i) => {
                                const height = 20 + Math.random() * 80;
                                return (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t ${stat.color.replace('text-', 'bg-').replace('-400', '-500/50')} group-hover:${stat.color.replace('text-', 'bg-')} transition-all duration-300`}
                                        style={{
                                            height: `${height}%`,
                                            animationDelay: `${i * 50}ms`,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
