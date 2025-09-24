import { useState, useEffect } from 'react';

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
  const [displayYoyoBalance, setDisplayYoyoBalance] = useState(0);

  // YOYO balance güncellemesi için effect
  useEffect(() => {
    setDisplayYoyoBalance(yoyoBalanceAmount);
  }, [yoyoBalanceAmount]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return "00:00:00";
    
    const seconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeasonStatus = () => {
    if (currentSeason.active) {
      return {
        text: `Season ${currentSeason.seasonNumber} ends in`,
        time: formatTimeLeft(currentSeason.timeUntilEnd),
        color: "text-green-400"
      };
    } else if (currentSeason.timeUntilStart > 0 || currentSeason.isPreseason) {
      return {
        text: currentSeason.isPreseason ? "Preseason - Season starts in" : `Season ${currentSeason.seasonNumber} starts in`,
        time: formatTimeLeft(currentSeason.timeUntilStart),
        color: "text-yellow-400"
      };
    } else {
      return {
        text: "Season Ended",
        time: "00:00:00",
        color: "text-red-400"
      };
    }
  };

  const seasonStatus = getSeasonStatus();

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 border border-slate-600 shadow-lg">
      {!walletConnected ? (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">Connect Your Wallet to Start Battling!</h3>
          <button
            onClick={isMobile ? onShowWalletOptions : onConnect}
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              "Connect Wallet"
            )}
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
              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-mono">
                {formatAddress(userAddress)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onDisconnect}
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* DETAYLAR DOĞRUDAN GÖSTERİLİYOR - SHOW/HIDE KALDIRILDI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-600">
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Total Points</div>
              <div className="text-2xl font-bold text-yellow-400">{points.toLocaleString()}</div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Season Points</div>
              <div className="text-2xl font-bold text-green-400">{seasonPoints.toLocaleString()}</div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">YOYO Balance</div>
              <div className="text-2xl font-bold text-purple-400">
                {displayYoyoBalance.toFixed(2)} YOYO
              </div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Games Today</div>
              <div className="text-2xl font-bold text-blue-400">
                {remainingGames}/{dailyLimit}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-300">
              <span>{currentSeason.isPreseason ? 'Preseason' : `Season ${currentSeason.seasonNumber}`}</span>
              <span>•</span>
              <span className={seasonStatus.color}>
                {seasonStatus.text}: {seasonStatus.time}
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