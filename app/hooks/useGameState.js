// app/hooks/useGameState.js
import { useState, useEffect, useCallback } from 'react';

export const useGameState = () => {
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
    
    if (window.parent !== window) {
      console.log('🚀 Page.js: Sending immediate ready...');
      const immediateReady = {
        type: 'ready',
        version: '1.0.0',
        app: 'YoYo Guild Battle', 
        from: 'page-component',
        timestamp: Date.now()
      };
      
      window.parent.postMessage(immediateReady, '*');
      
      setTimeout(() => {
        window.parent.postMessage(immediateReady, '*');
        console.log('📨 Page.js: Second ready sent');
      }, 500);
      
      setTimeout(() => {
        window.parent.postMessage(immediateReady, '*');
        console.log('📨 Page.js: Third ready sent');
      }, 2000);
    }
  }, []);

  // Farcaster Mini App detection
  useEffect(() => {
    if (!isClient) return;
    
    const checkFarcaster = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isFarcasterFrame = urlParams.get('source') === 'farcaster';
      const isEmbeddedParam = urlParams.get('embedded') === 'true';
      const isEmbedded = window.self !== window.top;
      const isWarpcastUA = /Farcaster|Warpcast/i.test(navigator.userAgent);
      const isFarcasterReferrer = document.referrer.includes('warpcast') || 
                                 document.referrer.includes('farcaster');
      const isBaseApp = window.location.href.includes('base.org') ||
                       document.referrer.includes('base.org') ||
                       navigator.userAgent.includes('Base');
      
      const shouldActivateMiniApp = isFarcasterFrame || isEmbeddedParam || isEmbedded || isWarpcastUA || isFarcasterReferrer || isBaseApp;
      
      console.log('🎯 Farcaster detection:', {
        isFarcasterFrame,
        isEmbeddedParam,
        isEmbedded,
        isWarpcastUA,
        isFarcasterReferrer,
        isBaseApp,
        shouldActivateMiniApp
      });
      
      setIsFarcasterMiniApp(shouldActivateMiniApp);
      
      if (shouldActivateMiniApp) {
        document.body.classList.add('farcaster-mini-app');
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        console.log('🚀 Farcaster Mini App fully activated');
      }
    };
    
    checkFarcaster();
    
    const handleUrlChange = () => {
      setTimeout(checkFarcaster, 100);
    };
    
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [isClient]);

  // Farcaster Ready Call
  useEffect(() => {
    if (isFarcasterMiniApp && isClient) {
      console.log('🎯 Farcaster Mini App active - sending additional ready signals');
      
      const sendAdditionalReadySignals = () => {
        if (window.parent !== window) {
          const readyMsg = {
            type: 'ready',
            version: '1.0.0', 
            app: 'YoYo Guild Battle',
            from: 'page-farcaster-detection',
            timestamp: Date.now()
          };
          
          window.parent.postMessage(readyMsg, '*');
          console.log('📨 Additional ready message sent via postMessage');
        }
        
        if (window.farcaster && window.farcaster.ready) {
          window.farcaster.ready()
            .then(() => console.log('✅ farcaster.ready() successful'))
            .catch(err => console.warn('⚠️ farcaster.ready() failed:', err));
        }
      };
      
      const timer1 = setTimeout(sendAdditionalReadySignals, 1500);
      const timer2 = setTimeout(sendAdditionalReadySignals, 4000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isFarcasterMiniApp, isClient]);

  // Mobile detection ve auto-connect
  useEffect(() => {
    if (!isClient) return;
    
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, [isClient]);

  const connectMobileWallet = useCallback((walletType) => {
    if (!isClient) return;
    
    const currentUrl = encodeURIComponent(window.location.href);
    let walletUrl = '';
    const WALLET_LINKS = {
      metamask: { universal: "https://metamask.app.link/dapp/" },
      rabby: { universal: "https://rabby.io/" },
      coinbase: { universal: "https://go.cb-w.com/dapp?cb_url=" },
      trust: { universal: "https://link.trustwallet.com/dapp/" }
    };
    
    switch(walletType) {
      case 'metamask': walletUrl = `${WALLET_LINKS.metamask.universal}${currentUrl}`; break;
      case 'rabby': walletUrl = `${WALLET_LINKS.rabby.universal}`; break;
      case 'coinbase': walletUrl = `${WALLET_LINKS.coinbase.universal}${currentUrl}`; break;
      case 'trust': walletUrl = `${WALLET_LINKS.trust.universal}${currentUrl}`; break;
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