import Image from 'next/image';

const HomeContent = ({ 
  walletConnected, 
  yoyoBalanceAmount, 
  remainingGames,
  pointValues,
  playerStats 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Image src="/images/yoyo.png" alt="YoYo Guild" width={100} height={100} className="rounded-full" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Welcome to YoYo Guild Battle</h2>
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
        
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 mt-6 border border-purple-500/30 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-2">🎯 Point System</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">{pointValues.winNormal} Points</div>
              <div className="text-gray-300">Normal Win</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg">{pointValues.winYoyo} Points</div>
              <div className="text-gray-300">Win with YOYO</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-bold text-lg">{pointValues.lose} Points</div>
              <div className="text-gray-300">Lose</div>
            </div>
          </div>
        </div>

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
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">Global Ranking</h3>
          <p className="text-gray-300">
            Compete for eternal glory in the all-time leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;