import './globals.css'
import FarcasterSDK from './components/FarcasterSDK'

export const metadata = {
  title: 'YoYo Guild Battle - Blockchain Battle Arena',
  description: 'Premium blockchain-based battling game with Guilders. Battle Tevans, earn points, win YOYO on Base network!',
  metadataBase: new URL('https://yoyoguild.vercel.app'),
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'YoYo Guild Battle',
    description: 'Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!',
    images: ['https://yoyoguild.vercel.app/images/page.png'],
    url: 'https://yoyoguild.vercel.app',
    type: 'website',
    siteName: 'YoYo Guild Battle',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YoYo Guild Battle',
    description: 'Blockchain Battle Arena on Base',
    images: ['https://yoyoguild.vercel.app/images/page.png'],
    creator: '@yoyoguild',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>YoYo Guild Battle - Blockchain Battle Arena</title>
        
        {/* Open Graph - CRITICAL FOR EMBED */}
        <meta property="og:title" content="YoYo Guild Battle" />
        <meta property="og:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="og:image" content="https://yoyoguild.vercel.app/images/page.png" />
        <meta property="og:url" content="https://yoyoguild.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="YoYo Guild Battle" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YoYo Guild Battle" />
        <meta name="twitter:description" content="Blockchain Battle Arena on Base" />
        <meta name="twitter:image" content="https://yoyoguild.vercel.app/images/page.png" />
        
        {/* Farcaster Frame Tags - CRITICAL FOR EMBED */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://yoyoguild.vercel.app/images/page.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="🎮 Play Game" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:1:target" content="https://yoyoguild.vercel.app/api/frame" />
        <meta property="fc:frame:button:2" content="🏆 Leaderboard" /> 
        <meta property="fc:frame:button:2:action" content="post" />
        <meta property="fc:frame:button:2:target" content="https://yoyoguild.vercel.app/api/frame?action=leaderboard" />
        
        {/* Farcaster Mini App Tags */}
        <meta property="fc:mini-app:name" content="YoYo Guild Battle" />
        <meta property="fc:mini-app:icon" content="https://yoyoguild.vercel.app/images/yoyo.png" />
        <meta property="fc:mini-app:description" content="Blockchain Battle Arena on Base" />
        <meta property="fc:mini-app:url" content="https://yoyoguild.vercel.app" />
        <meta property="fc:mini-app:terms" content="https://yoyoguild.vercel.app/api/terms" />
        <meta property="fc:mini-app:privacy" content="https://yoyoguild.vercel.app/api/privacy" />
        
        <link rel="icon" href="/images/yoyo.png" />
        <link rel="manifest" href="/manifest.json" />
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