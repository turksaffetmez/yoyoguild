"use client";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, abi } from '../utils/contract';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError('');

      console.log('🏆 Loading leaderboard from contract:', contractAddress);
      
      // Base RPC provider
      const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
      const contract = new ethers.Contract(contractAddress, abi, provider);
      
      // Önce contract bağlantısını test et
      try {
        const dailyLimit = await contract.DAILY_LIMIT();
        console.log('✅ Contract connection test passed, daily limit:', dailyLimit.toString());
      } catch (testError) {
        console.error('❌ Contract connection failed:', testError);
        throw new Error('Contract bağlantısı başarısız. Lütfen contract adresini ve ABI kontrol edin.');
      }
      
      // Leaderboard'u getir
      console.log('📊 Fetching leaderboard data...');
      const result = await contract.getTopPlayers();
      
      console.log('📋 Raw leaderboard result:', result);
      
      const addresses = result[0];
      const points = result[1];
      
      if (!addresses || addresses.length === 0) {
        console.log('ℹ️ No leaderboard data found');
        setLeaderboard([]);
        return;
      }
      
      // Leaderboard verisini işle
      const leaderboardData = addresses
        .map((address, index) => ({
          rank: index + 1,
          address: address,
          points: Number(ethers.formatUnits(points[index] || 0, 0)) // points uint256 olduğu için format
        }))
        .filter(player => player.points > 0)
        .slice(0, 100);
      
      console.log('✅ Processed leaderboard:', leaderboardData.length, 'players');
      setLeaderboard(leaderboardData);
      
    } catch (err) {
      console.error("❌ Failed to load leaderboard:", err);
      setError("Leaderboard yüklenirken hata oluştu: " + (err.message || 'Bilinmeyen hata'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLeaderboard = () => {
    loadLeaderboard();
  };

  const formatAddress = (address) => {
    if (!address) return "";
    if (isMobile) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Global Leaderboard</h2>
        <p className="text-gray-300">
          Real-time points ranking - Top 100 players
        </p>
        
        <button
          onClick={refreshLeaderboard}
          disabled={isLoading}
          className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={refreshLeaderboard}
            className="mt-2 bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl text-gray-400">No battles played yet!</h3>
          <p className="text-gray-500 mt-2">
            Be the first to battle and claim the top spot!
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className={`grid ${isMobile ? 'grid-cols-10' : 'grid-cols-12'} bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 font-semibold`}>
            <div className={`${isMobile ? 'col-span-1' : 'col-span-1'} text-center text-sm`}>Rank</div>
            <div className={`${isMobile ? 'col-span-6' : 'col-span-7'} text-sm`}>Player</div>
            <div className={`${isMobile ? 'col-span-3' : 'col-span-4'} text-right text-sm`}>Points</div>
          </div>
          
          <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
            {leaderboard.map((player, index) => (
              <div key={`${player.address}-${index}`} className={`grid ${isMobile ? 'grid-cols-10' : 'grid-cols-12'} p-3 hover:bg-gray-700/50 transition-colors`}>
                <div className={`${isMobile ? 'col-span-1' : 'col-span-1'} flex items-center justify-center`}>
                  {index === 0 && <span className="text-yellow-400 text-lg">🥇</span>}
                  {index === 1 && <span className="text-gray-300 text-lg">🥈</span>}
                  {index === 2 && <span className="text-orange-400 text-lg">🥉</span>}
                  {index > 2 && <span className="text-gray-400 text-sm">{index + 1}</span>}
                </div>
                <div className={`${isMobile ? 'col-span-6' : 'col-span-7'} font-mono text-sm flex items-center truncate`}>
                  <span className="truncate">{formatAddress(player.address)}</span>
                  {index < 3 && (
                    <span className="ml-2 text-xs bg-purple-500/30 px-2 py-1 rounded whitespace-nowrap">
                      Top {index + 1}
                    </span>
                  )}
                </div>
                <div className={`${isMobile ? 'col-span-3' : 'col-span-4'} text-right font-bold text-yellow-400 truncate`}>
                  {player.points.toLocaleString()}
                  {index === 0 && player.points > 0 && (
                    <span className="text-green-400 text-xs ml-1">👑</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">
          The leaderboard is updated in real time. The top 100 players receive $YoYo equivalent to the points they have collected! 🏅
        </p>
        <p className="text-green-400 text-xs mt-2">
          {leaderboard.length} players competing
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;