"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../utils/contract";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [images, setImages] = useState([
    "https://placekitten.com/300/300?image=1",
    "https://placekitten.com/300/300?image=2",
    "https://placekitten.com/300/300?image=3",
    "https://placekitten.com/300/300?image=4"
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionInfo, setTransactionInfo] = useState("");
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);

  // Örnek liderlik tablosu verisi
  const sampleLeaderboard = [
    { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", points: 12500 },
    { rank: 2, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 9800 },
    { rank: 3, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 7650 },
    { rank: 4, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 6320 },
    { rank: 5, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 5100 },
    { rank: 6, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 4870 },
    { rank: 7, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 4320 },
    { rank: 8, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 3980 },
    { rank: 9, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 3650 },
    { rank: 10, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 3420 },
  ];

  // useCallback ile fonksiyonları memoize et
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      // Kullanıcı cüzdanı bağlantısını kesti
      disconnectWallet();
      setStatusMessage("Cüzdan bağlantısı kesildi.");
    } else if (accounts[0] !== userAddress) {
      // Farklı bir hesaba geçiş yapıldı
      setUserAddress(accounts[0]);
      setStatusMessage("Hesap değiştirildi.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, [userAddress]);

  const handleChainChanged = useCallback(() => {
    // Zincir değiştiğinde sayfayı yenile
    window.location.reload();
  }, []);

  const checkWalletConnection = useCallback(async () => {
    if (!window.ethereum) return;
    
    try {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      const accounts = await newProvider.send("eth_accounts", []);
      
      if (accounts.length > 0) {
        // Otomatik olarak bağlan
        await connectWallet();
      }
    } catch (err) {
      console.error("Otomatik bağlantı hatası:", err);
    }
  }, []);

  useEffect(() => {
    // Sayfa yüklendiğinde otomatik olarak cüzdan bağlı mı kontrol et
    checkWalletConnection();
    
    // Ethereum hesap değişikliklerini dinle
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Liderlik tablosunu yükle
    setLeaderboard(sampleLeaderboard);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkWalletConnection, handleAccountsChanged, handleChainChanged]);

  async function connectWallet() {
    if (!window.ethereum) {
      setStatusMessage("Lütfen MetaMask yükleyin!");
      return;
    }
    
    try {
      setStatusMessage("Cüzdan bağlanıyor...");
      
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      await newProvider.send("eth_requestAccounts", []);
      const signer = await newProvider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      
      setContract(contractInstance);
      const address = await signer.getAddress();
      setUserAddress(address);
      setWalletConnected(true);
      
      // Mevcut puanları al
      await getPointsFromBlockchain(contractInstance, address);
      
      setStatusMessage("Cüzdan başarıyla bağlandı!");
      
      // 3 saniye sonra durum mesajını temizle
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("Cüzdan bağlanamadı:", err);
      setStatusMessage("Cüzdan bağlanamadı. Lütfen tekrar deneyin.");
    }
  }

  async function disconnectWallet() {
    setWalletConnected(false);
    setUserAddress("");
    setContract(null);
    setPoints(0);
    setProvider(null);
    setTransactionInfo("");
  }

  async function getPointsFromBlockchain(contractInstance, address) {
    if (!contractInstance) return;
    
    try {
      // Kontrattaki getPoints fonksiyonunu çağır
      const userPoints = await contractInstance.getPoints(address);
      setPoints(parseInt(userPoints.toString()));
    } catch (err) {
      console.error("Puanlar alınamadı:", err);
      // Puanları alamazsak sıfırdan devam et
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
      
      // Signer'ı güncelle
      const signer = await provider.getSigner();
      const updatedContract = contract.connect(signer);
      
      // Kontrat ile etkileşim - addPoints fonksiyonunu çağır
      const tx = await updatedContract.addPoints(await signer.getAddress(), amount);
      
      // İşlem hash'ini göster
      setTransactionInfo(`İşlem gönderildi: ${tx.hash}`);
      
      // İşlemin onaylanmasını bekle
      const receipt = await tx.wait();
      
      setStatusMessage(`İşlem onaylandı! ${amount} puan eklendi.`);
      setTransactionInfo(prev => prev + `\nİşlem onaylandı. Blok: ${receipt.blockNumber}`);
      
      // Puanları güncelle
      await getPointsFromBlockchain(updatedContract, await signer.getAddress());
      
      // 3 saniye sonra durum mesajını temizle
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

  async function selectImage(index) {
    if (isLoading) return;
    if (!walletConnected) {
      setStatusMessage("Önce cüzdanı bağlayın!");
      return;
    }
    
    setIsLoading(true);

    // Rastgele kazanan belirle
    const winner = Math.floor(Math.random() * 4);
    const earnedPoints = winner === index ? 100 : 10;

    // Kazanma mesajı göster
    if (winner === index) {
      setStatusMessage("🎉 Tebrikler! Kazandınız! +100 puan 🥳");
    } else {
      setStatusMessage("😢 Maalesef kaybettiniz. +10 puan 😔");
    }

    // Blockchain'e kaydet
    const success = await addPointsToBlockchain(earnedPoints);

    if (success) {
      // Frontend puanı güncelle
      setPoints(points + earnedPoints);
      
      // Yeni resimler (aynı resimlerle devam)
      setImages([
        "https://placekitten.com/300/300?image=1",
        "https://placekitten.com/300/300?image=2",
        "https://placekitten.com/300/300?image=3",
        "https://placekitten.com/300/300?image=4"
      ]);
    }

    setIsLoading(false);
    
    // 3 saniye sonra durum mesajını temizle
    setTimeout(() => setStatusMessage(""), 3000);
  }

  // Navigasyon sekmeleri
  const renderHomeTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">YoYo Guild&apos;e Hoş Geldiniz!</h2>
      
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-indigo-800 mb-3">YoYo Guild Nedir?</h3>
        <p className="text-gray-700">
          YoYo Guild, blokzincir teknolojisi ve oyun mekaniklerini birleştiren yenilikçi bir topluluktur. 
          Guild üyeleri, oyunlar oynayarak puan kazanır ve bu puanlarla çeşitli ödüller elde edebilirler.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-green-800 mb-3">Nasıl Çalışır?</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-2">
          <li>Cüzdanınızı bağlayın</li>
          <li>Oyunlar sekmesine gidin</li>
          <li>Resimlerden birini seçin ve kazanıp kazanmadığınızı görün</li>
          <li>Kazandığınız puanları blockchain&apos;e kaydedin</li>
          <li>Liderlik tablosunda yükselin</li>
        </ol>
      </div>
      
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-orange-800 mb-3">Neden YoYo Guild?</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Eğlenceli ve kazançlı oyun deneyimi</li>
          <li>Şeffaf ve güvenli blokzincir teknolojisi</li>
          <li>Topluluk odaklı yaklaşım</li>
          <li>Düzenli etkinlikler ve ödüller</li>
        </ul>
      </div>
    </div>
  );

  const renderPlayTab = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center text-indigo-700">Oyunu Oyna</h2>
      
      {walletConnected ? (
        <>
          <div className="bg-indigo-100 p-4 rounded-lg text-center">
            <p className="text-indigo-800 font-semibold">Toplam Puanınız: <span className="text-2xl">{points}</span></p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <div 
                key={i}
                className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-lg ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl"}`}
                onClick={() => !isLoading && selectImage(i)}
              >
                <img
                  src={img}
                  alt={`Seçenek ${i + 1}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "https://placekitten.com/300/300?image=" + (i+1);
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white py-2 text-center font-semibold">
                  Seçenek {i + 1}
                </div>
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">Bir resim seçin ve kazanıp kazanmadığınızı görün!</p>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="bg-yellow-100 p-6 rounded-xl max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4">Oyun Oynamak İçin Cüzdan Bağlayın</h3>
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-indigo-600 to-green-500 hover:from-indigo-700 hover:to-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
            >
              Cüzdanı Bağla
            </button>
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
          {leaderboard.map((player, index) => (
            <div key={index} className="grid grid-cols-3 p-4 hover:bg-gray-50">
              <div className="font-medium">#{player.rank}</div>
              <div className="truncate">
                {player.address.substring(0, 6)}...{player.address.substring(player.address.length - 4)}
              </div>
              <div className="text-right font-semibold">{player.points.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>Liderlik tablosu her gün güncellenmektedir.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-gradient-to-r from-indigo-600 to-green-500 text-white py-6 px-6 text-center">
          <h1 className="text-4xl font-bold mb-2">🎮 YoYo Guild</h1>
          <p className="text-lg opacity-90">Blokzincir tabanlı eğlence ve kazanç platformu</p>
        </header>
        
        {/* Navigasyon Menüsü */}
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
              Oyunu Oyna
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
          {/* Cüzdan Bilgileri */}
          {walletConnected && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">Cüzdan:</span> {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                </p>
                <p className="text-gray-700 mt-1">
                  <span className="font-semibold">Puanlar:</span> <span className="text-indigo-600 font-bold text-xl">{points}</span>
                </p>
              </div>
              <button
                onClick={disconnectWallet}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          )}
          
          {/* İçerik Alanı */}
          <div className="min-h-[400px]">
            {activeTab === "home" && renderHomeTab()}
            {activeTab === "play" && renderPlayTab()}
            {activeTab === "leaderboard" && renderLeaderboardTab()}
          </div>

          {/* Durum Mesajları */}
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

          {/* İşlem Bilgileri */}
          {transactionInfo && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg overflow-auto max-h-40">
              <p className="text-gray-700 font-semibold mb-2">İşlem Bilgisi:</p>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">{transactionInfo}</pre>
            </div>
          )}
        </div>
        
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>YoYo Guild - Blokzincir ile oyun deneyimi</p>
        </footer>
      </div>
    </div>
  );
}