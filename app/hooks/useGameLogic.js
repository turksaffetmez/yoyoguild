// app/hooks/useGameLogic.js
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
      console.error('❌ Game cannot start: missing requirements');
      return;
    }

    try {
      console.log('🔄 Checking daily limit from contract...');
      
      // ✅ CRITICAL FIX: ÖNCE contract'tan GÜNCEL verileri al
      const currentInfo = await contract.getPlayerInfo(userAddress);
      const dailyGamesPlayed = Number(currentInfo[1]);
      const dailyLimit = Number(currentInfo[2]);
      
      console.log('📊 Contract daily info:', {
        played: dailyGamesPlayed,
        limit: dailyLimit,
        remaining: dailyLimit - dailyGamesPlayed
      });
      
      // ✅ FRONTEND STATE'İNİ GÜNCELLE - Contract'tan gelen verilerle
      setGamesPlayedToday(dailyGamesPlayed);
      setDailyLimit(dailyLimit);
      
      // ✅ GÜNLÜK LİMİT KONTROLÜ - Contract'tan gelen veriyle
      if (dailyGamesPlayed >= dailyLimit) {
        const errorMsg = `Daily limit reached! Played: ${dailyGamesPlayed}/${dailyLimit}`;
        console.warn('🚫 ' + errorMsg);
        alert(errorMsg);
        return;
      }

      // Oyun başlıyor...
      setGameState(prev => ({ 
        ...prev, 
        isLoading: true, 
        selectedImage: selectedIndex, 
        gamePhase: "selecting",
        winnerIndex: null
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(true);

      // Transaction'ı gönder
      console.log('🎮 Sending playGame transaction...');
      const tx = await contract.playGame();
      setGameState(prev => ({ ...prev, gamePhase: "fighting" }));
      
      const receipt = await tx.wait();
      
      if (receipt.status === 0) {
        throw new Error("Transaction reverted");
      }

      // ✅ CRITICAL FIX: Transaction'dan SONRA HEMEN contract state'ini güncelle
      console.log('🔄 Updating state after successful transaction...');
      const updatedInfo = await contract.getPlayerInfo(userAddress);
      const newGamesPlayed = Number(updatedInfo[1]);
      const newTotalPoints = Number(updatedInfo[0]);
      
      // ✅ STATE'LERİ GÜNCELLE - Contract'tan gelen GÜNCEL verilerle
      setGamesPlayedToday(newGamesPlayed);
      setPoints(newTotalPoints);
      
      console.log('✅ State updated:', {
        gamesPlayed: newGamesPlayed,
        totalPoints: newTotalPoints
      });

      await updateLeaderboard();

      let isWinner = false;
      let pointsEarned = 0;

      // Event'leri parse et
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
        console.log('🎯 Game result from event:', { isWinner, pointsEarned });
      }

      // Countdown animasyonu
      for (let i = 3; i > 0; i--) {
        setGameState(prev => ({ ...prev, countdown: i }));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Son durum için tekrar güncelle
      await updatePlayerInfo(userAddress);

      const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);

      setGameState(prev => ({ 
        ...prev, 
        winnerIndex, 
        gamePhase: "result",
        pointsEarned: pointsEarned,
        isWinner: isWinner
      }));

      // YOYO balance'ı da güncelle
      const newYoyoBalance = await checkYoyoBalance(userAddress);
      setYoyoBalanceAmount(newYoyoBalance);

      // Farcaster Mini App için mesaj
      if (isFarcasterMiniApp) {
        window.parent.postMessage({ 
          type: 'GAME_RESULT', 
          won: isWinner, 
          points: pointsEarned,
          totalPoints: newTotalPoints
        }, '*');
      }

    } catch (err) {
      console.error("❌ Game transaction failed:", err);
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      
      let errorMessage = "Transaction failed: ";
      if (err.reason) {
        errorMessage += err.reason;
      } else if (err.message.includes("revert")) {
        errorMessage += "Contract reverted - possible daily limit reached";
      } else if (err.message.includes("user rejected")) {
        errorMessage += "User rejected transaction";
      } else {
        errorMessage += err.message;
      }
      
      setConnectionError(errorMessage);
      
      // Hata durumunda da state'leri güncelle
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