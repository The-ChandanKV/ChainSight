// MOCKED VERSION FOR GITHUB PAGES / SPA DEPLOYMENT
// Real server-side code removed to prevent build errors in SPA mode.

export async function loader({ request }: any) {
  // Mock data for demo
  const mockShipments = [
    {
      id: "mock_1", shipmentId: "SHP-1001", status: "In Transit",
      origin: "New York", destination: "London", carrier: "DHL",
      createdAt: new Date().toISOString()
    },
    {
      id: "mock_2", shipmentId: "SHP-1002", status: "Delivered",
      origin: "Tokyo", destination: "San Francisco", carrier: "FedEx",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  return Response.json(mockShipments);
}

export async function action({ request }: any) {
  // Mock action for demo
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const data = await request.json();

  return Response.json({
    ...data,
    id: "mock_new_" + Date.now(),
    createdAt: new Date().toISOString()
  }, { status: 201 });
}
