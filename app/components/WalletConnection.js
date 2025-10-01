import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnection = ({
  walletConnected,
  userAddress,
  points,
  yoyoBalanceAmount,
  onDisconnect,
  onConnect,
  isMobile,
  remainingGames,
  dailyLimit,
  isLoading,
  pointValues,
  playerStats
}) => {
  const [displayYoyoBalance, setDisplayYoyoBalance] = useState(0);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [currentChainId, setCurrentChainId] = useState(null);

  // Base Mainnet chainId
  const BASE_CHAIN_ID = '0x2105'; // Base Mainnet
  const BASE_CHAIN_NAME = 'Base Mainnet';

  // YOYO Token Address ve ABI
  const YOYO_TOKEN_ADDRESS = "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1";
  const YOYO_TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  // Ağ kontrolü
  const checkNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setCurrentChainId(chainId);
      setWrongNetwork(chainId !== BASE_CHAIN_ID);
    } catch (error) {
      console.error('Network check failed:', error);
    }
  };

  // Ağ değişikliğini dinle
  useEffect(() => {
    if (!window.ethereum) return;

    checkNetwork();

    // Ağ değiştiğinde kontrol et
    const handleChainChanged = (chainId) => {
      checkNetwork();
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Ağ değiştirme fonksiyonu
  const switchToBaseNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }],
      });
    } catch (switchError) {
      // Eğer zincir wallet'ta yoksa, ekle
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BASE_CHAIN_ID,
                chainName: 'Base Mainnet',
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error('Base network eklenemedi:', addError);
        }
      }
      console.error('Network switch failed:', switchError);
    }
  };

  // YOYO balance kontrolü
  const checkYoyoBalance = async (address) => {
    if (!address) return 0;
    try {
      let provider;
      
      if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
      }

      const yoyoContract = new ethers.Contract(YOYO_TOKEN_ADDRESS, YOYO_TOKEN_ABI, provider);
      const balance = await yoyoContract.balanceOf(address);
      const decimals = await yoyoContract.decimals();
      const formattedBalance = Number(ethers.formatUnits(balance, decimals));
      
      console.log(`YOYO Balance for ${address}: ${formattedBalance}`);
      return formattedBalance;
    } catch (error) {
      console.error("YOYO balance check failed:", error);
      return 0;
    }
  };

  // Balance refresh fonksiyonu
  const refreshYoyoBalance = async () => {
    if (!userAddress) return;
    
    setIsRefreshingBalance(true);
    try {
      const newBalance = await checkYoyoBalance(userAddress);
      setDisplayYoyoBalance(newBalance);
    } catch (error) {
      console.error("Failed to refresh YOYO balance:", error);
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  useEffect(() => {
    if (walletConnected && userAddress) {
      refreshYoyoBalance();
      checkNetwork();
    }
  }, [walletConnected, userAddress]);

  useEffect(() => {
    setDisplayYoyoBalance(yoyoBalanceAmount);
  }, [yoyoBalanceAmount]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const detectWallet = () => {
    if (window.ethereum) {
      if (window.ethereum.isMetaMask) return 'MetaMask';
      if (window.ethereum.isRabby) return 'Rabby';
      if (window.ethereum.isCoinbaseWallet) return 'Coinbase';
      if (window.ethereum.isTrust) return 'Trust Wallet';
      return 'Ethereum Wallet';
    }
    return null;
  };

  const currentWallet = detectWallet();

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 border border-slate-600 shadow-lg">
      {/* WRONG NETWORK UYARISI */}
      {wrongNetwork && walletConnected && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 font-semibold">⚠️ Wrong Network</p>
              <p className="text-red-300 text-sm mt-1">
                Please switch to <strong>{BASE_CHAIN_NAME}</strong> to play YoYo Guild Battle
              </p>
            </div>
            <button
              onClick={switchToBaseNetwork}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Switch to Base
            </button>
          </div>
        </div>
      )}

      {!walletConnected ? (
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">Connect Your Wallet to Start Battling!</h3>
          
          {/* Wallet Detected Indicator */}
          {currentWallet && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-4">
              <p className="text-blue-400 text-sm">
                {currentWallet} detected
              </p>
              <p className="text-blue-300 text-xs mt-1">
                Make sure you're on <strong>Base Mainnet</strong>
              </p>
            </div>
          )}
          
          <button
            onClick={onConnect}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              `Connect ${currentWallet || 'Wallet'}`
            )}
          </button>
          
          {isMobile && (
            <p className="text-gray-400 mt-2 text-sm">
              Make sure your wallet app is installed and on Base network
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${wrongNetwork ? 'bg-red-400' : 'bg-green-400'}`}></div>
              <span className="text-white font-semibold">
                {wrongNetwork ? 'Wrong Network' : 'Connected'}
              </span>
              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-mono">
                {formatAddress(userAddress)}
              </span>
              {currentWallet && (
                <span className="bg-blue-500 px-2 py-1 rounded-full text-xs">
                  {currentWallet}
                </span>
              )}
              {!wrongNetwork && (
                <span className="bg-green-500 px-2 py-1 rounded-full text-xs">
                  ✓ Base Network
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {wrongNetwork && (
                <button
                  onClick={switchToBaseNetwork}
                  className="bg-red-500 px-3 py-2 rounded-lg text-white hover:bg-red-600 transition-colors text-sm"
                >
                  🔄 Switch Network
                </button>
              )}
              <button
                onClick={refreshYoyoBalance}
                disabled={isRefreshingBalance}
                className="bg-green-600 px-3 py-2 rounded-lg text-white hover:bg-green-500 transition-colors text-sm disabled:opacity-50"
              >
                {isRefreshingBalance ? '🔄' : '🔄 Balance'}
              </button>
              <button
                onClick={onDisconnect}
                className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-500 transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* İstatistikler Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-600">
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Total Points</div>
              <div className="text-2xl font-bold text-yellow-400">{points.toLocaleString()}</div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Games Today</div>
              <div className="text-2xl font-bold text-blue-400">
                {remainingGames}/{dailyLimit}
              </div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-slate-400 text-sm">YOYO Balance</div>
                <button 
                  onClick={refreshYoyoBalance}
                  disabled={isRefreshingBalance}
                  className="text-xs text-green-400 hover:text-green-300 disabled:opacity-50"
                >
                  {isRefreshingBalance ? '...' : '↻'}
                </button>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {displayYoyoBalance > 0 ? displayYoyoBalance.toFixed(2) : '0'} YOYO
              </div>
              {displayYoyoBalance > 0 && (
                <div className="text-xs text-green-400 mt-1">
                  🎯 Boost Active (+10% Win)
                </div>
              )}
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Win Rate</div>
              <div className="text-2xl font-bold text-green-400">
                {playerStats?.winRate || 0}%
              </div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <div className="text-slate-400 text-sm">Total Games</div>
              <div className="text-2xl font-bold text-orange-400">
                {playerStats?.totalGames || 0}
              </div>
            </div>
          </div>

          {/* Detaylı İstatistikler */}
          {playerStats && playerStats.totalGames > 0 && (
            <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-600">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-green-400 font-bold">{playerStats.totalWins} Wins</div>
                </div>
                <div>
                  <div className="text-red-400 font-bold">{playerStats.totalLosses} Losses</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">Streak: {playerStats.winStreak}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-600">
            <div className="text-center text-sm text-gray-300">
              <span className="font-semibold text-green-400">Point System: </span>
              <span>Win {pointValues.winNormal} points | </span>
              <span className="text-yellow-400">Win with YOYO {pointValues.winYoyo} points | </span>
              <span className="text-red-400">Lose {pointValues.lose} points</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-300">
              <span>Total Points Leaderboard</span>
              <span>•</span>
              <span className="text-green-400">
                Real-time Updates
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full ${
                displayYoyoBalance > 0 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {displayYoyoBalance > 0 ? "🎯 Boost Active (+10% Win)" : "No YOYO Boost"}
              </div>
              {!wrongNetwork && (
                <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full">
                  ✓ Base Network
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;