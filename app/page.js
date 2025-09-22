"use client";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract";
import WalletConnection from "./components/WalletConnection";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import HomeContent from "./components/HomeContent";
import MobileWalletSelector from "./components/MobileWalletSelector";

const YOYO_COIN_ADDRESS = "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1";
const YOYO_COIN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionInfo, setTransactionInfo] = useState("");
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [leaderboard, setLeaderboard] = useState([]);
  const [yoyoBalance, setYoyoBalance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const [lastPlayDate, setLastPlayDate] = useState("");
  
  const [gameState, setGameState] = useState({
    selectedImage: null,
    winnerIndex: null,
    gamePhase: "idle",
    images: [
      { id: 1, url: "/images/tevans1.png", name: "Guilder #1" },
      { id: 2, url: "/images/tevans2.png", name: "Guilder #2" },
      { id: 3, url: "/images/tevans3.png", name: "Guilder #3" },
      { id: 4, url: "/images/tevans4.png", name: "Guilder #4" },
      { id: 5, url: "/images/tevans5.png", name: "Guilder #5" },
      { id: 6, url: "/images/tevans6.png", name: "Guilder #6" },
      { id: 7, url: "/images/tevans7.png", name: "Guilder #7" },
      { id: 8, url: "/images/tevans8.png", name: "Guilder #8" },
      { id: 9, url: "/images/tevans9.png", name: "Guilder #9" },
      { id: 10, url: "/images/tevans10.png", name: "Guilder #10" },
      { id: 11, url: "/images/tevans11.png", name: "Guilder #11" },
      { id: 12, url: "/images/tevans12.png", name: "Guilder #12" },
      { id: 13, url: "/images/tevans13.png", name: "Guilder #13" },
      { id: 14, url: "/images/tevans14.png", name: "Guilder #14" },
      { id: 15, url: "/images/tevans15.png", name: "Guilder #15" },
      { id: 16, url: "/images/tevans16.png", name: "Guilder #16" },
      { id: 17, url: "/images/tevans17.png", name: "Guilder #17" },
      { id: 18, url: "/images/tevans18.png", name: "Guilder #18" },
      { id: 19, url: "/images/tevans19.png", name: "Guilder #19" }
    ],
    isLoading: false,
    attackPosition: 0
  });

  const checkDailyLimit = useCallback(() => {
    const today = new Date().toDateString();
    if (lastPlayDate !== today) {
      setGamesPlayedToday(0);
      setLastPlayDate(today);
      return 5;
    }
    return 5 - gamesPlayedToday;
  }, [lastPlayDate, gamesPlayedToday]);

  const disconnectWallet = useCallback(() => {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    
    setWalletConnected(false);
    setUserAddress("");
    setContract(null);
    setPoints(0);
    setProvider(null);
    setTransactionInfo("");
    setYoyoBalance(0);
    setShowWalletOptions(false);
    setGameState(prev => ({ ...prev, gamePhase: "idle", selectedImage: null, winnerIndex: null }));
  }, []);

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
      setStatusMessage("Wallet disconnected.");
    } else if (accounts[0] !== userAddress) {
      setUserAddress(accounts[0]);
      setStatusMessage("Account changed.");
      await checkYoyoBalance(accounts[0]);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  }, [userAddress, disconnectWallet]);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  const checkYoyoBalance = useCallback(async (address) => {
    if (!window.ethereum) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const yoyoContract = new ethers.Contract(YOYO_COIN_ADDRESS, YOYO_COIN_ABI, provider);
      
      const balance = await yoyoContract.balanceOf(address);
      const formattedBalance = Number(ethers.formatUnits(balance, 18));
      setYoyoBalance(formattedBalance);
    } catch (err) {
      console.error("Failed to get YOYO balance:", err);
      setYoyoBalance(0);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        setStatusMessage("Connecting wallet...");
        
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const signer = await newProvider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        
        setContract(contractInstance);
        const address = await signer.getAddress();
        setUserAddress(address);
        setWalletConnected(true);
        
        await checkYoyoBalance(address);
        await getPointsFromBlockchain(contractInstance, address);
        
        setStatusMessage("Wallet connected successfully!");
        setTimeout(() => setStatusMessage(""), 3000);
      } catch (err) {
        console.error("Failed to connect wallet:", err);
        setStatusMessage("Failed to connect wallet. Please try again.");
      }
    } else {
      if (isMobile) {
        setShowWalletOptions(true);
      } else {
        setStatusMessage("Please install a Web3 wallet (MetaMask, Coinbase Wallet, etc.)!");
      }
    }
  }, [checkYoyoBalance, isMobile, contractAddress, abi]);

  const checkWalletConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
        
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        const accounts = await newProvider.send("eth_accounts", []);
        
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (err) {
        console.error("Auto-connection error:", err);
      }
    }
  }, [handleAccountsChanged, handleChainChanged, connectWallet]);

  const loadLeaderboard = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setLeaderboard([
          { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", points: 12500 },
          { rank: 2, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 9800 },
          { rank: 3, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", points: 7650 },
        ]);
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractInstance = new ethers.Contract(contractAddress, abi, provider);
      
      const sampleAddresses = [
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        userAddress
      ].filter(addr => addr);
      
      const leaderboardData = [];
      
      for (const address of sampleAddresses) {
        try {
          const userPoints = await contractInstance.getPoints(address);
          const pointsValue = parseInt(userPoints.toString());
          if (pointsValue > 0) {
            leaderboardData.push({ address, points: pointsValue });
          }
        } catch (err) {
          console.error(`Failed to get points for address ${address}:`, err);
        }
      }
      
      leaderboardData.sort((a, b) => b.points - a.points);
      const top10 = leaderboardData.slice(0, 10);
      
      const rankedLeaderboard = top10.map((player, index) => ({
        rank: index + 1,
        address: player.address,
        points: player.points
      }));
      
      setLeaderboard(rankedLeaderboard);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setLeaderboard([
        { rank: 1, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", points: 12500 },
        { rank: 2, address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", points: 9800 },
        { rank: 3, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", points: 7650 },
      ]);
    }
  }, [userAddress]);

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
    checkWalletConnection();
    loadLeaderboard();
    checkDailyLimit();
  }, [checkWalletConnection, loadLeaderboard, checkDailyLimit]);

  async function getPointsFromBlockchain(contractInstance, address) {
    if (!contractInstance) return;
    
    try {
      const userPoints = await contractInstance.getPoints(address);
      setPoints(parseInt(userPoints.toString()));
    } catch (err) {
      console.error("Failed to get points:", err);
      setPoints(0);
    }
  }

  async function addPointsToBlockchain(amount) {
    if (!contract) {
      setStatusMessage("Please connect wallet first!");
      return false;
    }
    
    const remainingGames = checkDailyLimit();
    if (remainingGames <= 0) {
      setStatusMessage("❌ Daily limit reached! Maximum 5 games per day.");
      return false;
    }
    
    try {
      setStatusMessage("Processing blockchain transaction...");
      
      const signer = await provider.getSigner();
      const updatedContract = contract.connect(signer);
      
      const tx = await updatedContract.addPoints(await signer.getAddress(), amount);
      
      setTransactionInfo(`Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      
      setStatusMessage(`Transaction confirmed! ${amount} points added.`);
      setTransactionInfo(prev => prev + `\nTransaction confirmed. Block: ${receipt.blockNumber}`);
      
      await getPointsFromBlockchain(updatedContract, await signer.getAddress());
      await loadLeaderboard();
      
      setGamesPlayedToday(prev => prev + 1);
      
      setTimeout(() => setStatusMessage(""), 3000);
      
      return true;
    } catch (err) {
      console.error("Error:", err);
      
      if (err.code === 4001 || err.code === 'ACTION_REJECTED' || err.message?.includes('user rejected') || err.message?.includes('denied transaction')) {
        setStatusMessage("❌ Transaction rejected. Please confirm the transaction in your wallet.");
      } else if (err.message?.includes('insufficient funds')) {
        setStatusMessage("💸 Insufficient gas fee. Please add ETH to your wallet.");
      } else if (err.message?.includes('network')) {
        setStatusMessage("🌐 Network error. Please check your connection.");
      } else {
        setStatusMessage("⚠️ Transaction failed: " + (err.message || "Unknown error"));
      }
      
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      
      return false;
    }
  }

  const resetGame = useCallback(() => {
    setGameState(prev => {
      const newImages = [...prev.images];
      
      if (prev.winnerIndex !== null) {
        const loserIndex = prev.winnerIndex === 0 ? 1 : 0;
        
        const currentIds = [prev.images[0].id, prev.images[1].id];
        const availableIds = Array.from({length: 19}, (_, i) => i + 1)
          .filter(id => !currentIds.includes(id));
        
        if (availableIds.length > 0) {
          const randomId = availableIds[Math.floor(Math.random() * availableIds.length)];
          newImages[loserIndex] = {
            id: randomId,
            url: `/images/tevans${randomId}.png`,
            name: `Guilder #${randomId}`
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
        attackPosition: 0
      };
    });
    
    setStatusMessage("");
  }, []);

  const startGame = async (selectedIndex) => {
    if (!walletConnected) {
      setStatusMessage("Please connect wallet first!");
      return;
    }
    
    const remainingGames = checkDailyLimit();
    if (remainingGames <= 0) {
      setStatusMessage("❌ Daily limit reached! Maximum 5 games per day.");
      return;
    }
    
    if (gameState.gamePhase !== "idle") return;
    
    setGameState(prev => ({ 
      ...prev, 
      isLoading: true, 
      selectedImage: selectedIndex, 
      gamePhase: "selecting",
      winnerIndex: null
    }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setGameState(prev => ({ ...prev, gamePhase: "fighting" }));
    
    try {
      const winChance = yoyoBalance > 0 ? 60 : 50;
      const isWinner = Math.floor(Math.random() * 100) < winChance;
      const winnerIndex = isWinner ? selectedIndex : (selectedIndex === 0 ? 1 : 0);
      const earnedPoints = isWinner ? 100 : 10;
      
      // Attack animation
      for (let i = 0; i <= 100; i += 20) {
        setGameState(prev => ({ ...prev, attackPosition: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const success = await addPointsToBlockchain(earnedPoints);
      
      if (success) {
        setGameState(prev => ({ ...prev, winnerIndex, gamePhase: "result" }));
        setPoints(prevPoints => prevPoints + earnedPoints);
        
        if (isWinner) {
          setStatusMessage(`🎉 Congratulations! You won! +100 points 🥳`);
        } else {
          setStatusMessage(`😢 Unfortunately you lost. +10 points 😔`);
        }
        
      } else {
        setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      }
    } catch (error) {
      console.error("Error during game:", error);
      setGameState(prev => ({ ...prev, gamePhase: "idle", isLoading: false }));
      setStatusMessage("❌ An error occurred during the game. Please try again.");
    }
  };

  const startNewGame = useCallback(() => {
    if (gameState.gamePhase === "result") {
      resetGame();
    }
  }, [gameState.gamePhase, resetGame]);

  const connectMobileWallet = useCallback((walletType) => {
    const currentUrl = encodeURIComponent(window.location.href);
    let walletUrl = '';
    
    const WALLET_LINKS = {
      metamask: { universal: "https://metamask.app.link/dapp/" },
      coinbase: { universal: "https://go.cb-w.com/dapp?cb_url=" },
      trust: { universal: "https://link.trustwallet.com/dapp/" }
    };
    
    switch(walletType) {
      case 'metamask': walletUrl = `${WALLET_LINKS.metamask.universal}${currentUrl}`; break;
      case 'coinbase': walletUrl = `${WALLET_LINKS.coinbase.universal}${currentUrl}`; break;
      case 'trust': walletUrl = `${WALLET_LINKS.trust.universal}${currentUrl}`; break;
      default: return;
    }
    
    window.open(walletUrl, '_blank');
    setShowWalletOptions(false);
    setTimeout(() => checkWalletConnection(), 3000);
  }, [checkWalletConnection]);

  const remainingGames = checkDailyLimit();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center p-4">
      {showWalletOptions && (
        <MobileWalletSelector 
          onConnect={connectMobileWallet}
          onClose={() => setShowWalletOptions(false)}
        />
      )}
      
      <div className="w-full max-w-6xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-500/20">
        <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-8 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <h1 className="text-5xl font-bold mb-3 relative z-10">⚔️ YoYo Guild</h1>
          <p className="text-xl opacity-90 relative z-10">Blockchain Battle Arena</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        </header>
        
        <nav className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 border-b border-gray-600">
          <div className="flex flex-wrap justify-center gap-3">
            {["home", "play", "leaderboard"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${
                  activeTab === tab 
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                }`}
              >
                {tab === "home" ? "🏠 Home" : tab === "play" ? "⚔️ Arena" : "🏆 Leaderboard"}
              </button>
            ))}
            <a 
              href="https://tevaera.com/guilds/YoYo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
            >
              👥 Join Guild
            </a>
          </div>
        </nav>
        
        <div className="p-6">
          <WalletConnection
            walletConnected={walletConnected}
            userAddress={userAddress}
            points={points}
            yoyoBalance={yoyoBalance}
            onDisconnect={disconnectWallet}
            onConnect={connectWallet}
            isMobile={isMobile}
            onShowWalletOptions={() => setShowWalletOptions(true)}
            remainingGames={remainingGames}
          />
          
          <div className="min-h-[500px]">
            {activeTab === "home" && <HomeContent walletConnected={walletConnected} yoyoBalance={yoyoBalance} remainingGames={remainingGames} />}
            {activeTab === "play" && (
              <GameBoard
                walletConnected={walletConnected}
                gameState={gameState}
                yoyoBalance={yoyoBalance}
                points={points}
                onStartGame={startGame}
                onConnectWallet={connectWallet}
                isMobile={isMobile}
                onShowWalletOptions={() => setShowWalletOptions(true)}
                onStartNewGame={startNewGame}
                onResetGame={resetGame}
                remainingGames={remainingGames}
              />
            )}
            {activeTab === "leaderboard" && <Leaderboard leaderboard={leaderboard} />}
          </div>

          {statusMessage && (
            <div className={`mt-6 p-4 rounded-xl text-center border-2 backdrop-blur-sm ${
              statusMessage.includes("Congratulations") || statusMessage.includes("successfully") 
                ? "bg-green-500/10 border-green-500/30 text-green-300" 
                : statusMessage.includes("Unfortunately") || statusMessage.includes("rejected") 
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : statusMessage.includes("connecting") || statusMessage.includes("Processing") 
                ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                : "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
            }`}>
              <p className="font-semibold text-lg">{statusMessage}</p>
            </div>
          )}

          {transactionInfo && (
            <div className="mt-6 bg-gray-700/50 rounded-xl p-4 overflow-auto max-h-40 border border-gray-600">
              <p className="text-gray-300 font-semibold mb-2">Transaction Info:</p>
              <pre className="text-sm text-gray-400 whitespace-pre-wrap">{transactionInfo}</pre>
            </div>
          )}
        </div>
        
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-400 py-4 text-center border-t border-gray-700">
          <p>YoYo Guild - Elite Blockchain Battling | Base Sepolia Network</p>
        </footer>
      </div>
    </div>
  );
}