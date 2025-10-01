"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract";
import Image from "next/image";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError('');

      console.log('🏆 Loading leaderboard...');
      
      const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
      const contract = new ethers.Contract(contractAddress, abi, provider);
      
      const result = await contract.getTopPlayers();
      const addresses = result[0];
      const points = result[1];
      
      if (!addresses || addresses.length === 0) {
        setLeaderboard([]);
        return;
      }
      
      const leaderboardData = addresses
        .map((address, index) => ({
          rank: index + 1,
          address: address,
          points: Number(ethers.formatUnits(points[index] || 0, 0))
        }))
        .filter(player => player.points > 0)
        .slice(0, 100);
      
      setLeaderboard(leaderboardData);
      
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("Leaderboard loading failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30 backdrop-blur-sm">
        
        {/* HEADER */}
        <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 text-white py-6 px-6 text-center">
          <div className="flex items-center justify-center space-x-4">
            <Image src="/images/yoyo.png" alt="YoYo Guild" width={60} height={60} className="rounded-full" />
            <div>
              <h1 className="text-3xl font-bold">YoYo Guild Battle</h1>
              <p className="text-sm opacity-90 mt-1">Final Leaderboard</p>
            </div>
          </div>
        </header>

        {/* ANNOUNCEMENT BANNER */}
        <div className="bg-yellow-500/20 border border-yellow-500/30 py-4 px-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">⏸️</span>
            <div>
              <h2 className="text-yellow-400 font-bold text-lg">YoYo Guild Battle is temporarily paused.</h2>
              <p className="text-yellow-300 text-sm">Rewards have been distributed to the winners.</p>
            </div>
          </div>
        </div>

        {/* LEADERBOARD CONTENT */}
        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">🏆 Final Leaderboard</h2>
            <p className="text-gray-300 mb-4">
              Top 100 players - Rewards distributed
            </p>
            
            <button
              onClick={loadLeaderboard}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : '🔄 Refresh Leaderboard'}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center mb-6">
              <p className="text-red-400">{error}</p>
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
              <h3 className="text-xl text-gray-400">No leaderboard data available</h3>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 font-semibold">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-8">Player Address</div>
                <div className="col-span-3 text-right">Total Points</div>
              </div>
              
              {/* PLAYER LIST */}
              <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
                {leaderboard.map((player, index) => (
                  <div key={player.address} className="grid grid-cols-12 p-4 hover:bg-gray-700/50 transition-colors">
                    {/* RANK */}
                    <div className="col-span-1 flex items-center justify-center">
                      {index === 0 && <span className="text-yellow-400 text-lg">🥇</span>}
                      {index === 1 && <span className="text-gray-300 text-lg">🥈</span>}
                      {index === 2 && <span className="text-orange-400 text-lg">🥉</span>}
                      {index > 2 && (
                        <span className="text-gray-400 font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* ADDRESS - TAM GÖSTERİM */}
                    <div className="col-span-8 font-mono text-sm flex items-center">
                      <span className="text-blue-300">{player.address}</span>
                      {index < 3 && (
                        <span className="ml-3 text-xs bg-purple-500/30 px-2 py-1 rounded whitespace-nowrap">
                          Top {index + 1}
                        </span>
                      )}
                    </div>
                    
                    {/* POINTS */}
                    <div className="col-span-3 text-right font-bold text-yellow-400">
                      {player.points.toLocaleString()} pts
                      {index === 0 && player.points > 0 && (
                        <span className="text-green-400 text-xs ml-2">👑 Winner</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER INFO */}
          <div className="mt-6 bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm">
              Thank you to all participants! Rewards have been sent to the top players.
            </p>
            <p className="text-green-400 text-xs mt-2">
              {leaderboard.length} players competed in the battle
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bg-slate-900/80 text-gray-400 py-4 text-center border-t border-slate-700/50">
          <p>YoYo Guild Battle | Base Mainnet | Rewards Distributed</p>
        </footer>
      </div>
    </div>
  );
}