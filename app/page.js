"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract";
import { checkYoyoBalance, getYoyoBalance } from "./utils/yoyoToken";
import WalletConnection from "./components/WalletConnection";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import HomeContent from "./components/HomeContent";
import MobileWalletSelector from "./components/MobileWalletSelector";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [seasonPoints, setSeasonPoints] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionInfo, setTransactionInfo] = useState("");
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [yoyoBalance, setYoyoBalance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(20);
  const [seasonTimeLeft, setSeasonTimeLeft] = useState(0);
  const [currentSeason, setCurrentSeason] = useState({});

  // Oyun state'leri
  const [gameState, setGameState] = useState({
    selectedImage: null,
    winnerIndex: null,
    gamePhase: "idle",
    images: [
      { id: 1, url: "/images/tevans1.png", name: "Guilder #1" },
      { id: 2, url: "/images/tevans2.png", name: "Guilder #2" },
      { id: 3, url: "/images/tevans3.png", name: "Guilder #3" },
      { id: 4, url: "/images/tevans4.png", name: "Guilder #4" },
      { id: 5, url: "/images/tevans5.png", name: "Guilder #5" },
      { id: 6, url: "/images/tevans6.png", name: "Guilder #6" },
      { id: 7, url: "/images/tevans7.png", name: "Guilder #7" },
      { id: 8, url: "/images/tevans8.png", name: "Guilder #8" },
      { id: 9, url: "/images/tevans9.png", name: "Guilder #9" },
      { id: 10, url: "/images/tevans10.png", name: "Guilder #10" },
      { id: 11, url: "/images/tevans11.png", name: "Guilder #11" },
      { id: 12, url: "/images/tevans12.png", name: "Guilder #12" },
      { id: 13, url: "/images/tevans13.png", name: "Guilder #13" },
      { id: 14, url: "/images/tevans14.png", name: "Guilder #14" },
      { id: 15, url: "/images/tevans15.png", name: "Guilder #15" },
      { id: 16, url: "/images/tevans16.png", name: "Guilder #16" },
      { id: 17, url: "/images/tevans17.png", name: "Guilder #17" },
      { id: 18, url: "/images/tevans18.png", name: "Guilder #18" },
      { id: 19, url: "/images/tevans19.png", name: "Guilder #19" }
    ],
    isLoading: false
  });

  // YOYO balance kontrolü
  const updateYoyoBalance = useCallback(async (address) => {
    if (!provider || !address) return;
    try {
      const balance = await getYoyoBalance(address, provider);
      setYoyoBalance(balance);
    } catch (error) {
      console.error("Failed to update YOYO balance:", error);
    }
  }, [provider]);

  // Oyuncu bilgilerini getir
  const updatePlayerInfo = useCallback(async (address) => {
    if (!contract || !address) return;
    try {
      const [totalPoints, currentSeasonPoints, gamesToday, limit] = await contract.getPlayerInfo(address);
      setPoints(Number(totalPoints));
      setSeasonPoints(Number(currentSeasonPoints));
      setGamesPlayedToday(Number(gamesToday));
      setDailyLimit(Number(limit));
    } catch (error) {
      console.error("Failed to update player info:", error);
    }
  }, [contract]);

  // Sezon bilgilerini getir
  const updateSeasonInfo = useCallback(async () => {
    if (!contract) return;
    try {
      const timeLeft = await contract.getSeasonTimeLeft();
      setSeasonTimeLeft(Number(timeLeft));
      
      const season = await contract.currentSeason();
      setCurrentSeason({
        startTime: Number(season.startTime),
        duration: Number(season.duration),
        seasonNumber: Number(season.seasonNumber),
        active: season.active
      });
    } catch (error) {
      console.error("Failed to update season info:", error);
    }
  }, [contract]);

  // Liderlik tablosunu getir
  const updateLeaderboard = useCallback(async () => {
    if (!contract) return;
    try {
      const [addresses, points] = await contract.getCurrentLeaderboard();
      const leaderboardData = addresses.map((address, index) => ({
        rank: index + 1,
        address: address,
        points: Number(points[index])
      })).filter(player => player.points > 0);
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Failed to update leaderboard:", error);
    }
  }, [contract]);

  // Cüzdan bağlantısı
  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        setStatusMessage("Connecting wallet...");
        
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const signer = await newProvider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        
        setContract(contractInstance);
        const address = await signer.getAddress();
        setUserAddress(address);
        setWalletConnected(true);
        
        // Tüm bilgileri güncelle
        await updateYoyoBalance(address);
        await updatePlayerInfo(address);
        await updateSeasonInfo();
        await updateLeaderboard();
        
        setStatusMessage("Wallet connected successfully!");
        setTimeout(() => setStatusMessage(""), 3000);
      } catch (err) {
        console.error("Failed to connect wallet:", err);
        setStatusMessage("Failed to connect wallet. Please try again.");
      }
    } else {
      if (isMobile) {
        setShowWalletOptions(true);
      } else {
        setStatusMessage("Please install a Web3 wallet (MetaMask, Coinbase Wallet, etc.)!");
      }
    }
  }, [updateYoyoBalance, updatePlayerInfo, updateSeasonInfo, updateLeaderboard, isMobile]);

  const disconnectWallet = useCallback(() => {
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
    setTransactionInfo("");
    setYoyoBalance(0);
    setShowWalletOptions(false);
    setGameState(prev => ({ ...prev, gamePhase: "idle", selectedImage: null, winnerIndex: null }));
  }, []);

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
      setStatusMessage("Wallet disconnected.");
    } else if (accounts[0] !== userAddress) {
      setUserAddress(accounts[0]);
      setStatusMessage("Account changed.");
      await updateYoyoBalance(accounts[0]);
      await updatePlayerInfo(accounts[0]);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, [userAddress, disconnectWallet, updateYoyoBalance, updatePlayerInfo]);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  const checkWalletConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        const accounts = await newProvider.send("eth_accounts", []);
        
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (err) {
        console.error("Auto-connection error:", err);
      }
    }
  }, [handleAccountsChanged, handleChainChanged, connectWallet]);

  // Oyunu başlat - YENİ SİSTEM
  const startGame = async (selectedIndex) => {
    if (!walletConnected || !contract) {
      setStatusMessage("Please connect wallet first!");
      return;
    }
    
    if (gameState.gamePhase !== "idle") return;
    
    if (gamesPlayedToday >= dailyLimit) {
      setStatusMessage("❌ Daily limit reached! Maximum 20 games per day.");
      return;
    }
    
    // Oyunu başlat
    setGameState(prev => ({ 
      ...prev, 
      isLoading: true, 
      selectedImage: selectedIndex, 
      gamePhase: "selecting",
      winnerIndex: null
    }));
    
    // Seçim animasyonu
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGameState(prev => ({ ...prev, gamePhase: "fighting" }));
    
    try {
      // 1. Önce frontend'de kazananı belirle
      const winChance = yoyoBalance > 0 ? 60 : 50;
      const isWinner = Math.floor(Math.random() * 100) < winChance;
      const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);
      
      // 2. YOYO kontrolü
      const hasYoyo = yoyoBalance > 0;
      
      // 3. Contract'a işlem gönder - GERÇEK SONUÇ BURADA
      setStatusMessage("🔄 Processing blockchain transaction...");
      
      const tx = await contract.playGame(isWinner, hasYoyo);
      setTransactionInfo(`Transaction sent: ${tx.hash}`);
      
      // İşlemin onaylanmasını bekle
      const receipt = await tx.wait();
      setTransactionInfo(prev => prev + `\nConfirmed! Block: ${receipt.blockNumber}`);
      
      // 4. Başarılıysa animasyonları göster
      setGameState(prev => ({ ...prev, winnerIndex, gamePhase: "result" }));
      
      // 5. Bilgileri güncelle
      await updatePlayerInfo(userAddress);
      await updateLeaderboard();
      
      // 6. Sonuç mesajı
      const pointsEarned = isWinner ? (hasYoyo ? 500 : 250) : 10;
      if (isWinner) {
        setStatusMessage(`🎉 You won! +${pointsEarned} YOYO Points 🥳`);
      } else {
        setStatusMessage(`😢 You lost! +${pointsEarned} YOYO Points`);
      }
      
      setTimeout(() => setStatusMessage(""), 5000);
      
    } catch (err) {
      console.error("Game transaction failed:", err);
      
      if (err.code === 4001 || err.message?.includes('user rejected')) {
        setStatusMessage("❌ Transaction rejected. Please try again.");
      } else if (err.message?.includes('Daily limit reached')) {
        setStatusMessage("❌ Daily limit reached! Maximum 20 games per day.");
      } else if (err.message?.includes('Season ended')) {
        setStatusMessage("❌ Current season has ended. Wait for new season.");
      } else {
        setStatusMessage("⚠️ Transaction failed. Please try again.");
      }
      
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
    }
  };

  // Reset game function
  const resetGame = useCallback(() => {
    setGameState(prev => {
      const newImages = [...prev.images];
      
      // Only change the losing character
      if (prev.winnerIndex !== null) {
        const loserIndex = prev.winnerIndex === 0 ? 1 : 0;
        
        // New random character excluding current ones
        const currentIds = [prev.images[0].id, prev.images[1].id];
        const availableIds = Array.from({length: 19}, (_, i) => i + 1)
          .filter(id => !currentIds.includes(id));
        
        if (availableIds.length > 0) {
          const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
          newImages[loserIndex] = {
            id: randomId,
            url: `/images/tevans${randomId}.png`,
            name: `Guilder #${randomId}`
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

  // Yeni oyun başlatma
  const startNewGame = useCallback(() => {
    if (gameState.gamePhase === "result") {
      resetGame();
    }
  }, [gameState.gamePhase, resetGame]);

  // Mobil cüzdan bağlantısı
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

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    checkWalletConnection();
  }, [checkWalletConnection]);

  const remainingGames = dailyLimit - gamesPlayedToday;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center p-4">
      {showWalletOptions && (
        <MobileWalletSelector 
          onConnect={connectMobileWallet}
          onClose={() => setShowWalletOptions(false)}
        />
      )}
      
      <div className="w-full max-w-6xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-500/20">
        <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-8 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <h1 className="text-5xl font-bold mb-3 relative z-10">⚔️ YoYo Guild</h1>
          <p className="text-xl opacity-90 relative z-10">Blockchain Battle Arena - Season {currentSeason.seasonNumber || 1}</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        </header>
        
        <nav className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 border-b border-gray-600">
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
          <WalletConnection
            walletConnected={walletConnected}
            userAddress={userAddress}
            points={points}
            seasonPoints={seasonPoints}
            yoyoBalance={yoyoBalance}
            onDisconnect={disconnectWallet}
            onConnect={connectWallet}
            isMobile={isMobile}
            onShowWalletOptions={() => setShowWalletOptions(true)}
            remainingGames={remainingGames}
            dailyLimit={dailyLimit}
            seasonTimeLeft={seasonTimeLeft}
          />
          
          <div className="min-h-[500px]">
            {activeTab === "home" && (
              <HomeContent 
                walletConnected={walletConnected} 
                yoyoBalance={yoyoBalance} 
                remainingGames={remainingGames}
                seasonTimeLeft={seasonTimeLeft}
                currentSeason={currentSeason}
              />
            )}
            {activeTab === "play" && (
              <GameBoard
                walletConnected={walletConnected}
                gameState={gameState}
                yoyoBalance={yoyoBalance}
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
              />
            )}
            {activeTab === "leaderboard" && (
              <Leaderboard 
                leaderboard={leaderboard} 
                currentSeason={currentSeason}
              />
            )}
          </div>

          {statusMessage && (
            <div className={`mt-6 p-4 rounded-xl text-center border-2 backdrop-blur-sm ${
              statusMessage.includes("won") || statusMessage.includes("successfully") 
                ? "bg-green-500/10 border-green-500/30 text-green-300" 
                : statusMessage.includes("lost") || statusMessage.includes("rejected") 
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : statusMessage.includes("Processing") 
                ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                : "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
            }`}>
              <p className="font-semibold text-lg">{statusMessage}</p>
            </div>
          )}

          {transactionInfo && (
            <div className="mt-6 bg-gray-700/50 rounded-xl p-4 overflow-auto max-h-40 border border-gray-600">
              <p className="text-gray-300 font-semibold mb-2">Transaction Info:</p>
              <pre className="text-sm text-gray-400 whitespace-pre-wrap">{transactionInfo}</pre>
            </div>
          )}
        </div>
        
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 py-4 text-center border-t border-gray-700">
          <p>YoYo Guild - Elite Blockchain Battling | Base Mainnet | Season {currentSeason.seasonNumber || 1}</p>
        </footer>
      </div>
    </div>
  );
}