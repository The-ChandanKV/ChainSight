import { useState, useEffect } from 'react';

interface Activity {
    id: string;
    type: 'created' | 'updated' | 'delivered' | 'delayed' | 'alert';
    message: string;
    timestamp: Date;
    shipmentId?: string;
}

const activityTypes = {
    created: { icon: '📦', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    updated: { icon: '🔄', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    delivered: { icon: '✅', color: 'text-green-400', bg: 'bg-green-500/20' },
    delayed: { icon: '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    alert: { icon: '🚨', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const generateRandomActivity = (): Activity => {
    const types: Activity['type'][] = ['created', 'updated', 'delivered', 'delayed', 'alert'];
    const type = types[Math.floor(Math.random() * types.length)];
    const shipmentId = `SHP-${Math.floor(Math.random() * 9000) + 1000}`;

    const messages = {
        created: [`New shipment ${shipmentId} created`, `Order ${shipmentId} is being processed`],
        updated: [`${shipmentId} status updated to In Transit`, `Location update for ${shipmentId}`],
        delivered: [`${shipmentId} delivered successfully`, `Package ${shipmentId} received by customer`],
        delayed: [`${shipmentId} experiencing minor delay`, `Weather affecting ${shipmentId} route`],
        alert: [`Temperature alert for ${shipmentId}`, `Security check required for ${shipmentId}`],
    };

    return {
        id: Date.now().toString() + Math.random(),
        type,
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        timestamp: new Date(),
        shipmentId,
    };
};

export default function LiveActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([
        {
            id: '1',
            type: 'delivered',
            message: 'SHP-2024-001 delivered successfully',
            timestamp: new Date(Date.now() - 120000),
            shipmentId: 'SHP-2024-001',
        },
        {
            id: '2',
            type: 'updated',
            message: 'SHP-2024-003 status updated to In Transit',
            timestamp: new Date(Date.now() - 300000),
            shipmentId: 'SHP-2024-003',
        },
        {
            id: '3',
            type: 'created',
            message: 'New shipment SHP-2024-005 created',
            timestamp: new Date(Date.now() - 600000),
            shipmentId: 'SHP-2024-005',
        },
    ]);
    const [isLive, setIsLive] = useState(true);
    const [newActivity, setNewActivity] = useState<string | null>(null);

    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            const activity = generateRandomActivity();
            setActivities((prev) => [activity, ...prev].slice(0, 20));
            setNewActivity(activity.id);

            setTimeout(() => setNewActivity(null), 2000);
        }, 5000);

        return () => clearInterval(interval);
    }, [isLive]);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        if (seconds > 10) return `${seconds}s ago`;
        return 'Just now';
    };

    return (
        <div className="glass-dark rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">Live Activity</h3>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isLive ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                        <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                        <span className={`text-xs font-medium ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
                            {isLive ? 'LIVE' : 'PAUSED'}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`p-2 rounded-lg transition-all duration-300 ${isLive ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        }`}
                >
                    {isLive ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {activities.map((activity, index) => {
                    const config = activityTypes[activity.type];
                    const isNew = activity.id === newActivity;

                    return (
                        <div
                            key={activity.id}
                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all duration-500 ${isNew ? 'bg-blue-500/10 animate-pulse' : ''
                                }`}
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center text-lg`}>
                                    {config.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${config.color}`}>{activity.message}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                                        {activity.shipmentId && (
                                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono">
                                                {activity.shipmentId}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isNew && (
                                    <span className="px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded-full animate-bounce">
                                        NEW
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-3 border-t border-white/10 bg-gray-900/50">
                <p className="text-center text-xs text-gray-500">
                    Showing last {activities.length} activities • Updates every 5s
                </p>
            </div>
        </div>
    );
}
