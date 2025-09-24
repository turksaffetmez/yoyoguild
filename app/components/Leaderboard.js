const Leaderboard = ({ leaderboard, currentSeason }) => {
  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Season Leaderboard</h2>
        <p className="text-gray-300">Season {currentSeason.seasonNumber || 1} - Top Guilders</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl text-gray-400">No battles played yet this season</h3>
          <p className="text-gray-500">Be the first to battle and claim the top spot!</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 font-semibold">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">Address</div>
            <div className="col-span-4 text-right">Points</div>
          </div>
          
          <div className="divide-y divide-gray-700">
            {leaderboard.slice(0, 100).map((player, index) => (
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
          Leaderboard updates after each battle. Top players at the end of the season win special rewards!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;