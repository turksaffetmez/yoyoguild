export default function FramePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">YoYo Guild Battle</h1>
        <p className="text-xl mb-8">Frame should be visible in Farcaster</p>
        <img 
          src="/images/page.png" 
          alt="YoYo Guild Battle" 
          className="mx-auto rounded-lg max-w-md mb-8"
        />
        <div className="space-y-4">
          <a 
            href="https://yoyoguild.vercel.app?source=farcaster" 
            className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            🎮 Play Game
          </a>
          <a 
            href="https://yoyoguild.vercel.app?source=farcaster&tab=leaderboard" 
            className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            🏆 Leaderboard
          </a>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'YoYo Guild Battle Frame',
  description: 'Blockchain Battle Arena on Base',
  openGraph: {
    title: 'YoYo Guild Battle',
    description: 'Blockchain Battle Arena on Base - Battle Tevans, earn points, win YOYO!',
    images: ['https://yoyoguild.vercel.app/images/page.png'],
    url: 'https://yoyoguild.vercel.app/frame',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YoYo Guild Battle',
    description: 'Blockchain Battle Arena on Base',
    images: ['https://yoyoguild.vercel.app/images/page.png'],
  }
}