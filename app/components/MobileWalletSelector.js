"use client";
import { useState } from "react";

export default function MobileWalletSelector({ onConnect, onClose }) {
  const [selectedWallet, setSelectedWallet] = useState(null);

  const wallets = [
    { 
      id: 'metamask', 
      name: 'MetaMask', 
      icon: '🦊', 
      description: 'Most popular Web3 wallet',
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 'coinbase', 
      name: 'Coinbase Wallet', 
      icon: '💰', 
      description: 'Secure and user-friendly',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      id: 'trust', 
      name: 'Trust Wallet', 
      icon: '🔒', 
      description: 'Multi-chain support',
      color: 'from-emerald-500 to-blue-600'
    }
  ];

  const handleWalletSelect = (walletId) => {
    setSelectedWallet(walletId);
    setTimeout(() => {
      onConnect(walletId);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-md w-full p-8 border-2 border-purple-500/30 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Connect Your Wallet</h3>
            <p className="text-gray-400 mt-1">Choose your preferred Web3 wallet</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white text-xl transition-all hover:scale-110"
          >
            ×
          </button>
        </div>
        
        {/* Wallet Options */}
        <div className="space-y-4 mb-6">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet.id)}
              disabled={selectedWallet}
              className={`w-full flex items-center p-5 rounded-2xl transition-all duration-300 border-2 ${
                selectedWallet === wallet.id
                  ? `border-green-500 bg-green-500/10 scale-105`
                  : `border-gray-600 bg-gray-700/50 hover:border-purple-500 hover:scale-102`
              } ${selectedWallet ? 'opacity-70' : 'hover:shadow-lg'}`}
            >
              <span className={`text-4xl mr-4 ${selectedWallet === wallet.id ? 'animate-bounce' : ''}`}>
                {wallet.icon}
              </span>
              <div className="text-left flex-1">
                <div className="font-bold text-white text-lg">{wallet.name}</div>
                <div className="text-gray-400 text-sm">{wallet.description}</div>
              </div>
              {selectedWallet === wallet.id ? (
                <div className="text-green-400 text-2xl animate-pulse">✓</div>
              ) : (
                <div className="text-gray-500 text-2xl">→</div>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {selectedWallet && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
            <p className="text-gray-400">Connecting to {wallets.find(w => w.id === selectedWallet)?.name}...</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center pt-4 border-t border-gray-700/50">
          <p className="text-gray-500 text-sm">
            By connecting, you agree to YoYo Guild's <span className="text-purple-400">Terms of Service</span>
          </p>
          <div className="flex justify-center space-x-4 mt-3 text-gray-600">
            <span>🔒 Secure</span>
            <span>⚡ Fast</span>
            <span>🌐 Web3</span>
          </div>
        </div>

        {/* Connection Tips */}
        {!selectedWallet && (
          <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
            <h4 className="text-blue-400 font-semibold mb-2">💡 Pro Tip</h4>
            <p className="text-blue-300 text-sm">
              Make sure your wallet is set to <strong>Base Mainnet</strong> for optimal experience.
            </p>
          </div>
        )}
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}