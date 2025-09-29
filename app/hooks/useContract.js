// app/hooks/useContract.js
import { useCallback } from 'react';
import { ethers } from 'ethers';
import { contractAddress, abi } from '../utils/contract';

export const useContract = (provider, isClient) => {
  
  const checkYoyoBalance = useCallback(async (address) => {
    if (!address || !isClient) return 0;
    try {
      let balanceProvider = provider;
      if (!balanceProvider && window.ethereum) {
        balanceProvider = new ethers.BrowserProvider(window.ethereum);
      }
      if (!balanceProvider) return 0;

      const yoyoContract = new ethers.Contract(
        "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1",
        ["function balanceOf(address) view returns (uint256)"],
        balanceProvider
      );
      const balance = await yoyoContract.balanceOf(address);
      return Number(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("YOYO balance check failed:", error);
      return 0;
    }
  }, [provider, isClient]);

  const getPointValues = useCallback(async (contract) => {
    if (!contract) return { winNormal: 250, winYoyo: 500, lose: 10 };
    try {
      const values = await contract.getPointValues();
      return {
        winNormal: Number(values[0]),
        winYoyo: Number(values[1]),
        lose: Number(values[2])
      };
    } catch (error) {
      return { winNormal: 250, winYoyo: 500, lose: 10 };
    }
  }, []);

  const updatePlayerInfo = useCallback(async (contract, address, checkYoyoBalance, setPoints, setGamesPlayedToday, setDailyLimit, setPlayerStats, setYoyoBalanceAmount) => {
    if (!contract || !address) return;
    try {
      const [
        totalPoints, 
        gamesToday, 
        limit, 
        hasYoyoBoost,
        totalGames,
        totalWins, 
        totalLosses,
        winStreak,
        maxWinStreak,
        winRate
      ] = await contract.getPlayerInfo(address);
      
      // State'leri güncelle
      setPoints(Number(totalPoints));
      setGamesPlayedToday(Number(gamesToday));
      setDailyLimit(Number(limit));
      
      setPlayerStats({
        totalGames: Number(totalGames),
        totalWins: Number(totalWins),
        totalLosses: Number(totalLosses),
        winRate: Number(winRate),
        winStreak: Number(winStreak),
        maxWinStreak: Number(maxWinStreak)
      });
      
      const yoyoBalance = await checkYoyoBalance(address);
      setYoyoBalanceAmount(yoyoBalance);
      
    } catch (error) {
      console.error("Failed to update player info:", error);
    }
  }, []);

  const updateLeaderboard = useCallback(async (contract, setLeaderboard) => {
    if (!contract) return;
    try {
      const [addresses, points] = await contract.getTopPlayers();
      
      if (!addresses || addresses.length === 0) {
        setLeaderboard([]);
        return;
      }
      
      const leaderboardData = addresses
        .map((address, index) => ({
          rank: index + 1,
          address: address,
          points: Number(points[index] || 0)
        }))
        .filter(player => player.points > 0)
        .slice(0, 100);
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Failed to update leaderboard:", error);
      setLeaderboard([]);
    }
  }, []);

  // ✅ GELİŞTİRİLMİŞ WALLET BAĞLANTISI - Tüm cüzdanlar için
  const connectWallet = useCallback(async (
    walletType = 'standard', 
    farcasterAddress = null,
    isMobile,
    setShowWalletOptions,
    setProvider,
    setContract,
    setUserAddress,
    setWalletConnected,
    checkYoyoBalance,
    setYoyoBalanceAmount,
    getPointValues,
    setPointValues,
    updatePlayerInfo,
    updateLeaderboard,
    isFarcasterMiniApp,
    points,
    setConnectionError,
    setIsLoading
  ) => {
    if (!isClient) return;

    try {
      setIsLoading(true);
      setConnectionError("");

      let address = farcasterAddress;
      
      // Farcaster dışında normal wallet bağlantısı
      if (!farcasterAddress) {
        // ✅ TÜM CÜZDAN DESTEĞİ - window.ethereum kontrolü
        if (typeof window.ethereum === 'undefined') {
          // Mobile wallet seçeneklerini göster
          if (isMobile) {
            setShowWalletOptions(true);
            return;
          } else {
            throw new Error("Please install a Web3 wallet like MetaMask, Rabby, or Coinbase Wallet");
          }
        }

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length === 0) {
          throw new Error("No accounts found");
        }
        address = accounts[0];
      }

      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      
      const signer = await newProvider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      
      setContract(contractInstance);
      setUserAddress(address);
      setWalletConnected(true);
      
      const yoyoBalance = await checkYoyoBalance(address);
      setYoyoBalanceAmount(yoyoBalance);
      
      const pointVals = await getPointValues(contractInstance);
      setPointValues(pointVals);
      
      await updatePlayerInfo(contractInstance, address, checkYoyoBalance, () => {}, () => {}, () => {}, () => {}, setYoyoBalanceAmount);
      await updateLeaderboard(contractInstance, () => {});
      
      if (isFarcasterMiniApp) {
        window.parent.postMessage({ 
          type: 'WALLET_CONNECTED', 
          address,
          points: points
        }, '*');
      }
      
    } catch (err) {
      console.error("Wallet connection failed:", err);
      
      // ✅ DETAYLI HATA MESAJLARI
      if (err.code === 4001) {
        setConnectionError("Connection rejected by user");
      } else if (err.message.includes("Rabby")) {
        setConnectionError("Rabby Wallet connection failed");
      } else if (err.message.includes("MetaMask")) {
        setConnectionError("MetaMask connection failed");
      } else if (err.message.includes("install")) {
        setConnectionError("Web3 wallet not detected. Please install MetaMask, Rabby, or Coinbase Wallet.");
      } else {
        setConnectionError(err.message || "Failed to connect wallet");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isClient]);

  const disconnectWallet = useCallback((
    setWalletConnected,
    setUserAddress,
    setContract,
    setPoints,
    setYoyoBalanceAmount,
    setGamesPlayedToday,
    setLeaderboard,
    setPlayerStats,
    setGameState
  ) => {
    setWalletConnected(false);
    setUserAddress("");
    setContract(null);
    setPoints(0);
    setYoyoBalanceAmount(0);
    setGamesPlayedToday(0);
    setLeaderboard([]);
    setPlayerStats({
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      winStreak: 0,
      maxWinStreak: 0
    });
    setGameState(prev => ({
      ...prev,
      gamePhase: "idle",
      selectedImage: null,
      winnerIndex: null
    }));
  }, []);

  return {
    checkYoyoBalance,
    getPointValues,
    updatePlayerInfo,
    updateLeaderboard,
    connectWallet,
    disconnectWallet
  };
};