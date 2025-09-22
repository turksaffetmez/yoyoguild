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
  
  // Oyun state'leri - TEVANS olarak güncellendi
  const [gameState, setGameState] = useState({
    selectedImage: null,
    winnerIndex: null,
    gamePhase: "idle",
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

  // ... (diğer fonksiyonlar aynı kalacak, sadece resetGame fonksiyonunu güncelliyorum)

  const resetGame = () => {
    if (gameState.winnerIndex !== null) {
      const loserIndex = gameState.winnerIndex === 0 ? 1 : 0;
      const newImages = [...gameState.images];
      const randomTeVans = Math.floor(Math.random() * 8) + 3; // 3-10 arası rastgele tevans
      newImages[loserIndex] = {
        ...newImages[loserIndex],
        url: `/images/tevans${randomTeVans}.png`
      };
      
      setGameState(prev => ({ 
        ...prev, 
        selectedImage: null, 
        winnerIndex: null, 
        gamePhase: "idle", 
        isLoading: false,
        images: newImages
      }));
    }
  };

  // ... (diğer tüm fonksiyonlar aynı kalacak)

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