import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const GameBoard = ({ 
  walletConnected, 
  gameState, 
  yoyoBalance, 
  points, 
  onStartGame, 
  onConnectWallet, 
  isMobile,
  onShowWalletOptions 
}) => {
  
  const imageVariants = {
    idle: { scale: 1, x: 0, opacity: 1 },
    selected: { scale: 1.1, x: 0, opacity: 1 },
    attacking: (custom) => ({
      x: custom.direction * 50,
      scale: 1.2,
      transition: { duration: 0.5 }
    }),
    winning: { 
      scale: 1.3, 
      rotate: 360,
      transition: { duration: 1 }
    },
    losing: { 
      scale: 0.5, 
      opacity: 0,
      x: -100,
      transition: { duration: 1 }
    }
  };

  if (!walletConnected) {
    return (
      <div className="text-center py-10">
        <div className="bg-yellow-100 p-6 rounded-xl max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-yellow-800 mb-4">Oyun Oynamak İçin Cüzdan Bağlayın</h3>
          <button
            onClick={onConnectWallet}
            className="bg-gradient-to-r from-indigo-600 to-green-500 hover:from-indigo-700 hover:to-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 mb-3"
          >
            Cüzdanı Bağla
          </button>
          {isMobile && (
            <>
              <p className="text-sm text-yellow-700 mb-2">📱 Mobil cihazınızda cüzdan bağlamak için:</p>
              <button
                onClick={onShowWalletOptions}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-sm"
              >
                Diğer Cüzdan Seçenekleri
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center text-indigo-700">Dövüş Arenası</h2>
      
      <div className="bg-indigo-100 p-4 rounded-lg text-center">
        <p className="text-indigo-800 font-semibold">Toplam Puanınız: <span className="text-2xl">{points}</span></p>
        {yoyoBalance > 0 ? (
          <p className="text-green-600 mt-1">
            🎉 {yoyoBalance} YOYO Coin&apos;iniz var! Kazanma şansınız: <span className="font-bold">%60</span>
          </p>
        ) : (
          <p className="text-yellow-600 mt-1">
            ℹ️ YOYO Coin&apos;iniz yok. Kazanma şansınız: <span className="font-bold">%50</span>
          </p>
        )}
      </div>
      
      <div className="flex justify-center items-center gap-8 relative min-h-80">
        <AnimatePresence mode="wait">
          {gameState.images.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative cursor-pointer"
              variants={imageVariants}
              initial="idle"
              animate={
                gameState.gamePhase === "selecting" && gameState.selectedImage === index ? "selected" :
                gameState.gamePhase === "fighting" ? 
                  (index === gameState.selectedImage ? 
                    { x: index === 0 ? 50 : -50, scale: 1.2 } : 
                    { x: index === 0 ? -20 : 20, scale: 0.9 }
                  ) :
                gameState.gamePhase === "result" ?
                  (index === gameState.winnerIndex ? "winning" : "losing") :
                "idle"
              }
              transition={{ duration: 0.5 }}
              whileHover={gameState.gamePhase === "idle" ? { scale: 1.05 } : {}}
              onClick={() => gameState.gamePhase === "idle" && !gameState.isLoading && onStartGame(index)}
            >
              <Image
                src={image.url}
                alt={`TeVans ${index + 1}`}  {/* Alt text güncellendi */}
                width={200}
                height={200}
                className="rounded-xl shadow-lg border-4 border-gray-300"
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                TeVans {index + 1}  {/* Başlık güncellendi */}
              </div>
              {gameState.gamePhase === "selecting" && gameState.selectedImage === index && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  Seçildi!
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text">
            VS
          </span>
        </motion.div>

        {gameState.gamePhase !== "idle" && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
            {gameState.gamePhase === "selecting" && "🔄 TeVans seçiliyor..."}  {/* Text güncellendi */}
            {gameState.gamePhase === "waiting" && "⏳ Blockchain onayı bekleniyor..."}
            {gameState.gamePhase === "fighting" && "⚔️ Dövüş devam ediyor!"}
            {gameState.gamePhase === "result" && "🎯 Sonuç belirleniyor..."}
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-gray-600">Bir TeVans seçin ve kazanıp kazanmadığınızı görün!</p>  {/* Text güncellendi */}
        <p className="text-sm text-gray-500 mt-1">
          {yoyoBalance > 0 ? 'Kazanma şansınız: %60' : 'Kazanma şansınız: %50'}
        </p>
        {gameState.gamePhase === "idle" && !gameState.isLoading && (
          <p className="text-xs text-gray-400 mt-2">TeVans&apos;ların üzerine tıklayarak seçim yapın</p>  {/* Text güncellendi */}
        )}
      </div>
    </div>
  );
};

export default GameBoard;