export async function GET() {
  return new Response(JSON.stringify({
    terms: "YoYo Guild Battle Terms of Service..."
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}