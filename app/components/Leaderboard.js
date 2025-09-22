"use client";
import { useState } from "react";

export default function Leaderboard({ leaderboard }) {
  const [sortBy, setSortBy] = useState("points");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortBy === "points") {
      return sortOrder === "desc" ? b.points - a.points : a.points - b.points;
    } else {
      return sortOrder === "desc" ? b.rank - a.rank : a.rank - b.rank;
    }
  });

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return "from-yellow-400 to-yellow-600";
      case 2: return "from-gray-400 to-gray-600";
      case 3: return "from-orange-400 to-orange-600";
      default: return "from-purple-500 to-blue-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-3">
          🏆 Guilder Leaderboard
        </h2>
        <p className="text-gray-300 text-lg">Top warriors ranked by battle prowess</p>
      </div>

      {/* Sorting Controls */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-800/50 rounded-2xl">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Sort by:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy("rank")}
              className={`px-4 py-2 rounded-lg transition-all ${
                sortBy === "rank" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Rank
            </button>
            <button
              onClick={() => setSortBy("points")}
              className={`px-4 py-2 rounded-lg transition-all ${
                sortBy === "points" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Points
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
        >
          {sortOrder === "desc" ? "↓ Descending" : "↑ Ascending"}
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-500/20">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-6 px-8 text-lg">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-7">Guilder Address</div>
          <div className="col-span-2 text-right">Points</div>
          <div className="col-span-2 text-center">Status</div>
        </div>
        
        {/* Table Body */}
        <div className="divide-y divide-gray-700/50">
          {sortedLeaderboard.map((player, index) => (
            <div 
              key={index} 
              className="grid grid-cols-12 items-center py-6 px-8 hover:bg-gray-700/30 transition-all duration-300 group"
            >
              {/* Rank */}
              <div className="col-span-1 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getRankColor(player.rank)} text-white font-bold text-lg shadow-lg`}>
                  {getRankBadge(player.rank)}
                </div>
              </div>
              
              {/* Address */}
              <div className="col-span-7">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {player.rank}
                  </div>
                  <div>
                    <div className="font-mono text-white text-lg font-semibold">
                      {formatAddress(player.address)}
                    </div>
                    <div className="text-gray-400 text-sm">Battle Master</div>
                  </div>
                </div>
              </div>
              
              {/* Points */}
              <div className="col-span-2 text-right">
                <div className="text-2xl font-bold text-white">
                  {player.points.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">points</div>
              </div>
              
              {/* Status */}
              <div className="col-span-2 text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  player.rank <= 3 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}>
                  {player.rank <= 3 ? "Elite" : "Active"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedLeaderboard.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No Battles Yet</h3>
            <p className="text-gray-500">Start battling to appear on the leaderboard!</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-yellow-400">
          <span>🥇</span>
          <span>Champion</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <span>🥈</span>
          <span>Contender</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-orange-400">
          <span>🥉</span>
          <span>Challenger</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-purple-400">
          <span>⚔️</span>
          <span>Warrior</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Leaderboard updates after each battle. All data is stored securely on the blockchain.</p>
        <p className="mt-1">Compete daily to climb the ranks and earn legendary status!</p>
      </div>
    </div>
  );
}