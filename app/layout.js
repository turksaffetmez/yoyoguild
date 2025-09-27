import './globals.css'
import FarcasterMiniApp from './components/FarcasterMiniApp'

export const metadata = {
  title: 'YoYo Guild - Blockchain Battle Arena',
  description: 'Premium blockchain-based battling game with Guilders',
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://yoyoguild.vercel.app/images/page.png',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': '🎮 Play Game',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://yoyoguild.vercel.app?source=farcaster',
    'fc:frame:button:2': '🏆 Leaderboard',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://yoyoguild.vercel.app?source=farcaster&tab=leaderboard',
    
    // Mini App specific meta tags
    'fc:mini-app:name': 'YoYo Guild Battle',
    'fc:mini-app:icon': 'https://yoyoguild.vercel.app/images/yoyo.png',
    'fc:mini-app:description': 'Blockchain Battle Arena on Base',
    'fc:mini-app:url': 'https://yoyoguild.vercel.app',
    'fc:mini-app:terms': 'https://yoyoguild.vercel.app/terms',
    'fc:mini-app:privacy': 'https://yoyoguild.vercel.app/privacy'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/yoyo.png" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <FarcasterMiniApp />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}