import { connectDB, ShipmentModel, type ShipmentStatus } from "../models/shipment";

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

    const updatedShipment = await ShipmentModel.findByIdAndUpdate(
      id,
      { status },
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
