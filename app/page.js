"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../utils/contract";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// YOYO Coin kontrat adresi ve ABI
const YOYO_COIN_ADDRESS = "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1";
const YOYO_COIN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// WalletConnect ve diğer cüzdan bağlantıları
const WALLET_CONNECT_PROJECT_ID = "your-walletconnect-project-id"; // WalletConnect proje ID'nizi buraya ekleyin

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionInfo, setTransactionInfo] = useState("");
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [yoyoBalance, setYoyoBalance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  
  // Oyun state'leri
  const [selectedImage, setSelectedImage] = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [gamePhase, setGamePhase] = useState("idle"); // idle, selecting, fighting, result
  const [images, setImages] = useState([
    { id: 1, url: "https://placekitten.com/300/300?image=1", winner: false },
    { id: 2, url: "https://placekitten.com/300/300?image=2", winner: false }
  ]);

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

  // Farcaster ve mobil cüzdan bağlantısı
  const connectWallet = useCallback(async (walletType = "injected") => {
    try {
      setStatusMessage("Cüzdan bağlanıyor...");
      
      let newProvider;
      
      if (walletType === "walletconnect") {
        // WalletConnect entegrasyonu buraya eklenecek
        setStatusMessage("WalletConnect destekleniyor...");
        return;
      } else {
        // Injected provider (MetaMask, Coinbase Wallet, etc.)
        if (!window.ethereum) {
          setStatusMessage("Web3 cüzdanı bulunamadı. Lütfen MetaMask veya benzeri bir cüzdan yükleyin.");
          return;
        }
        
        newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      
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
  }, [checkYoyoBalance]);

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

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    checkWalletConnection();
    loadLeaderboard();
  }, [checkWalletConnection]);

  // Liderlik tablosunu contract'tan çek
  async function loadLeaderboard() {
    try {
      if (!window.ethereum) {
        // Fallback data
        setLeaderboard([
          { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", points: 12500 },
          { rank: 2, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 9800 },
          { rank: 3, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", points: 7650 },
        ]);
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractInstance = new ethers.Contract(contractAddress, abi, provider);
      
      // Örnek adresler - gerçek uygulamada contract'tan alınacak
      const sampleAddresses = [
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        userAddress // Kullanıcının kendi adresini de ekle
      ].filter(addr => addr); // undefined/null adresleri filtrele
      
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
      
      // Puanlara göre sırala ve top 10'u al
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
      // Fallback data
      setLeaderboard([
        { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", points: 12500 },
        { rank: 2, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 9800 },
        { rank: 3, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", points: 7650 },
      ]);
    }
  }

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
      setStatusMessage("İşlem blockchain&apos;e kaydediliyor...");
      
      const signer = await provider.getSigner();
      const updatedContract = contract.connect(signer);
      
      const tx = await updatedContract.addPoints(await signer.getAddress(), amount);
      
      setTransactionInfo(`İşlem gönderildi: ${tx.hash}`);
      
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

  // Oyun mekaniği fonksiyonları
  const startGame = async (selectedIndex) => {
    if (!walletConnected) {
      setStatusMessage("Önce cüzdanı bağlayın!");
      return;
    }
    
    if (gamePhase !== "idle") return;
    
    setSelectedImage(selectedIndex);
    setGamePhase("selecting");
    
    // Seçim animasyonu
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGamePhase("fighting");
    
    // Kazananı belirle
    const winChance = yoyoBalance > 0 ? 60 : 50;
    const isWinner = Math.floor(Math.random() * 100) < winChance;
    const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);
    
    setWinnerIndex(winnerIndex);
    
    // Dövüş animasyonu
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGamePhase("result");
    
    // Puanları işle
    const earnedPoints = isWinner ? 100 : 10;
    
    if (isWinner) {
      setStatusMessage(`🎉 Tebrikler! Kazandınız! +100 puan 🥳 ${yoyoBalance > 0 ? '(%10 YOYO bonusu ile)' : ''}`);
    } else {
      setStatusMessage(`😢 Maalesef kaybettiniz. +10 puan 😔 ${yoyoBalance > 0 ? '(%10 YOYO bonusuna rağmen)' : ''}`);
    }
    
    const success = await addPointsToBlockchain(earnedPoints);
    
    if (success) {
      setPoints(points + earnedPoints);
    }
    
    // Yeni oyun için hazırlık
    setTimeout(() => {
      resetGame();
    }, 3000);
  };

  const resetGame = () => {
    setSelectedImage(null);
    setWinnerIndex(null);
    setGamePhase("idle");
    
    // Kaybeden resmi değiştir
    if (winnerIndex !== null) {
      const loserIndex = winnerIndex === 0 ? 1 : 0;
      const newImages = [...images];
      newImages[loserIndex] = {
        ...newImages[loserIndex],
        url: `https://placekitten.com/300/300?image=${Math.floor(Math.random() * 10) + 3}`,
        winner: false
      };
      setImages(newImages);
    }
  };

  // Animasyon varyantları
  const imageVariants = {
    idle: { scale: 1, x: 0, opacity: 1 },
    selected: { scale: 1.1, x: 0, opacity: 1 },
    attacking: (custom) => ({
      x: custom.direction * 100,
      scale: 1.2,
      transition: { duration: 0.5 }
    }),
    winning: { 
      scale: 1.3, 
      rotate: 360,
      transition: { duration: 1 }
    },
    losing: { 
      scale: 0.8, 
      opacity: 0,
      x: -200,
      transition: { duration: 1 }
    }
  };

  // UI bileşenleri
  const renderHomeTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">YoYo Guild&apos;e Hoş Geldiniz!</h2>
      {/* ... home content aynı kalacak ... */}
    </div>
  );

  const renderPlayTab = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center text-indigo-700">Dövüş Arenası</h2>
      
      {walletConnected && (
        <div className="bg-indigo-100 p-4 rounded-lg text-center">
          <p className="text-indigo-800 font-semibold">Toplam Puanınız: <span className="text-2xl">{points}</span></p>
          {yoyoBalance > 0 ? (
            <p className="text-green-600 mt-1">
              🎉 {yoyoBalance} YOYO Coin&apos;iniz var! Kazanma şansınız: <span className="font-bold">%60</span>
            </p>
          ) : (
            <p className="text-yellow-600 mt-1">
              ℹ️ YOYO Coin&apos;iniz yok. Kazanma şansınız: <span className="font-bold">%50</span>
            </p>
          )}
        </div>
      )}
      
      {walletConnected ? (
        <>
          <div className="flex justify-center items-center gap-8 relative">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="relative cursor-pointer"
                  variants={imageVariants}
                  initial="idle"
                  animate={
                    gamePhase === "selecting" && selectedImage === index ? "selected" :
                    gamePhase === "fighting" ? 
                      (index === selectedImage ? "attacking" : "idle") :
                    gamePhase === "result" ?
                      (index === winnerIndex ? "winning" : "losing") :
                    "idle"
                  }
                  custom={{ direction: index === 0 ? 1 : -1 }}
                  whileHover={gamePhase === "idle" ? { scale: 1.05 } : {}}
                  onClick={() => gamePhase === "idle" && startGame(index)}
                >
                  <Image
                    src={image.url}
                    alt={`Dövüşçü ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-xl shadow-lg border-4 border-gray-300"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                    Dövüşçü {index + 1}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* VS yazısı */}
            <motion.div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text">
                VS
              </span>
            </motion.div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">Bir dövüşçü seçin ve kazanıp kazanmadığınızı görün!</p>
            <p className="text-sm text-gray-500 mt-1">
              {yoyoBalance > 0 ? 'Kazanma şansınız: %60' : 'Kazanma şansınız: %50'}
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="bg-yellow-100 p-6 rounded-xl max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4">Oyun Oynamak İçin Cüzdan Bağlayın</h3>
            <button
              onClick={() => connectWallet()}
              className="bg-gradient-to-r from-indigo-600 to-green-500 hover:from-indigo-700 hover:to-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 mb-3"
            >
              Cüzdanı Bağla
            </button>
            {isMobile && (
              <>
                <p className="text-sm text-yellow-700 mb-2">
                  📱 Mobil cihazınızda cüzdan bağlamak için:
                </p>
                <button
                  onClick={() => setShowWalletOptions(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-sm"
                >
                  Diğer Cüzdan Seçenekleri
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderLeaderboardTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">Liderlik Tablosu - Top 10</h2>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="grid grid-cols-3 bg-indigo-100 text-indigo-800 font-semibold p-4">
          <div>Sıra</div>
          <div>Cüzdan Adresi</div>
          <div className="text-right">Puan</div>
        </div>
        
        <div className="divide-y">
          {leaderboard.map((player) => (
            <div key={player.rank} className="grid grid-cols-3 p-4 hover:bg-gray-50">
              <div className="font-medium">#{player.rank}</div>
              <div className="truncate">
                {player.address.substring(0, 6)}...{player.address.substring(player.address.length - 4)}
              </div>
              <div className="text-right font-semibold">{player.points.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MobileWalletSelector = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Cüzdan Seçin</h3>
        
        <div className="space-y-3">
          <button
            onClick={() => connectWallet("injected")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="mr-2">🦊</span> MetaMask/Injected
          </button>
          
          <button
            onClick={() => connectWallet("walletconnect")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="mr-2">🔗</span> WalletConnect
          </button>
        </div>
        
        <button
          onClick={() => setShowWalletOptions(false)}
          className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
        >
          İptal
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center p-4">
      {showWalletOptions && <MobileWalletSelector />}
      
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* ... header ve navigation aynı kalacak ... */}
        
        <div className="p-6">
          {/* ... cüzdan bilgileri ve içerik aynı kalacak ... */}
        </div>
      </div>
    </div>
  );
}