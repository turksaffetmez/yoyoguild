import './globals.css'

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
    'fc:frame:button:1:target': 'https://yoyoguild.vercel.app',
    'fc:frame:button:2': '🏆 Leaderboard',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://yoyoguild.vercel.app?tab=leaderboard'
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