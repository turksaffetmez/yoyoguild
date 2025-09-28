export default function FramePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">YoYo Guild Battle</h1>
        <p className="text-xl mb-8">Frame should be visible in Farcaster</p>
        <img 
          src="/images/page.png" 
          alt="YoYo Guild Battle" 
          className="mx-auto rounded-lg max-w-md"
        />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'YoYo Guild Battle Frame',
  description: 'Blockchain Battle Arena on Base',
  openGraph: {
    title: 'YoYo Guild Battle',
    description: 'Blockchain Battle Arena on Base',
    images: ['https://yoyoguild.vercel.app/images/page.png'],
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
  }
}