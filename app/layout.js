import './globals.css'
import FarcasterSDK from './components/FarcasterSDK'
import SplashRemover from './components/SplashRemover'

export const metadata = {
  title: 'YoYo Guild Battle - Blockchain Battle Arena',
  description: 'Premium blockchain-based battling game with Guilders. Battle Tevans, earn points, win YOYO on Base network!',
  metadataBase: new URL('https://yoyoguild.vercel.app'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="/ready.js" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>YoYo Guild Battle - Blockchain Battle Arena</title>
        
        {/* MINI APP READY SCRIPT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // MINI APP READY - Sadeleştirilmiş
              if (window.parent !== window.self) {
                console.log('🚀 YoYo Mini App Loading...');
                
                const sendReady = () => {
                  const msg = { 
                    type: 'ready', 
                    version: '1.0.0', 
                    app: 'YoYo Guild Battle',
                    timestamp: Date.now()
                  };
                  window.parent.postMessage(msg, '*');
                };
                
                sendReady();
                [100, 500, 1000, 2000, 5000].forEach(t => setTimeout(sendReady, t));
              }
            `
          }}
        />
        
        {/* FARCASTER MINI APP TAGS - SADECE BUNLAR GEREKLİ */}
        <meta property="fc:mini-app:name" content="YoYo Guild Battle" />
        <meta property="fc:mini-app:icon" content="https://yoyoguild.vercel.app/images/logo.png" />
        <meta property="fc:mini-app:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="fc:mini-app:url" content="https://yoyoguild.vercel.app" />
        
        {/* OPEN GRAPH - Mini App preview için gerekli */}
        <meta property="og:title" content="YoYo Guild Battle" />
        <meta property="og:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="og:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta property="og:url" content="https://yoyoguild.vercel.app" />
        <meta property="og:type" content="website" />
        
        {/* TWITTER CARD - Preview için */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YoYo Guild Battle" />
        <meta name="twitter:description" content="Blockchain Battle Arena on Base" />
        <meta name="twitter:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        
        <link rel="icon" href="/images/logo.png" />
		<link rel="farcaster-manifest" href="/manifest.json" />
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