"use client";

export default function HomeContent({ walletConnected, yoyoBalance, remainingGames }) {
  const features = [
    { icon: "⚔️", title: "Epic Battles", desc: "Real-time Guilder vs Guilder combat" },
    { icon: "💰", title: "Earn Points", desc: "Win battles to climb leaderboard" },
    { icon: "🔗", title: "Blockchain", desc: "Secure on-chain transactions" },
    { icon: "🎮", title: "Daily Limits", desc: "5 strategic battles per day" }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6">
          Welcome to YoYo Guild Arena
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The ultimate blockchain battle platform where strategy meets rewards. 
          Assemble your Guilders, enter the arena, and claim your victory!
        </p>
        
        {!walletConnected && (
          <div className="animate-pulse">
            <div className="text-2xl text-yellow-400 mb-4">🔒 Connect your wallet to begin your journey</div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 text-center border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats Dashboard */}
      <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-3xl p-8 mb-12 border border-purple-500/20">
        <h3 className="text-3xl font-bold text-center text-white mb-8">Today's Battle Readiness</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">{walletConnected ? "✅" : "❌"}</div>
            <div className="text-sm text-gray-400">Wallet Status</div>
            <div className="text-lg font-bold text-white">{walletConnected ? "Connected" : "Not Connected"}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">{yoyoBalance > 0 ? "✅" : "⚠️"}</div>
            <div className="text-sm text-gray-400">YOYO Tokens</div>
            <div className="text-lg font-bold text-white">{yoyoBalance > 0 ? "Bonus Active" : "No Bonus"}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <div className="text-sm text-gray-400">Battles Available</div>
            <div className="text-lg font-bold text-white">{remainingGames}/5</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <div className="text-sm text-gray-400">Win Chance</div>
            <div className="text-lg font-bold text-white">{yoyoBalance > 0 ? "60%" : "50%"}</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!walletConnected && (
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-green-500/30">
            <h4 className="text-2xl font-bold text-white mb-4">Ready to Begin Your Quest?</h4>
            <p className="text-gray-300 mb-6">Connect your wallet and enter the arena today!</p>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-12 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl text-lg">
              🚀 Start Battling Now
            </button>
          </div>
        </div>
      )}

      {/* Connected State */}
      {walletConnected && (
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/30">
            <h4 className="text-2xl font-bold text-white mb-4">You're Battle Ready! ⚔️</h4>
            <p className="text-gray-300 mb-4">
              {remainingGames > 0 
                ? `You have ${remainingGames} battle${remainingGames > 1 ? 's' : ''} remaining today!`
                : "You've completed today's battles. Return tomorrow for more!"}
            </p>
            <div className="text-green-400 font-semibold">
              {yoyoBalance > 0 ? "🎉 YOYO Bonus Active (60% win chance)" : "💡 Get YOYO tokens for better odds!"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}