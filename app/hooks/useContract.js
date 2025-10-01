import { ethers } from 'ethers';
import { contractAddress, abi } from '../utils/contract';

export const useContract = (provider, isClient) => {
  const YOYO_TOKEN_ADDRESS = "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1";
  const YOYO_TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  // Optimize edilmiş YOYO balance kontrolü
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
      const [balance, decimals] = await Promise.all([
        yoyoContract.balanceOf(address),
        yoyoContract.decimals()
      ]);
      
      const formattedBalance = Number(ethers.formatUnits(balance, decimals));
      console.log(`💰 YOYO Balance: ${formattedBalance} for ${address}`);
      return formattedBalance;
    } catch (error) {
      console.error("YOYO balance check failed:", error);
      return 0;
    }
  };

  // Point values getir - optimize edilmiş
  const getPointValues = async (contract) => {
    if (!contract) return { winNormal: 250, winYoyo: 500, lose: 10 };
    
    try {
      const [winNormal, winYoyo, lose] = await Promise.all([
        contract.WIN_POINTS(),
        contract.WIN_YOYO_POINTS(),
        contract.LOSE_POINTS()
      ]);
      
      return {
        winNormal: Number(winNormal),
        winYoyo: Number(winYoyo),
        lose: Number(lose)
      };
    } catch (error) {
      console.error("Failed to get point values, using defaults:", error);
      return { winNormal: 250, winYoyo: 500, lose: 10 };
    }
  };

  // Optimize edilmiş player info güncelleme
  const updatePlayerInfo = async (contract, address, checkYoyoBalance, setPoints, setGamesPlayedToday, setDailyLimit, setPlayerStats, setYoyoBalanceAmount) => {
    if (!contract || !address) return;
    
    try {
      const [playerInfo, yoyoBalance] = await Promise.all([
        contract.getPlayerInfo(address),
        checkYoyoBalance(address)
      ]);

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
      ] = playerInfo;

      // Batch state updates
      if (setPoints) setPoints(Number(totalPoints));
      if (setGamesPlayedToday) setGamesPlayedToday(Number(gamesToday));
      if (setDailyLimit) setDailyLimit(Number(limit));
      if (setYoyoBalanceAmount) setYoyoBalanceAmount(yoyoBalance);
      
      if (setPlayerStats) {
        setPlayerStats({
          totalGames: Number(totalGames),
          totalWins: Number(totalWins),
          totalLosses: Number(totalLosses),
          winRate: Number(winRate),
          winStreak: Number(winStreak),
          maxWinStreak: Number(maxWinStreak)
        });
      }
      
      console.log('✅ Player info updated successfully');
      
    } catch (error) {
      console.error("❌ Failed to update player info:", error);
    }
  };

  // Optimize edilmiş leaderboard güncelleme
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
      console.log('🏆 Leaderboard updated:', leaderboardData.length, 'players');
      
    } catch (error) {
      console.error("Failed to update leaderboard:", error);
    }
  };

  // Optimize edilmiş wallet bağlantısı
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

      // FARCASTER veya BASE EMBEDDED WALLET
      if ((walletType === 'farcaster' || walletType === 'embedded') && farcasterAddress) {
        console.log('🎯 Using embedded wallet');
        address = farcasterAddress;
        
        if (window.ethereum) {
          providerInstance = new ethers.BrowserProvider(window.ethereum);
          signer = await providerInstance.getSigner();
        } else {
          providerInstance = new ethers.JsonRpcProvider('https://mainnet.base.org');
          signer = null;
        }
      }
      // STANDARD WALLET
      else {
        if (!window.ethereum) {
          throw new Error('No Ethereum wallet found. Please install MetaMask, Rabby, or use a wallet-enabled browser.');
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

      // State'leri güncelle
      if (setProvider) setProvider(providerInstance);
      if (setContract) setContract(contractInstance);
      if (setUserAddress) setUserAddress(address);
      if (setWalletConnected) setWalletConnected(true);
      if (setShowWalletOptions) setShowWalletOptions(false);
      if (setConnectionError) setConnectionError('');

      console.log('✅ Wallet connected successfully:', { address, walletType });

      // Parallel data fetching
      await Promise.all([
        checkYoyoBalance && checkYoyoBalance(address).then(balance => {
          if (setYoyoBalanceAmount) setYoyoBalanceAmount(balance);
        }),
        getPointValues && getPointValues(contractInstance).then(pointVals => {
          if (setPointValues) setPointValues(pointVals);
        }),
        updatePlayerInfo && updatePlayerInfo(
          contractInstance, address, checkYoyoBalance, 
          null, null, null, null, null
        ),
        updateLeaderboard && updateLeaderboard(contractInstance, null)
      ]);

    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      if (setConnectionError) {
        let errorMessage = 'Connection failed: ';
        
        if (error.code === 4001) {
          errorMessage += 'User rejected the connection';
        } else if (error.code === -32002) {
          errorMessage += 'Connection request already pending';
        } else if (error.message.includes('No Ethereum wallet')) {
          errorMessage += 'No wallet found. Please install a wallet.';
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