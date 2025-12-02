const { ethers } = require("ethers");
require("dotenv/config");
const { join } = require("path");
const { readFileSync } = require("fs");

// In CommonJS, __dirname is already available as a global variable

// Load contract ABI
const contractPath = join(__dirname, "../artifacts/contracts/SupplyChain.sol/SupplyChain.json");
let contractABI;

try {
    const contractJSON = JSON.parse(readFileSync(contractPath, "utf8"));
    contractABI = contractJSON.abi;
} catch (error) {
    console.warn("Contract ABI not loaded. Please compile and deploy the contract first.");
    contractABI = [];
}

// Setup provider and wallet based on network
const rpcUrl = process.env.RPC_URL || process.env.INFURA_RPC_URL || process.env.SEPOLIA_RPC_URL;
const privateKey = process.env.PRIVATE_KEY || process.env.BLOCKCHAIN_PRIVATE_KEY;

if (!rpcUrl) {
    console.warn("No RPC URL configured. Blockchain functionality will be limited.");
}

if (!privateKey) {
    console.warn("No private key configured. Blockchain functionality will be limited.");
}

const provider = rpcUrl ? new ethers.JsonRpcProvider(rpcUrl) : null;
const wallet = (provider && privateKey) ? new ethers.Wallet(privateKey, provider) : null;

// Contract instance
const contractAddress = process.env.CONTRACT_ADDRESS;
let contract;

if (contractAddress && contractABI.length > 0 && wallet) {
    contract = new ethers.Contract(contractAddress, contractABI, wallet);
    console.log(`✅ Blockchain connected to contract: ${contractAddress}`);
} else {
    console.warn("⚠️  Contract not fully initialized. Check CONTRACT_ADDRESS, RPC_URL, and PRIVATE_KEY in .env");
}

/**
 * Create a new shipment on-chain with detailed information
 */
async function createShipment(shipmentId, origin, destination, carrier) {
    if (!contract) {
        throw new Error("Contract not initialized. Please set CONTRACT_ADDRESS, RPC_URL, and PRIVATE_KEY in .env");
    }

    try {
        console.log(`📦 Creating shipment on-chain: ${shipmentId}`);

        const tx = await contract.createShipment(shipmentId, origin, destination, carrier);
        console.log(`⏳ Transaction sent: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`✅ Shipment created in block: ${receipt.blockNumber}`);

        // Extract dataHash from event logs
        const event = receipt.logs.find(log => {
            try {
                const parsed = contract.interface.parseLog(log);
                return parsed.name === "ShipmentCreated";
            } catch {
                return false;
            }
        });

        let dataHash = null;
        if (event) {
            const parsed = contract.interface.parseLog(event);
            dataHash = parsed.args.dataHash;
        }

        return {
            success: true,
            shipmentId,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            dataHash: dataHash,
            gasUsed: receipt.gasUsed.toString(),
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error(`❌ Error creating shipment:`, error.message);
        throw new Error(`Failed to create shipment on blockchain: ${error.message}`);
    }
}

/**
 * Update shipment status on-chain
 */
async function updateShipmentStatus(shipmentId, status, location = "", notes = "") {
    if (!contract) {
        throw new Error("Contract not initialized. Please set CONTRACT_ADDRESS, RPC_URL, and PRIVATE_KEY in .env");
    }

    try {
        console.log(`📝 Updating shipment status on-chain: ${shipmentId} -> ${status}`);

        const tx = await contract.updateShipmentStatus(shipmentId, status, location, notes);
        console.log(`⏳ Transaction sent: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`✅ Status updated in block: ${receipt.blockNumber}`);

        return {
            success: true,
            shipmentId,
            status,
            location,
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString(),
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error(`❌ Error updating shipment:`, error.message);
        throw new Error(`Failed to update shipment on blockchain: ${error.message}`);
    }
}

/**
 * Get shipment details from blockchain
 */
async function getShipment(shipmentId) {
    if (!contract) {
        throw new Error("Contract not initialized. Please set CONTRACT_ADDRESS, RPC_URL, and PRIVATE_KEY in .env");
    }

    try {
        const shipment = await contract.getShipment(shipmentId);

        return {
            shipmentId: shipment.shipmentId,
            status: shipment.status,
            timestamp: Number(shipment.timestamp),
            createdBy: shipment.createdBy,
            origin: shipment.origin,
            destination: shipment.destination,
            carrier: shipment.carrier,
            dataHash: shipment.dataHash,
        };
    } catch (error) {
        console.error(`❌ Error fetching shipment:`, error.message);
        throw new Error(`Failed to fetch shipment from blockchain: ${error.message}`);
    }
}

/**
 * Get full shipment history from blockchain
 */
async function getShipmentHistory(shipmentId) {
    if (!contract) {
        throw new Error("Contract not initialized. Please set CONTRACT_ADDRESS, RPC_URL, and PRIVATE_KEY in .env");
    }

    try {
        const history = await contract.getShipmentHistory(shipmentId);

        return history.map(entry => ({
            status: entry.status,
            timestamp: Number(entry.timestamp),
            updatedBy: entry.updatedBy,
            location: entry.location,
            notes: entry.notes,
        }));
    } catch (error) {
        console.error(`❌ Error fetching shipment history:`, error.message);
        throw new Error(`Failed to fetch shipment history from blockchain: ${error.message}`);
    }
}

/**
 * Get all shipment IDs
 */
async function getAllShipments() {
    if (!contract) {
        throw new Error("Contract not initialized. Please set CONTRACT_ADDRESS, RPC_URL, and PRIVATE_KEY in .env");
    }

    try {
        const shipmentIds = await contract.getAllShipments();
        return shipmentIds;
    } catch (error) {
        console.error(`❌ Error fetching all shipments:`, error.message);
        throw new Error(`Failed to fetch shipments from blockchain: ${error.message}`);
    }
}

/**
 * Get total shipment count
 */
async function getShipmentCount() {
    if (!contract) {
        throw new Error("Contract not initialized. Please set CONTRACT_ADDRESS, RPC_URL, and PRIVATE_KEY in .env");
    }

    try {
        const count = await contract.getShipmentCount();
        return Number(count);
    } catch (error) {
        console.error(`❌ Error fetching shipment count:`, error.message);
        throw new Error(`Failed to fetch shipment count from blockchain: ${error.message}`);
    }
}

/**
 * Verify shipment data integrity
 */
async function verifyShipmentHash(shipmentId) {
    if (!contract) {
        throw new Error("Contract not initialized. Please set CONTRACT_ADDRESS, RPC_URL, and PRIVATE_KEY in .env");
    }

    try {
        const isValid = await contract.verifyShipmentHash(shipmentId);
        return isValid;
    } catch (error) {
        console.error(`❌ Error verifying shipment hash:`, error.message);
        throw new Error(`Failed to verify shipment hash: ${error.message}`);
    }
}

/**
 * Get network information
 */
async function getNetworkInfo() {
    if (!provider) {
        throw new Error("Provider not initialized");
    }

    try {
        const network = await provider.getNetwork();
        const blockNumber = await provider.getBlockNumber();

        return {
            chainId: Number(network.chainId),
            name: network.name,
            currentBlock: blockNumber,
        };
    } catch (error) {
        console.error(`❌ Error fetching network info:`, error.message);
        throw new Error(`Failed to fetch network info: ${error.message}`);
    }
}

// Export functions
module.exports = {
    createShipment,
    updateShipmentStatus,
    getShipment,
    getShipmentHistory,
    getAllShipments,
    getShipmentCount,
    verifyShipmentHash,
    getNetworkInfo,
    contract,
    provider,
    wallet
};
