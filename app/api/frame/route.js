import { NextResponse } from 'next/server'

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>YoYo Guild Battle</title>
        <meta property="og:title" content="YoYo Guild Battle">
        <meta property="og:image" content="https://yoyoguild.vercel.app/images/page.png">
        <meta property="og:description" content="Blockchain Battle Arena on Base">
        <meta property="og:url" content="https://yoyoguild.vercel.app">
        <meta property="og:type" content="website">
        
        <!-- Farcaster Frame Meta Tags -->
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="https://yoyoguild.vercel.app/images/page.png">
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1">
        
        <meta name="fc:frame:button:1" content="🎮 Play Game">
        <meta name="fc:frame:button:1:action" content="link">
        <meta name="fc:frame:button:1:target" content="https://yoyoguild.vercel.app?source=farcaster">
        
        <meta name="fc:frame:button:2" content="🏆 Leaderboard">
        <meta name="fc:frame:button:2:action" content="link">
        <meta name="fc:frame:button:2:target" content="https://yoyoguild.vercel.app?source=farcaster&tab=leaderboard">
        
        <!-- Mini App Meta -->
        <meta name="fc:mini-app:name" content="YoYo Guild Battle">
        <meta name="fc:mini-app:icon" content="https://yoyoguild.vercel.app/images/yoyo.png">
        <meta name="fc:mini-app:description" content="Blockchain Battle Arena on Base">
        <meta name="fc:mini-app:url" content="https://yoyoguild.vercel.app">
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="YoYo Guild Battle">
        <meta name="twitter:description" content="Blockchain Battle Arena on Base">
        <meta name="twitter:image" content="https://yoyoguild.vercel.app/images/page.png">
        
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background: #000;
            color: white;
            margin: 0;
          }
          img {
            border-radius: 10px;
            margin: 20px 0;
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>YoYo Guild Battle</h1>
        <p>Tap the buttons above to play in Farcaster!</p>
        <img src="https://yoyoguild.vercel.app/images/page.png" width="300">
        <p>Blockchain Battle Arena on Base Network</p>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}