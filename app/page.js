"use client";
import { useState } from "react";
import { ethers } from "ethers";

// Kontrat bilgileri
const contractAddress = "KONTRAT_ADRESİNİ_BURAYA_YAZ"; 
const abi = [ /* Remix’ten aldığın ABI buraya */ ];

export default function Home() {
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function connectContract() {
    if (!window.ethereum) return alert("MetaMask yok!");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  }

  async function addPointsToBlockchain(amount) {
    try {
      const contract = await connectContract();
      const tx = await contract.addPoints(await contract.signer.getAddress(), amount);
      await tx.wait();
      console.log(`✅ ${amount} puan kontrata kaydedildi!`);
    } catch (err) {
      console.error("❌ Puan kontrata kaydedilemedi:", err);
    }
  }

  async function playGame() {
    setIsLoading(true);

    // frontend puanını arttır
    const newPoints = points + 100; // örnek: her oyunda 100 puan
    setPoints(newPoints);

    // blockchain'e kaydet
    await addPointsToBlockchain(100);

    setIsLoading(false);
  }

  return (
    <main className="p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">🎮 YoYo Guild Game</h1>

      <button
        onClick={playGame}
        disabled={isLoading}
        className={`px-6 py-3 rounded-lg text-white ${
          isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "İşleniyor..." : "Oyunu Oyna ve Puan Kazan"}
      </button>

      <p className="mt-4 text-lg">Toplam Puan: {points}</p>
    </main>
  );
}
