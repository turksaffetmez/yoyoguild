import { useState } from 'react';

const WalletConnection = ({
  walletConnected,
  userAddress,
  points,
  seasonPoints,
  yoyoBalanceAmount,
  onDisconnect,
  onConnect,
  isMobile,
  onShowWalletOptions,
  remainingGames,
  dailyLimit,
  seasonTimeLeft,
  currentSeason,
  isLoading
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return "Season Ended";
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 mb-6 border border-gray-600 shadow-lg">
      {!walletConnected ? (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">Connect Your Wallet to Start Battling!</h3>
          <button
            onClick={isMobile ? onShowWalletOptions : onConnect}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
          {isMobile && (
            <p className="text-gray-400 mt-2 text-sm">
              Mobile wallet detected. Tap to select your wallet.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Connected</span>
              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                {formatAddress(userAddress)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="bg-gray-600 px-4 py-2 rounded-lg text-white hover:bg-gray-500 transition-colors"
              >
                {showDetails ? "Hide" : "Show"} Details
              </button>
              <button
                onClick={onDisconnect}
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-600">
              <div className="bg-gray-900/50 p-4 rounded-xl">
                <div className="text-gray-400 text-sm">Total Points</div>
                <div className="text-2xl font-bold text-yellow-400">{points.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-xl">
                <div className="text-gray-400 text-sm">Season Points</div>
                <div className="text-2xl font-bold text-green-400">{seasonPoints.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-xl">
                <div className="text-gray-400 text-sm">YOYO Balance</div>
                <div className="text-2xl font-bold text-purple-400">
                  {yoyoBalanceAmount > 0 ? `${yoyoBalanceAmount.toFixed(2)} 🎯` : "0"}
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-xl">
                <div className="text-gray-400 text-sm">Games Today</div>
                <div className="text-2xl font-bold text-blue-400">
                  {remainingGames}/{dailyLimit}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <span>Season {currentSeason.seasonNumber || 1}</span>
              <span>•</span>
              <span className={seasonTimeLeft > 0 ? "text-green-400" : "text-red-400"}>
                {formatTimeLeft(seasonTimeLeft)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full ${
                yoyoBalanceAmount > 0 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {yoyoBalanceAmount > 0 ? "🎯 Boost Active (+10% Win)" : "No YOYO Boost"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;