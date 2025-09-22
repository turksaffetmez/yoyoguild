"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract";
import WalletConnection from "./components/WalletConnection";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import HomeContent from "./components/HomeContent";
import MobileWalletSelector from "./components/MobileWalletSelector";

// YOYO Coin kontrat adresi ve ABI
const YOYO_COIN_ADDRESS = "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1";
const YOYO_COIN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionInfo, setTransactionInfo] = useState("");
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [yoyoBalance, setYoyoBalance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  
  // Oyun state'leri - 19 TeVans desteği
  const [gameState, setGameState] = useState({
    selectedImage: null,
    winnerIndex: null,
    gamePhase: "idle", // idle, selecting, waiting, fighting, result
    images: [
      { id: 1, url: "/images/tevans1.png" },
      { id: 2, url: "/images/tevans2.png" },
      { id: 3, url: "/images/tevans3.png" },
      { id: 4, url: "/images/tevans4.png" },
      { id: 5, url: "/images/tevans5.png" },
      { id: 6, url: "/images/tevans6.png" },
      { id: 7, url: "/images/tevans7.png" },
      { id: 8, url: "/images/tevans8.png" },
      { id: 9, url: "/images/tevans9.png" },
      { id: 10, url: "/images/tevans10.png" },
      { id: 11, url: "/images/tevans11.png" },
      { id: 12, url: "/images/tevans12.png" },
      { id: 13, url: "/images/tevans13.png" },
      { id: 14, url: "/images/tevans14.png" },
      { id: 15, url: "/images/tevans15.png" },
      { id: 16, url: "/images/tevans16.png" },
      { id: 17, url: "/images/tevans17.png" },
      { id: 18, url: "/images/tevans18.png" },
      { id: 19, url: "/images/tevans19.png" }
    ],
    isLoading: false
  });

  // useCallback ile fonksiyonları memoize et
  const disconnectWallet = useCallback(() => {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    
    setWalletConnected(false);
    setUserAddress("");
    setContract(null);
    setPoints(0);
    setProvider(null);
    setTransactionInfo("");
    setYoyoBalance(0);
    setShowWalletOptions(false);
    setGameState(prev => ({ ...prev, gamePhase: "idle", selectedImage: null, winnerIndex: null }));
  }, []);

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
      setStatusMessage("Cüzdan bağlantısı kesildi.");
    } else if (accounts[0] !== userAddress) {
      setUserAddress(accounts[0]);
      setStatusMessage("Hesap değiştirildi.");
      await checkYoyoBalance(accounts[0]);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, [userAddress, disconnectWallet]);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  const checkYoyoBalance = useCallback(async (address) => {
    if (!window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const yoyoContract = new ethers.Contract(YOYO_COIN_ADDRESS, YOYO_COIN_ABI, provider);
      
      const balance = await yoyoContract.balanceOf(address);
      const formattedBalance = Number(ethers.formatUnits(balance, 18));
      setYoyoBalance(formattedBalance);
    } catch (err) {
      console.error("YOYO bakiyesi alınamadı:", err);
      setYoyoBalance(0);
    }
  }, []);

  // TEK connectWallet FONKSİYONU - diğerini sildim
  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        setStatusMessage("Cüzdan bağlanıyor...");
        
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const signer = await newProvider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        
        setContract(contractInstance);
        const address = await signer.getAddress();
        setUserAddress(address);
        setWalletConnected(true);
        
        await checkYoyoBalance(address);
        await getPointsFromBlockchain(contractInstance, address);
        
        setStatusMessage("Cüzdan başarıyla bağlandı!");
        setTimeout(() => setStatusMessage(""), 3000);
      } catch (err) {
        console.error("Cüzdan bağlanamadı:", err);
        setStatusMessage("Cüzdan bağlanamadı. Lütfen tekrar deneyin.");
      }
    } else {
      if (isMobile) {
        setShowWalletOptions(true);
      } else {
        setStatusMessage("Lütfen bir Web3 cüzdanı yükleyin (MetaMask, Coinbase Wallet, vs.)!");
      }
    }
  }, [checkYoyoBalance, isMobile, contractAddress, abi]);

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
        console.error("Otomatik bağlantı hatası:", err);
      }
    }
  }, [handleAccountsChanged, handleChainChanged, connectWallet]);

  const loadLeaderboard = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setLeaderboard([
          { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", points: 12500 },
          { rank: 2, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 9800 },
          { rank: 3, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", points: 7650 },
        ]);
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractInstance = new ethers.Contract(contractAddress, abi, provider);
      
      const sampleAddresses = [
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        userAddress
      ].filter(addr => addr);
      
      const leaderboardData = [];
      
      for (const address of sampleAddresses) {
        try {
          const userPoints = await contractInstance.getPoints(address);
          const pointsValue = parseInt(userPoints.toString());
          if (pointsValue > 0) {
            leaderboardData.push({ address, points: pointsValue });
          }
        } catch (err) {
          console.error(`Adres ${address} için puan alınamadı:`, err);
        }
      }
      
      leaderboardData.sort((a, b) => b.points - a.points);
      const top10 = leaderboardData.slice(0, 10);
      
      const rankedLeaderboard = top10.map((player, index) => ({
        rank: index + 1,
        address: player.address,
        points: player.points
      }));
      
      setLeaderboard(rankedLeaderboard);
    } catch (err) {
      console.error("Liderlik tablosu yüklenemedi:", err);
      setLeaderboard([
        { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", points: 12500 },
        { rank: 2, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 9800 },
        { rank: 3, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", points: 7650 },
      ]);
    }
  }, [userAddress]);

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    checkWalletConnection();
    loadLeaderboard();
  }, [checkWalletConnection, loadLeaderboard]);

  async function getPointsFromBlockchain(contractInstance, address) {
    if (!contractInstance) return;
    
    try {
      const userPoints = await contractInstance.getPoints(address);
      setPoints(parseInt(userPoints.toString()));
    } catch (err) {
      console.error("Puanlar alınamadı:", err);
      setPoints(0);
    }
  }

  async function addPointsToBlockchain(amount) {
    if (!contract) {
      setStatusMessage("Önce cüzdanı bağlayın!");
      return false;
    }
    
    try {
      setStatusMessage("İşlem blockchain'e kaydediliyor...");
      
      const signer = await provider.getSigner();
      const updatedContract = contract.connect(signer);
      
      const tx = await updatedContract.addPoints(await signer.getAddress(), amount);
      
      setTransactionInfo(`İşlem gönderildi: ${tx.hash}`);
      
      // İŞLEM ONAYLANDIKTAN SONRA ANİMASYON BAŞLASIN
      const receipt = await tx.wait();
      
      setStatusMessage(`İşlem onaylandı! ${amount} puan eklendi.`);
      setTransactionInfo(prev => prev + `\nİşlem onaylandı. Blok: ${receipt.blockNumber}`);
      
      await getPointsFromBlockchain(updatedContract, await signer.getAddress());
      await loadLeaderboard();
      
      setTimeout(() => setStatusMessage(""), 3000);
      
      return true;
    } catch (err) {
      console.error("Hata:", err);
      if (err.message.includes("user rejected")) {
        setStatusMessage("İşlem kullanıcı tarafından reddedildi.");
      } else {
        setStatusMessage("İşlem başarısız: " + err.message);
      }
      return false;
    }
  }

  // Reset fonksiyonunu düzelt
  const resetGame = useCallback(() => {
    setGameState(prev => {
      const newImages = [...prev.images];
      
      // Sadece kaybeden karakteri değiştir
      if (prev.winnerIndex !== null) {
        const loserIndex = prev.winnerIndex === 0 ? 1 : 0;
        
        // Mevcut karakterler hariç yeni rastgele karakter
        const currentIds = [prev.images[0].id, prev.images[1].id];
        const availableIds = Array.from({length: 19}, (_, i) => i + 1)
          .filter(id => !currentIds.includes(id));
        
        if (availableIds.length > 0) {
          const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
          newImages[loserIndex] = {
            id: randomId,
            url: `/images/tevans${randomId}.png`
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
    
    // Status mesajını temizle
    setStatusMessage("");
  }, []);

  // Oyun mekaniği fonksiyonları
  const startGame = async (selectedIndex) => {
    if (!walletConnected) {
      setStatusMessage("Önce cüzdanı bağlayın!");
      return;
    }
    
    if (gameState.gamePhase !== "idle") return;
    
    // Oyunu başlat
    setGameState(prev => ({ 
      ...prev, 
      isLoading: true, 
      selectedImage: selectedIndex, 
      gamePhase: "selecting",
      winnerIndex: null
    }));
    
    // 1. Seçim animasyonu (1 saniye)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGameState(prev => ({ ...prev, gamePhase: "waiting" }));
    
    // 2. Kazanma şansını hesapla
    const winChance = yoyoBalance > 0 ? 60 : 50;
    const isWinner = Math.floor(Math.random() * 100) < winChance;
    const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);
    const earnedPoints = isWinner ? 100 : 10;
    
    // 3. Blockchain işlemini gönder
    const success = await addPointsToBlockchain(earnedPoints);
    
    if (success) {
      // 4. Dövüş animasyonunu başlat
      setGameState(prev => ({ ...prev, winnerIndex, gamePhase: "fighting" }));
      
      // Dövüş animasyonu (2 saniye)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 5. Sonucu göster
      setGameState(prev => ({ ...prev, gamePhase: "result" }));
      setPoints(prevPoints => prevPoints + earnedPoints);
      
      if (isWinner) {
        setStatusMessage(`🎉 Tebrikler! Kazandınız! +100 puan 🥳`);
      } else {
        setStatusMessage(`😢 Maalesef kaybettiniz. +10 puan 😔`);
      }
      
    } else {
      // İşlem başarısız olursa
      setGameState(prev => ({ 
        ...prev, 
        gamePhase: "idle", 
        isLoading: false 
      }));
      setStatusMessage("Blockchain işlemi başarısız. Lütfen tekrar deneyin.");
    }
  };

  // Yeni oyun başlatma fonksiyonu
  const startNewGame = useCallback(() => {
    if (gameState.gamePhase === "result") {
      resetGame();
    }
  }, [gameState.gamePhase, resetGame]);

  // Mobil cüzdan bağlantı fonksiyonu
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center p-4">
      {showWalletOptions && (
        <MobileWalletSelector 
          onConnect={connectMobileWallet}
          onClose={() => setShowWalletOptions(false)}
        />
      )}
      
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-gradient-to-r from-indigo-600 to-green-500 text-white py-6 px-6 text-center">
          <h1 className="text-4xl font-bold mb-2">🎮 YoYo Guild</h1>
          <p className="text-lg opacity-90">Blokzincir tabanlı dövüş ve kazanç platformu</p>
        </header>
        
        <nav className="bg-indigo-100 p-2">
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setActiveTab("home")} 
              className={`px-4 py-2 rounded-full transition-colors ${activeTab === "home" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 hover:bg-indigo-50"}`}
            >
              Ana Sayfa
            </button>
            <button 
              onClick={() => setActiveTab("play")} 
              className={`px-4 py-2 rounded-full transition-colors ${activeTab === "play" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 hover:bg-indigo-50"}`}
            >
              Dövüş Arenası
            </button>
            <button 
              onClick={() => setActiveTab("leaderboard")} 
              className={`px-4 py-2 rounded-full transition-colors ${activeTab === "leaderboard" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 hover:bg-indigo-50"}`}
            >
              Liderlik Tablosu
            </button>
            <a 
              href="https://tevaera.com/guilds/YoYo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              YoYo Guild&apos;e Katıl
            </a>
          </div>
        </nav>
        
        <div className="p-6">
          <WalletConnection
            walletConnected={walletConnected}
            userAddress={userAddress}
            points={points}
            yoyoBalance={yoyoBalance}
            onDisconnect={disconnectWallet}
            onConnect={connectWallet}
            isMobile={isMobile}
            onShowWalletOptions={() => setShowWalletOptions(true)}
          />
          
          <div className="min-h-[400px]">
            {activeTab === "home" && <HomeContent walletConnected={walletConnected} yoyoBalance={yoyoBalance} />}
            {activeTab === "play" && (
              <GameBoard
                walletConnected={walletConnected}
                gameState={gameState}
                yoyoBalance={yoyoBalance}
                points={points}
                onStartGame={startGame}
                onConnectWallet={connectWallet}
                isMobile={isMobile}
                onShowWalletOptions={() => setShowWalletOptions(true)}
                onStartNewGame={startNewGame}
                onResetGame={resetGame}
              />
            )}
            {activeTab === "leaderboard" && <Leaderboard leaderboard={leaderboard} />}
          </div>

          {statusMessage && (
            <div className={`mt-6 p-4 rounded-lg text-center ${
              statusMessage.includes("Tebrikler") || statusMessage.includes("başarıyla") ? "bg-green-100 text-green-800" : 
              statusMessage.includes("Maalesef") || statusMessage.includes("reddedildi") ? "bg-red-100 text-red-800" : 
              statusMessage.includes("bağlanıyor") || statusMessage.includes("kaydediliyor") ? "bg-blue-100 text-blue-800" : 
              "bg-yellow-100 text-yellow-800"
            }`}>
              <p className="font-semibold">{statusMessage}</p>
            </div>
          )}

          {transactionInfo && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg overflow-auto max-h-40">
              <p className="text-gray-700 font-semibold mb-2">İşlem Bilgisi:</p>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">{transactionInfo}</pre>
            </div>
          )}
        </div>
        
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>YoYo Guild - Blokzincir ile dövüş deneyimi | Base Sepolia</p>
        </footer>
      </div>
    </div>
  );
}