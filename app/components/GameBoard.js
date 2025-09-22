"use client";
import { useEffect, useState } from "react";

export default function GameBoard({ 
  walletConnected, 
  gameState, 
  yoyoBalance, 
  points, 
  onStartGame, 
  onConnectWallet,
  isMobile,
  onShowWalletOptions,
  onStartNewGame,
  onResetGame
}) {
  const [localGameState, setLocalGameState] = useState({
    fightAnimation: false,
    showResult: false
  });

  // Oyun fazı değişikliklerini takip et
  useEffect(() => {
    if (gameState.gamePhase === "result") {
      // Sonuç gösterildikten 3 saniye sonra otomatik reset
      const timer = setTimeout(() => {
        onResetGame();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    if (gameState.gamePhase === "fighting") {
      // Dövüş animasyonu
      setLocalGameState(prev => ({ ...prev, fightAnimation: true }));
      const timer = setTimeout(() => {
        setLocalGameState(prev => ({ ...prev, fightAnimation: false }));
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gamePhase, onResetGame]);

  // Karakter seçim butonu
  const CharacterButton = ({ index, character }) => (
    <button
      onClick={() => onStartGame(index)}
      disabled={!walletConnected || gameState.gamePhase !== "idle" || gameState.isLoading}
      className={`relative group transition-all duration-300 transform hover:scale-105 ${
        gameState.gamePhase !== "idle" || gameState.isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl"
      } ${
        gameState.selectedImage === index ? "ring-4 ring-yellow-400 scale-105" : ""
      }`}
    >
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 border-4 ${
        gameState.winnerIndex === index ? "border-green-500 bg-green-50" : 
        gameState.winnerIndex !== null && gameState.winnerIndex !== index ? "border-red-300 bg-red-50" :
        "border-gray-300"
      } transition-all duration-500`}>
        <img 
          src={character.url} 
          alt={`TeVans ${character.id}`}
          className="w-32 h-32 object-contain mx-auto transition-transform duration-300 group-hover:scale-110"
        />
        <div className="mt-2 text-center">
          <span className="font-bold text-gray-700">TeVans #{character.id}</span>
        </div>
      </div>
      
      {/* Seçim efekti */}
      {gameState.selectedImage === index && gameState.gamePhase === "selecting" && (
        <div className="absolute inset-0 rounded-2xl bg-yellow-200 bg-opacity-30 animate-pulse"></div>
      )}
      
      {/* Kazanan efekti */}
      {gameState.winnerIndex === index && gameState.gamePhase === "result" && (
        <div className="absolute inset-0 rounded-2xl bg-green-200 bg-opacity-40 animate-ping"></div>
      )}
    </button>
  );

  // Dövüş animasyonu
  const FightAnimation = () => (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-6xl animate-bounce">⚔️</div>
      <div className="absolute text-4xl animate-ping">🔥</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Oyun Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{points}</div>
          <div className="text-sm text-blue-500">Toplam Puan</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{yoyoBalance} YOYO</div>
          <div className="text-sm text-green-500">Token Balance</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {yoyoBalance > 0 ? "%60" : "%50"}
          </div>
          <div className="text-sm text-purple-500">Kazanma Şansı</div>
        </div>
      </div>

      {/* Oyun Arena */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl p-8 shadow-2xl min-h-[500px] flex items-center justify-center">
        {/* Dövüş Arenası Başlığı */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
          ⚔️ DÖVÜŞ ARENASI ⚔️
        </div>

        {/* Cüzdan Bağlı Değilse */}
        {!walletConnected && (
          <div className="text-center text-white p-8">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-4">Cüzdan Bağlantısı Gerekli</h3>
            <p className="text-gray-300 mb-6">Dövüşe başlamak için cüzdanınızı bağlayın</p>
            <button
              onClick={isMobile ? onShowWalletOptions : onConnectWallet}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {isMobile ? "Mobil Cüzdan Bağla" : "Cüzdan Bağla"}
            </button>
          </div>
        )}

        {/* Cüzdan Bağlıysa ve Oyun Hazırsa */}
        {walletConnected && gameState.gamePhase === "idle" && (
          <div className="text-center text-white">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-2">Dövüşe Hazır!</h3>
            <p className="text-gray-300 mb-6">Bir karakter seçerek dövüşü başlat</p>
          </div>
        )}

        {/* Karakter Seçim Ekranı */}
        {walletConnected && (gameState.gamePhase === "idle" || gameState.gamePhase === "selecting") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            <CharacterButton index={0} character={gameState.images[0]} />
            <CharacterButton index={1} character={gameState.images[1]} />
          </div>
        )}

        {/* Bekleme Ekranı */}
        {walletConnected && gameState.gamePhase === "waiting" && (
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h3 className="text-2xl font-bold mb-2">Blockchain İşlemi Bekleniyor...</h3>
            <p className="text-gray-300">Lütfen cüzdanınızdaki işlemi onaylayın</p>
          </div>
        )}

        {/* Dövüş Animasyonu */}
        {walletConnected && gameState.gamePhase === "fighting" && (
          <div className="text-center text-white relative">
            <FightAnimation />
            <div className="relative z-20">
              <div className="text-6xl mb-4 animate-bounce">⚔️</div>
              <h3 className="text-2xl font-bold mb-2">DÖVÜŞ!</h3>
              <p className="text-gray-300">Karakterler savaşıyor...</p>
            </div>
            
            {/* Karakterler dövüş sırasında da görünsün */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mt-8 opacity-70">
              <div>
                <img 
                  src={gameState.images[0].url} 
                  alt="TeVans 1"
                  className="w-32 h-32 object-contain mx-auto"
                />
              </div>
              <div>
                <img 
                  src={gameState.images[1].url} 
                  alt="TeVans 2" 
                  className="w-32 h-32 object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sonuç Ekranı */}
        {walletConnected && gameState.gamePhase === "result" && (
          <div className="text-center text-white w-full">
            <div className={`text-6xl mb-4 animate-bounce ${
              gameState.winnerIndex === 0 ? "text-green-400" : 
              gameState.winnerIndex === 1 ? "text-green-400" : "text-gray-400"
            }`}>
              {gameState.winnerIndex !== null ? "🏆" : "😢"}
            </div>
            
            <h3 className="text-3xl font-bold mb-2">
              {gameState.winnerIndex !== null ? "🎉 KAZANAN BELLİ OLDU! 🎉" : "❌ BERABERE ❌"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mx-auto mt-8">
              <div className={`p-4 rounded-2xl transition-all duration-500 ${
                gameState.winnerIndex === 0 ? "bg-green-500 scale-105" : "bg-red-500"
              }`}>
                <img 
                  src={gameState.images[0].url} 
                  alt="TeVans 1"
                  className="w-32 h-32 object-contain mx-auto"
                />
                <div className="mt-2 font-bold">
                  {gameState.winnerIndex === 0 ? "🏆 KAZANDI!" : "💀 KAYBETTİ"}
                </div>
              </div>
              
              <div className={`p-4 rounded-2xl transition-all duration-500 ${
                gameState.winnerIndex === 1 ? "bg-green-500 scale-105" : "bg-red-500"
              }`}>
                <img 
                  src={gameState.images[1].url} 
                  alt="TeVans 2"
                  className="w-32 h-32 object-contain mx-auto"
                />
                <div className="mt-2 font-bold">
                  {gameState.winnerIndex === 1 ? "🏆 KAZANDI!" : "💀 KAYBETTİ"}
                </div>
              </div>
            </div>

            {/* Yeni Oyun Butonu */}
            <div className="mt-8">
              <button 
                onClick={onStartNewGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg animate-pulse"
              >
                🎮 YENİ DÖVÜŞ BAŞLAT
              </button>
              <p className="text-gray-300 mt-2 text-sm">
                Otomatik olarak 5 saniye sonra yeni dövüş başlayacak
              </p>
            </div>
          </div>
        )}

        {/* Loading Durumu */}
        {gameState.isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-3xl">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p>Yükleniyor...</p>
            </div>
          </div>
        )}
      </div>

      {/* Oyun Talimatları */}
      <div className="mt-6 bg-gray-800 text-white rounded-lg p-4">
        <h4 className="font-bold mb-2">🎯 Oyun Talimatları:</h4>
        <ul className="text-sm space-y-1">
          <li>• Bir karakter seçerek dövüşü başlat</li>
          <li>• YOYO token'ın varsa kazanma şansın %60</li>
          <li>• Kazanırsan +100 puan, kaybedersen +10 puan</li>
          <li>• Kaybeden karakter bir sonraki dövüşte değişir</li>
        </ul>
      </div>
    </div>
  );
}