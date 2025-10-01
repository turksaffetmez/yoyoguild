import './globals.css'
import FarcasterSDK from './components/FarcasterSDK'
import SplashRemover from './components/SplashRemover'

export const metadata = {
  title: 'YoYo Guild Battle - Blockchain Battle Arena',
  description: 'Premium blockchain-based battling game with Guilders. Battle Tevans, earn points, win YOYO on Base network!',
  metadataBase: new URL('https://yoyoguild.vercel.app'),
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="/ready.js" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>YoYo Guild Battle - Blockchain Battle Arena</title>
        
        {/* ACİL READY FIX - Splash screen için */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // ACİL READY FIX - Splash screen için
              if (window.parent !== window.self) {
                console.log('🚀 EMERGENCY: Sending immediate ready from layout');
                
                // Acil ready mesajı
                const emergencyReady = () => {
                  const msg = { 
                    type: 'ready', 
                    version: '1.0.0', 
                    app: 'YoYo Guild Battle',
                    timestamp: Date.now(),
                    emergency: true 
                  };
                  window.parent.postMessage(msg, '*');
                  console.log('📨 Emergency ready sent:', msg.timestamp);
                };
                
                // HEMEN gönder
                emergencyReady();
                
                // Hızlı aralıklarla tekrarla
                [50, 150, 300, 600, 1000, 2000, 3000, 5000].forEach(timeout => {
                  setTimeout(emergencyReady, timeout);
                });
              }

              // Sayfa yüklendikten sonra da ready gönder
              window.addEventListener('load', () => {
                if (window.parent !== window.self) {
                  setTimeout(() => {
                    const msg = { type: 'ready', version: '1.0.0', event: 'page_load' };
                    window.parent.postMessage(msg, '*');
                    console.log('📨 Ready sent after page load');
                  }, 100);
                }
              });
            `
          }}
        />
        
        {/* 1. FARCASTER FRAME TAGS - EN KRİTİK - BUNLAR EKLENDİ */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🎮 Play Game" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:2" content="🏆 Leaderboard" />
        <meta property="fc:frame:button:2:action" content="post" />
        
        {/* 2. OPEN GRAPH TAGS - Frame için zorunlu */}
        <meta property="og:title" content="YoYo Guild Battle" />
        <meta property="og:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="og:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="YoYo Guild Battle" />
        <meta property="og:url" content="https://yoyoguild.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="YoYo Guild Battle" />
        
        {/* 3. TWITTER CARD TAGS */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YoYo Guild Battle" />
        <meta name="twitter:description" content="Blockchain Battle Arena on Base" />
        <meta name="twitter:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta name="twitter:site" content="@yoyoguild" />
        
        {/* 4. FARCASTER MINI APP TAGS - Mevcut */}
        <meta property="fc:mini-app:name" content="YoYo Guild Battle" />
        <meta property="fc:mini-app:icon" content="https://yoyoguild.vercel.app/images/logo.png" />
        <meta property="fc:mini-app:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="fc:mini-app:url" content="https://yoyoguild.vercel.app" />
        <meta property="fc:mini-app:terms" content="https://yoyoguild.vercel.app/api/terms" />
        <meta property="fc:mini-app:privacy" content="https://yoyoguild.vercel.app/api/privacy" />
        
        {/* 5. BASE MINI APP TAGS - Mevcut */}
        <meta name="base:title" content="YoYo Guild Battle" />
        <meta name="base:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta name="base:icon" content="https://yoyoguild.vercel.app/images/logo.png" />
        <meta name="base:image" content="https://yoyoguild.vercel.app/images/logo.png" />
        <meta name="base:splash" content="https://yoyoguild.vercel.app/images/yoyo.png" />
        <meta name="base:splashBackground" content="#000000" />
        <meta name="base:url" content="https://yoyoguild.vercel.app" />
        <meta name="base:network" content="base" />
        <meta name="base:category" content="gaming" />
        <meta name="base:tags" content="gaming,battle,blockchain,yoyo,base,nft,points" />
        <meta name="base:ogImageUrl" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta name="base:ogTitle" content="YoYo Guild Battle" />
        <meta name="base:ogDescription" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta name="base:primaryCategory" content="gaming" />
        
        <link rel="icon" href="/images/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <FarcasterSDK />
        <SplashRemover />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}