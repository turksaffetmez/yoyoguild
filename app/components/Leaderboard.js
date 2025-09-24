import { useState } from 'react';

const Leaderboard = ({ leaderboard, currentSeason }) => {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason.seasonNumber || 1);

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  // Sezon seçenekleri - ilk 4 sezon + mevcut sezon
  const seasonOptions = [];
  const maxSeason = Math.max(4, currentSeason.seasonNumber || 1);
  for (let i = 1; i <= maxSeason; i++) {
    seasonOptions.push(i);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Season Leaderboard</h2>
        
        {/* Sezon Seçici */}
        <div className="flex justify-center items-center space-x-4 mb-4">
          <span className="text-gray-300">Select Season:</span>
          <div className="flex space-x-2">
            {seasonOptions.map(season => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedSeason === season
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Season {season}
                {season === currentSeason.seasonNumber && ' (Current)'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-300">
          {selectedSeason === currentSeason.seasonNumber 
            ? `Season ${currentSeason.seasonNumber} - Top 100 Players` 
            : `Season ${selectedSeason} - Historical Leaderboard`
          }
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl text-gray-400">
            {selectedSeason === currentSeason.seasonNumber
              ? "No battles played yet this season"
              : `No data available for Season ${selectedSeason}`
            }
          </h3>
          <p className="text-gray-500">Be the first to battle and claim the top spot!</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 font-semibold">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">Address</div>
            <div className="col-span-4 text-right">Points</div>
          </div>
          
          <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
            {leaderboard.map((player, index) => (
              <div key={player.address} className="grid grid-cols-12 p-4 hover:bg-gray-700/50 transition-colors">
                <div className="col-span-1 flex items-center">
                  {index === 0 && <span className="text-yellow-400 text-lg">🥇</span>}
                  {index === 1 && <span className="text-gray-300 text-lg">🥈</span>}
                  {index === 2 && <span className="text-orange-400 text-lg">🥉</span>}
                  {index > 2 && <span className="text-gray-400 ml-2">{player.rank}</span>}
                </div>
                <div className="col-span-7 font-mono text-sm flex items-center">
                  {formatAddress(player.address)}
                </div>
                <div className="col-span-4 text-right font-bold text-yellow-400">
                  {player.points.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">
          {selectedSeason === currentSeason.seasonNumber
            ? "Leaderboard updates after each battle. Top players at the end of the season win special rewards!"
            : "Historical leaderboard data from previous seasons."
          }
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;