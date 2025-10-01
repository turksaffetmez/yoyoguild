import { useState } from 'react';

const WalletConnection = ({
  pointValues
}) => {
  const [displayYoyoBalance] = useState(0);

  const showMaintenanceMessage = () => {
    alert("Wallet connection is under maintenance. It will be available soon.");
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 border border-slate-600 shadow-lg">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-4">Connect Your Wallet to Start Battling!</h3>
        
        <button
          onClick={showMaintenanceMessage}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 mb-3"
        >
          Connect Wallet
        </button>
        
        <p className="text-yellow-400 text-sm mt-2">
          ⚠️ Wallet connection under maintenance
        </p>

        <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-600 mt-4">
          <div className="text-center text-sm text-gray-300">
            <span className="font-semibold text-green-400">Point System: </span>
            <span>Win {pointValues.winNormal} points | </span>
            <span className="text-yellow-400">Win with YOYO {pointValues.winYoyo} points | </span>
            <span className="text-red-400">Lose {pointValues.lose} points</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;