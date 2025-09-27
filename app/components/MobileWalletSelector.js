const MobileWalletSelector = ({ onConnect, onClose }) => {
  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Most popular Ethereum wallet'
    },
    {
      id: 'rabby', 
      name: 'Rabby Wallet',
      icon: '🐰',
      description: 'Multi-chain DeFi wallet'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '💰',
      description: 'Secure and easy to use'
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      icon: '🔒',
      description: 'Multi-chain mobile wallet'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 max-w-md w-full border-2 border-purple-500/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Select Wallet</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-300 mb-6 text-center">
          Choose your wallet to connect to YoYo Guild Battle
        </p>
        
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => onConnect(wallet.id)}
              className="w-full bg-gray-700 hover:bg-gray-600 rounded-xl p-4 flex items-center space-x-4 transition-all transform hover:scale-105"
            >
              <div className="text-3xl">{wallet.icon}</div>
              <div className="text-left">
                <div className="font-semibold text-white">{wallet.name}</div>
                <div className="text-sm text-gray-400">{wallet.description}</div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <p className="text-yellow-400 text-sm text-center">
            Make sure your wallet is installed and set to Base network
          </p>
          <p className="text-blue-400 text-xs text-center mt-1">
            Rabby users: Ensure Base network is added
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileWalletSelector;