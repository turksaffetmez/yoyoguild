import { useState, useEffect } from 'react';
import Image from 'next/image';

const GameBoard = ({
  walletConnected,
  gameState,
  yoyoBalanceAmount,
  points,
  onStartGame,
  onConnectWallet,
  isMobile,
  onStartNewGame,
  onResetGame,
  remainingGames,
  dailyLimit,
  isLoading,
  pointValues
}) => {
  const [countdown, setCountdown] = useState(0);
  const [fightAnimation, setFightAnimation] = useState(false);

  useEffect(() => {
    if (gameState.gamePhase === "fighting" && gameState.countdown > 0) {
      setCountdown(gameState.countdown);
    } else if (gameState.gamePhase === "fighting" && (!gameState.countdown || gameState.countdown === 0)) {
      setFightAnimation(true);
      setTimeout(() => setFightAnimation(false), 2000);
    }
  }, [gameState.gamePhase, gameState.countdown]);

  const handleGameStart = (selectedIndex) => {
    onConnectWallet();
  };

  const getWinChance = () => {
    return yoyoBalanceAmount > 0 ? 60 : 50;
  };

  const getPointsInfo = () => {
    if (yoyoBalanceAmount > 0) {
      return `Win: ${pointValues.winYoyo} points | Lose: ${pointValues.lose} points`;
    } else {
      return `Win: ${pointValues.winNormal} points | Lose: ${pointValues.lose} points`;
    }
  };

  const renderGamePhase = () => {
    switch (gameState.gamePhase) {
      case "idle":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Tevan</h2>

            <p className="text-gray-300 mb-2">
              Win rate: <span className="text-yellow-400">{getWinChance()}%</span>
              {yoyoBalanceAmount > 0 && <span className="text-green-400 ml-2">(+10% YOYO Boost!)</span>}
            </p>
            <p className="text-green-400 font-semibold mb-4">
              {getPointsInfo()}
            </p>
            
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center items-center max-w-4xl mx-auto relative`}>
              <div className={`text-center ${isMobile ? 'mb-12' : 'mr-12'}`}>
                <div 
                  className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 ${isMobile ? 'w-full' : 'p-6'} border-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-purple-500 ${
                    gameState.selectedImage === 0 ? 'border-yellow-400 scale-105' : 'border-gray-600'
                  }`}
                  onClick={() => handleGameStart(0)}
                >
                  <div className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} mx-auto mb-4 relative`}>
                    <Image
                      src={gameState.images[0].url}
                      alt={gameState.images[0].name}
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-2`}>{gameState.images[0].name}</h3>
                  <div className="text-sm text-gray-400">Win Chance: {getWinChance()}%</div>
                </div>
              </div>

              <div className={`font-bold text-red-500 animate-pulse absolute ${isMobile ? 'text-3xl top-1/2' : 'text-4xl left-1/2'} transform -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-900/80 rounded-full ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} flex items-center justify-center border-4 border-red-500`}>
                VS
              </div>

              <div className={`text-center ${isMobile ? 'mt-12' : 'ml-12'}`}>
                <div 
                  className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 ${isMobile ? 'w-full' : 'p-6'} border-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-purple-500 ${
                    gameState.selectedImage === 1 ? 'border-yellow-400 scale-105' : 'border-gray-600'
                  }`}
                  onClick={() => handleGameStart(1)}
                >
                  <div className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} mx-auto mb-4 relative`}>
                    <Image
                      src={gameState.images[1].url}
                      alt={gameState.images[1].name}
                      fill
                      className="rounded-xl object-cover scale-x-[-1]"
                    />
                  </div>
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-2`}>{gameState.images[1].name}</h3>
                  <div className="text-sm text-gray-400">Win Chance: {getWinChance()}%</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 max-w-md mx-auto">
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Wallet Status:</span>
                  <span className="text-yellow-400">Not Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>YOYO Boost:</span>
                  <span className="text-yellow-400">Not Active</span>
                </div>
                <div className="flex justify-between text-blue-400">
                  <span>Connect wallet to play!</span>
                </div>
              </div>
            </div>
          </div>
        );

      // Diğer game phase'ler aynı kalabilir, sadece butonlar maintenance mesajı göstersin
      default:
        return (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-white mb-4">Game Demo</h2>
            <p className="text-gray-300">Wallet connection is under maintenance.</p>
            <button
              onClick={onStartNewGame}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Back to Selection
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center">
      {renderGamePhase()}
    </div>
  );
};

export default GameBoard;