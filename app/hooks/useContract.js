import { ethers } from 'ethers';
import { contractAddress, abi } from '../utils/contract';

export const useContract = () => {
  
  const checkYoyoBalance = async (address) => {
    if (!address) return 0;
    try {
      const YOYO_TOKEN_ADDRESS = "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1";
      const YOYO_TOKEN_ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ];

      const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
      const contract = new ethers.Contract(YOYO_TOKEN_ADDRESS, YOYO_TOKEN_ABI, provider);
      
      const [balance, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals()
      ]);
      
      return Number(ethers.formatUnits(balance, decimals));
    } catch (error) {
      console.error("YOYO balance error:", error);
      return 0;
    }
  };

  const getPointValues = async (contract) => {
    if (!contract) return { winNormal: 250, winYoyo: 500, lose: 10 };
    
    try {
      // Contract'tan point değerlerini al
      const [winNormal, winYoyo, lose] = await Promise.all([
        contract.WIN_POINTS_NORMAL(),
        contract.WIN_POINTS_YOYO(),
        contract.LOSE_POINTS()
      ]);
      
      return {
        winNormal: Number(winNormal),
        winYoyo: Number(winYoyo),
        lose: Number(lose)
      };
    } catch (error) {
      console.error("Point values error, using defaults:", error);
      return { winNormal: 250, winYoyo: 500, lose: 10 };
    }
  };

  const updatePlayerInfo = async (contract, address, checkYoyoBalance, setPoints, setGamesPlayedToday, setDailyLimit, setPlayerStats, setYoyoBalanceAmount) => {
    if (!contract || !address) return;
    
    try {
      const playerInfo = await contract.getPlayerInfo(address);
      const yoyoBalance = await checkYoyoBalance(address);

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

      // State'leri güncelle
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
      
      console.log('✅ Player info updated from contract');
      
    } catch (error) {
      console.error("❌ Failed to update player info:", error);
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
      console.log('🏆 Leaderboard updated from contract');
      
    } catch (error) {
      console.error("Leaderboard error:", error);
    }
  };

  const connectWallet = async (
    setProvider,
    setContract,
    setUserAddress, 
    setWalletConnected,
    setConnectionError,
    setIsLoading
  ) => {
    try {
      console.log('🔗 Connecting wallet to contract...');
      
      if (!window.ethereum) {
        throw new Error('No Ethereum wallet found. Please install MetaMask or use a wallet-enabled browser.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Contract instance oluştur
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);

      setProvider(provider);
      setContract(contractInstance);
      setUserAddress(address);
      setWalletConnected(true);
      setConnectionError('');

      console.log('✅ Wallet connected to contract:', address);

      return { provider, contract: contractInstance, address };

    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      if (setConnectionError) {
        setConnectionError(error.message || 'Connection failed');
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
    
    setWalletConnected(false);
    setUserAddress('');
    setContract(null);
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