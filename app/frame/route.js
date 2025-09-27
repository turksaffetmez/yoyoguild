export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>YoYo Guild Battle</title>
        <meta property="og:title" content="YoYo Guild Battle">
        <meta property="og:image" content="https://yoyoguild.vercel.app/images/page.png">
        
        <!-- Farcaster Frame Meta Tags -->
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="https://yoyoguild.vercel.app/images/page.png">
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1">
        
        <meta name="fc:frame:button:1" content="🎮 Play Game">
        <meta name="fc:frame:button:1:action" content="link">
        <meta name="fc:frame:button:1:target" content="https://yoyoguild.vercel.app">
        
        <meta name="fc:frame:button:2" content="🏆 Leaderboard">
        <meta name="fc:frame:button:2:action" content="link">
        <meta name="fc:frame:button:2:target" content="https://yoyoguild.vercel.app?tab=leaderboard">
        
        <!-- Mini App Meta -->
        <meta name="fc:mini-app:name" content="YoYo Guild Battle">
        <meta name="fc:mini-app:icon" content="https://yoyoguild.vercel.app/images/yoyo.png">
      </head>
      <body>
        <h1>YoYo Guild Battle</h1>
        <p>If you see this, open in Warpcast to view the frame.</p>
        <a href="https://yoyoguild.vercel.app">Open Mini App</a>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}