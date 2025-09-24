"use client";
import { useEffect } from "react";
import Image from "next/image";

export default function GameBoard({ 
  walletConnected, 
  gameState, 
  yoyoBalance, 
  points,
  seasonPoints,
  onStartGame, 
  onConnectWallet,
  isMobile,
  onShowWalletOptions,
  onStartNewGame,
  onResetGame,
  remainingGames,
  dailyLimit,
  seasonTimeLeft
}) {
  // Oyun fazı değişikliklerini takip et
  useEffect(() => {
    if (gameState.gamePhase === "result") {
      // Sonuç gösterildikten 5 saniye sonra otomatik reset
      const timer = setTimeout(() => {
        onResetGame();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gamePhase, onResetGame]);

  // Karakter seçim butonu
  const CharacterButton = ({ index, character }) => (
    <button
      onClick={() => onStartGame(index)}
      disabled={!walletConnected || gameState.gamePhase !== "idle" || gameState.isLoading || remainingGames <= 0}
      className={`relative group transition-all duration-300 transform ${
        gameState.gamePhase !== "idle" || gameState.isLoading || remainingGames <= 0 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:scale-105 hover:shadow-2xl"
      } ${
        gameState.selectedImage === index ? "ring-4 ring-yellow-400 scale-105" : ""
      }`}
    >
      <div className={`relative rounded-2xl p-6 border-4 backdrop-blur-sm ${
        gameState.winnerIndex === index 
          ? "border-green-500 bg-green-500/20" 
          : gameState.winnerIndex !== null && gameState.winnerIndex !== index 
          ? "border-red-500 bg-red-500/20" 
          : "border-purple-500/50 bg-gray-800/50"
      } transition-all duration-500`}>
        
        <Image 
          src={character.url} 
          alt={character.name}
          width={140}
          height={140}
          className="w-35 h-35 object-contain mx-auto transition-transform duration-300 group-hover:scale-110"
        />
        
        <div className="mt-3 text-center">
          <span className="font-bold text-white text-lg">{character.name}</span>
        </div>

        {/* Selection glow */}
        {gameState.selectedImage === index && gameState.gamePhase === "selecting" && (
          <div className="absolute inset-0 rounded-2xl bg-yellow-400/20 animate-pulse"></div>
        )}

        {/* Winner crown */}
        {gameState.winnerIndex === index && gameState.gamePhase === "result" && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
            👑
          </div>
        )}
      </div>
    </button>
  );

  const FightAnimation = () => (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 rounded-3xl">
      <div className="text-center text-white">
        {/* Character movement animation */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <div className="transform transition-all duration-1000 animate-bounce">
            <Image 
              src={gameState.images[0].url} 
              alt={gameState.images[0].name}
              width={120}
              height={120}
              className="w-30 h-30 object-contain filter drop-shadow-lg"
            />
          </div>
          
          <div className="text-6xl animate-ping">⚡</div>
          
          <div className="transform transition-all duration-1000 animate-bounce" style={{animationDelay: '0.5s'}}>
            <Image 
              src={gameState.images[1].url} 
              alt={gameState.images[1].name}
              width={120}
              height={120}
              className="w-30 h-30 object-contain filter drop-shadow-lg"
            />
          </div>
        </div>

        <div className="text-4xl font-bold mb-4 animate-pulse">CLASH! ⚔️</div>
        <div className="text-xl text-gray-300">Processing blockchain transaction...</div>
        
        {/* Impact effects */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-64 h-64 border-4 border-orange-500/50 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );

  const formatTimeLeft = (seconds) => {
    if (!seconds || seconds === 0) return "Season ended";
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return "Less than 1h left";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Premium Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl p-5 text-center border border-blue-500/30 backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">{points.toLocaleString()}</div>
          <div className="text-blue-300 text-sm font-semibold">TOTAL POINTS</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-2xl p-5 text-center border border-purple-500/30 backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">{seasonPoints.toLocaleString()}</div>
          <div className="text-purple-300 text-sm font-semibold">SEASON POINTS</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl p-5 text-center border border-green-500/30 backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">{yoyoBalance.toFixed(2)}</div>
          <div className="text-green-300 text-sm font-semibold">YOYO BALANCE</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-2xl p-5 text-center border border-orange-500/30 backdrop-blur-sm">
          <div className="text-3xl font-bold text-white mb-1">{remainingGames}/{dailyLimit}</div>
          <div className="text-orange-300 text-sm font-semibold">DAILY GAMES</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl p-5 text-center border border-yellow-500/30 backdrop-blur-sm">
          <div className="text-2xl font-bold text-white mb-1">{formatTimeLeft(seasonTimeLeft)}</div>
          <div className="text-yellow-300 text-sm font-semibold">SEASON END</div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 rounded-3xl p-8 shadow-2xl min-h-[600px] flex items-center justify-center border-2 border-purple-500/30">
        
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-pulse"></div>
        
        {/* Battle Arena Title */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-full font-bold text-xl shadow-2xl border-2 border-orange-400">
          ⚔️ BATTLE ARENA ⚔️
        </div>

        {/* Wallet Not Connected */}
        {!walletConnected && (
          <div className="text-center text-white p-8 relative z-10">
            <div className="text-8xl mb-6 animate-bounce">🔒</div>
            <h3 className="text-3xl font-bold mb-4">Wallet Connection Required</h3>
            <p className="text-gray-300 mb-6 text-lg">Connect your wallet to enter the arena</p>
            <button
              onClick={isMobile ? onShowWalletOptions : onConnectWallet}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-10 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl text-lg"
            >
              {isMobile ? "📱 Connect Mobile Wallet" : "🔗 Connect Wallet"}
            </button>
          </div>
        )}

        {/* Daily Limit Reached */}
        {walletConnected && remainingGames <= 0 && (
          <div className="text-center text-white p-8 relative z-10">
            <div className="text-8xl mb-6 animate-pulse">⏰</div>
            <h3 className="text-3xl font-bold mb-4">Daily Limit Reached</h3>
            <p className="text-gray-300 mb-2 text-lg">You've completed today's {dailyLimit} battles</p>
            <p className="text-yellow-300 text-lg">Return tomorrow for more epic battles!</p>
          </div>
        )}

        {/* Season Ended */}
        {walletConnected && seasonTimeLeft === 0 && (
          <div className="text-center text-white p-8 relative z-10">
            <div className="text-8xl mb-6">🏆</div>
            <h3 className="text-3xl font-bold mb-4">Season Ended</h3>
            <p className="text-gray-300 mb-2 text-lg">Current season has concluded</p>
            <p className="text-yellow-300 text-lg">Wait for the next season to begin!</p>
          </div>
        )}

        {/* Ready to Battle */}
        {walletConnected && remainingGames > 0 && seasonTimeLeft > 0 && gameState.gamePhase === "idle" && (
          <div className="text-center text-white relative z-10">
            <div className="text-6xl mb-6 animate-pulse">🎮</div>
            <h3 className="text-3xl font-bold mb-4">Ready for Battle!</h3>
            <p className="text-gray-300 text-lg mb-8">Choose your Guilder and begin the fight</p>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
              <p className="text-yellow-300 mb-2">🎯 Win with YOYO: 500 points | Win without: 250 points</p>
              <p className="text-gray-300">💀 Lose: 10 points</p>
            </div>
          </div>
        )}

        {/* Character Selection */}
        {walletConnected && remainingGames > 0 && seasonTimeLeft > 0 && (gameState.gamePhase === "idle" || gameState.gamePhase === "selecting") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl relative z-10">
            <CharacterButton index={0} character={gameState.images[0]} />
            <div className="flex items-center justify-center">
              <div className="text-4xl text-white/50 animate-pulse">VS</div>
            </div>
            <CharacterButton index={1} character={gameState.images[1]} />
          </div>
        )}

        {/* Fight Animation */}
        {walletConnected && gameState.gamePhase === "fighting" && (
          <FightAnimation />
        )}

        {/* Result Screen */}
        {walletConnected && gameState.gamePhase === "result" && (
          <div className="text-center text-white w-full relative z-10">
            <div className={`text-8xl mb-6 animate-bounce ${
              gameState.winnerIndex !== null ? "text-yellow-400" : "text-gray-400"
            }`}>
              {gameState.winnerIndex !== null ? "🏆" : "🤝"}
            </div>
            
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {gameState.winnerIndex !== null ? "VICTORY ACHIEVED!" : "BATTLE ENDED!"}
            </h3>
            
            <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mx-auto mt-8">
              <div className={`p-6 rounded-2xl transition-all duration-1000 border-4 ${
                gameState.winnerIndex === 0 
                  ? "border-green-500 bg-green-500/20 scale-110" 
                  : "border-red-500 bg-red-500/20 opacity-60"
              }`}>
                <Image 
                  src={gameState.images[0].url} 
                  alt={gameState.images[0].name}
                  width={140}
                  height={140}
                  className="w-35 h-35 object-contain mx-auto"
                />
                <div className="mt-3 font-bold text-lg">
                  {gameState.winnerIndex === 0 ? "🎯 VICTORIOUS" : "💀 DEFEATED"}
                </div>
              </div>
              
              <div className={`p-6 rounded-2xl transition-all duration-1000 border-4 ${
                gameState.winnerIndex === 1 
                  ? "border-green-500 bg-green-500/20 scale-110" 
                  : "border-red-500 bg-red-500/20 opacity-60"
              }`}>
                <Image 
                  src={gameState.images[1].url} 
                  alt={gameState.images[1].name}
                  width={140}
                  height={140}
                  className="w-35 h-35 object-contain mx-auto"
                />
                <div className="mt-3 font-bold text-lg">
                  {gameState.winnerIndex === 1 ? "🎯 VICTORIOUS" : "💀 DEFEATED"}
                </div>
              </div>
            </div>

            {/* New Battle Button */}
            <div className="mt-12">
              <button 
                onClick={onStartNewGame}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-4 px-12 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl text-lg animate-pulse"
              >
                ⚔️ START NEW BATTLE
              </button>
              <p className="text-gray-400 mt-3">
                Next battle begins automatically in 5 seconds
              </p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {gameState.isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-3xl z-50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-xl">Preparing Battle...</p>
            </div>
          </div>
        )}
      </div>

      {/* Game Instructions */}
      <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white border border-gray-600">
        <h4 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-yellow-400 mr-2">🎯</span>
          BATTLE INSTRUCTIONS
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <ul className="space-y-2">
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Select your Guilder to start</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> YOYO tokens increase win chance to 60%</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Watch the epic battle animation</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Win with YOYO: 500 points</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Win without YOYO: 250 points</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Lose: 10 points</li>
              <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Maximum {dailyLimit} battles per day</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}