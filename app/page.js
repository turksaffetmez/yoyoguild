"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../utils/contract";

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
  const [images, setImages] = useState([
    "https://placekitten.com/300/300?image=1",
    "https://placekitten.com/300/300?image=2"
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionInfo, setTransactionInfo] = useState("");
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [yoyoBalance, setYoyoBalance] = useState(0);
  const [yoyoDecimals, setYoyoDecimals] = useState(18);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobil cihaz kontrolü
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    
    // Sayfa yüklendiğinde otomatik olarak cüzdan bağlı mı kontrol et
    checkWalletConnection();
    
    // Liderlik tablosunu yükle
    loadLeaderboard();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      // Kullanıcı cüzdanı bağlantısını kesti
      disconnectWallet();
      setStatusMessage("Cüzdan bağlantısı kesildi.");
    } else if (accounts[0] !== userAddress) {
      // Farklı bir hesaba geçiş yapıldı
      setUserAddress(accounts[0]);
      setStatusMessage("Hesap değiştirildi.");
      
      // Yeni hesap için YOYO bakiyesini kontrol et
      await checkYoyoBalance(accounts[0]);
      
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
      
      // Ethereum event listener'larını ekle
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      const accounts = await newProvider.send("eth_accounts", []);
      
      if (accounts.length > 0) {
        // Otomatik olarak bağlan
        await connectWallet();
      }
    } catch (err) {
      console.error("Otomatik bağlantı hatası:", err);
    }
  }, [handleAccountsChanged, handleChainChanged]);

  async function checkYoyoBalance(address) {
    if (!window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const yoyoContract = new ethers.Contract(YOYO_COIN_ADDRESS, YOYO_COIN_ABI, provider);
      
      // Decimals değerini al
      const decimals = await yoyoContract.decimals();
      setYoyoDecimals(Number(decimals));
      
      // Bakiyeyi al
      const balance = await yoyoContract.balanceOf(address);
      const formattedBalance = Number(ethers.formatUnits(balance, decimals));
      setYoyoBalance(formattedBalance);
    } catch (err) {
      console.error("YOYO bakiyesi alınamadı:", err);
      setYoyoBalance(0);
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setStatusMessage("Lütfen bir Web3 cüzdanı yükleyin (MetaMask, Coinbase Wallet, vs.)!");
      return;
    }
    
    try {
      setStatusMessage("Cüzdan bağlanıyor...");
      
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      
      // Tüm cüzdanları destekleyen bağlantı
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const signer = await newProvider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      
      setContract(contractInstance);
      const address = await signer.getAddress();
      setUserAddress(address);
      setWalletConnected(true);
      
      // YOYO Coin bakiyesini kontrol et
      await checkYoyoBalance(address);
      
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

  async function loadLeaderboard() {
    try {
      if (!window.ethereum) return;
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractInstance = new ethers.Contract(contractAddress, abi, provider);
      
      // Örnek adresler - gerçek uygulamada contract'tan alınacak
      const sampleAddresses = [
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
      ];
      
      const leaderboardData = [];
      
      // Her adres için puanları al
      for (const address of sampleAddresses) {
        try {
          const userPoints = await contractInstance.getPoints(address);
          leaderboardData.push({
            address,
            points: parseInt(userPoints.toString())
          });
        } catch (err) {
          console.error(`Adres ${address} için puan alınamadı:`, err);
        }
      }
      
      // Puanlara göre sırala
      leaderboardData.sort((a, b) => b.points - a.points);
      
      // Sıralama ekle
      const rankedLeaderboard = leaderboardData.map((player, index) => ({
        rank: index + 1,
        address: player.address,
        points: player.points
      }));
      
      setLeaderboard(rankedLeaderboard);
    } catch (err) {
      console.error("Liderlik tablosu yüklenemedi:", err);
      
      // Fallback: Örnek veriler
      const sampleLeaderboard = [
        { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", points: 12500 },
        { rank: 2, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 9800 },
        { rank: 3, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", points: 7650 },
      ];
      
      setLeaderboard(sampleLeaderboard);
    }
  }

  async function addPointsToBlockchain(amount) {
    if (!contract) {
      setStatusMessage("Önce cüzdanı bağlayın!");
      return false;
    }
    
    try {
      setStatusMessage("İşlem blockchain'e kaydediliyor...");
      
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
      
      // Liderlik tablosunu yenile
      await loadLeaderboard();
      
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

    // Temel kazanma şansı %50
    let winChance = 50;
    
    // YOYO Coin'e sahipse %10 ekstra şans
    if (yoyoBalance > 0) {
      winChance += 10;
    }
    
    // Rastgele kazanan belirle
    const randomNum = Math.floor(Math.random() * 100);
    const isWinner = randomNum < winChance;
    const earnedPoints = isWinner ? 100 : 10;

    // Kazanma mesajı göster
    if (isWinner) {
      setStatusMessage(`🎉 Tebrikler! Kazandınız! +100 puan 🥳 ${yoyoBalance > 0 ? '(%10 YOYO bonusu ile)' : ''}`);
    } else {
      setStatusMessage(`😢 Maalesef kaybettiniz. +10 puan 😔 ${yoyoBalance > 0 ? '(%10 YOYO bonusuna rağmen)' : ''}`);
    }

    // Blockchain'e kaydet
    const success = await addPointsToBlockchain(earnedPoints);

    if (success) {
      // Frontend puanı güncelle
      setPoints(points + earnedPoints);
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
        <h3 className="text-xl font-semibold text-green-800 mb-3">YOYO Coin Avantajı</h3>
        <p className="text-gray-700">
          YOYO Coin&apos;e sahipseniz, oyunlarda kazanma şansınız %10 artar! 
          Daha fazla kazanmak için YOYO Coin edinin.
        </p>
        {walletConnected && yoyoBalance > 0 && (
          <div className="mt-3 p-3 bg-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              🎉 Tebrikler! {yoyoBalance} YOYO Coin&apos;iniz var. Kazanma şansınız %10 arttı!
            </p>
          </div>
        )}
        {walletConnected && yoyoBalance === 0 && (
          <div className="mt-3 p-3 bg-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold">
              ℹ️ YOYO Coin&apos;iniz yok. Kazanma şansınız %50. YOYO Coin alarak şansınızı %60&apos;a çıkarabilirsiniz!
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-orange-800 mb-3">Nasıl Çalışır?</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-2">
          <li>Cüzdanınızı bağlayın (MetaMask, Coinbase Wallet, vs.)</li>
          <li>Oyunlar sekmesine gidin</li>
          <li>İki resimden birini seçin (%50 kazanma şansı)</li>
          <li>YOYO Coin&apos;iniz varsa %60 şansla kazanın</li>
          <li>Kazandığınız puanları blockchain&apos;e kaydedin</li>
          <li>Liderlik tablosunda yükselin</li>
        </ol>
      </div>
    </div>
  );

  const renderPlayTab = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center text-indigo-700">Oyunu Oyna</h2>
      
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
          <div className="flex justify-center gap-6">
            {images.map((img, i) => (
              <div 
                key={i}
                className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-lg ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl"}`}
                onClick={() => !isLoading && selectImage(i)}
              >
                <img
                  src={img}
                  alt={`Seçenek ${i + 1}`}
                  className="w-64 h-64 object-cover"
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
              onClick={connectWallet}
              className="bg-gradient-to-r from-indigo-600 to-green-500 hover:from-indigo-700 hover:to-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
            >
              Cüzdanı Bağla
            </button>
            {isMobile && (
              <p className="text-sm text-yellow-700 mt-3">
                📱 Mobil cihazınızda: MetaMask, Coinbase Wallet veya Trust Wallet gibi bir Web3 cüzdan uygulaması kullanın.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderLeaderboardTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">Liderlik Tablosu</h2>
      
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
        <p>Liderlik tablosu gerçek zamanlı olarak blockchain&apos;den alınmaktadır.</p>
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
                {yoyoBalance > 0 ? (
                  <p className="text-green-600 mt-1">
                    <span className="font-semibold">YOYO Coin:</span> {yoyoBalance}
                  </p>
                ) : (
                  <p className="text-yellow-600 mt-1">
                    <span className="font-semibold">YOYO Coin:</span> 0
                  </p>
                )}
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
          <p>YoYo Guild - Blokzincir ile oyun deneyimi | Base Sepolia</p>
        </footer>
      </div>
    </div>
  );
}