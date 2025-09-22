const Leaderboard = ({ leaderboard }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">Liderlik Tablosu - Top 10</h2>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="grid grid-cols-3 bg-indigo-100 text-indigo-800 font-semibold p-4">
          <div>Sıra</div>
          <div>Cüzdan Adresi</div>
          <div className="text-right">Puan</div>
        </div>
        
        <div className="divide-y">
          {leaderboard.map((player) => (
            <div key={player.rank} className="grid grid-cols-3 p-4 hover:bg-gray-50">
              <div className="font-medium">#{player.rank}</div>
              <div className="truncate">
                {player.address.substring(0, 6)}...{player.address.substring(player.address.length - 4)}
              </div>
              <div className="text-right font-semibold">{player.points.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>Liderlik tablosu gerçek zamanlı olarak blockchain&apos;den güncellenmektedir.</p>
      </div>
    </div>
  );
};

export default Leaderboard;