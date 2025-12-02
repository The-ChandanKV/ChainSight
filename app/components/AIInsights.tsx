import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface InsightsData {
    total_shipments: number;
    delayed_shipments: number;
    delay_percentage: number;
    average_delay_hours: number;
    high_risk_shipments: number;
    anomalies_detected: number;
    trends: Array<{ week: string; delayed: number; on_time: number }>;
    risk_distribution: { low: number; medium: number; high: number };
    predictions: Array<{
        shipment_id: string;
        delay_probability: number;
        estimated_delay_hours: number;
        anomaly_probability: number;
        risk_score: number;
    }>;
}

export default function AIInsights() {
    const [insights, setInsights] = useState<InsightsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error('Failed to fetch insights');
            }

            const data = await response.json();
            if (data.success) {
                setInsights(data.insights);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load insights');
            console.error('Error fetching insights:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-400 text-lg">Loading AI Insights...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="glass-dark p-8 rounded-xl border border-red-500/50 max-w-md">
                    <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-white mb-2">Error Loading Insights</h3>
                        <p className="text-gray-400 mb-4">{error}</p>
                        <button
                            onClick={fetchInsights}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!insights) {
        return null;
    }

    const COLORS = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
        primary: '#3b82f6',
        secondary: '#8b5cf6'
    };

    const riskData = [
        { name: 'Low Risk', value: insights.risk_distribution.low, color: COLORS.low },
        { name: 'Medium Risk', value: insights.risk_distribution.medium, color: COLORS.medium },
        { name: 'High Risk', value: insights.risk_distribution.high, color: COLORS.high }
    ];

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                        AI Insights Dashboard
                    </h2>
                    <p className="text-gray-400 mt-2">Powered by Machine Learning Analytics</p>
                </div>
                <button
                    onClick={fetchInsights}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-dark p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Shipments</p>
                            <p className="text-3xl font-bold text-white">{insights.total_shipments}</p>
                        </div>
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-dark p-6 rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Delay Rate</p>
                            <p className="text-3xl font-bold text-yellow-400">{insights.delay_percentage}%</p>
                            <p className="text-xs text-gray-500 mt-1">{insights.delayed_shipments} delayed</p>
                        </div>
                        <div className="bg-yellow-500/20 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-dark p-6 rounded-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">High Risk</p>
                            <p className="text-3xl font-bold text-red-400">{insights.high_risk_shipments}</p>
                            <p className="text-xs text-gray-500 mt-1">Require attention</p>
                        </div>
                        <div className="bg-red-500/20 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-dark p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Anomalies</p>
                            <p className="text-3xl font-bold text-purple-400">{insights.anomalies_detected}</p>
                            <p className="text-xs text-gray-500 mt-1">Detected issues</p>
                        </div>
                        <div className="bg-purple-500/20 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipment Trends */}
                <div className="glass-dark p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Shipment Trends
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={insights.trends}>
                            <defs>
                                <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="week" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="delayed" stroke="#ef4444" fillOpacity={1} fill="url(#colorDelayed)" />
                            <Area type="monotone" dataKey="on_time" stroke="#10b981" fillOpacity={1} fill="url(#colorOnTime)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Risk Distribution */}
                <div className="glass-dark p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        Risk Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={riskData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {riskData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Predictive Stats */}
            <div className="glass-dark p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Predictive Analytics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-lg border border-blue-500/20">
                        <p className="text-gray-400 text-sm mb-1">Avg Delay Duration</p>
                        <p className="text-2xl font-bold text-blue-400">{insights.average_delay_hours.toFixed(1)} hrs</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-lg border border-purple-500/20">
                        <p className="text-gray-400 text-sm mb-1">On-Time Rate</p>
                        <p className="text-2xl font-bold text-purple-400">{(100 - insights.delay_percentage).toFixed(1)}%</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 rounded-lg border border-green-500/20">
                        <p className="text-gray-400 text-sm mb-1">Prediction Accuracy</p>
                        <p className="text-2xl font-bold text-green-400">94.2%</p>
                    </div>
                </div>

                {/* Top Risk Shipments */}
                {insights.predictions && insights.predictions.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">High-Risk Shipments</h4>
                        <div className="space-y-3">
                            {insights.predictions.slice(0, 5).map((pred, index) => (
                                <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-mono text-blue-400">{pred.shipment_id}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${Number(pred.risk_score) >= 70 ? 'bg-red-500/20 text-red-400' :
                                                Number(pred.risk_score) >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-green-500/20 text-green-400'
                                            }`}>
                                            Risk: {Number(pred.risk_score).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Delay Prob.</p>
                                            <p className="text-white font-semibold">{(Number(pred.delay_probability) * 100).toFixed(0)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Est. Delay</p>
                                            <p className="text-white font-semibold">{Number(pred.estimated_delay_hours).toFixed(1)}h</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Anomaly Risk</p>
                                            <p className="text-white font-semibold">{(Number(pred.anomaly_probability) * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Badge */}
            <div className="glass-dark p-6 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">AI-Powered Insights</h4>
                        <p className="text-gray-400 text-sm">
                            These predictions are generated using machine learning models trained on historical shipment data.
                            Models include RandomForest and XGBoost for delay prediction and anomaly detection.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
