import { connectDB, ShipmentModel } from "../models/shipment";
import { ethers } from 'ethers';

// Smart contract ABI
const SHIPMENT_TRACKER_ABI = [
  'function createShipment(string shipmentId, string status) external',
  'event ShipmentCreated(string indexed shipmentId, bytes32 dataHash, uint256 timestamp)'
];

// Blockchain helper function
async function recordOnBlockchain(shipmentId: string, status: string): Promise<string | null> {
  const enabled = process.env.BLOCKCHAIN_ENABLED === 'true';
  if (!enabled) {
    console.log('Blockchain disabled, skipping on-chain recording');
    return null;
  }

  try {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || '';
    const contractAddress = process.env.CONTRACT_ADDRESS || '';
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '';

    if (!rpcUrl || !contractAddress || !privateKey) {
      console.warn('Blockchain not configured, skipping on-chain recording');
      return null;
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, SHIPMENT_TRACKER_ABI, wallet);

    console.log(`Recording shipment ${shipmentId} on blockchain...`);
    const tx = await contract.createShipment(shipmentId, status);
    console.log(`Transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    await tx.wait();
    console.log(`Transaction confirmed: ${tx.hash}`);
    
    return tx.hash;
  } catch (error) {
    console.error('Blockchain recording failed:', error);
    return null; // Don't fail the entire operation if blockchain fails
  }
}

// GET /api/shipments
export async function loader({ request }: any) {
  await connectDB();

  try {
    const shipments = await ShipmentModel.find().sort({ createdAt: -1 });
    return Response.json(shipments.map(shipment => ({
      ...shipment.toObject(),
      id: shipment._id?.toString(),
      _id: undefined
    })));
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return Response.json({ error: 'Failed to fetch shipments' }, { status: 500 });
  }
}

// POST /api/shipments
export async function action({ request }: any) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  await connectDB();

  try {
    const data = await request.json();
    
    // Record on blockchain first (async, non-blocking)
    const txHash = await recordOnBlockchain(data.shipmentId, data.status || 'Created');
    
    // Save to database with blockchain tx hash
    const shipment = new ShipmentModel({
      ...data,
      blockchainTxHash: txHash || undefined,
      statusUpdateTxHashes: []
    });
    const savedShipment = await shipment.save();

    const responseData = {
      ...savedShipment.toObject(),
      id: savedShipment._id?.toString(),
      _id: undefined
    };
    console.log('API returning shipment:', responseData);
    return Response.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return Response.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}
