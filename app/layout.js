import './globals.css'

export const metadata = {
  title: 'YoYo Guild Battle - Blockchain Battle Arena',
  description: 'Premium blockchain-based battling game with Guilders. Battle Tevans, earn points, win YOYO on Base network!',
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
    
    // Mini App Meta Tags
    'fc:mini-app:name': 'YoYo Guild Battle',
    'fc:mini-app:icon': 'https://yoyoguild.vercel.app/images/yoyo.png',
    'fc:mini-app:description': 'Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!',
    'fc:mini-app:url': 'https://yoyoguild.vercel.app',
    'fc:mini-app:terms': 'https://yoyoguild.vercel.app/terms',
    'fc:mini-app:privacy': 'https://yoyoguild.vercel.app/privacy',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/yoyo.png" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}