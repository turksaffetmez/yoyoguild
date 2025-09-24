"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract";
import WalletConnection from "./components/WalletConnection";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import HomeContent from "./components/HomeContent";
import MobileWalletSelector from "./components/MobileWalletSelector";
import Image from "next/image";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [seasonPoints, setSeasonPoints] = useState(0);
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [preseasonLeaderboard, setPreseasonLeaderboard] = useState([]);
  const [yoyoBalanceAmount, setYoyoBalanceAmount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(20);
  const [seasonTimeLeft, setSeasonTimeLeft] = useState(0);
  const [currentSeason, setCurrentSeason] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Sezon 1 başlangıç zamanı: 25 Eylül 2025 12:00 UTC
  const SEASON1_START_TIME = new Date("2025-09-25T12:00:00Z").getTime();
  const SEASON_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 gün milisaniye cinsinden

  const [gameState, setGameState] = useState({
    selectedImage: null,
    winnerIndex: null,
    gamePhase: "idle",
    images: [
      { id: 1, url: "/images/tevans1.png", name: "Tevan #1" },
      { id: 2, url: "/images/tevans2.png", name: "Tevan #2" },
      { id: 3, url: "/images/tevans3.png", name: "Tevan #3" },
      { id: 4, url: "/images/tevans4.png", name: "Tevan #4" },
      { id: 5, url: "/images/tevans5.png", name: "Tevan #5" },
      { id: 6, url: "/images/tevans6.png", name: "Tevan #6" },
      { id: 7, url: "/images/tevans7.png", name: "Tevan #7" },
      { id: 8, url: "/images/tevans8.png", name: "Tevan #8" },
      { id: 9, url: "/images/tevans9.png", name: "Tevan #9" },
      { id: 10, url: "/images/tevans10.png", name: "Tevan #10" },
      { id: 11, url: "/images/tevans11.png", name: "Tevan #11" },
      { id: 12, url: "/images/tevans12.png", name: "Tevan #12" },
      { id: 13, url: "/images/tevans13.png", name: "Tevan #13" },
      { id: 14, url: "/images/tevans14.png", name: "Tevan #14" },
      { id: 15, url: "/images/tevans15.png", name: "Tevan #15" },
      { id: 16, url: "/images/tevans16.png", name: "Tevan #16" },
      { id: 17, url: "/images/tevans17.png", name: "Tevan #17" },
      { id: 18, url: "/images/tevans18.png", name: "Tevan #18" },
      { id: 19, url: "/images/tevans19.png", name: "Tevan #19" }
    ],
    isLoading: false
  });

  // Mevcut sezonu hesapla
  const calculateCurrentSeason = useCallback(() => {
    const now = Date.now();
    const timeSinceStart = now - SEASON1_START_TIME;
    
    if (timeSinceStart < 0) {
      // Sezon henüz başlamadı - Preseason
      return {
        seasonNumber: 0, // 0 = preseason
        startTime: SEASON1_START_TIME,
        duration: SEASON_DURATION,
        active: false,
        timeUntilStart: Math.abs(timeSinceStart),
        isPreseason: true
      };
    }
    
    const seasonsPassed = Math.floor(timeSinceStart / SEASON_DURATION);
    const currentSeasonNumber = seasonsPassed + 1;
    const currentSeasonStart = SEASON1_START_TIME + (seasonsPassed * SEASON_DURATION);
    const timeUntilEnd = currentSeasonStart + SEASON_DURATION - now;
    
    return {
      seasonNumber: currentSeasonNumber,
      startTime: currentSeasonStart,
      duration: SEASON_DURATION,
      active: timeUntilEnd > 0,
      timeUntilEnd: Math.max(0, timeUntilEnd),
      timeUntilStart: 0,
      isPreseason: false
    };
  }, []);

  // YOYO balance kontrolü - DÜZELTİLDİ
  const checkYoyoBalance = useCallback(async (address) => {
    if (!address) return 0;
    try {
      // Provider yoksa yeni provider oluştur
      let balanceProvider = provider;
      if (!balanceProvider && window.ethereum) {
        balanceProvider = new ethers.BrowserProvider(window.ethereum);
      }
      if (!balanceProvider) return 0;

      const yoyoContract = new ethers.Contract(
        "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1",
        ["function balanceOf(address) view returns (uint256)"],
        balanceProvider
      );
      const balance = await yoyoContract.balanceOf(address);
      const balanceNumber = Number(ethers.formatUnits(balance, 18));
      console.log("YOYO Balance retrieved:", balanceNumber);
      return balanceNumber;
    } catch (error) {
      console.error("YOYO balance check failed:", error);
      return 0;
    }
  }, [provider]);

  // Oyuncu bilgilerini getir
  const updatePlayerInfo = useCallback(async (address) => {
    if (!contract || !address) return;
    try {
      const [totalPoints, currentSeasonPoints, gamesToday, limit, seasonNumber] = await contract.getPlayerInfo(address);
      setPoints(Number(totalPoints));
      setSeasonPoints(Number(currentSeasonPoints));
      setGamesPlayedToday(Number(gamesToday));
      setDailyLimit(Number(limit));
      
      // YOYO balance'ı hemen güncelle - AYRI BİR ŞEKİLDE
      const yoyoBalance = await checkYoyoBalance(address);
      setYoyoBalanceAmount(yoyoBalance);
    } catch (error) {
      console.error("Failed to update player info:", error);
    }
  }, [contract, checkYoyoBalance]);

  // Sezon bilgilerini güncelle
  const updateSeasonInfo = useCallback(() => {
    const seasonInfo = calculateCurrentSeason();
    setCurrentSeason(seasonInfo);
    
    if (seasonInfo.active) {
      setSeasonTimeLeft(seasonInfo.timeUntilEnd);
    } else {
      setSeasonTimeLeft(seasonInfo.timeUntilStart);
    }
  }, [calculateCurrentSeason]);

  // Liderlik tablosunu getir
  const updateLeaderboard = useCallback(async () => {
    if (!contract) return;
    try {
      const seasonInfo = calculateCurrentSeason();
      const targetSeason = seasonInfo.isPreseason ? 0 : seasonInfo.seasonNumber;
      
      const [addresses, points] = await contract.getSeasonLeaderboard(targetSeason);
      
      const leaderboardData = addresses
        .map((address, index) => ({
          rank: index + 1,
          address: address,
          points: Number(points[index])
        }))
        .filter(player => player.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 100)
        .map((player, index) => ({
          ...player,
          rank: index + 1
        }));
      
      if (seasonInfo.isPreseason) {
        setPreseasonLeaderboard(leaderboardData);
        setLeaderboard([]);
      } else {
        setLeaderboard(leaderboardData);
        setPreseasonLeaderboard([]);
      }
    } catch (error) {
      console.error("Failed to update leaderboard:", error);
    }
  }, [contract, calculateCurrentSeason]);

  // Preseason liderlik tablosunu getir
  const updatePreseasonLeaderboard = useCallback(async () => {
    if (!contract) return;
    try {
      const [addresses, points] = await contract.getSeasonLeaderboard(0);
      
      const leaderboardData = addresses
        .map((address, index) => ({
          rank: index + 1,
          address: address,
          points: Number(points[index])
        }))
        .filter(player => player.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 100)
        .map((player, index) => ({
          ...player,
          rank: index + 1
        }));
      
      setPreseasonLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Failed to update preseason leaderboard:", error);
    }
  }, [contract]);

  // Accounts changed handler
  const handleAccountsChanged = useCallback((accounts) => {
    console.log("Accounts changed:", accounts);
    
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      checkWalletConnection();
    }
  }, []);

  const handleChainChanged = useCallback((chainId) => {
    console.log("Chain changed:", chainId);
    window.location.reload();
  }, []);

  // Disconnect fonksiyonu
  const disconnectWallet = useCallback(() => {
    console.log("Disconnecting wallet...");
    
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    
    setWalletConnected(false);
    setUserAddress("");
    setContract(null);
    setPoints(0);
    setSeasonPoints(0);
    setProvider(null);
    setYoyoBalanceAmount(0);
    setShowWalletOptions(false);
    setLeaderboard([]);
    setPreseasonLeaderboard([]);
    setConnectionError("");
    setIsLoading(false);
    
    setGameState(prev => ({ 
      ...prev, 
      gamePhase: "idle", 
      selectedImage: null, 
      winnerIndex: null,
      isLoading: false 
    }));
  }, [handleAccountsChanged, handleChainChanged]);

  // Cüzdan bağlantısı - YOYO BALANCE DÜZELTİLDİ
  const connectWallet = useCallback(async () => {
    console.log("connectWallet called");
    
    if (typeof window.ethereum === 'undefined') {
      setConnectionError("MetaMask not installed!");
      if (isMobile) {
        setShowWalletOptions(true);
      }
      return;
    }

    try {
      setIsLoading(true);
      setConnectionError("");

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      
      const signer = await newProvider.getSigner();
      const address = await signer.getAddress();
      
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      
      setContract(contractInstance);
      setUserAddress(address);
      setWalletConnected(true);
      
      // YOYO balance'ı HEMEN ve AYRI olarak kontrol et
      const yoyoBalance = await checkYoyoBalance(address);
      console.log("Setting YOYO balance:", yoyoBalance);
      setYoyoBalanceAmount(yoyoBalance);
      
      // Diğer verileri güncelle
      await updatePlayerInfo(address);
      updateSeasonInfo();
      await updateLeaderboard();
      
      // Preseason ise preseason liderliğini de güncelle
      const seasonInfo = calculateCurrentSeason();
      if (seasonInfo.isPreseason) {
        await updatePreseasonLeaderboard();
      }
      
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setConnectionError(err.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  }, [checkYoyoBalance, updatePlayerInfo, updateSeasonInfo, updateLeaderboard, updatePreseasonLeaderboard, calculateCurrentSeason, isMobile]);

  // Otomatik bağlantı kontrolü - YOYO BALANCE DÜZELTİLDİ
  const checkWalletConnection = useCallback(async () => {
    if (initialized) return;
    
    if (typeof window.ethereum === 'undefined') {
      setInitialized(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length > 0) {
        const signer = await newProvider.getSigner();
        const address = await signer.getAddress();
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        
        setContract(contractInstance);
        setUserAddress(address);
        setWalletConnected(true);
        
        // YOYO balance'ı HEMEN kontrol et
        const yoyoBalance = await checkYoyoBalance(address);
        console.log("Auto-connect YOYO balance:", yoyoBalance);
        setYoyoBalanceAmount(yoyoBalance);
        
        await updatePlayerInfo(address);
        updateSeasonInfo();
        await updateLeaderboard();
        
        // Preseason ise preseason liderliğini de güncelle
        const seasonInfo = calculateCurrentSeason();
        if (seasonInfo.isPreseason) {
          await updatePreseasonLeaderboard();
        }
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
    } catch (err) {
      console.error("Auto-connection error:", err);
    } finally {
      setIsLoading(false);
      setInitialized(true);
    }
  }, [initialized, checkYoyoBalance, updatePlayerInfo, updateSeasonInfo, updateLeaderboard, updatePreseasonLeaderboard, calculateCurrentSeason, handleAccountsChanged, handleChainChanged]);

  // Oyunu başlat - RANDOM WIN/LOSE (Contract'tan önce belirleniyor)
  const startGame = async (selectedIndex) => {
    if (!walletConnected || !contract || isLoading) return;
    if (gameState.gamePhase !== "idle") return;
    if (gamesPlayedToday >= dailyLimit) return;
    
    const seasonInfo = calculateCurrentSeason();
    
    setGameState(prev => ({ 
      ...prev, 
      isLoading: true, 
      selectedImage: selectedIndex, 
      gamePhase: "selecting",
      winnerIndex: null
    }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGameState(prev => ({ ...prev, gamePhase: "fighting" }));
    
    try {
      setIsLoading(true);
      
      // FRONTEND'DE KAZANAN BELLİ OLUYOR - Rastgele belirle
      const winChance = yoyoBalanceAmount > 0 ? 60 : 50;
      const isWinner = Math.floor(Math.random() * 100) < winChance;
      const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);
      
      console.log("Game result - Winner:", isWinner, "Selected:", selectedIndex, "WinnerIndex:", winnerIndex);
      
      // Contract'a işlem gönder - Frontend'de belirlenen sonucu gönder
      const tx = await contract.playGame(isWinner);
      await tx.wait();
      
      setGameState(prev => ({ ...prev, winnerIndex, gamePhase: "result" }));
      
      await updatePlayerInfo(userAddress);
      await updateLeaderboard();
      
      // Preseason ise preseason liderliğini de güncelle
      if (seasonInfo.isPreseason) {
        await updatePreseasonLeaderboard();
      }
      
    } catch (err) {
      console.error("Game transaction failed:", err);
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      setConnectionError("Transaction failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Kaybeden karakteri değiştir
  const resetGame = useCallback(() => {
    setGameState(prev => {
      const newImages = [...prev.images];
      if (prev.winnerIndex !== null) {
        const loserIndex = prev.winnerIndex === 0 ? 1 : 0;
        const currentIds = [prev.images[0].id, prev.images[1].id];
        const availableIds = Array.from({length: 19}, (_, i) => i + 1).filter(id => !currentIds.includes(id));
        if (availableIds.length > 0) {
          const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
          newImages[loserIndex] = {
            id: randomId,
            url: `/images/tevans${randomId}.png`,
            name: `Tevan #${randomId}`
          };
        }
      }
      return {
        ...prev,
        selectedImage: null,
        winnerIndex: null,
        gamePhase: "idle",
        isLoading: false,
        images: newImages
      };
    });
  }, []);

  const startNewGame = useCallback(() => {
    if (gameState.gamePhase === "result") {
      resetGame();
    }
  }, [gameState.gamePhase, resetGame]);

  const connectMobileWallet = useCallback((walletType) => {
    const currentUrl = encodeURIComponent(window.location.href);
    let walletUrl = '';
    const WALLET_LINKS = {
      metamask: { universal: "https://metamask.app.link/dapp/" },
      coinbase: { universal: "https://go.cb-w.com/dapp?cb_url=" },
      trust: { universal: "https://link.trustwallet.com/dapp/" }
    };
    switch(walletType) {
      case 'metamask': walletUrl = `${WALLET_LINKS.metamask.universal}${currentUrl}`; break;
      case 'coinbase': walletUrl = `${WALLET_LINKS.coinbase.universal}${currentUrl}`; break;
      case 'trust': walletUrl = `${WALLET_LINKS.trust.universal}${currentUrl}`; break;
      default: return;
    }
    window.open(walletUrl, '_blank');
    setShowWalletOptions(false);
    setTimeout(() => checkWalletConnection(), 3000);
  }, [checkWalletConnection]);

  // Sezon zamanlayıcısı
  useEffect(() => {
    updateSeasonInfo();
    
    const interval = setInterval(() => {
      updateSeasonInfo();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [updateSeasonInfo]);

  // İlk yükleme
  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    
    if (!initialized) {
      checkWalletConnection();
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  const remainingGames = dailyLimit - gamesPlayedToday;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center p-4">
      {showWalletOptions && (
        <MobileWalletSelector 
          onConnect={connectMobileWallet}
          onClose={() => setShowWalletOptions(false)}
        />
      )}
      
      <div className="w-full max-w-6xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30 backdrop-blur-sm">
        <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-8 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="flex items-center justify-center space-x-4 mb-2 relative z-10">
            <Image src="/images/yoyo.png" alt="YoYo Guild" width={60} height={60} className="rounded-full" />
            <div>
              <h1 className="text-4xl font-bold">YoYo Guild Battle v1</h1>
              <p className="text-lg opacity-90">
                {currentSeason.isPreseason ? 'Preseason' : `Season ${currentSeason.seasonNumber}`}
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
                    ? "btn-primary" 
                    : "btn-secondary"
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
            seasonPoints={seasonPoints}
            yoyoBalanceAmount={yoyoBalanceAmount}
            onDisconnect={disconnectWallet}
            onConnect={connectWallet}
            isMobile={isMobile}
            onShowWalletOptions={() => setShowWalletOptions(true)}
            remainingGames={remainingGames}
            dailyLimit={dailyLimit}
            seasonTimeLeft={seasonTimeLeft}
            currentSeason={currentSeason}
            isLoading={isLoading}
          />
          
          <div className="min-h-[500px]">
            {activeTab === "home" && (
              <HomeContent 
                walletConnected={walletConnected} 
                yoyoBalanceAmount={yoyoBalanceAmount}
                remainingGames={remainingGames}
                seasonTimeLeft={seasonTimeLeft}
                currentSeason={currentSeason}
              />
            )}
            {activeTab === "play" && (
              <GameBoard
                walletConnected={walletConnected}
                gameState={gameState}
                yoyoBalanceAmount={yoyoBalanceAmount}
                points={points}
                seasonPoints={seasonPoints}
                onStartGame={startGame}
                onConnectWallet={connectWallet}
                isMobile={isMobile}
                onShowWalletOptions={() => setShowWalletOptions(true)}
                onStartNewGame={startNewGame}
                onResetGame={resetGame}
                remainingGames={remainingGames}
                dailyLimit={dailyLimit}
                seasonTimeLeft={seasonTimeLeft}
                currentSeason={currentSeason}
                isLoading={isLoading}
              />
            )}
            {activeTab === "leaderboard" && (
              <Leaderboard 
                leaderboard={leaderboard}
                preseasonLeaderboard={preseasonLeaderboard}
                currentSeason={currentSeason}
              />
            )}
          </div>
        </div>
        
        <footer className="bg-slate-900/80 text-gray-400 py-4 text-center border-t border-slate-700/50 backdrop-blur-sm">
          <p>YoYo Guild Battle v1 | Base Mainnet | {currentSeason.isPreseason ? 'Preseason' : `Season ${currentSeason.seasonNumber}`}</p>
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