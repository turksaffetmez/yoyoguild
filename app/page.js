"use client";
import { useEffect } from "react";
import { useGameState } from "./hooks/useGameState";
import WalletConnection from "./components/WalletConnection";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import HomeContent from "./components/HomeContent";
import FarcasterWallet from "./components/FarcasterWallet";
import FarcasterMiniApp from "./components/FarcasterMiniApp";
import MetaTags from "./components/MetaTags";
import Image from "next/image";

export default function Home() {
  const {
    activeTab, setActiveTab,
    pointValues,
    isFarcasterMiniApp,
    isClient,
    gameState, setGameState
  } = useGameState();

  const showMaintenanceMessage = () => {
    alert("Wallet connection is under maintenance. It will be available soon.");
  };

  const startGame = () => {
    showMaintenanceMessage();
  };

  const startNewGame = () => {
    // Oyun state'ini sıfırla ama işlem yapma
    setGameState(prev => ({
      ...prev,
      selectedImage: null,
      winnerIndex: null,
      gamePhase: "idle",
      isLoading: false,
      pointsEarned: 0,
      isWinner: false,
      countdown: null
    }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      selectedImage: null,
      winnerIndex: null,
      gamePhase: "idle",
      isLoading: false,
      pointsEarned: 0,
      isWinner: false,
      countdown: null
    }));
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading YoYo Guild Battle...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center p-4 ${isFarcasterMiniApp ? 'farcaster-mini-app' : ''}`}>
      <MetaTags />
      <FarcasterMiniApp />
      
      <div className="w-full max-w-6xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30 backdrop-blur-sm">
        <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-6 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="flex items-center justify-center space-x-4 relative z-10">
            <Image src="/images/yoyo.png" alt="YoYo Guild" width={80} height={80} className="rounded-full" />
            <div>
              <h1 className="text-4xl font-bold">YoYo Guild Battle</h1>
              <p className="text-sm opacity-90 mt-1">
                Battle ! Earn $YoYo !
              </p>
            </div>
          </div>
        </header>
        
        <nav className="bg-slate-800/80 p-4 border-b border-slate-700/50 backdrop-blur-sm">
          <div className="flex flex-wrap justify-center gap-3">
            {["home", "play", "leaderboard"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                  activeTab === tab 
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                }`}
              >
                {tab === "home" ? "🏠 Home" : tab === "play" ? "⚔️ Arena" : "🏆 Leaderboard"}
              </button>
            ))}
            <a 
              href="https://tevaera.com/guilds/YoYo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              👥 Join Guild
            </a>
          </div>
        </nav>
        
        <div className="p-6">
          <FarcasterWallet />
          
          <WalletConnection pointValues={pointValues} />
          
          <div className="min-h-[500px]">
            {activeTab === "home" && (
              <HomeContent 
                walletConnected={false} 
                yoyoBalanceAmount={0}
                remainingGames={0}
                pointValues={pointValues}
                playerStats={null}
              />
            )}
            {activeTab === "play" && (
              <GameBoard
                walletConnected={false}
                gameState={gameState}
                yoyoBalanceAmount={0}
                points={0}
                onStartGame={startGame}
                onConnectWallet={showMaintenanceMessage}
                isMobile={false}
                onStartNewGame={startNewGame}
                onResetGame={resetGame}
                remainingGames={0}
                dailyLimit={20}
                isLoading={false}
                pointValues={pointValues}
                playerStats={null}
              />
            )}
            {activeTab === "leaderboard" && (
              <Leaderboard />
            )}
          </div>
        </div>
        
        {!isFarcasterMiniApp && (
          <footer className="bg-slate-900/80 text-gray-400 py-4 text-center border-t border-slate-700/50 backdrop-blur-sm">
            <p>YoYo Guild Battle | Base Mainnet</p>
          </footer>
        )}
      </div>
    </div>
  );
}