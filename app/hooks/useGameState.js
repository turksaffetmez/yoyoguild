import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  USER_ADDRESS: 'yoyo_user_address',
  PLAYER_STATS: 'yoyo_player_stats', 
  POINTS: 'yoyo_points',
  GAMES_PLAYED: 'yoyo_games_played',
  DAILY_LIMIT: 'yoyo_daily_limit',
  YOYO_BALANCE: 'yoyo_balance',
  LAST_UPDATE: 'yoyo_last_update'
};

export const useGameState = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.USER_ADDRESS) || "";
    }
    return "";
  });
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.POINTS);
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [yoyoBalanceAmount, setYoyoBalanceAmount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.YOYO_BALANCE);
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED);
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [dailyLimit, setDailyLimit] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_LIMIT);
      return saved ? parseInt(saved) : 20;
    }
    return 20;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [pointValues, setPointValues] = useState({
    winNormal: 250,
    winYoyo: 500,
    lose: 10
  });
  const [isFarcasterMiniApp, setIsFarcasterMiniApp] = useState(false);
  const [playerStats, setPlayerStats] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
      return saved ? JSON.parse(saved) : {
        totalGames: 0,
        totalWins: 0,
        totalLosses: 0,
        winRate: 0,
        winStreak: 0,
        maxWinStreak: 0
      };
    }
    return {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      winStreak: 0,
      maxWinStreak: 0
    };
  });
  const [isClient, setIsClient] = useState(false);

  const [gameState, setGameState] = useState({
    selectedImage: null,
    winnerIndex: null,
    gamePhase: "idle",
    images: [
      { id: 1, url: "/images/tevans1.png", name: "Tevan #1" },
      { id: 2, url: "/images/tevans2.png", name: "Tevan #2" },
      { id: 3, url: "/images/tevans3.png", name: "Tevan #3" },
      { id: 4, url: "/images/tevans4.png", name: "Tevan #4" },
      { id: 5, url: "/images/tevans5.png", name: "Tevan #5" },
      { id: 6, url: "/images/tevans6.png", name: "Tevan #6" },
      { id: 7, url: "/images/tevans7.png", name: "Tevan #7" },
      { id: 8, url: "/images/tevans8.png", name: "Tevan #8" },
      { id: 9, url: "/images/tevans9.png", name: "Tevan #9" },
      { id: 10, url: "/images/tevans10.png", name: "Tevan #10" },
      { id: 11, url: "/images/tevans11.png", name: "Tevan #11" },
      { id: 12, url: "/images/tevans12.png", name: "Tevan #12" },
      { id: 13, url: "/images/tevans13.png", name: "Tevan #13" },
      { id: 14, url: "/images/tevans14.png", name: "Tevan #14" },
      { id: 15, url: "/images/tevans15.png", name: "Tevan #15" },
      { id: 16, url: "/images/tevans16.png", name: "Tevan #16" },
      { id: 17, url: "/images/tevans17.png", name: "Tevan #17" },
      { id: 18, url: "/images/tevans18.png", name: "Tevan #18" },
      { id: 19, url: "/images/tevans19.png", name: "Tevan #19" }
    ],
    isLoading: false,
    pointsEarned: 0,
    isWinner: false
  });

  useEffect(() => {
    if (!isClient) return;
    
    localStorage.setItem(STORAGE_KEYS.USER_ADDRESS, userAddress);
    localStorage.setItem(STORAGE_KEYS.POINTS, points.toString());
    localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, gamesPlayedToday.toString());
    localStorage.setItem(STORAGE_KEYS.DAILY_LIMIT, dailyLimit.toString());
    localStorage.setItem(STORAGE_KEYS.YOYO_BALANCE, yoyoBalanceAmount.toString());
    localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(playerStats));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
  }, [userAddress, points, gamesPlayedToday, dailyLimit, yoyoBalanceAmount, playerStats, isClient]);

  const refreshPlayerData = useCallback(async (contract, address, checkYoyoBalance, setPoints, setGamesPlayedToday, setDailyLimit, setPlayerStats, setYoyoBalanceAmount) => {
    if (!contract || !address) return;
    
    try {
      console.log('🔄 Refreshing player data from contract...');
      
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
      console.error("❌ Failed to refresh player data:", error);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Basit Farcaster detection
  useEffect(() => {
    if (!isClient) return;
    
    const isEmbedded = window.self !== window.top;
    const isWarpcastUA = /Farcaster|Warpcast/i.test(navigator.userAgent);
    
    const shouldActivateMiniApp = isEmbedded || isWarpcastUA;
    
    setIsFarcasterMiniApp(shouldActivateMiniApp);
    
    if (shouldActivateMiniApp) {
      document.body.classList.add('farcaster-mini-app');
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, [isClient]);

  const remainingGames = dailyLimit - gamesPlayedToday;

  return {
    walletConnected, setWalletConnected,
    userAddress, setUserAddress,
    contract, setContract,
    points, setPoints,
    provider, setProvider,
    activeTab, setActiveTab,
    leaderboard, setLeaderboard,
    yoyoBalanceAmount, setYoyoBalanceAmount,
    isMobile, setIsMobile,
    showWalletOptions, setShowWalletOptions,
    gamesPlayedToday, setGamesPlayedToday,
    dailyLimit, setDailyLimit,
    isLoading, setIsLoading,
    connectionError, setConnectionError,
    pointValues, setPointValues,
    isFarcasterMiniApp, setIsFarcasterMiniApp,
    playerStats, setPlayerStats,
    isClient, setIsClient,
    gameState, setGameState,
    remainingGames,
    refreshPlayerData
  };
};