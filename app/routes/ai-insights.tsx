import Navbar from "../components/Navbar";
import AIInsights from "../components/AIInsights";

export default function AIInsightsPage() {
    return (
        <div className="min-h-screen relative">
            <Navbar />
            <main className="pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 p-6 glass rounded-2xl border border-purple-500/20 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 animate-gradient" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                    AI-Powered Analytics
                                </h1>
                                <p className="text-gray-400">
                                    Machine learning insights for smarter supply chain decisions
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="text-purple-400 text-sm font-medium">XGBoost Model</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-blue-400 text-sm font-medium">94.2% Accuracy</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Model Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="glass-dark p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:border-purple-500/30 transition-all duration-300">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Delay Prediction</p>
                            <p className="text-white font-semibold">RandomForest Classifier</p>
                        </div>
                    </div>

                    <div className="glass-dark p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:border-blue-500/30 transition-all duration-300">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Duration Estimation</p>
                            <p className="text-white font-semibold">XGBoost Regressor</p>
                        </div>
                    </div>

                    <div className="glass-dark p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:border-green-500/30 transition-all duration-300">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Anomaly Detection</p>
                            <p className="text-white font-semibold">Isolation Forest</p>
                        </div>
                    </div>
                </div>

                {/* Main AI Insights Component */}
                <AIInsights />

                {/* Footer */}
                <footer className="mt-12 pt-8 border-t border-white/10 text-center">
                    <div className="glass-dark rounded-2xl p-6 inline-block">
                        <div className="flex items-center gap-3 justify-center mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <span className="text-white font-bold text-lg">AI Analytics Engine</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-md mx-auto">
                            Predictions are generated using ML models trained on historical shipment data.
                            Models are retrained weekly for optimal accuracy.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
