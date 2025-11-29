import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
    shipmentId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
    },
    transactionHash: {
        type: String,
    },
    blockNumber: {
        type: Number,
    },
    createdBy: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Shipment", shipmentSchema);
