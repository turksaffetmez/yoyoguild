// app/hooks/useGameState.js
import { useState, useEffect, useCallback } from 'react';

// Local Storage key'leri
const STORAGE_KEYS = {
  USER_ADDRESS: 'yoyo_user_address',
  PLAYER_STATS: 'yoyo_player_stats', 
  POINTS: 'yoyo_points',
  GAMES_PLAYED: 'yoyo_games_played',
  LAST_UPDATE: 'yoyo_last_update'
};

export const useGameState = () => {
  // State'ler - localStorage'dan başlangıç değerlerini al
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [yoyoBalanceAmount, setYoyoBalanceAmount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [pointValues, setPointValues] = useState({
    winNormal: 250,
    winYoyo: 500,
    lose: 10
  });
  const [isFarcasterMiniApp, setIsFarcasterMiniApp] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    winRate: 0,
    winStreak: 0,
    maxWinStreak: 0
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

  // Client-side kontrolü
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Farcaster Mini App detection - BASİTLEŞTİRİLMİŞ
  useEffect(() => {
    if (!isClient) return;
    
    const isEmbedded = window.self !== window.top;
    const isWarpcastUA = /Farcaster|Warpcast/i.test(navigator.userAgent);
    const isBaseApp = /Base/i.test(navigator.userAgent) || window.location.href.includes('base.org');
    
    const shouldActivateMiniApp = isEmbedded || isWarpcastUA || isBaseApp;
    
    setIsFarcasterMiniApp(shouldActivateMiniApp);
    
    if (shouldActivateMiniApp) {
      document.body.classList.add('farcaster-mini-app');
    }
  }, [isClient]);

  // Mobile detection
  useEffect(() => {
    if (!isClient) return;
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, [isClient]);

  const connectMobileWallet = useCallback((walletType) => {
    if (!isClient) return;
    
    const currentUrl = encodeURIComponent(window.location.href);
    let walletUrl = '';
    
    switch(walletType) {
      case 'metamask': walletUrl = `https://metamask.app.link/dapp/${currentUrl}`; break;
      case 'rabby': walletUrl = `https://rabby.io/`; break;
      case 'coinbase': walletUrl = `https://go.cb-w.com/dapp?cb_url=${currentUrl}`; break;
      case 'trust': walletUrl = `https://link.trustwallet.com/dapp/${currentUrl}`; break;
      default: return;
    }
    window.open(walletUrl, '_blank');
    setShowWalletOptions(false);
  }, [isClient]);

  const remainingGames = dailyLimit - gamesPlayedToday;

  return {
    // State'ler
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
    
    // Computed values
    remainingGames,
    
    // Functions
    connectMobileWallet
  };
};