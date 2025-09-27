"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract";
import WalletConnection from "./components/WalletConnection";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import HomeContent from "./components/HomeContent";
import MobileWalletSelector from "./components/MobileWalletSelector";
import FarcasterWallet from "./components/FarcasterWallet";
import FarcasterMiniApp from "./components/FarcasterMiniApp";
import Image from "next/image";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [yoyoBalanceAmount, setYoyoBalanceAmount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [pointValues, setPointValues] = useState({
    winNormal: 250,
    winYoyo: 500,
    lose: 10
  });
  const [isFarcasterMiniApp, setIsFarcasterMiniApp] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    winRate: 0,
    winStreak: 0,
    maxWinStreak: 0
  });
  const [isClient, setIsClient] = useState(false);

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
    isLoading: false,
    pointsEarned: 0,
    isWinner: false
  });

  // Client-side kontrolü
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Geliştirilmiş Farcaster Mini App detection
  useEffect(() => {
    if (!isClient) return;
    
    const checkFarcasterMiniApp = () => {
      // URL parametrelerini kontrol et
      const urlParams = new URLSearchParams(window.location.search);
      const isFarcasterParam = urlParams.get('farcaster') === 'true' || urlParams.get('source') === 'farcaster';
      const isEmbeddedParam = urlParams.get('embedded') === 'true';
      
      // Embedded mode kontrolü
      const isEmbedded = window.self !== window.top;
      
      // User agent kontrolü
      const isFarcasterUA = /Farcaster|Warpcast/i.test(navigator.userAgent);
      
      // Referrer kontrolü
      const isFarcasterReferrer = document.referrer.includes('warpcast') || 
                                 document.referrer.includes('farcaster');
      
      // Tüm koşulları değerlendir
      const isMiniApp = isFarcasterParam || isEmbeddedParam || isEmbedded || isFarcasterUA || isFarcasterReferrer;
      
      console.log('Farcaster detection:', {
        isFarcasterParam,
        isEmbeddedParam,
        isEmbedded,
        isFarcasterUA,
        isFarcasterReferrer,
        isMiniApp
      });
      
      setIsFarcasterMiniApp(isMiniApp);
      
      // Mini App modunda özel styling uygula
      if (isMiniApp) {
        document.body.classList.add('farcaster-mini-app');
        console.log('🎯 Farcaster Mini App mode activated');
      }
    };
    
    checkFarcasterMiniApp();
  }, [isClient]);

  // Rabby Wallet desteği
  const isRabbyWallet = useCallback(() => {
    if (!isClient) return false;
    return window.ethereum?.isRabby || false;
  }, [isClient]);

  const checkYoyoBalance = useCallback(async (address) => {
    if (!address || !isClient) return 0;
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
  }, [provider, isClient]);

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

  const updatePlayerInfo = useCallback(async (address) => {
    if (!contract || !address) return;
    try {
      const [
        totalPoints, 
        gamesToday, 
        limit, 
        hasYoyoBoost,
        totalGames,
        totalWins, 
        totalLosses,
        winStreak,
        maxWinStreak,
        winRate
      ] = await contract.getPlayerInfo(address);
      
      setPoints(Number(totalPoints));
      setGamesPlayedToday(Number(gamesToday));
      setDailyLimit(Number(limit));
      
      setPlayerStats({
        totalGames: Number(totalGames),
        totalWins: Number(totalWins),
        totalLosses: Number(totalLosses),
        winRate: Number(winRate),
        winStreak: Number(winStreak),
        maxWinStreak: Number(maxWinStreak)
      });
      
      const yoyoBalance = await checkYoyoBalance(address);
      setYoyoBalanceAmount(yoyoBalance);
    } catch (error) {
      console.error("Failed to update player info:", error);
    }
  }, [contract, checkYoyoBalance]);

  const updateLeaderboard = useCallback(async () => {
    if (!contract) return;
    try {
      const [addresses, points] = await contract.getTopPlayers();
      
      if (!addresses || addresses.length === 0) {
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
        .slice(0, 100);
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Failed to update leaderboard:", error);
      setLeaderboard([]);
    }
  }, [contract]);

  const connectWallet = useCallback(async (walletType = 'standard', farcasterAddress = null) => {
    if (!isClient) return;
    
    if (walletType === 'rabby' && !window.ethereum?.isRabby) {
      setConnectionError("Rabby Wallet not detected! Please install Rabby Wallet.");
      return;
    }

    if (typeof window.ethereum === 'undefined' && !farcasterAddress) {
      setConnectionError("Wallet not installed!");
      if (isMobile) {
        setShowWalletOptions(true);
      }
      return;
    }

    try {
      setIsLoading(true);
      setConnectionError("");

      let address = farcasterAddress;
      
      if (!farcasterAddress) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length === 0) {
          throw new Error("No accounts found");
        }
        address = accounts[0];
      }

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      
      const signer = await newProvider.getSigner();
      
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      
      setContract(contractInstance);
      setUserAddress(address);
      setWalletConnected(true);
      
      const yoyoBalance = await checkYoyoBalance(address);
      setYoyoBalanceAmount(yoyoBalance);
      
      await getPointValues();
      await updatePlayerInfo(address);
      await updateLeaderboard();
      
      // Farcaster Mini App için mesaj gönder
      if (isFarcasterMiniApp) {
        window.parent.postMessage({ 
          type: 'WALLET_CONNECTED', 
          address,
          points: points
        }, '*');
      }
      
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      
      if (err.code === 4001) {
        setConnectionError("Connection rejected by user");
      } else if (err.message.includes("Rabby")) {
        setConnectionError("Rabby Wallet connection failed. Please check if Rabby is unlocked.");
      } else {
        setConnectionError(err.message || "Failed to connect wallet");
      }
    } finally {
      setIsLoading(false);
    }
  }, [checkYoyoBalance, getPointValues, updatePlayerInfo, updateLeaderboard, isMobile, isFarcasterMiniApp, isClient, points]);

  const startGame = async (selectedIndex) => {
    if (!walletConnected || !contract || isLoading) return;
    if (gameState.gamePhase !== "idle") return;
    
    try {
      const currentInfo = await contract.getPlayerInfo(userAddress);
      const dailyGamesPlayed = Number(currentInfo[1]);
      const dailyLimit = Number(currentInfo[2]);
      
      if (dailyGamesPlayed >= dailyLimit) {
        alert(`Daily limit reached! Played: ${dailyGamesPlayed}/${dailyLimit}`);
        return;
      }
      
      setGameState(prev => ({ 
        ...prev, 
        isLoading: true, 
        selectedImage: selectedIndex, 
        gamePhase: "selecting",
        winnerIndex: null
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoading(true);
      
      const tx = await contract.playGame();
      setGameState(prev => ({ ...prev, gamePhase: "fighting" }));
      
      const receipt = await tx.wait();
      
      if (receipt.status === 0) {
        throw new Error("Transaction reverted");
      }
      
      let isWinner = false;
      let pointsEarned = 0;
      
      const gamePlayedEvent = receipt.logs.find(log => {
        try {
          const parsedLog = contract.interface.parseLog(log);
          return parsedLog && parsedLog.name === "GamePlayed";
        } catch {
          return false;
        }
      });
      
      if (gamePlayedEvent) {
        const parsedLog = contract.interface.parseLog(gamePlayedEvent);
        isWinner = parsedLog.args.won;
        pointsEarned = Number(parsedLog.args.points);
      }
      
      for (let i = 3; i > 0; i--) {
        setGameState(prev => ({ ...prev, countdown: i }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      await updatePlayerInfo(userAddress);
      await updateLeaderboard();
      
      const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);
      
      setGameState(prev => ({ 
        ...prev, 
        winnerIndex, 
        gamePhase: "result",
        pointsEarned: pointsEarned,
        isWinner: isWinner
      }));
      
      // Farcaster Mini App için game result mesajı
      if (isFarcasterMiniApp) {
        window.parent.postMessage({ 
          type: 'GAME_RESULT', 
          won: isWinner, 
          points: pointsEarned,
          totalPoints: points + pointsEarned
        }, '*');
      }
      
    } catch (err) {
      console.error("Game transaction failed:", err);
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      
      let errorMessage = "Transaction failed: ";
      if (err.reason) {
        errorMessage += err.reason;
      } else if (err.message.includes("revert")) {
        errorMessage += "Daily limit reached";
      } else if (err.message.includes("Rabby")) {
        errorMessage += "Rabby Wallet error - please try again";
      } else {
        errorMessage += err.message;
      }
      
      setConnectionError(errorMessage);
      
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

  const disconnectWallet = useCallback(() => {
    setWalletConnected(false);
    setUserAddress("");
    setContract(null);
    setPoints(0);
    setYoyoBalanceAmount(0);
    setGamesPlayedToday(0);
    setLeaderboard([]);
    setPlayerStats({
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      winStreak: 0,
      maxWinStreak: 0
    });
    setGameState(prev => ({
      ...prev,
      gamePhase: "idle",
      selectedImage: null,
      winnerIndex: null
    }));
  }, []);

  const connectMobileWallet = useCallback((walletType) => {
    if (!isClient) return;
    
    const currentUrl = encodeURIComponent(window.location.href);
    let walletUrl = '';
    const WALLET_LINKS = {
      metamask: { universal: "https://metamask.app.link/dapp/" },
      rabby: { universal: "https://rabby.io/" },
      coinbase: { universal: "https://go.cb-w.com/dapp?cb_url=" },
      trust: { universal: "https://link.trustwallet.com/dapp/" }
    };
    
    switch(walletType) {
      case 'metamask': walletUrl = `${WALLET_LINKS.metamask.universal}${currentUrl}`; break;
      case 'rabby': walletUrl = `${WALLET_LINKS.rabby.universal}`; break;
      case 'coinbase': walletUrl = `${WALLET_LINKS.coinbase.universal}${currentUrl}`; break;
      case 'trust': walletUrl = `${WALLET_LINKS.trust.universal}${currentUrl}`; break;
      default: return;
    }
    window.open(walletUrl, '_blank');
    setShowWalletOptions(false);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
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
          await updateLeaderboard();
        }
      } catch (err) {
        console.error("Auto-connection error:", err);
      }
    };
    
    checkWalletConnection();
  }, [isClient]);

  const remainingGames = dailyLimit - gamesPlayedToday;

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading YoYo Guild Battle...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center p-4 ${isFarcasterMiniApp ? 'farcaster-mini-app' : ''}`}>
      {/* Farcaster Mini App Component */}
      <FarcasterMiniApp />
      
      {showWalletOptions && (
        <MobileWalletSelector 
          onConnect={connectMobileWallet}
          onClose={() => setShowWalletOptions(false)}
        />
      )}
      
      <div className="w-full max-w-6xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30 backdrop-blur-sm">
        <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-6 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <div className="flex items-center justify-center space-x-4 relative z-10">
            <Image src="/images/yoyo.png" alt="YoYo Guild" width={80} height={80} className="rounded-full" />
            <div>
              <h1 className="text-4xl font-bold">YoYo Guild Battle</h1>
              <p className="text-sm opacity-90 mt-1">
                {isFarcasterMiniApp ? "🎯 Farcaster Mini App" : "Blockchain Battle Arena"}
                {isRabbyWallet() && " | Rabby Wallet Supported"}
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
          
          <FarcasterWallet onConnect={connectWallet} />
          
          <WalletConnection
            walletConnected={walletConnected}
            userAddress={userAddress}
            points={points}
            yoyoBalanceAmount={yoyoBalanceAmount}
            onDisconnect={disconnectWallet}
            onConnect={connectWallet}
            isMobile={isMobile}
            onShowWalletOptions={() => setShowWalletOptions(true)}
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
                onShowWalletOptions={() => setShowWalletOptions(true)}
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
            <p>YoYo Guild Battle | Base Mainnet | {isFarcasterMiniApp ? 'Farcaster Mini App' : 'Web App'}</p>
            {isRabbyWallet() && <p className="text-xs mt-1">🔗 Rabby Wallet Supported</p>}
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