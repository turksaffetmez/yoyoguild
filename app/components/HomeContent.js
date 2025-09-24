"use client";
import { useEffect, useState } from "react";

export default function HomeContent({ walletConnected, yoyoBalance, remainingGames, seasonTimeLeft, currentSeason }) {
  const [timeLeft, setTimeLeft] = useState("");
  
  const features = [
    { icon: "⚔️", title: "Blockchain Battles", desc: "Every fight recorded on Base blockchain" },
    { icon: "💰", title: "YOYO Points", desc: "Earn points for every battle" },
    { icon: "🏆", title: "Season System", desc: "Compete in weekly seasons" },
    { icon: "🔒", title: "Provably Fair", desc: "Results stored on-chain" }
  ];

  const formatTimeLeft = (seconds) => {
    if (!seconds || seconds === 0) return "Season ended";
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days} days ${hours} hours`;
    if (hours > 0) return `${hours} hours ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  useEffect(() => {
    setTimeLeft(formatTimeLeft(seasonTimeLeft));
    
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(seasonTimeLeft));
    }, 60000);
    
    return () => clearInterval(timer);
  }, [seasonTimeLeft]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6">
          Welcome to YoYo Guild Arena
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The ultimate blockchain battle platform where every fight matters. 
          Compete, earn points, and climb the leaderboard on Base Mainnet!
        </p>
        
        {/* Season Info */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 mb-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-2">Season {currentSeason.seasonNumber || 1}</h3>
          <p className="text-gray-300">
            {timeLeft === "Season ended" ? "Season has concluded" : `Season ends in: ${timeLeft}`}
          </p>
        </div>
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
        <h3 className="text-3xl font-bold text-center text-white mb-8">Current Status</h3>
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
            <div className="text-lg font-bold text-white">{remainingGames}/20</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <div className="text-sm text-gray-400">Win Chance</div>
            <div className="text-lg font-bold text-white">{yoyoBalance > 0 ? "60%" : "50%"}</div>
          </div>
        </div>
      </div>

      {/* Points System */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
          <div className="text-3xl mb-2">🎉</div>
          <h4 className="text-lg font-bold text-white mb-2">Win with YOYO</h4>
          <p className="text-2xl font-bold text-green-400">500 Points</p>
          <p className="text-gray-400 text-sm">60% win chance</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
          <div className="text-3xl mb-2">👍</div>
          <h4 className="text-lg font-bold text-white mb-2">Win without YOYO</h4>
          <p className="text-2xl font-bold text-blue-400">250 Points</p>
          <p className="text-gray-400 text-sm">50% win chance</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/20 rounded-2xl p-6 border border-gray-500/30">
          <div className="text-3xl mb-2">💪</div>
          <h4 className="text-lg font-bold text-white mb-2">Participation</h4>
          <p className="text-2xl font-bold text-gray-400">10 Points</p>
          <p className="text-gray-400 text-sm">Always rewarded</p>
        </div>
      </div>

      {/* Call to Action */}
      {!walletConnected && (
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-green-500/30">
            <h4 className="text-2xl font-bold text-white mb-4">Ready to Begin Your Quest?</h4>
            <p className="text-gray-300 mb-6">Connect your wallet and enter the arena today!</p>
            <div className="text-yellow-400 mb-4">
              🎯 <strong>Pro Tip:</strong> Hold YOYO tokens for better rewards!
            </div>
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
            <div className={`font-semibold ${yoyoBalance > 0 ? "text-green-400" : "text-yellow-400"}`}>
              {yoyoBalance > 0 ? "🎉 YOYO Bonus Active (60% win chance)" : "💡 Get YOYO tokens for better rewards!"}
            </div>
          </div>
        </div>
      )}

      {/* Blockchain Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Powered by Base Mainnet • All transactions are secure and transparent</p>
        <p className="mt-1">Every battle is recorded on the blockchain for complete fairness</p>
      </div>
    </div>
  );
}