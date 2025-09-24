const HomeContent = ({ 
  walletConnected, 
  yoyoBalanceAmount, 
  remainingGames, 
  seasonTimeLeft, 
  currentSeason 
}) => {
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return "Season Ended";
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days} days ${hours} hours`;
    if (hours > 0) return `${hours} hours ${minutes} minutes`;
    return `${minutes} minutes`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Welcome to YoYo Guild Battle! ⚔️</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Battle with your Guilders, earn points, and climb the leaderboard. 
          Hold YOYO tokens to increase your win chance and dominate the arena!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30">
          <div className="text-4xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-white mb-2">Daily Battles</h3>
          <p className="text-gray-300">
            Play {remainingGames} out of {walletConnected ? '20' : '20'} games remaining today
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-2">YOYO Boost</h3>
          <p className="text-gray-300">
            {yoyoBalanceAmount > 0 ? 
              `Active! ${yoyoBalanceAmount.toFixed(2)} YOYO (+10% win chance)` : 
              'Not active - hold YOYO for boost'
            }
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500/30">
          <div className="text-4xl mb-4">⏰</div>
          <h3 className="text-xl font-bold text-white mb-2">Season {currentSeason.seasonNumber || 1}</h3>
          <p className="text-gray-300">
            {formatTimeLeft(seasonTimeLeft)} remaining
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">How to Play</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              1
            </div>
            <h4 className="font-bold text-white mb-2">Connect Wallet</h4>
            <p className="text-gray-400 text-sm">Connect your Base-compatible wallet</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              2
            </div>
            <h4 className="font-bold text-white mb-2">Choose Guilder</h4>
            <p className="text-gray-400 text-sm">Select your fighter for the battle</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              3
            </div>
            <h4 className="font-bold text-white mb-2">Battle</h4>
            <p className="text-gray-400 text-sm">Win battles to earn points</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              4
            </div>
            <h4 className="font-bold text-white mb-2">Climb Leaderboard</h4>
            <p className="text-gray-400 text-sm">Compete for top seasonal rewards</p>
          </div>
        </div>
      </div>

      {!walletConnected && (
        <div className="text-center py-8">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Battle?</h3>
            <p className="text-gray-300 mb-6">Connect your wallet to start your Guild Battle journey!</p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105">
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeContent;