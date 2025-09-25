import { useState, useEffect } from 'react';

const Leaderboard = ({ leaderboard, currentSeason }) => {
  const [selectedSeason, setSelectedSeason] = useState(
    currentSeason.active && !currentSeason.isPreseason ? currentSeason.seasonNumber : 1
  );
  const [isLoading, setIsLoading] = useState(false);

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const seasonOptions = [];
  const maxSeason = Math.max(4, currentSeason.seasonNumber || 1);
  for (let i = 1; i <= maxSeason; i++) {
    seasonOptions.push({
      value: i,
      label: `Season ${i}${i === currentSeason.seasonNumber && !currentSeason.isPreseason ? ' (Current)' : ''}`
    });
  }

  const displayLeaderboard = leaderboard;

  useEffect(() => {
    if (selectedSeason) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedSeason]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h2>
        
        <div className="flex justify-center items-center space-x-4 mb-4">
          <span className="text-gray-300">Select Season:</span>
          <div className="relative">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg appearance-none focus:outline-none focus:border-purple-500 pr-8"
              disabled={currentSeason.isPreseason}
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
          {currentSeason.isPreseason ? "Preseason - Leaderboard starts with Season 1" : `Season ${selectedSeason} Leaderboard`}
        </p>
      </div>

      {currentSeason.isPreseason && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-yellow-400 text-sm">
            ⚠️ Preseason Mode - Leaderboard will be available when Season 1 starts on September 25, 2025
          </p>
          <p className="text-yellow-300 text-xs mt-2">
            All points will reset when Season 1 begins
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      ) : displayLeaderboard.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl text-gray-400">
            {currentSeason.isPreseason 
              ? "Season 1 starts soon!" 
              : `No battles played yet in Season ${selectedSeason}`
            }
          </h3>
          <p className="text-gray-500 mt-2">
            {currentSeason.isPreseason
              ? "Official competition starts with Season 1 on September 25, 2025"
              : "Be the first to battle and claim the top spot!"
            }
          </p>
          {!currentSeason.isPreseason && (
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-400">
                💡 Season {currentSeason.seasonNumber} ends in {Math.floor(currentSeason.timeUntilEnd / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 font-semibold">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-7">Player Address</div>
            <div className="col-span-4 text-right">Points</div>
          </div>
          
          <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
            {displayLeaderboard.map((player, index) => (
              <div key={`${player.address}-${index}`} className="grid grid-cols-12 p-4 hover:bg-gray-700/50 transition-colors">
                <div className="col-span-1 flex items-center justify-center">
                  {index === 0 && <span className="text-yellow-400 text-lg">🥇</span>}
                  {index === 1 && <span className="text-gray-300 text-lg">🥈</span>}
                  {index === 2 && <span className="text-orange-400 text-lg">🥉</span>}
                  {index > 2 && <span className="text-gray-400">{index + 1}</span>}
                </div>
                <div className="col-span-7 font-mono text-sm flex items-center">
                  {formatAddress(player.address)}
                  {index < 3 && (
                    <span className="ml-2 text-xs bg-purple-500/30 px-2 py-1 rounded">
                      Top {index + 1}
                    </span>
                  )}
                </div>
                <div className="col-span-4 text-right font-bold text-yellow-400">
                  {player.points.toLocaleString()}
                  {index === 0 && player.points > 0 && (
                    <span className="text-green-400 text-xs ml-2">👑</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
        <p className="text-gray-400 text-sm">
          {currentSeason.isPreseason
            ? "Preseason points are for testing. All rankings will reset when Season 1 begins."
            : "Leaderboard updates in real-time. Top 3 players at season end win special rewards! 🏅"
          }
        </p>
        {!currentSeason.isPreseason && currentSeason.active && (
          <p className="text-green-400 text-xs mt-2">
            Season {currentSeason.seasonNumber} ends in {Math.ceil(currentSeason.timeUntilEnd / (1000 * 60 * 60 * 24))} days
          </p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;