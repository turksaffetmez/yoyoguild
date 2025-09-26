import { useState, useEffect } from 'react';

const Leaderboard = ({ leaderboard }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [leaderboard]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Global Leaderboard</h2>
        <p className="text-gray-300">
          All-time points ranking - Compete for the top spot!
        </p>
      </div>

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
          <div className="grid grid-cols-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 font-semibold">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-7">Player Address</div>
            <div className="col-span-4 text-right">Total Points</div>
          </div>
          
          <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
            {leaderboard.map((player, index) => (
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
          The leaderboard is updated in real time. The top 100 players receive $YoYo equivalent to the points they have collected! 🏅
        </p>
        <p className="text-gray-400 text-sm mt-2">
          You will be notified via the{' '}
          <a 
            href="https://x.com/yoyoguild" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            YoYo Guild X account
          </a>{' '}
          and{' '}
          <a 
            href="https://discord.gg/yoyoguild" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Discord channel
          </a>{' '}
          when the rewards are sent. 📢
        </p>
        <p className="text-green-400 text-xs mt-2">
          {leaderboard.length} players competing
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;