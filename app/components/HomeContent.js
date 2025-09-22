const HomeContent = ({ walletConnected, yoyoBalance }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">YoYo Guild&apos;e Hoş Geldiniz!</h2>
      
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-indigo-800 mb-3">YoYo Guild Nedir?</h3>
        <p className="text-gray-700">
          YoYo Guild, blokzincir teknolojisi ve oyun mekaniklerini birleştiren yenilikçi bir topluluktur. 
          Guild üyeleri, TeVans karakterleriyle dövüşerek puan kazanır ve bu puanlarla çeşitli ödüller elde edebilirler.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-green-800 mb-3">YOYO Coin Avantajı</h3>
        <p className="text-gray-700">
          YOYO Coin&apos;e sahipseniz, oyunlarda kazanma şansınız %10 artar! 
          Daha fazla kazanmak için YOYO Coin edinin.
        </p>
        {walletConnected && yoyoBalance > 0 && (
          <div className="mt-3 p-3 bg-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              🎉 Tebrikler! {yoyoBalance} YOYO Coin&apos;iniz var. Kazanma şansınız %10 arttı!
            </p>
          </div>
        )}
        {walletConnected && yoyoBalance === 0 && (
          <div className="mt-3 p-3 bg-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold">
              ℹ️ YOYO Coin&apos;iniz yok. Kazanma şansınız %50. YOYO Coin alarak şansınızı %60&apos;a çıkarabilirsiniz!
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-orange-800 mb-3">Nasıl Çalışır?</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-2">
          <li>Cüzdanınızı bağlayın (MetaMask, Coinbase Wallet, vs.)</li>
          <li>Oyunlar sekmesine gidin</li>
		  <li>İki TeVans karakterinden birini seçin (%50 kazanma şansı)</li>  
          <li>YOYO Coin&apos;iniz varsa %60 şansla kazanın</li>
          <li>Kazandığınız puanları blockchain&apos;e kaydedin</li>
          <li>Liderlik tablosunda yükselin</li>
        </ol>
      </div>
    </div>
  );
};

export default HomeContent;