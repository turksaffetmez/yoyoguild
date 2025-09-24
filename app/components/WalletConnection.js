"use client";
import { useState, useEffect } from "react";

export default function WalletConnection({
  walletConnected,
  userAddress,
  points,
  seasonPoints,
  yoyoBalance,
  onDisconnect,
  onConnect,
  isMobile,
  onShowWalletOptions,
  remainingGames,
  dailyLimit,
  seasonTimeLeft
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const formatAddress = (address) => {
    if (!address) return "Not Connected";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeLeft = (seconds) => {
    if (!seconds || seconds === 0) return "Season ended";
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const copyAddress = async () => {
    if (userAddress) {
      await navigator.clipboard.writeText(userAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  useEffect(() => {
    setTimeLeft(formatTimeLeft(seasonTimeLeft));
    
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(seasonTimeLeft));
    }, 60000);
    
    return () => clearInterval(timer);
  }, [seasonTimeLeft]);

  return (
    <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-3xl p-6 shadow-2xl border-2 border-purple-500/20 mb-8 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
        
        {/* Connection Status */}
        <div className="flex items-center space-x-4">
          <div className={`relative w-4 h-4 rounded-full ${walletConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}>
            <div className={`absolute inset-0 rounded-full ${walletConnected ? "bg-green-400 animate-ping" : "bg-red-400"} opacity-75`}></div>
          </div>
          <div>
            <div className="text-sm text-gray-400">STATUS</div>
            <div className={`font-bold text-lg ${walletConnected ? "text-green-400" : "text-red-400"}`}>
              {walletConnected ? "CONNECTED" : "NOT CONNECTED"}
            </div>
          </div>
        </div>

        {/* Address with Copy */}
        <div className="text-center group relative">
          <div className="text-sm text-gray-400">WALLET ADDRESS</div>
          <button 
            onClick={copyAddress}
            className="font-mono font-bold text-white text-lg hover:text-purple-300 transition-colors"
            disabled={!walletConnected}
          >
            {formatAddress(userAddress)}
            {walletConnected && (
              <span className="ml-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {isCopied ? "✅" : "📋"}
              </span>
            )}
          </button>
          {isCopied && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-sm">
              Copied!
            </div>
          )}
        </div>

        {/* Total Points */}
        <div className="text-center">
          <div className="text-sm text-gray-400">TOTAL POINTS</div>
          <div className="font-bold text-blue-400 text-2xl">{points.toLocaleString()}</div>
        </div>

        {/* Season Points */}
        <div className="text-center">
          <div className="text-sm text-gray-400">SEASON POINTS</div>
          <div className="font-bold text-purple-400 text-2xl">{seasonPoints.toLocaleString()}</div>
        </div>

        {/* YOYO Balance */}
        <div className="text-center">
          <div className="text-sm text-gray-400">YOYO BALANCE</div>
          <div className="font-bold text-green-400 text-2xl">{yoyoBalance.toFixed(2)}</div>
        </div>

        {/* Daily Games */}
        <div className="text-center">
          <div className="text-sm text-gray-400">DAILY GAMES</div>
          <div className="font-bold text-orange-400 text-2xl">{remainingGames}<span className="text-sm text-gray-400">/{dailyLimit}</span></div>
        </div>

        {/* Season Timer */}
        <div className="text-center">
          <div className="text-sm text-gray-400">SEASON ENDS</div>
          <div className="font-bold text-yellow-400 text-xl">{timeLeft}</div>
        </div>

        {/* Action Button */}
        <div className="flex space-x-3">
          {!walletConnected ? (
            <button
              onClick={isMobile ? onShowWalletOptions : onConnect}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2"
            >
              <span>🔗</span>
              <span>Connect Wallet</span>
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-3 px-8 rounded-xl hover:from-red-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* Connection Progress Bar */}
      <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000 shadow-lg"
          style={{ width: walletConnected ? "100%" : "0%" }}
        ></div>
      </div>

      {/* Daily Progress */}
      <div className="mt-3 flex justify-between text-xs text-gray-400">
        <span>Daily Progress ({dailyLimit - remainingGames}/{dailyLimit})</span>
        <span>Season Points: {seasonPoints.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1">
        <div 
          className="bg-gradient-to-r from-orange-500 to-yellow-500 h-1 rounded-full transition-all duration-500"
          style={{ width: `${((dailyLimit - remainingGames) / dailyLimit) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}