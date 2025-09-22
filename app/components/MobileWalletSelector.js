const MobileWalletSelector = ({ onConnect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Cüzdan Seçin</h3>
        <p className="text-gray-600 mb-4">Oyunu oynamak için bir cüzdan uygulaması seçin:</p>
        
        <div className="space-y-3">
          <button
            onClick={() => onConnect('metamask')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="mr-2">🦊</span> MetaMask ile Bağlan
          </button>
          
          <button
            onClick={() => onConnect('coinbase')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="mr-2">🔵</span> Coinbase Wallet ile Bağlan
          </button>
          
          <button
            onClick={() => onConnect('trust')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="mr-2">🔷</span> Trust Wallet ile Bağlan
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
        >
          İptal
        </button>
      </div>
    </div>
  );
};

export default MobileWalletSelector;