export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>YoYo Guild Battle</title>
        <meta property="og:title" content="YoYo Guild Battle">
        <meta property="og:image" content="https://yoyoguild.vercel.app/images/page.png">
        
        <!-- Open Graph -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://yoyoguild.vercel.app">
        <meta property="og:description" content="Blockchain Battle Arena on Base">
        
        <!-- Farcaster Frame -->
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="https://yoyoguild.vercel.app/images/page.png">
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1">
        
        <meta name="fc:frame:button:1" content="🎮 Play Mini App">
        <meta name="fc:frame:button:1:action" content="link">
        <meta name="fc:frame:button:1:target" content="https://yoyoguild.vercel.app?farcaster=true">
        
        <meta name="fc:frame:button:2" content="🏆 Leaderboard">
        <meta name="fc:frame:button:2:action" content="link">
        <meta name="fc:frame:button:2:target" content="https://yoyoguild.vercel.app?farcaster=true&tab=leaderboard">
        
        <!-- Mini App Meta -->
        <meta name="fc:mini-app:name" content="YoYo Guild Battle">
        <meta name="fc:mini-app:icon" content="https://yoyoguild.vercel.app/images/yoyo.png">
        <meta name="fc:mini-app:description" content="Blockchain Battle Arena on Base">
      </head>
      <body>
        <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
          <h1>YoYo Guild Battle</h1>
          <p>Tap "Play Mini App" to open in Farcaster</p>
          <img src="https://yoyoguild.vercel.app/images/page.png" width="300" style="border-radius: 10px;">
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}