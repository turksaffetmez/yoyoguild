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
  isFarcasterMiniApp,
  points
) => {
  
  const startGame = useCallback(async (selectedIndex) => {
    if (!walletConnected || !contract || !userAddress) {
      console.error('Game cannot start: missing requirements');
      return;
    }

    try {
      console.log('🎮 Starting game...', { selectedIndex });

      const currentInfo = await contract.getPlayerInfo(userAddress);
      const dailyGamesPlayed = Number(currentInfo[1]);
      const dailyLimit = Number(currentInfo[2]);
      
      setGamesPlayedToday(dailyGamesPlayed);
      setDailyLimit(dailyLimit);
      
      if (dailyGamesPlayed >= dailyLimit) {
        alert(`Daily limit reached! Played: ${dailyGamesPlayed}/${dailyLimit}`);
        return;
      }

      setGameState(prev => ({ 
        ...prev, 
        isLoading: true, 
        selectedImage: selectedIndex, 
        gamePhase: "selecting",
        winnerIndex: null
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(true);

      // ✅ GÜNCELLENMİŞ GAS LİMİT: 50.000
      const tx = await contract.playGame({
        gasLimit: 50000,
      });
      
      console.log('📨 Transaction sent:', tx.hash);
      
      setGameState(prev => ({ ...prev, gamePhase: "fighting" }));
      const receipt = await tx.wait();
      
      console.log('✅ Transaction confirmed:', receipt);
      
      if (receipt.status === 0) {
        throw new Error("Transaction reverted");
      }

      const updatedInfo = await contract.getPlayerInfo(userAddress);
      const newGamesPlayed = Number(updatedInfo[1]);
      const newTotalPoints = Number(updatedInfo[0]);
      const oldTotalPoints = points;
      
      setGamesPlayedToday(newGamesPlayed);
      setPoints(newTotalPoints);

      await updateLeaderboard();

      let isWinner = false;
      let pointsEarned = newTotalPoints - oldTotalPoints;

      console.log('📊 Points comparison:', { oldTotalPoints, newTotalPoints, pointsEarned });

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
          isWinner = pointsEarned > 0;
          console.log('⚠️ No event found, using points logic');
        }
      } catch (eventError) {
        isWinner = pointsEarned > 0;
        console.log('⚠️ Event parsing failed');
      }

      for (let i = 3; i > 0; i--) {
        setGameState(prev => ({ ...prev, countdown: i }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      await updatePlayerInfo(userAddress);

      const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);

      setGameState(prev => ({ 
        ...prev, 
        winnerIndex, 
        gamePhase: "result",
        pointsEarned: pointsEarned,
        isWinner: isWinner
      }));

      const newYoyoBalance = await checkYoyoBalance(userAddress);
      setYoyoBalanceAmount(newYoyoBalance);

      if (isFarcasterMiniApp) {
        window.parent.postMessage({ 
          type: 'GAME_RESULT', 
          won: isWinner, 
          points: pointsEarned,
          totalPoints: newTotalPoints
        }, '*');
      }

      console.log('🎮 Game completed successfully');

    } catch (err) {
      console.error("❌ Game transaction failed:", err);
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      
      let errorMessage = "Transaction failed: ";
      if (err.reason) {
        errorMessage += err.reason;
      } else if (err.message.includes("revert")) {
        errorMessage += "Daily limit reached or transaction reverted";
      } else if (err.message.includes("user rejected")) {
        errorMessage += "User rejected transaction";
      } else if (err.message.includes("gas")) {
        errorMessage += "Gas error - try again";
      } else {
        errorMessage += err.message;
      }
      
      setConnectionError(errorMessage);
      
      if (userAddress) {
        await updatePlayerInfo(userAddress);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    walletConnected, contract, userAddress, updatePlayerInfo, updateLeaderboard,
    checkYoyoBalance, setYoyoBalanceAmount, setPoints, setGamesPlayedToday,
    setDailyLimit, setGameState, setIsLoading, setConnectionError, 
    isFarcasterMiniApp, points
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