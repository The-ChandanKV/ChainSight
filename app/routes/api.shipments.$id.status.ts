// MOCKED VERSION FOR GITHUB PAGES / SPA DEPLOYMENT
// Real server-side code removed to prevent build errors in SPA mode.

export async function action({ request, params }: any) {
  if (request.method !== 'PUT') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { id } = params;
  const data = await request.json();

  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 });
  }

  return Response.json({
    id,
    ...data,
    statusUpdateTxHashes: ["0xmockhash" + Date.now()]
  });
}
