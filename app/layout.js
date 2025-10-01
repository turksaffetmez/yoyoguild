import './globals.css'
import FarcasterSDK from './components/FarcasterSDK'

export const metadata = {
  title: 'YoYo Guild Battle - Blockchain Battle Arena',
  description: 'Premium blockchain-based battling game with Guilders. Battle Tevans, earn points, win YOYO on Base network!',
  metadataBase: new URL('https://yoyoguild.vercel.app'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* SIMPLE FARCASTER READY SOLUTION */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // SIMPLE FARCASTER READY - No complex SDK loading
              (function() {
                console.log('🚀 SIMPLE: Starting Farcaster ready process...');
                
                const sendFarcasterReady = function() {
                  try {
                    // 1. Önce SDK'yı dene (eğer Farcaster yüklemişse)
                    let sdkCalled = false;
                    
                    if (window.farcaster?.actions?.ready) {
                      window.farcaster.actions.ready();
                      console.log('✅ Layout: sdk.actions.ready() called');
                      sdkCalled = true;
                    }
                    else if (window.farcaster?.ready) {
                      window.farcaster.ready();
                      console.log('✅ Layout: farcaster.ready() called');
                      sdkCalled = true;
                    }
                    
                    // 2. Farcaster formatında ready mesajı gönder
                    if (window.parent !== window) {
                      const readyMsg = {
                        type: 'ready',
                        data: {
                          version: '1.0.0',
                          app: 'YoYo Guild Battle',
                          sdk: sdkCalled,
                          timestamp: Date.now()
                        }
                      };
                      window.parent.postMessage(readyMsg, '*');
                      console.log('📨 Layout ready sent, SDK:', sdkCalled);
                    }
                    
                    // 3. SDK yoksa bilgi ver
                    if (!sdkCalled) {
                      console.log('ℹ️ Layout: No SDK found, Farcaster should provide it');
                    }
                  } catch(error) {
                    console.error('❌ Layout ready error:', error);
                  }
                };
                
                // Hemen gönder
                sendFarcasterReady();
                
                // Multiple attempts - Farcaster yavaş yüklenebilir
                [100, 500, 1000, 2000, 3000, 5000].forEach(timeout => {
                  setTimeout(sendFarcasterReady, timeout);
                });
                
                // Final attempt
                setTimeout(sendFarcasterReady, 10000);
              })();
            `
          }}
        />

        <script src="/ready.js" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>YoYo Guild Battle - Blockchain Battle Arena</title>
        
        {/* FARCASTER FRAME TAGS */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🎮 Play Game" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content="https://yoyoguild.vercel.app" />
        <meta property="fc:frame:button:2" content="🏆 Leaderboard" />
        <meta property="fc:frame:button:2:action" content="post" />
        <meta property="fc:frame:button:2:target" content="https://yoyoguild.vercel.app?tab=leaderboard" />
        
        {/* OPEN GRAPH TAGS */}
        <meta property="og:title" content="YoYo Guild Battle" />
        <meta property="og:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="og:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="YoYo Guild Battle" />
        <meta property="og:url" content="https://yoyoguild.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="YoYo Guild Battle" />
        
        {/* TWITTER CARD */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YoYo Guild Battle" />
        <meta name="twitter:description" content="Blockchain Battle Arena on Base" />
        <meta name="twitter:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta name="twitter:site" content="@yoyoguild" />
        
        {/* FARCASTER MINI APP TAGS */}
        <meta property="fc:mini-app:name" content="YoYo Guild Battle" />
        <meta property="fc:mini-app:icon" content="https://yoyoguild.vercel.app/images/logo.png" />
        <meta property="fc:mini-app:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="fc:mini-app:url" content="https://yoyoguild.vercel.app" />
        
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <FarcasterSDK />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}