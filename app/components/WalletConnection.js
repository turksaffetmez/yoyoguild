const WalletConnection = ({ 
  walletConnected, 
  userAddress, 
  points, 
  yoyoBalance, 
  onDisconnect, 
  onConnect, 
  isMobile,
  onShowWalletOptions 
}) => {
  if (!walletConnected) {
    return (
      <div className="text-center py-6">
        <div className="bg-yellow-100 p-4 rounded-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Cüzdan Bağlanmamış</h3>
          <button
            onClick={onConnect}
            className="bg-gradient-to-r from-indigo-600 to-green-500 hover:from-indigo-700 hover:to-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
          >
            Cüzdanı Bağla
          </button>
          {isMobile && (
            <button
              onClick={onShowWalletOptions}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors"
            >
              Diğer Seçenekler
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg flex justify-between items-center flex-wrap gap-4">
      <div>
        <p className="text-gray-700">
          <span className="font-semibold">Cüzdan:</span> {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
        </p>
        <p className="text-gray-700 mt-1">
          <span className="font-semibold">Puanlar:</span> <span className="text-indigo-600 font-bold text-xl">{points}</span>
        </p>
        {yoyoBalance > 0 ? (
          <p className="text-green-600 mt-1">
            <span className="font-semibold">YOYO Coin:</span> {yoyoBalance}
          </p>
        ) : (
          <p className="text-yellow-600 mt-1">
            <span className="font-semibold">YOYO Coin:</span> 0
          </p>
        )}
      </div>
      <button
        onClick={onDisconnect}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors"
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default WalletConnection;