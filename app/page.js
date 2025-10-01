"use client";
import { useEffect, useCallback, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract";
import { useGameState } from "./hooks/useGameState";
import { useContract } from "./hooks/useContract";
import { useGameLogic } from "./hooks/useGameLogic";
import WalletConnection from "./components/WalletConnection";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import HomeContent from "./components/HomeContent";
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
    gamesPlayedToday, setGamesPlayedToday,
    dailyLimit, setDailyLimit,
    isLoading, setIsLoading,
    connectionError, setConnectionError,
    pointValues, setPointValues,
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

  const [farcasterSDK, setFarcasterSDK] = useState(null);

  // Farcaster SDK Initialization
  useEffect(() => {
    if (!isClient) return;

    const initializeFarcasterSDK = async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        await sdk.actions.ready();
        setFarcasterSDK(sdk);
        console.log('✅ Farcaster SDK initialized');
      } catch (error) {
        console.log('Farcaster SDK not available:', error);
      }
    };

    initializeFarcasterSDK();
  }, [isClient]);

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

  // UNIVERSAL WALLET CONNECTION
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setConnectionError("");

    try {
      console.log('🔗 Attempting universal wallet connection...');

      // 1. ÖNCE FARCASTER SDK DENEYELİM
      if (farcasterSDK?.actions?.connectWallet) {
        try {
          console.log('🎯 Trying Farcaster SDK...');
          const accounts = await farcasterSDK.actions.connectWallet();
          if (accounts && accounts[0]) {
            console.log('✅ Farcaster SDK connected:', accounts[0]);
            await handleWalletConnection('farcaster', accounts[0]);
            return;
          }
        } catch (error) {
          console.log('Farcaster SDK failed:', error);
        }
      }

      // 2. SONRA BASE EMBEDDED WALLET
      if (window.ethereum) {
        try {
          console.log('🟡 Trying Base embedded wallet...');
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          if (accounts && accounts[0]) {
            console.log('✅ Base wallet connected:', accounts[0]);
            await handleWalletConnection('base', accounts[0]);
            return;
          }
        } catch (error) {
          console.log('Base wallet failed:', error);
        }
      }

      // 3. SON ÇARE: STANDARD ETHEREUM
      if (window.ethereum) {
        try {
          console.log('🌐 Trying standard Ethereum...');
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          if (accounts && accounts[0]) {
            console.log('✅ Ethereum connected:', accounts[0]);
            await handleWalletConnection('ethereum', accounts[0]);
            return;
          }
        } catch (error) {
          console.log('Ethereum failed:', error);
        }
      }

      // HİÇBİRİ ÇALIŞMAZSA
      throw new Error('No wallet found. Please make sure you have a wallet installed.');

    } catch (error) {
      console.error('❌ All connection methods failed:', error);
      setConnectionError(error.message || 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  }, [farcasterSDK, setIsLoading, setConnectionError]);

  const handleWalletConnection = async (walletType, address) => {
    try {
      let providerInstance;
      let signer;

      if (window.ethereum) {
        providerInstance = new ethers.BrowserProvider(window.ethereum);
        signer = await providerInstance.getSigner();
      } else {
        providerInstance = new ethers.JsonRpcProvider('https://mainnet.base.org');
        signer = null;
      }

      const contractInstance = signer 
        ? new ethers.Contract(contractAddress, abi, signer)
        : new ethers.Contract(contractAddress, abi, providerInstance);

      setProvider(providerInstance);
      setContract(contractInstance);
      setUserAddress(address);
      setWalletConnected(true);

      // Fetch initial data
      const [balance, pointVals] = await Promise.all([
        checkYoyoBalance(address),
        getContractPointValues(contractInstance)
      ]);

      setYoyoBalanceAmount(balance);
      setPointValues(pointVals);

      await updatePlayerInfo(address);
      await updateLeaderboard();

      console.log('✅ Wallet connection completed successfully');

    } catch (error) {
      console.error('❌ Wallet setup failed:', error);
      throw error;
    }
  };

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
    points
  );

  // Auto-refresh data
  useEffect(() => {
    if (!isClient || !walletConnected || !contract || !userAddress) return;

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

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading YoYo Guild Battle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center p-4">
      <MetaTags />
      
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
        
        <footer className="bg-slate-900/80 text-gray-400 py-4 text-center border-t border-slate-700/50 backdrop-blur-sm">
          <p>YoYo Guild Battle | Base Mainnet</p>
        </footer>
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