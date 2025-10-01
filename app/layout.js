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
        {/* MANUEL FARCASTER SDK YÜKLEME - MODULE FORMAT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // MANUEL FARCASTER SDK YÜKLEME - MODULE FORMAT
              (function() {
                console.log('🚀 MANUEL: Loading Farcaster SDK as module...');
                
                // Eğer SDK zaten yüklüyse, hemen ready çağır
                if (window.farcaster) {
                  console.log('✅ SDK already loaded, calling ready immediately');
                  callFarcasterReady();
                  return;
                }
                
                // Module olarak SDK yükle
                const script = document.createElement('script');
                script.type = 'module';
                script.innerHTML = \\`
                  import { sdk } from 'https://esm.sh/@farcaster/frame-sdk@0.1.4';
                  window.farcaster = sdk;
                  console.log('✅ Farcaster SDK loaded as module');
                  
                  // Ready çağır
                  if (window.farcaster?.actions?.ready) {
                    window.farcaster.actions.ready();
                    console.log('✅ sdk.actions.ready() called from module');
                  }
                \\`;
                
                script.onerror = function() {
                  console.error('❌ Failed to load SDK as module');
                  sendEmergencyReady();
                };
                
                document.head.appendChild(script);
                
                // Fallback: Eğer module yüklenmezse, classic script dene
                setTimeout(() => {
                  if (!window.farcaster) {
                    console.log('🔄 Module failed, trying classic script...');
                    loadClassicSDK();
                  }
                }, 2000);
                
                function loadClassicSDK() {
                  const classicScript = document.createElement('script');
                  classicScript.src = 'https://cdn.jsdelivr.net/npm/@farcaster/frame-sdk@0.1.4/dist.js';
                  classicScript.onload = function() {
                    console.log('✅ Classic SDK loaded');
                    callFarcasterReady();
                  };
                  classicScript.onerror = function() {
                    console.error('❌ Classic SDK also failed');
                    sendEmergencyReady();
                  };
                  document.head.appendChild(classicScript);
                }
                
                // Ready çağırma fonksiyonu
                function callFarcasterReady() {
                  try {
                    // Tüm olası SDK formatlarını dene
                    let called = false;
                    
                    // FORMAT 1: Yeni SDK - sdk.actions.ready()
                    if (window.farcaster?.actions?.ready) {
                      window.farcaster.actions.ready();
                      console.log('✅ sdk.actions.ready() called successfully');
                      called = true;
                    }
                    
                    // FORMAT 2: Eski SDK - farcaster.ready()
                    if (!called && window.farcaster?.ready) {
                      window.farcaster.ready();
                      console.log('✅ farcaster.ready() called successfully');
                      called = true;
                    }
                    
                    if (!called) {
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
                    const readyMsg = {
                      type: 'ready',
                      data: {
                        version: '1.0.0'
                      }
                    };
                    window.parent.postMessage(readyMsg, '*');
                    console.log('📨 Emergency ready sent with Farcaster format');
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