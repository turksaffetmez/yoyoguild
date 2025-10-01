import { useCallback } from 'react';

export const useGameLogic = (
  walletConnected,
  contract,
  userAddress,
  updatePlayerInfo,
  updateLeaderboard,
  checkYoyoBalance,
  setYoyoBalanceAmount,
  setPoints,
  setGamesPlayedToday,
  setDailyLimit,
  setGameState,
  setIsLoading,
  setConnectionError,
  points
) => {
  
  const startGame = useCallback(async (selectedIndex) => {
    if (!walletConnected || !contract || !userAddress) {
      console.error('Game cannot start: missing requirements');
      return;
    }

    try {
      console.log('🎮 Starting game...', { selectedIndex });

      // Önce günlük limit kontrolü
      const currentInfo = await contract.getPlayerInfo(userAddress);
      const dailyGamesPlayed = Number(currentInfo[1]);
      const dailyLimit = Number(currentInfo[2]);
      
      setGamesPlayedToday(dailyGamesPlayed);
      setDailyLimit(dailyLimit);
      
      if (dailyGamesPlayed >= dailyLimit) {
        alert(`Daily limit reached! Played: ${dailyGamesPlayed}/${dailyLimit}`);
        return;
      }

      // Oyun state'ini güncelle
      setGameState(prev => ({ 
        ...prev, 
        isLoading: true, 
        selectedImage: selectedIndex, 
        gamePhase: "selecting",
        winnerIndex: null
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(true);

      // ✅ OPTIMIZE EDİLMİŞ GAS AYARLARI
      const tx = await contract.playGame({
        gasLimit: 100000, // Base için optimize edilmiş gas limit
        maxPriorityFeePerGas: ethers.parseUnits('1', 'gwei'),
        maxFeePerGas: ethers.parseUnits('1.5', 'gwei'),
      });
      
      console.log('📨 Transaction sent:', tx.hash);
      
      setGameState(prev => ({ ...prev, gamePhase: "fighting" }));
      
      // Transaction confirmation bekleyelim
      const receipt = await tx.wait();
      
      console.log('✅ Transaction confirmed:', receipt);
      
      if (receipt.status === 0) {
        throw new Error("Transaction reverted");
      }

      // Sonuçları al ve state'i güncelle
      const updatedInfo = await contract.getPlayerInfo(userAddress);
      const newGamesPlayed = Number(updatedInfo[1]);
      const newTotalPoints = Number(updatedInfo[0]);
      const oldTotalPoints = points;
      
      setGamesPlayedToday(newGamesPlayed);
      setPoints(newTotalPoints);

      // Leaderboard'u güncelle
      await updateLeaderboard();

      let isWinner = false;
      let pointsEarned = newTotalPoints - oldTotalPoints;

      console.log('📊 Points comparison:', { oldTotalPoints, newTotalPoints, pointsEarned });

      // Event parsing - daha güvenli
      try {
        const gamePlayedEvent = receipt.logs.find(log => {
          try {
            const parsedLog = contract.interface.parseLog(log);
            return parsedLog && parsedLog.name === "GamePlayed";
          } catch {
            return false;
          }
        });

        if (gamePlayedEvent) {
          const parsedLog = contract.interface.parseLog(gamePlayedEvent);
          isWinner = parsedLog.args.won;
          pointsEarned = Number(parsedLog.args.points);
          console.log('🎯 Event result:', { isWinner, pointsEarned });
        } else {
          // Event bulunamazsa points karşılaştırması yap
          isWinner = pointsEarned > 0;
          console.log('⚠️ No event found, using points comparison');
        }
      } catch (eventError) {
        console.log('⚠️ Event parsing failed, using fallback');
        isWinner = pointsEarned > 0;
      }

      // Countdown animasyonu
      for (let i = 3; i > 0; i--) {
        setGameState(prev => ({ ...prev, countdown: i }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Savaş animasyonu
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Son güncellemeler
      await updatePlayerInfo(userAddress);

      const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);

      setGameState(prev => ({ 
        ...prev, 
        winnerIndex, 
        gamePhase: "result",
        pointsEarned: pointsEarned,
        isWinner: isWinner
      }));

      // YOYO balance'ı güncelle
      const newYoyoBalance = await checkYoyoBalance(userAddress);
      setYoyoBalanceAmount(newYoyoBalance);

      console.log('🎮 Game completed successfully');

    } catch (err) {
      console.error("❌ Game transaction failed:", err);
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      
      let errorMessage = "Transaction failed: ";
      
      // Detaylı hata mesajları
      if (err.reason) {
        errorMessage += err.reason;
      } else if (err.message.includes("user rejected")) {
        errorMessage += "User rejected transaction";
      } else if (err.message.includes("gas")) {
        errorMessage += "Insufficient gas. Please try again with higher gas limit.";
      } else if (err.message.includes("revert")) {
        errorMessage += "Contract reverted. Daily limit may be reached.";
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        errorMessage += "Insufficient funds for gas";
      } else if (err.code === "NETWORK_ERROR") {
        errorMessage += "Network error. Please check your connection.";
      } else {
        errorMessage += err.message || "Unknown error occurred";
      }
      
      setConnectionError(errorMessage);
      
      // Hata durumunda player info'yu güncelle
      if (userAddress) {
        try {
          await updatePlayerInfo(userAddress);
        } catch (updateError) {
          console.error("Failed to update player info after error:", updateError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    walletConnected, contract, userAddress, updatePlayerInfo, updateLeaderboard,
    checkYoyoBalance, setYoyoBalanceAmount, setPoints, setGamesPlayedToday,
    setDailyLimit, setGameState, setIsLoading, setConnectionError, points
  ]);

  const resetGame = useCallback(() => {
    setGameState(prev => {
      const newImages = [...prev.images];
      if (prev.winnerIndex !== null) {
        const loserIndex = prev.winnerIndex === 0 ? 1 : 0;
        const currentIds = [prev.images[0].id, prev.images[1].id];
        const availableIds = Array.from({length: 19}, (_, i) => i + 1).filter(id => !currentIds.includes(id));
        if (availableIds.length > 0) {
          const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
          newImages[loserIndex] = {
            id: randomId,
            url: `/images/tevans${randomId}.png`,
            name: `Tevan #${randomId}`
          };
        }
      }
      return {
        ...prev,
        selectedImage: null,
        winnerIndex: null,
        gamePhase: "idle",
        isLoading: false,
        images: newImages,
        pointsEarned: 0,
        isWinner: false,
        countdown: null
      };
    });
  }, [setGameState]);

  const startNewGame = useCallback(() => {
    setGameState(prev => {
      if (prev.gamePhase === "result") {
        const newImages = [...prev.images];
        if (prev.winnerIndex !== null) {
          const loserIndex = prev.winnerIndex === 0 ? 1 : 0;
          const currentIds = [prev.images[0].id, prev.images[1].id];
          const availableIds = Array.from({length: 19}, (_, i) => i + 1).filter(id => !currentIds.includes(id));
          if (availableIds.length > 0) {
            const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
            newImages[loserIndex] = {
              id: randomId,
              url: `/images/tevans${randomId}.png`,
              name: `Tevan #${randomId}`
            };
          }
        }
        return {
          ...prev,
          selectedImage: null,
          winnerIndex: null,
          gamePhase: "idle",
          isLoading: false,
          images: newImages,
          pointsEarned: 0,
          isWinner: false,
          countdown: null
        };
      }
      return prev;
    });
  }, [setGameState]);

  return {
    startGame,
    resetGame,
    startNewGame
  };
};