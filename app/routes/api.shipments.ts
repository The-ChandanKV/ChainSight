import { connectDB, ShipmentModel } from "../models/shipment";

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
    const shipment = new ShipmentModel(data);
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
