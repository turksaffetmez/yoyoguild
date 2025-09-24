import { useState } from 'react';

const Leaderboard = ({ leaderboard, preseasonLeaderboard, currentSeason }) => {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason.isPreseason ? 0 : currentSeason.seasonNumber);

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  // Sezon seçenekleri - preseason + 4 sezon
  const seasonOptions = [
    { value: 0, label: 'Preseason' }
  ];
  
  const maxSeason = Math.max(4, currentSeason.seasonNumber || 1);
  for (let i = 1; i <= maxSeason; i++) {
    seasonOptions.push({
      value: i,
      label: `Season ${i}${i === currentSeason.seasonNumber && !currentSeason.isPreseason ? ' (Current)' : ''}`
    });
  }

  // Gösterilecek liderlik verisini seç
  const displayLeaderboard = selectedSeason === 0 ? preseasonLeaderboard : leaderboard;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h2>
        
        {/* DROPDOWN MENÜ - Sezon Seçici */}
        <div className="flex justify-center items-center space-x-4 mb-4">
          <span className="text-gray-300">Select Season:</span>
          <div className="relative">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg appearance-none focus:outline-none focus:border-purple-500 pr-8"
            >
              {seasonOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <p className="text-gray-300">
          {selectedSeason === 0 
            ? "Preseason Leaderboard - Testing Phase" 
            : `Season ${selectedSeason} Leaderboard`
          }
        </p>
      </div>

      {selectedSeason === 0 && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-yellow-400 text-sm">
            ⚠️ Preseason battles are for testing purposes only. Points will not count towards official rewards.
          </p>
        </div>
      )}

      {displayLeaderboard.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl text-gray-400">
            {selectedSeason === 0
              ? "No preseason battles played yet"
              : `No data available for Season ${selectedSeason}`
            }
          </h3>
          <p className="text-gray-500">
            {selectedSeason === 0
              ? "Be the first to test the preseason battles!"
              : "Be the first to battle and claim the top spot!"
            }
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 font-semibold">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">Address</div>
            <div className="col-span-4 text-right">Points</div>
          </div>
          
          <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
            {displayLeaderboard.map((player, index) => (
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
          {selectedSeason === 0
            ? "Preseason leaderboard shows test battles. Official competition starts with Season 1."
            : "Leaderboard updates after each battle. Top players at the end of the season win special rewards!"
          }
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;