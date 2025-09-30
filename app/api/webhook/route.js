export async function POST(request) {
  return new Response(JSON.stringify({
    status: "ok",
    message: "Webhook received"
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}