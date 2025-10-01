"use client";
import { useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract";
import { useGameState } from "./hooks/useGameState";
import { useContract } from "./hooks/useContract";
import { useGameLogic } from "./hooks/useGameLogic";
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
    walletConnected, setWalletConnected,
    userAddress, setUserAddress,
    contract, setContract,
    points, setPoints,
    provider, setProvider,
    activeTab, setActiveTab,
    leaderboard, setLeaderboard,
    yoyoBalanceAmount, setYoyoBalanceAmount,
    isMobile, setIsMobile,
    showWalletOptions, setShowWalletOptions,
    gamesPlayedToday, setGamesPlayedToday,
    dailyLimit, setDailyLimit,
    isLoading, setIsLoading,
    connectionError, setConnectionError,
    pointValues, setPointValues,
    isFarcasterMiniApp, setIsFarcasterMiniApp,
    currentEnvironment, setCurrentEnvironment,
    playerStats, setPlayerStats,
    isClient,
    gameState, setGameState,
    remainingGames,
    refreshPlayerData
  } = useGameState();

  const {
    checkYoyoBalance,
    getPointValues: getContractPointValues,
    updatePlayerInfo: updateContractPlayerInfo,
    updateLeaderboard: updateContractLeaderboard,
    connectWallet: connectContractWallet,
    disconnectWallet: disconnectContractWallet
  } = useContract(provider, isClient);

  const updatePlayerInfo = useCallback(async (address) => {
    if (!contract || !address) return;
    await updateContractPlayerInfo(
      contract,
      address,
      checkYoyoBalance,
      setPoints,
      setGamesPlayedToday,
      setDailyLimit,
      setPlayerStats,
      setYoyoBalanceAmount
    );
  }, [contract, updateContractPlayerInfo, checkYoyoBalance, setPoints, setGamesPlayedToday, setDailyLimit, setPlayerStats, setYoyoBalanceAmount]);

  const updateLeaderboard = useCallback(async () => {
    if (!contract) return;
    await updateContractLeaderboard(contract, setLeaderboard);
  }, [contract, updateContractLeaderboard, setLeaderboard]);

  const connectWallet = useCallback(async (walletType = 'standard', farcasterAddress = null) => {
    await connectContractWallet(
      walletType,
      farcasterAddress,
      isMobile,
      setShowWalletOptions,
      setProvider,
      setContract,
      setUserAddress,
      setWalletConnected,
      checkYoyoBalance,
      setYoyoBalanceAmount,
      getContractPointValues,
      setPointValues,
      updatePlayerInfo,
      updateLeaderboard,
      refreshPlayerData,
      isFarcasterMiniApp,
      points,
      setConnectionError,
      setIsLoading
    );
  }, [
    connectContractWallet, isMobile, setShowWalletOptions, setProvider, setContract,
    setUserAddress, setWalletConnected, checkYoyoBalance, setYoyoBalanceAmount,
    getContractPointValues, setPointValues, updatePlayerInfo, updateLeaderboard,
    refreshPlayerData, isFarcasterMiniApp, points, setConnectionError, setIsLoading
  ]);

  const disconnectWallet = useCallback(() => {
    disconnectContractWallet(
      setWalletConnected,
      setUserAddress,
      setContract,
      setPoints,
      setYoyoBalanceAmount,
      setGamesPlayedToday,
      setLeaderboard,
      setPlayerStats,
      setGameState
    );
  }, [disconnectContractWallet, setWalletConnected, setUserAddress, setContract, setPoints, setYoyoBalanceAmount, setGamesPlayedToday, setLeaderboard, setPlayerStats, setGameState]);

  const {
    startGame,
    resetGame,
    startNewGame
  } = useGameLogic(
    walletConnected,
    contract,
    userAddress,
    updatePlayerInfo,
    updateLeaderboard,
    checkYoyoBalance,
    setYoyoBalanceAmount,
    setPoints,
    setGamesPlayedToday,
    setDailyLimit,
    setGameState,
    setIsLoading,
    setConnectionError,
    isFarcasterMiniApp,
    points
  );

  // ✅ OTOMATİK BAĞLANMA - Sadece Base ve Farcaster için
  useEffect(() => {
    if (!isClient || walletConnected || isLoading) return;

    const autoConnectByEnvironment = async () => {
      console.log('🌍 Auto-connect for environment:', currentEnvironment);
      
      try {
        switch (currentEnvironment) {
          case 'farcaster':
            console.log('🎯 Attempting Farcaster auto-connect...');
            // Farcaster için SDK ile bağlanmayı dene
            if (window.farcaster?.actions?.connectWallet) {
              try {
                const accounts = await window.farcaster.actions.connectWallet();
                if (accounts && accounts[0]) {
                  await connectWallet('farcaster', accounts[0]);
                  return;
                }
              } catch (error) {
                console.log('Farcaster SDK auto-connect failed:', error);
              }
            }
            break;
            
          case 'base':
            console.log('🟡 Attempting Base app auto-connect...');
            // Base app için embedded wallet bağlantısı
            if (window.ethereum) {
              try {
                const accounts = await window.ethereum.request({
                  method: 'eth_requestAccounts'
                });
                if (accounts && accounts[0]) {
                  await connectWallet('embedded', accounts[0]);
                  return;
                }
              } catch (error) {
                console.log('Base app auto-connect failed:', error);
              }
            }
            break;
            
          default:
            console.log('🌐 Browser environment - no auto-connect');
            // Normal browser'da otomatik bağlanma yok
            break;
        }
      } catch (error) {
        console.log('⚠️ Auto-connect failed:', error);
      }
    };

    // Sadece Base ve Farcaster'da otomatik bağlan
    if (currentEnvironment === 'farcaster' || currentEnvironment === 'base') {
      const timer = setTimeout(autoConnectByEnvironment, 1000);
      return () => clearTimeout(timer);
    }
  }, [isClient, walletConnected, currentEnvironment, connectWallet, isLoading]);

  // ✅ SAYFA YÜKLENDİĞİNDE OTOMATİK REFRESH
  useEffect(() => {
    if (!isClient || !walletConnected || !contract || !userAddress) return;

    console.log('🔄 Auto-refreshing player data...');
    
    const autoRefresh = async () => {
      try {
        await refreshPlayerData(
          contract,
          userAddress,
          checkYoyoBalance,
          setPoints,
          setGamesPlayedToday,
          setDailyLimit,
          setPlayerStats,
          setYoyoBalanceAmount
        );
        await updateLeaderboard();
      } catch (error) {
        console.error('❌ Auto-refresh failed:', error);
      }
    };

    autoRefresh();
    const interval = setInterval(autoRefresh, 30000);
    
    return () => clearInterval(interval);
  }, [isClient, walletConnected, contract, userAddress, refreshPlayerData, checkYoyoBalance, updateLeaderboard]);

  // Eski bağlı cüzdan kontrolü (sadece daha önce bağlanmışsa)
  useEffect(() => {
    if (!isClient || typeof window.ethereum === 'undefined' || walletConnected) return;
    
    const checkWalletConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });

        if (accounts.length > 0) {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(newProvider);
          
          const signer = await newProvider.getSigner();
          const address = await signer.getAddress();
          const contractInstance = new ethers.Contract(contractAddress, abi, signer);
          
          setContract(contractInstance);
          setUserAddress(address);
          setWalletConnected(true);
          
          const yoyoBalance = await checkYoyoBalance(address);
          setYoyoBalanceAmount(yoyoBalance);
          
          const pointVals = await getContractPointValues(contractInstance);
          setPointValues(pointVals);
          
          await updatePlayerInfo(address);
          await updateLeaderboard();
        }
      } catch (err) {
        console.error("Auto-connection error:", err);
      }
    };
    
    checkWalletConnection();
  }, [isClient, walletConnected]);

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
          {connectionError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-center">{connectionError}</p>
              <button 
                onClick={() => setConnectionError("")}
                className="text-red-300 text-sm mt-2 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {/* FarcasterWallet - Sadece browser'da göster (manuel bağlanma için) */}
          {currentEnvironment === 'browser' && <FarcasterWallet onConnect={connectWallet} />}
          
          <WalletConnection
            walletConnected={walletConnected}
            userAddress={userAddress}
            points={points}
            yoyoBalanceAmount={yoyoBalanceAmount}
            onDisconnect={disconnectWallet}
            onConnect={connectWallet}
            isMobile={isMobile}
            remainingGames={remainingGames}
            dailyLimit={dailyLimit}
            isLoading={isLoading}
            pointValues={pointValues}
            playerStats={playerStats}
            currentEnvironment={currentEnvironment}
          />
          
          <div className="min-h-[500px]">
            {activeTab === "home" && (
              <HomeContent 
                walletConnected={walletConnected} 
                yoyoBalanceAmount={yoyoBalanceAmount}
                remainingGames={remainingGames}
                pointValues={pointValues}
                playerStats={playerStats}
              />
            )}
            {activeTab === "play" && (
              <GameBoard
                walletConnected={walletConnected}
                gameState={gameState}
                yoyoBalanceAmount={yoyoBalanceAmount}
                points={points}
                onStartGame={startGame}
                onConnectWallet={connectWallet}
                isMobile={isMobile}
                onStartNewGame={startNewGame}
                onResetGame={resetGame}
                remainingGames={remainingGames}
                dailyLimit={dailyLimit}
                isLoading={isLoading}
                pointValues={pointValues}
                playerStats={playerStats}
              />
            )}
            {activeTab === "leaderboard" && (
              <Leaderboard 
                leaderboard={leaderboard} 
              />
            )}
          </div>
        </div>
        
        {!isFarcasterMiniApp && (
          <footer className="bg-slate-900/80 text-gray-400 py-4 text-center border-t border-slate-700/50 backdrop-blur-sm">
            <p>YoYo Guild Battle | Base Mainnet</p>
          </footer>
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-white">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}