import { useState, useEffect } from 'react';

export const useGameState = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [pointValues, setPointValues] = useState({
    winNormal: 250,
    winYoyo: 500,
    lose: 10
  });
  const [isFarcasterMiniApp, setIsFarcasterMiniApp] = useState(false);
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
    setIsClient(true);
  }, []);

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

  return {
    activeTab, setActiveTab,
    pointValues, setPointValues,
    isFarcasterMiniApp, setIsFarcasterMiniApp,
    isClient, setIsClient,
    gameState, setGameState
  };
};