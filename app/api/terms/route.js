export async function GET() {
  return new Response(JSON.stringify({
    message: "Terms of Service: https://yoyoguild.vercel.app/terms",
    version: "1.0",
    lastUpdated: "2024-01-01"
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}