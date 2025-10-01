import { useState, useEffect } from 'react';

const WalletConnection = ({
  walletConnected,
  userAddress,
  points,
  yoyoBalanceAmount,
  onDisconnect,
  onConnect,
  isMobile,
  remainingGames,
  dailyLimit,
  isLoading,
  pointValues,
  playerStats
}) => {
  const [displayYoyoBalance, setDisplayYoyoBalance] = useState(0);

  const showMaintenanceMessage = () => {
    alert("Wallet connection is under maintenance. It will be available soon.");
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 border border-slate-600 shadow-lg">
      {!walletConnected ? (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">Connect Your Wallet to Start Battling!</h3>
          
          <button
            onClick={showMaintenanceMessage}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 mb-3"
          >
            Connect Wallet
          </button>
          
          <p className="text-yellow-400 text-sm mt-2">
            ⚠️ Wallet connection under maintenance
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Connected</span>
              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-mono">
                {formatAddress(userAddress)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onDisconnect}
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-600">
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Total Points</div>
              <div className="text-2xl font-bold text-yellow-400">{points.toLocaleString()}</div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Games Today</div>
              <div className="text-2xl font-bold text-blue-400">
                {remainingGames}/{dailyLimit}
              </div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">YOYO Balance</div>
              <div className="text-2xl font-bold text-purple-400">
                {displayYoyoBalance > 0 ? displayYoyoBalance.toFixed(2) : '0'} YOYO
              </div>
              {displayYoyoBalance > 0 && (
                <div className="text-xs text-green-400 mt-1">
                  🎯 Boost Active (+10% Win)
                </div>
              )}
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Win Rate</div>
              <div className="text-2xl font-bold text-green-400">
                {playerStats?.winRate || 0}%
              </div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Total Games</div>
              <div className="text-2xl font-bold text-orange-400">
                {playerStats?.totalGames || 0}
              </div>
            </div>
          </div>

          {playerStats && playerStats.totalGames > 0 && (
            <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-600">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-green-400 font-bold">{playerStats.totalWins} Wins</div>
                </div>
                <div>
                  <div className="text-red-400 font-bold">{playerStats.totalLosses} Losses</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">Streak: {playerStats.winStreak}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-600">
            <div className="text-center text-sm text-gray-300">
              <span className="font-semibold text-green-400">Point System: </span>
              <span>Win {pointValues.winNormal} points | </span>
              <span className="text-yellow-400">Win with YOYO {pointValues.winYoyo} points | </span>
              <span className="text-red-400">Lose {pointValues.lose} points</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-300">
              <span>Total Points Leaderboard</span>
              <span>•</span>
              <span className="text-green-400">
                Real-time Updates
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full ${
                displayYoyoBalance > 0 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {displayYoyoBalance > 0 ? "🎯 Boost Active (+10% Win)" : "No YOYO Boost"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;