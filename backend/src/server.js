const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");
const blockchain = require("./blockchain.js");
const Shipment = require("./models/Shipment.js");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
if (process.env.MONGODB_URI) {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => console.log("✅ MongoDB connected"))
        .catch((err) => console.error("❌ MongoDB connection error:", err));
} else {
    console.warn("⚠️  MONGODB_URI not set. Running without database caching.");
}

// Routes

// Health check
app.get("/api/health", async (req, res) => {
    try {
        const networkInfo = await blockchain.getNetworkInfo().catch(() => null);
        res.json({
            status: "ok",
            message: "ChainSight Backend API",
            blockchain: networkInfo ? {
                connected: true,
                network: networkInfo.name,
                chainId: networkInfo.chainId,
                currentBlock: networkInfo.currentBlock,
            } : {
                connected: false,
                message: "Blockchain not configured"
            }
        });
    } catch (error) {
        res.json({
            status: "ok",
            message: "ChainSight Backend API",
            blockchain: { connected: false }
        });
    }
});

// Create shipment with detailed information
app.post("/api/shipment/create", async (req, res) => {
    try {
        const { shipmentId, origin, destination, carrier } = req.body;

        // Validation
        if (!shipmentId) {
            return res.status(400).json({ error: "shipmentId is required" });
        }
        if (!origin) {
            return res.status(400).json({ error: "origin is required" });
        }
        if (!destination) {
            return res.status(400).json({ error: "destination is required" });
        }
        if (!carrier) {
            return res.status(400).json({ error: "carrier is required" });
        }

        // Create on blockchain
        const result = await blockchain.createShipment(shipmentId, origin, destination, carrier);

        // Cache in database if available
        if (mongoose.connection.readyState === 1) {
            await Shipment.create({
                shipmentId,
                status: "Created",
                origin,
                destination,
                carrier,
                transactionHash: result.transactionHash,
                blockNumber: result.blockNumber,
                dataHash: result.dataHash,
            });
        }

        res.status(201).json({
            success: true,
            message: "Shipment created and recorded on blockchain",
            data: {
                shipmentId,
                origin,
                destination,
                carrier,
                transactionHash: result.transactionHash,
                blockNumber: result.blockNumber,
                dataHash: result.dataHash,
                gasUsed: result.gasUsed,
            }
        });
    } catch (error) {
        console.error("Error creating shipment:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update shipment status with location and notes
app.put("/api/shipment/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, location, notes } = req.body;

        if (!status) {
            return res.status(400).json({ error: "status is required" });
        }

        // Update on blockchain
        const result = await blockchain.updateShipmentStatus(
            id,
            status,
            location || "",
            notes || ""
        );

        // Update in database if available
        if (mongoose.connection.readyState === 1) {
            await Shipment.findOneAndUpdate(
                { shipmentId: id },
                {
                    status,
                    location,
                    transactionHash: result.transactionHash,
                    blockNumber: result.blockNumber,
                    updatedAt: new Date(),
                },
                { new: true }
            );
        }

        res.json({
            success: true,
            message: "Shipment status updated on blockchain",
            data: {
                shipmentId: id,
                status,
                location: location || "",
                transactionHash: result.transactionHash,
                blockNumber: result.blockNumber,
                gasUsed: result.gasUsed,
            }
        });
    } catch (error) {
        console.error("Error updating shipment:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get shipment history
app.get("/api/shipment/:id/history", async (req, res) => {
    try {
        const { id } = req.params;

        // Get history from blockchain
        const history = await blockchain.getShipmentHistory(id);

        res.json({
            success: true,
            shipmentId: id,
            history,
            count: history.length,
        });
    } catch (error) {
        console.error("Error fetching shipment history:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get single shipment
app.get("/api/shipment/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Get from blockchain
        const shipment = await blockchain.getShipment(id);

        res.json({
            success: true,
            shipment,
        });
    } catch (error) {
        console.error("Error fetching shipment:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Verify shipment data integrity
app.get("/api/shipment/:id/verify", async (req, res) => {
    try {
        const { id } = req.params;

        const isValid = await blockchain.verifyShipmentHash(id);

        res.json({
            success: true,
            shipmentId: id,
            verified: isValid,
            message: isValid ? "Shipment data is valid and untampered" : "Shipment data verification failed"
        });
    } catch (error) {
        console.error("Error verifying shipment:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all shipments
app.get("/api/shipments", async (req, res) => {
    try {
        const shipmentIds = await blockchain.getAllShipments();
        const count = await blockchain.getShipmentCount();

        res.json({
            success: true,
            shipments: shipmentIds,
            count,
        });
    } catch (error) {
        console.error("Error fetching all shipments:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get network information
app.get("/api/network", async (req, res) => {
    try {
        const networkInfo = await blockchain.getNetworkInfo();

        res.json({
            success: true,
            network: networkInfo,
        });
    } catch (error) {
        console.error("Error fetching network info:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// AI Insights endpoint - proxies to ML service
app.post("/api/insights", async (req, res) => {
    try {
        const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000";

        // Fetch all shipments from database
        let shipments = [];

        if (mongoose.connection.readyState === 1) {
            const dbShipments = await Shipment.find({}).lean();

            // Enrich with mock data for ML predictions
            shipments = dbShipments.map(s => ({
                shipment_id: s.shipmentId,
                distance_km: Math.random() * 3000 + 200,
                temperature_avg: Math.random() * 30 + 10,
                temperature_variance: Math.random() * 10,
                carrier_rating: Math.random() * 2 + 3,
                package_weight: Math.random() * 50 + 5,
                route_complexity: Math.floor(Math.random() * 5) + 1,
                weather_score: Math.random() * 5 + 5,
                is_fragile: Math.random() > 0.7 ? 1 : 0,
                is_express: Math.random() > 0.6 ? 1 : 0
            }));
        }

        // Try to get insights from ML service
        try {
            const fetch = (await import('node-fetch')).default;
            const mlResponse = await fetch(`${ML_SERVICE_URL}/insights`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipments })
            });

            if (mlResponse.ok) {
                const mlData = await mlResponse.json();
                return res.json(mlData);
            }
        } catch (mlError) {
            console.warn("ML service not available, returning mock insights:", mlError.message);
        }

        // Fallback: Return mock insights if ML service is not available
        const totalShipments = shipments.length || 10;
        const delayedShipments = Math.floor(totalShipments * 0.12);

        res.json({
            success: true,
            insights: {
                total_shipments: totalShipments,
                delayed_shipments: delayedShipments,
                delay_percentage: ((delayedShipments / totalShipments) * 100).toFixed(2),
                average_delay_hours: 8.5,
                high_risk_shipments: Math.floor(totalShipments * 0.08),
                anomalies_detected: Math.floor(totalShipments * 0.05),
                trends: [
                    { week: 'Week 1', delayed: 5, on_time: 45 },
                    { week: 'Week 2', delayed: 8, on_time: 42 },
                    { week: 'Week 3', delayed: 6, on_time: 44 },
                    { week: 'Week 4', delayed: delayedShipments, on_time: totalShipments - delayedShipments }
                ],
                risk_distribution: {
                    low: Math.floor(totalShipments * 0.6),
                    medium: Math.floor(totalShipments * 0.3),
                    high: Math.floor(totalShipments * 0.1)
                },
                predictions: shipments.slice(0, 5).map((s, i) => ({
                    shipment_id: s.shipment_id,
                    delay_probability: (Math.random() * 0.5 + 0.1).toFixed(2),
                    estimated_delay_hours: Math.random() * 12,
                    anomaly_probability: (Math.random() * 0.3).toFixed(2),
                    risk_score: (Math.random() * 40 + 20).toFixed(2)
                }))
            },
            ml_service_available: false
        });
    } catch (error) {
        console.error("Error fetching insights:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 ChainSight Server running on port ${PORT}`);
    console.log(`📍 Contract address: ${process.env.CONTRACT_ADDRESS || "Not set"}`);
    console.log(`🔗 Network: ${process.env.RPC_URL || process.env.INFURA_RPC_URL || "Not configured"}\n`);
});
