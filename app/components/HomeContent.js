const HomeContent = ({ 
  walletConnected, 
  yoyoBalanceAmount, 
  remainingGames, 
  seasonTimeLeft, 
  currentSeason 
}) => {
  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return "00:00:00";
    
    const seconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeasonStatus = () => {
    if (currentSeason.active) {
      return {
        text: `Season ${currentSeason.seasonNumber} ends in`,
        time: formatTimeLeft(currentSeason.timeUntilEnd),
        color: "text-green-400"
      };
    } else if (currentSeason.timeUntilStart > 0 || currentSeason.isPreseason) {
      return {
        text: currentSeason.isPreseason ? "Season starts in" : `Season ${currentSeason.seasonNumber} starts in`,
        time: formatTimeLeft(currentSeason.timeUntilStart),
        color: "text-yellow-400"
      };
    } else {
      return {
        text: "Season Ended",
        time: "00:00:00",
        color: "text-red-400"
      };
    }
  };

  const seasonStatus = getSeasonStatus();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Welcome to YoYo Guild Battle v1</h2>
        <div className="text-lg text-gray-300 max-w-4xl mx-auto space-y-4">
          <p>
            YoYo Guild is an elite community that brings together skilled players in the Tevaera universe. 
            With strategy, skill, and teamwork, we build, grow, and thrive together. Winning together, growing together! 
            Make a difference with YoYo Guild! 🚀
          </p>
          <p>
            If you want to make history in Web3game, click on join guild above. Purchase a minimum amount of $yoyo. 
            Get a 60% win rate and benefit from the upcoming Tevaera and Degen Rivals airdrops.
          </p>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center space-x-6 mt-6">
          <a href="https://www.yoyoguild.com/" target="_blank" rel="noopener noreferrer" 
             className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
            <span className="text-xl">🌐</span>
            <span>Web</span>
          </a>
          <a href="https://x.com/yoyoguild" target="_blank" rel="noopener noreferrer" 
             className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-xl">🐦</span>
            <span>X</span>
          </a>
          <a href="https://discord.gg/yoyoguild" target="_blank" rel="noopener noreferrer" 
             className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors">
            <span className="text-xl">💬</span>
            <span>Discord</span>
          </a>
        </div>
      </div>

      {/* Season Timer */}
      <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30 text-center">
        <div className="text-2xl font-bold text-white mb-2">{seasonStatus.text}</div>
        <div className={`text-4xl font-mono font-bold ${seasonStatus.color} mb-4`}>
          {seasonStatus.time}
        </div>
        <div className="text-sm text-gray-400">
          {currentSeason.isPreseason ? 
            `Official Season 1 starts on September 25, 2025 12:00 UTC` :
            currentSeason.active ?
              `Season ${currentSeason.seasonNumber} started on ${new Date(currentSeason.startTime).toLocaleDateString()}` :
              `Season ${currentSeason.seasonNumber} starts on September 25, 2025 12:00 UTC`
          }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30">
          <div className="text-4xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-white mb-2">Daily Battles</h3>
          <p className="text-gray-300">
            {walletConnected ? 
              `Play ${remainingGames} out of 20 games remaining today` : 
              'Connect wallet to see daily battles'
            }
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-2">YOYO Boost</h3>
          <p className="text-gray-300">
            {yoyoBalanceAmount > 0 ? 
              `Active! ${yoyoBalanceAmount.toFixed(2)} YOYO (+10% win chance)` : 
              'Not active - hold YOYO for boost'
            }
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500/30">
          <div className="text-4xl mb-4">⏰</div>
          <h3 className="text-xl font-bold text-white mb-2">{currentSeason.isPreseason ? 'Preseason' : `Season ${currentSeason.seasonNumber}`}</h3>
          <p className="text-gray-300">
            {currentSeason.isPreseason ? 'Testing Phase - Get ready!' : 
             currentSeason.active ? 'Active - Compete for rewards!' : 'Starting soon - Get ready!'}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">How to Play</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              1
            </div>
            <h4 className="font-bold text-white mb-2">Connect Wallet</h4>
            <p className="text-gray-400 text-sm">Connect your Base-compatible wallet</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              2
            </div>
            <h4 className="font-bold text-white mb-2">Choose Tevan</h4>
            <p className="text-gray-400 text-sm">Select your fighter for the battle</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              3
            </div>
            <h4 className="font-bold text-white mb-2">Battle</h4>
            <p className="text-gray-400 text-sm">Win battles to earn points</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              4
            </div>
            <h4 className="font-bold text-white mb-2">Climb Leaderboard</h4>
            <p className="text-gray-400 text-sm">Compete for top seasonal rewards</p>
          </div>
        </div>
      </div>

      {/* "Ready to Battle" SECTION REMOVED */}
    </div>
  );
};

export default HomeContent;