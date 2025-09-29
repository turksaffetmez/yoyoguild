import './globals.css'
import FarcasterSDK from './components/FarcasterSDK'
import { AppKit } from '@reown/appkit/react'
import { ethersAdapter } from '@reown/appkit-adapter-ethers'

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
    images: [
      {
        url: 'https://yoyoguild.vercel.app/images/baseapp.png',
        width: 1200,
        height: 630,
        alt: 'YoYo Guild Battle',
      }
    ],
    url: 'https://yoyoguild.vercel.app',
    type: 'website',
    siteName: 'YoYo Guild Battle',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YoYo Guild Battle',
    description: 'Blockchain Battle Arena on Base',
    images: ['https://yoyoguild.vercel.app/images/baseapp.png'],
    creator: '@yoyoguild',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="/ready.js" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>YoYo Guild Battle - Blockchain Battle Arena</title>
        
        {/* IMMEDIATE READY SCRIPT - CRITICAL FOR BASE APP */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // IMMEDIATE READY CALL - Base App için kritik!
              if (window.parent !== window.self) {
                console.log('🚀 Layout.js: Sending immediate ready...');
                const readyMsg = {
                  type: 'ready',
                  version: '1.0.0',
                  app: 'YoYo Guild Battle',
                  from: 'layout-head',
                  timestamp: Date.now()
                };
                
                // Hemen gönder
                window.parent.postMessage(readyMsg, '*');
                
                // Kısa aralıklarla tekrar gönder
                setTimeout(() => {
                  window.parent.postMessage(readyMsg, '*');
                  console.log('📨 Layout.js: Second ready sent');
                }, 300);
                
                setTimeout(() => {
                  window.parent.postMessage(readyMsg, '*');
                  console.log('📨 Layout.js: Third ready sent');
                }, 1000);
              }
            `
          }}
        />
        
        {/* CRITICAL - Open Graph Tags for Base Preview */}
        <meta property="og:title" content="YoYo Guild Battle" />
        <meta property="og:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="og:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="YoYo Guild Battle" />
        <meta property="og:url" content="https://yoyoguild.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="YoYo Guild Battle" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YoYo Guild Battle" />
        <meta name="twitter:description" content="Blockchain Battle Arena on Base" />
        <meta name="twitter:image" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta name="twitter:site" content="@yoyoguild" />
        
        {/* Farcaster Mini App Tags */}
        <meta property="fc:mini-app:name" content="YoYo Guild Battle" />
        <meta property="fc:mini-app:icon" content="https://yoyoguild.vercel.app/images/yoyo.png" />
        <meta property="fc:mini-app:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta property="fc:mini-app:url" content="https://yoyoguild.vercel.app" />
        <meta property="fc:mini-app:terms" content="https://yoyoguild.vercel.app/api/terms" />
        <meta property="fc:mini-app:privacy" content="https://yoyoguild.vercel.app/api/privacy" />
        
        {/* Base Mini App Tags - CRITICAL FOR BASE */}
        <meta name="base:title" content="YoYo Guild Battle" />
        <meta name="base:description" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta name="base:icon" content="https://yoyoguild.vercel.app/images/yoyo.png" />
        <meta name="base:image" content="https://yoyoguild.vercel.app/images/yoyo.png" />
        <meta name="base:splash" content="https://yoyoguild.vercel.app/images/page.png" />
        <meta name="base:splashBackground" content="#000000" />
        <meta name="base:url" content="https://yoyoguild.vercel.app" />
        <meta name="base:network" content="base" />
        <meta name="base:category" content="gaming" />
        <meta name="base:tags" content="gaming,battle,blockchain,yoyo,base,nft,points" />
        <meta name="base:ogImageUrl" content="https://yoyoguild.vercel.app/images/baseapp.png" />
        <meta name="base:ogTitle" content="YoYo Guild Battle" />
        <meta name="base:ogDescription" content="Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!" />
        <meta name="base:primaryCategory" content="gaming" />
        
        <link rel="icon" href="/images/yoyo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <AppKit
          projectId="e8db88fb3beee69a329da06119e72095" // WalletConnect Cloud'dan alacaksınız
          networks={[{
            id: 8453,
            name: 'Base',
            currency: 'ETH',
            explorerUrl: 'https://basescan.org',
            rpcUrl: 'https://mainnet.base.org'
          }]}
          defaultNetwork={8453}
          adapters={[ethersAdapter]}
          features={{
            analytics: true,
            allWallets: true
          }}
          themeMode="dark"
          themeVariables={{
            '--w3m-accent': '#8B5CF6',
            '--w3m-border-radius-master': '12px'
          }}
        >
          <FarcasterSDK />
          <main className="min-h-screen">
            {children}
          </main>
        </AppKit>
      </body>
    </html>
  )
}