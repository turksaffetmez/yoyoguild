export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 p-8">
      <div className="max-w-4xl mx-auto bg-white/10 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-4">
          <p><strong>Last Updated:</strong> September 28, 2024</p>
          
          <h2 className="text-xl font-bold mt-6">1. Information We Collect</h2>
          <p>We collect only your wallet address and game performance data necessary for the gameplay and leaderboard functionality.</p>
          
          <h2 className="text-xl font-bold mt-6">2. How We Use Information</h2>
          <p>Your wallet address is used to track your points and display on the leaderboard. We do not sell or share your data with third parties.</p>
          
          <h2 className="text-xl font-bold mt-6">3. Blockchain Transparency</h2>
          <p>All game transactions are public on the Base blockchain. Your wallet address and points are visible on the public leaderboard.</p>
          
          <h2 className="text-xl font-bold mt-6">4. Data Storage</h2>
          <p>Your game data is stored on the blockchain and in our secure database. We implement industry-standard security measures.</p>
          
          <h2 className="text-xl font-bold mt-6">5. Your Rights</h2>
          <p>You can disconnect your wallet at any time to stop data collection. However, your historical game data remains on the blockchain.</p>
          
          <h2 className="text-xl font-bold mt-6">6. Contact</h2>
          <p>For privacy concerns, contact us through our official channels.</p>
        </div>
      </div>
    </div>
  )
}