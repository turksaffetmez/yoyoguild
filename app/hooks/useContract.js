import { ethers } from 'ethers';
import { contractAddress, abi } from '../utils/contract';

export const useContract = (provider, isClient) => {
  const YOYO_TOKEN_ADDRESS = "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1";
  const YOYO_TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  const checkYoyoBalance = async (address) => {
    if (!address) return 0;
    try {
      let providerInstance;
      
      if (window.ethereum) {
        providerInstance = new ethers.BrowserProvider(window.ethereum);
      } else {
        providerInstance = new ethers.JsonRpcProvider('https://mainnet.base.org');
      }

      const yoyoContract = new ethers.Contract(YOYO_TOKEN_ADDRESS, YOYO_TOKEN_ABI, providerInstance);
      const balance = await yoyoContract.balanceOf(address);
      const decimals = await yoyoContract.decimals();
      const formattedBalance = Number(ethers.formatUnits(balance, decimals));
      
      return formattedBalance;
    } catch (error) {
      console.error("YOYO balance check failed:", error);
      return 0;
    }
  };

  const getPointValues = async (contract) => {
    if (!contract) return { winNormal: 10, winYoyo: 15, lose: 5 };
    
    try {
      const winNormal = await contract.WIN_POINTS();
      const winYoyo = await contract.WIN_YOYO_POINTS();
      const lose = await contract.LOSE_POINTS();
      
      return {
        winNormal: Number(winNormal),
        winYoyo: Number(winYoyo),
        lose: Number(lose)
      };
    } catch (error) {
      console.error("Failed to get point values:", error);
      return { winNormal: 10, winYoyo: 15, lose: 5 };
    }
  };

  const updatePlayerInfo = async (contract, address, checkYoyoBalance, setPoints, setGamesPlayedToday, setDailyLimit, setPlayerStats, setYoyoBalanceAmount) => {
    if (!contract || !address) return;
    
    try {
      const [points, gamesPlayed, dailyLimit, stats] = await Promise.all([
        contract.getPoints(address),
        contract.getGamesPlayedToday(address),
        contract.dailyGameLimit(),
        contract.getPlayerStats(address)
      ]);

      const yoyoBalance = await checkYoyoBalance(address);
      
      if (setPoints) setPoints(Number(points));
      if (setGamesPlayedToday) setGamesPlayedToday(Number(gamesPlayed));
      if (setDailyLimit) setDailyLimit(Number(dailyLimit));
      if (setYoyoBalanceAmount) setYoyoBalanceAmount(yoyoBalance);
      
      if (setPlayerStats && stats) {
        const totalGames = Number(stats.totalGames) || 0;
        const totalWins = Number(stats.totalWins) || 0;
        const totalLosses = Number(stats.totalLosses) || 0;
        const winStreak = Number(stats.winStreak) || 0;
        
        const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
        
        setPlayerStats({
          totalGames,
          totalWins,
          totalLosses,
          winRate,
          winStreak
        });
      }
      
    } catch (error) {
      console.error("Failed to update player info:", error);
    }
  };

  const updateLeaderboard = async (contract, setLeaderboard) => {
    if (!contract) return;
    
    try {
      const [addresses, points] = await contract.getTopPlayers();
      
      const leaderboardData = addresses
        .map((address, index) => ({
          rank: index + 1,
          address: address,
          points: Number(points[index] || 0)
        }))
        .filter(player => player.points > 0)
        .slice(0, 100);
      
      if (setLeaderboard) setLeaderboard(leaderboardData);
      
    } catch (error) {
      console.error("Failed to update leaderboard:", error);
    }
  };

  const connectWallet = async (
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
    refreshPlayerData,
    isFarcasterMiniApp,
    points,
    setConnectionError,
    setIsLoading
  ) => {
    try {
      console.log('🔗 Connecting wallet:', { walletType });
      
      let providerInstance;
      let signer;
      let address;

      if ((walletType === 'farcaster' || walletType === 'embedded') && farcasterAddress) {
        console.log('🎯 Using Farcaster embedded wallet');
        address = farcasterAddress;
        
        if (window.ethereum) {
          providerInstance = new ethers.BrowserProvider(window.ethereum);
          signer = await providerInstance.getSigner();
        } else {
          providerInstance = new ethers.JsonRpcProvider('https://mainnet.base.org');
          signer = null;
        }
      }
      else {
        if (!window.ethereum) {
          throw new Error('No wallet found. Please install a wallet like MetaMask, Rabby, or use a wallet-enabled browser.');
        }

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found. Please connect your wallet.');
        }

        address = accounts[0];
        providerInstance = new ethers.BrowserProvider(window.ethereum);
        signer = await providerInstance.getSigner();
      }

      const contractInstance = signer 
        ? new ethers.Contract(contractAddress, abi, signer)
        : new ethers.Contract(contractAddress, abi, providerInstance);

      if (setProvider) setProvider(providerInstance);
      if (setContract) setContract(contractInstance);
      if (setUserAddress) setUserAddress(address);
      if (setWalletConnected) setWalletConnected(true);
      if (setShowWalletOptions) setShowWalletOptions(false);
      if (setConnectionError) setConnectionError('');

      if (checkYoyoBalance) {
        const balance = await checkYoyoBalance(address);
        if (setYoyoBalanceAmount) setYoyoBalanceAmount(balance);
      }

      if (getPointValues && setPointValues) {
        const pointVals = await getPointValues(contractInstance);
        setPointValues(pointVals);
      }

      if (updatePlayerInfo) {
        await updatePlayerInfo(
          contractInstance, 
          address, 
          checkYoyoBalance, 
          null, null, null, null, null
        );
      }

      if (updateLeaderboard) {
        await updateLeaderboard(contractInstance, null);
      }

      if (refreshPlayerData) {
        await refreshPlayerData(
          contractInstance,
          address,
          checkYoyoBalance,
          null, null, null, null, null
        );
      }

    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      if (setConnectionError) {
        let errorMessage = 'Connection failed: ';
        
        if (error.code === 4001) {
          errorMessage += 'User rejected the connection';
        } else if (error.code === -32002) {
          errorMessage += 'Connection request already pending';
        } else if (error.message.includes('No wallet found')) {
          errorMessage += 'No wallet found. Please install a wallet or use a wallet-enabled browser.';
        } else {
          errorMessage += error.message || 'Unknown error occurred';
        }
        
        setConnectionError(errorMessage);
      }
      throw error;
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  const disconnectWallet = (
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
    console.log('🔌 Disconnecting wallet...');
    
    if (setWalletConnected) setWalletConnected(false);
    if (setUserAddress) setUserAddress('');
    if (setContract) setContract(null);
    if (setPoints) setPoints(0);
    if (setYoyoBalanceAmount) setYoyoBalanceAmount(0);
    if (setGamesPlayedToday) setGamesPlayedToday(0);
    if (setLeaderboard) setLeaderboard([]);
    if (setPlayerStats) setPlayerStats(null);
    
    if (setGameState) {
      setGameState({
        gamePhase: "idle",
        selectedImage: null,
        winnerIndex: null,
        isWinner: false,
        pointsEarned: 0,
        countdown: 3,
        images: [
          { id: 1, url: "/images/tevans1.png", name: "Tevan #1" },
          { id: 2, url: "/images/tevans2.png", name: "Tevan #2" }
        ]
      });
    }
  };

  return {
    checkYoyoBalance,
    getPointValues,
    updatePlayerInfo,
    updateLeaderboard,
    connectWallet,
    disconnectWallet
  };
};