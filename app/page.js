"use client";
import { useState } from "react";
import { addPointsToBlockchain, getPointsFromBlockchain } from "./utils/blockchain";

export default function Home() {
  const [points, setPoints] = useState(0);
  const [address, setAddress] = useState("");

  async function playGame() {
    try {
      // Önce cüzdan adresini alalım
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const player = accounts[0];
      setAddress(player);

      // Oyunda puan ekle (örnek: 100 puan)
      await addPointsToBlockchain(100);

      // Güncel puanı blockchain'den al
      const newPoints = await getPointsFromBlockchain(player);
      setPoints(newPoints);
    } catch (err) {
      console.error("Oyun hatası:", err);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">🎮 YoYo Guild Game</h1>
      
      <button
        onClick={playGame}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Oyna ve 100 Puan Kazan
      </button>

      {address && (
        <div className="mt-6 text-lg">
          <p><strong>Cüzdan:</strong> {address}</p>
          <p><strong>Toplam Puan:</strong> {points}</p>
        </div>
      )}
    </main>
  );
}
