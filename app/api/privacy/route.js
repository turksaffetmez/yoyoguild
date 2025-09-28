export async function GET() {
  return new Response(JSON.stringify({
    privacy: "YoYo Guild Battle Privacy Policy..."
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}