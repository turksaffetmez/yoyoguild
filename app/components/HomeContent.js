import Image from 'next/image';

const HomeContent = ({ 
  walletConnected, 
  yoyoBalanceAmount, 
  remainingGames,
  pointValues 
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          
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
            <p className="text-gray-400 text-sm">Compete for top global ranking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;