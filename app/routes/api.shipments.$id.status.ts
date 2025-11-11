import { connectDB, ShipmentModel, type ShipmentStatus } from "../models/shipment";
import { ethers } from 'ethers';

// Smart contract ABI
const SHIPMENT_TRACKER_ABI = [
  'function updateShipmentStatus(string shipmentId, string status) external',
  'event ShipmentStatusUpdated(string indexed shipmentId, bytes32 dataHash, string status, uint256 timestamp)'
];

// Blockchain helper function
async function recordStatusUpdateOnBlockchain(shipmentId: string, status: string): Promise<string | null> {
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

    console.log(`Recording status update for ${shipmentId} -> ${status} on blockchain...`);
    const tx = await contract.updateShipmentStatus(shipmentId, status);
    console.log(`Transaction sent: ${tx.hash}`);
    
    // Wait for confirmation
    await tx.wait();
    console.log(`Transaction confirmed: ${tx.hash}`);
    
    return tx.hash;
  } catch (error) {
    console.error('Blockchain status update failed:', error);
    return null; // Don't fail the entire operation if blockchain fails
  }
}

// PUT /api/shipments/:id/status
export async function action({ request, params }: any) {
  if (request.method !== 'PUT') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  await connectDB();

  try {
    const { id } = params;
    const { status }: { status: ShipmentStatus } = await request.json();

    if (!id || !status) {
      return Response.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // Get current shipment to retrieve shipmentId
    const currentShipment = await ShipmentModel.findById(id);
    if (!currentShipment) {
      return Response.json({ error: 'Shipment not found' }, { status: 404 });
    }

    // Record status update on blockchain
    const txHash = await recordStatusUpdateOnBlockchain(currentShipment.shipmentId, status);

    // Update shipment with new status and blockchain tx hash
    const updateData: any = { status };
    if (txHash) {
      updateData.$push = { statusUpdateTxHashes: txHash };
    }

    const updatedShipment = await ShipmentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedShipment) {
      return Response.json({ error: 'Shipment not found' }, { status: 404 });
    }

    return Response.json({
      ...updatedShipment.toObject(),
      id: updatedShipment._id?.toString(),
      _id: undefined
    });
  } catch (error) {
    console.error('Error updating shipment status:', error);
    return Response.json({ error: 'Failed to update shipment status' }, { status: 500 });
  }
}
