import AIInsights from "../components/AIInsights";
import Navbar from "../components/Navbar";

export default function AIInsightsPage() {
    return (
        <div className="relative min-h-screen text-white overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src="/Live.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

            {/* Content */}
            <div className="relative z-20">
                <Navbar />
                <div className="max-w-7xl mx-auto p-8 pt-24">
                    <AIInsights />
                </div>
            </div>
        </div>
    );
}
