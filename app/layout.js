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
        {/* MANUEL FARCASTER SDK YÜKLEME - EN KRİTİK KISIM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // MANUEL FARCASTER SDK YÜKLEME
              (function() {
                console.log('🚀 MANUEL: Loading Farcaster SDK...');
                
                // Eğer SDK zaten yüklüyse, hemen ready çağır
                if (window.farcaster) {
                  console.log('✅ SDK already loaded, calling ready immediately');
                  callFarcasterReady();
                  return;
                }
                
                // Manuel olarak SDK yükle
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@farcaster/frame-sdk@0.1.4/dist.js';
                script.async = true;
                script.onload = function() {
                  console.log('✅ Farcaster SDK manually loaded successfully');
                  callFarcasterReady();
                };
                script.onerror = function() {
                  console.error('❌ Failed to load Farcaster SDK');
                  sendEmergencyReady();
                };
                document.head.appendChild(script);
                
                // Ready çağırma fonksiyonu
                function callFarcasterReady() {
                  try {
                    if (window.farcaster?.actions?.ready) {
                      window.farcaster.actions.ready();
                      console.log('✅ sdk.actions.ready() called successfully');
                    } else if (window.farcaster?.ready) {
                      window.farcaster.ready();
                      console.log('✅ farcaster.ready() called successfully');
                    } else {
                      console.warn('⚠️ SDK loaded but no ready method found');
                      sendEmergencyReady();
                    }
                  } catch (error) {
                    console.error('❌ Error calling ready:', error);
                    sendEmergencyReady();
                  }
                }
                
                // Acil ready mesajı (fallback)
                function sendEmergencyReady() {
                  if (window.parent !== window) {
                    window.parent.postMessage({ 
                      type: 'ready', 
                      version: '1.0.0',
                      app: 'YoYo Guild Battle',
                      manual: true,
                      timestamp: Date.now()
                    }, '*');
                    console.log('📨 Emergency ready sent (manual fallback)');
                  }
                }
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