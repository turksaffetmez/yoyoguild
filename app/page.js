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
  const [yoyoBalanceAmount, setYoyoBalanceAmount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(20);
  const [seasonTimeLeft, setSeasonTimeLeft] = useState(0);
  const [currentSeason, setCurrentSeason] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [pointValues, setPointValues] = useState({
    winNormal: 250,
    winYoyo: 500,
    lose: 10
  });

  // Sezon 1 başlangıç zamanı: 25 Eylül 2025 12:00 UTC
  const SEASON1_START_TIME = new Date("2025-09-25T12:00:00Z").getTime();
  const SEASON_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 hafta

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
    
    if (now < SEASON1_START_TIME) {
      return {
        seasonNumber: 0,
        startTime: SEASON1_START_TIME,
        duration: SEASON_DURATION,
        active: false,
        timeUntilStart: SEASON1_START_TIME - now,
        isPreseason: true,
        nextSeasonNumber: 1
      };
    }
    
    const timeSinceSeason1 = now - SEASON1_START_TIME;
    const seasonsPassed = Math.floor(timeSinceSeason1 / SEASON_DURATION);
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
      isPreseason: false,
      nextSeasonNumber: currentSeasonNumber + 1
    };
  }, []);

  // YOYO balance kontrolü
  const checkYoyoBalance = useCallback(async (address) => {
    if (!address) return 0;
    try {
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
      return Number(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("YOYO balance check failed:", error);
      return 0;
    }
  }, [provider]);

  // Puan değerlerini getir
  const getPointValues = useCallback(async () => {
    if (!contract) return;
    try {
      const values = await contract.getPointValues();
      setPointValues({
        winNormal: Number(values[0]),
        winYoyo: Number(values[1]),
        lose: Number(values[2])
      });
    } catch (error) {
      console.error("Failed to get point values:", error);
    }
  }, [contract]);

  // Oyuncu bilgilerini getir
  const updatePlayerInfo = useCallback(async (address) => {
    if (!contract || !address) return;
    try {
      const [totalPoints, currentSeasonPoints, gamesToday, limit, seasonNumber] = await contract.getPlayerInfo(address);
      setPoints(Number(totalPoints));
      setSeasonPoints(Number(currentSeasonPoints));
      setGamesPlayedToday(Number(gamesToday));
      setDailyLimit(Number(limit));
      
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
      let seasonToQuery;
      
      if (currentSeason.isPreseason) {
        seasonToQuery = 0;
      } else {
        seasonToQuery = currentSeason.active ? currentSeason.seasonNumber : 0;
      }
      
      console.log("Querying leaderboard for season:", seasonToQuery);
      
      const [addresses, points] = await contract.getSeasonLeaderboard(seasonToQuery);
      
      console.log("Leaderboard raw data:", { 
        season: seasonToQuery, 
        addresses, 
        points,
        addressesLength: addresses?.length 
      });
      
      if (!addresses || addresses.length === 0) {
        console.log("No leaderboard data found for season:", seasonToQuery);
        setLeaderboard([]);
        return;
      }
      
      const leaderboardData = addresses
        .map((address, index) => ({
          rank: index + 1,
          address: address,
          points: Number(points[index] || 0)
        }))
        .filter(player => player.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 100)
        .map((player, index) => ({
          ...player,
          rank: index + 1
        }));
      
      console.log("Processed leaderboard:", leaderboardData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Failed to update leaderboard:", error);
      setLeaderboard([]);
    }
  }, [contract, currentSeason]);

  // Cüzdan bağlantısı
  const connectWallet = useCallback(async () => {
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
      
      const yoyoBalance = await checkYoyoBalance(address);
      setYoyoBalanceAmount(yoyoBalance);
      
      await getPointValues();
      await updatePlayerInfo(address);
      updateSeasonInfo();
      await updateLeaderboard();
      
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setConnectionError(err.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  }, [checkYoyoBalance, getPointValues, updatePlayerInfo, updateSeasonInfo, updateLeaderboard, isMobile]);

  // Oyunu başlat
  const startGame = async (selectedIndex) => {
    if (!walletConnected || !contract || isLoading) return;
    if (gameState.gamePhase !== "idle") return;
    
    try {
      // ÖNCE contract'tan güncel oyuncu bilgilerini al
      const currentInfo = await contract.getPlayerInfo(userAddress);
      const dailyGamesPlayed = Number(currentInfo[2]);
      const dailyLimit = Number(currentInfo[3]);
      
      console.log("Daily games check:", { dailyGamesPlayed, dailyLimit });
      
      if (dailyGamesPlayed >= dailyLimit) {
        alert(`Daily limit reached! Played: ${dailyGamesPlayed}/${dailyLimit}`);
        return;
      }
      
      const seasonInfo = calculateCurrentSeason();
      
      setGameState(prev => ({ 
        ...prev, 
        isLoading: true, 
        selectedImage: selectedIndex, 
        gamePhase: "selecting",
        winnerIndex: null
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoading(true);
      
      // Contract'a işlem gönder - PARAMETRESİZ
      const tx = await contract.playGame();
      console.log("Transaction sent:", tx);
      
      // GERİ SAYIM TRANSACTION ONAYINDAN SONRA BAŞLASIN
      setGameState(prev => ({ ...prev, gamePhase: "fighting" }));
      
      // Transaction'ın onaylanmasını bekle
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      if (receipt.status === 0) {
        throw new Error("Transaction reverted");
      }
      
      // Transaction başarılı, 3 saniye geri sayım
      for (let i = 3; i > 0; i--) {
        setGameState(prev => ({ ...prev, countdown: i }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Yeni oyuncu bilgilerini al
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newInfo = await contract.getPlayerInfo(userAddress);
      console.log("After battle - Player info:", newInfo);
      
      // Kazananı belirle (puan artışına göre)
      const pointsBefore = Number(currentInfo[0]);
      const pointsAfter = Number(newInfo[0]);
      const seasonPointsBefore = Number(currentInfo[1]);
      const seasonPointsAfter = Number(newInfo[1]);
      
      const isWinner = pointsAfter > pointsBefore;
      const pointsEarned = pointsAfter - pointsBefore;
      const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);
      
      console.log("Battle result:", {
        pointsBefore, pointsAfter, pointsEarned,
        seasonPointsBefore, seasonPointsAfter,
        isWinner, winnerIndex,
        hasYoyo: yoyoBalanceAmount > 0
      });
      
      setGameState(prev => ({ 
        ...prev, 
        winnerIndex, 
        gamePhase: "result",
        pointsEarned: pointsEarned,
        isWinner: isWinner
      }));
      
      // State'leri güncelle
      setPoints(pointsAfter);
      setSeasonPoints(seasonPointsAfter);
      setGamesPlayedToday(Number(newInfo[2]));
      
      // Leaderboard'u güncelle
      await updateLeaderboard();
      
    } catch (err) {
      console.error("Game transaction failed:", err);
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      
      let errorMessage = "Transaction failed: ";
      if (err.reason) {
        errorMessage += err.reason;
      } else if (err.message.includes("revert")) {
        errorMessage += "Daily limit reached or contract error";
      } else if (err.data?.message) {
        errorMessage += err.data.message;
      } else {
        errorMessage += err.message;
      }
      
      setConnectionError(errorMessage);
      
      // Hata durumunda oyuncu bilgilerini yenile
      if (userAddress) {
        await updatePlayerInfo(userAddress);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        images: newImages,
        pointsEarned: 0,
        isWinner: false,
        countdown: null
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
  }, []);

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    
    const checkWalletConnection = async () => {
      if (typeof window.ethereum === 'undefined') return;
      
      try {
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
          
          const yoyoBalance = await checkYoyoBalance(address);
          setYoyoBalanceAmount(yoyoBalance);
          
          await getPointValues();
          await updatePlayerInfo(address);
          updateSeasonInfo();
          await updateLeaderboard();
        }
      } catch (err) {
        console.error("Auto-connection error:", err);
      }
    };
    
    checkWalletConnection();
  }, []);

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
            seasonPoints={seasonPoints}
            yoyoBalanceAmount={yoyoBalanceAmount}
            onDisconnect={() => {
              setWalletConnected(false);
              setUserAddress("");
              setContract(null);
              setPoints(0);
              setSeasonPoints(0);
              setYoyoBalanceAmount(0);
            }}
            onConnect={connectWallet}
            isMobile={isMobile}
            onShowWalletOptions={() => setShowWalletOptions(true)}
            remainingGames={remainingGames}
            dailyLimit={dailyLimit}
            seasonTimeLeft={seasonTimeLeft}
            currentSeason={currentSeason}
            isLoading={isLoading}
            pointValues={pointValues}
          />
          
          <div className="min-h-[500px]">
            {activeTab === "home" && (
              <HomeContent 
                walletConnected={walletConnected} 
                yoyoBalanceAmount={yoyoBalanceAmount}
                remainingGames={remainingGames}
                seasonTimeLeft={seasonTimeLeft}
                currentSeason={currentSeason}
                pointValues={pointValues}
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
                pointValues={pointValues}
              />
            )}
            {activeTab === "leaderboard" && (
              <Leaderboard 
                leaderboard={leaderboard} 
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