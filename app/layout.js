import './globals.css'
import FarcasterMiniApp from './components/FarcasterMiniApp'
import MetaTags from './components/MetaTags'

export const metadata = {
  title: 'YoYo Guild - Blockchain Battle Arena',
  description: 'Premium blockchain-based battling game with Guilders',
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/yoyo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <MetaTags />
        <FarcasterMiniApp />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}