"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../utils/contract";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [images, setImages] = useState([
    "https://placekitten.com/200/200?image=1",
    "https://placekitten.com/200/200?image=2",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionInfo, setTransactionInfo] = useState("");
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    // Sayfa yüklendiğinde otomatik olarak cüzdan bağlı mı kontrol et
    checkWalletConnection();
    
    // Ethereum hesap değişikliklerini dinle
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  function handleAccountsChanged(accounts) {
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
  }

  function handleChainChanged(chainId) {
    // Zincir değiştiğinde sayfayı yenile
    window.location.reload();
  }

  async function checkWalletConnection() {
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
  }

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
      // Kontratta getPoints fonksiyonu olduğunu varsayıyoruz
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
      setStatusMessage("İşlem blockchain'e kaydediliyor...");
      
      // Signer'ı güncelle
      const signer = await provider.getSigner();
      const updatedContract = contract.connect(signer);
      
      // Kontrat ile etkileşim
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
    const winner = Math.floor(Math.random() * 2);
    const earnedPoints = winner === index ? 100 : 10;

    // Kazanma mesajı göster
    if (winner === index) {
      setStatusMessage("🎉 Tebrikler! Kazandınız! +100 puan");
    } else {
      setStatusMessage("😢 Maalesef kaybettiniz. +10 puan");
    }

    // Blockchain'e kaydet
    const success = await addPointsToBlockchain(earnedPoints);

    if (success) {
      // Frontend puanı güncelle
      setPoints(points + earnedPoints);
      
      // Yeni resimler
      setImages([
        `https://placekitten.com/200/200?image=${Math.floor(Math.random() * 16)}`,
        `https://placekitten.com/200/200?image=${Math.floor(Math.random() * 16)}`,
      ]);
    }

    setIsLoading(false);
    
    // 3 saniye sonra durum mesajını temizle
    setTimeout(() => setStatusMessage(""), 3000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-gradient-to-r from-indigo-600 to-green-500 text-white py-8 px-6 text-center">
          <h1 className="text-4xl font-bold mb-2">🎮 YoYo Guild Game</h1>
          <p className="text-lg opacity-90">Kazanmak için bir resim seçin ve puan toplayın!</p>
        </header>
        
        <div className="p-6">
          <div className="text-center mb-8">
            {!walletConnected ? (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-indigo-600 to-green-500 hover:from-indigo-700 hover:to-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Cüzdanı Bağla
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <span className="font-semibold">Cüzdan:</span> {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <span className="font-semibold">Toplam Puan:</span> <span className="text-indigo-600 font-bold text-xl">{points}</span>
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors duration-300"
                >
                  Cüzdanı Bağlantısını Kes
                </button>
              </div>
            )}
          </div>

          {walletConnected && (
            <div className="game-section">
              <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
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
            </div>
          )}

          {statusMessage && (
            <div className={`p-4 rounded-lg text-center mb-4 ${
              statusMessage.includes("Tebrikler") || statusMessage.includes("başarıyla") ? "bg-green-100 text-green-800" : 
              statusMessage.includes("Maalesef") || statusMessage.includes("reddedildi") ? "bg-red-100 text-red-800" : 
              statusMessage.includes("bağlanıyor") || statusMessage.includes("kaydediliyor") ? "bg-blue-100 text-blue-800" : 
              "bg-yellow-100 text-yellow-800"
            }`}>
              {statusMessage}
            </div>
          )}

          {transactionInfo && (
            <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-40">
              <p className="text-gray-700 font-semibold mb-2">İşlem Bilgisi:</p>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">{transactionInfo}</pre>
            </div>
          )}
        </div>
        
        <footer className="bg-gray-800 text-white py-4 text-center">
          <p>YoYo Guild Game - Blokzincir ile oyun deneyimi</p>
        </footer>
      </div>
    </div>
  );
}