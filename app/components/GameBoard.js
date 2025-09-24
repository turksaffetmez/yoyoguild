import { useState, useEffect } from 'react';
import Image from 'next/image';

const GameBoard = ({
  walletConnected,
  gameState,
  yoyoBalanceAmount,
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
  seasonTimeLeft,
  currentSeason,
  isLoading
}) => {
  const [countdown, setCountdown] = useState(0);
  const [fightAnimation, setFightAnimation] = useState(false);

  useEffect(() => {
    let interval;
    if (gameState.gamePhase === "fighting" && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (gameState.gamePhase === "fighting" && countdown === 0) {
      setFightAnimation(true);
      setTimeout(() => setFightAnimation(false), 2000);
    }
    return () => clearInterval(interval);
  }, [gameState.gamePhase, countdown]);

  const handleGameStart = (selectedIndex) => {
    if (!walletConnected) {
      if (isMobile) {
        onShowWalletOptions();
      } else {
        onConnectWallet();
      }
      return;
    }
    
    if (remainingGames <= 0) {
      alert("Daily game limit reached! Come back tomorrow.");
      return;
    }
    
    setCountdown(3);
    onStartGame(selectedIndex);
  };

  const getWinChance = () => {
    return yoyoBalanceAmount > 0 ? 60 : 50;
  };

  const renderGamePhase = () => {
    switch (gameState.gamePhase) {
      case "idle":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Guilder</h2>
            <p className="text-gray-300 mb-6">
              Select a Guilder to battle with. Win rate: <span className="text-yellow-400">{getWinChance()}%</span>
              {yoyoBalanceAmount > 0 && <span className="text-green-400 ml-2">(+10% YOYO Boost!)</span>}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {gameState.images.slice(0, 2).map((image, index) => (
                <div key={image.id} className="text-center">
                  <div 
                    className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:border-purple-500 ${
                      gameState.selectedImage === index ? 'border-yellow-400 scale-105' : 'border-gray-600'
                    }`}
                    onClick={() => handleGameStart(index)}
                  >
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{image.name}</h3>
                    <div className="text-sm text-gray-400">Win Chance: {getWinChance()}%</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 max-w-md mx-auto">
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Remaining Games Today:</span>
                  <span className={remainingGames > 0 ? "text-green-400" : "text-red-400"}>
                    {remainingGames}/{dailyLimit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>YOYO Boost:</span>
                  <span className={yoyoBalanceAmount > 0 ? "text-green-400" : "text-yellow-400"}>
                    {yoyoBalanceAmount > 0 ? "Active (+10%)" : "Not Active"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "selecting":
        return (
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-yellow-400 animate-pulse">Preparing Battle...</h2>
            <div className="flex justify-center space-x-8">
              {gameState.images.slice(0, 2).map((image, index) => (
                <div key={image.id} className={`transform transition-all duration-500 ${
                  gameState.selectedImage === index ? 'scale-110' : 'scale-90 opacity-60'
                }`}>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-4 border-yellow-400">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white">{image.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "fighting":
        return (
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-red-400 animate-pulse">
              {countdown > 0 ? `Battle starts in ${countdown}...` : 'BATTLE!'}
            </h2>
            
            <div className={`flex justify-center space-x-8 transition-all duration-300 ${
              fightAnimation ? 'scale-110' : 'scale-100'
            }`}>
              {gameState.images.slice(0, 2).map((image, index) => (
                <div key={image.id} className={`transform transition-all duration-500 ${
                  fightAnimation && index === gameState.selectedImage ? 'animate-bounce' : ''
                }`}>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-4 border-red-500">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white">{image.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            {fightAnimation && (
              <div className="text-6xl animate-pulse">⚔️</div>
            )}
          </div>
        );

      case "result":
        const isWinner = gameState.winnerIndex === gameState.selectedImage;
        return (
          <div className="text-center space-y-8">
            <div className={`text-4xl font-bold ${isWinner ? 'text-green-400' : 'text-red-400'} animate-bounce`}>
              {isWinner ? 'VICTORY! 🎉' : 'DEFEAT! 💀'}
            </div>
            
            <div className="flex justify-center space-x-8">
              {gameState.images.slice(0, 2).map((image, index) => (
                <div key={image.id} className={`transform transition-all duration-500 ${
                  index === gameState.winnerIndex ? 'scale-110 border-green-400' : 'scale-90 border-red-400 opacity-70'
                }`}>
                  <div className={`bg-gradient-to-br rounded-2xl p-6 border-4 ${
                    index === gameState.winnerIndex ? 'from-green-900/50 to-emerald-900/50' : 'from-red-900/50 to-rose-900/50'
                  }`}>
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white">{image.name}</h3>
                    <div className={`text-lg font-bold ${index === gameState.winnerIndex ? 'text-green-400' : 'text-red-400'}`}>
                      {index === gameState.winnerIndex ? 'WINNER' : 'LOSER'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 max-w-md mx-auto">
              <div className="space-y-3">
                <div className="text-2xl font-bold text-yellow-400">
                  {isWinner ? '+10 Points!' : 'Better luck next time!'}
                </div>
                <div className="text-gray-300">
                  Total Points: <span className="text-white font-bold">{points}</span>
                </div>
                <div className="text-gray-300">
                  Season Points: <span className="text-green-400 font-bold">{seasonPoints}</span>
                </div>
                <div className="text-gray-300">
                  Remaining Games: <span className={remainingGames > 0 ? "text-green-400" : "text-red-400"}>
                    {remainingGames}/{dailyLimit}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onStartNewGame}
              disabled={remainingGames <= 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {remainingGames > 0 ? 'Battle Again!' : 'Daily Limit Reached'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!walletConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-white mb-4">⚔️ Guild Battle Arena</h2>
        <p className="text-gray-300 mb-8">Connect your wallet to start battling!</p>
        <button
          onClick={isMobile ? onShowWalletOptions : onConnectWallet}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          Connect Wallet to Play
        </button>
      </div>
    );
  }

  if (remainingGames <= 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Daily Limit Reached!</h2>
        <p className="text-gray-300 mb-4">You've played all {dailyLimit} games for today.</p>
        <p className="text-yellow-400">Come back tomorrow for more battles!</p>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center">
      {renderGamePhase()}
    </div>
  );
};

export default GameBoard;