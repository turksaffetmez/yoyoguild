"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "../utils/contract";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [images, setImages] = useState([
    "https://placekitten.com/200/200?image=1",
    "https://placekitten.com/200/200?image=2",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask yok!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractInstance);
      const address = await signer.getAddress();
      setUserAddress(address);
      setWalletConnected(true);
      console.log("Cüzdan bağlandı:", address);
    } catch (err) {
      console.error("Cüzdan bağlanamadı:", err);
      alert("Cüzdan bağlanamadı. Konsolu kontrol et.");
    }
  }

  async function addPointsToBlockchain(amount) {
    if (!contract) return alert("Önce cüzdanı bağlayın!");
    try {
      const tx = await contract.addPoints(await contract.signer.getAddress(), amount);
      await tx.wait();
      console.log("Puan kaydedildi:", amount);
    } catch (err) {
      console.error("Hata:", err);
    }
  }

  async function selectImage(index) {
    if (!walletConnected) return alert("Önce cüzdanı bağlayın!");
    setIsLoading(true);

    // Rastgele kazanan belirle
    const winner = Math.floor(Math.random() * 2);
    const earnedPoints = winner === index ? 100 : 10;

    alert(winner === index ? "🎉 Kazandınız! +100 puan" : "😢 Kaybettiniz! +10 puan");

    // Frontend puanı güncelle
    setPoints(points + earnedPoints);

    // Blockchain’e kaydet
    await addPointsToBlockchain(earnedPoints);

    // Yeni resimler
    setImages([
      `https://placekitten.com/200/200?image=${Math.floor(Math.random() * 16)}`,
      `https://placekitten.com/200/200?image=${Math.floor(Math.random() * 16)}`,
    ]);

    setIsLoading(false);
  }

  return (
    <main className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">🎮 YoYo Guild Game</h1>

      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="mb-4">Cüzdan: {userAddress}</p>
          <p className="mb-4">Toplam Puan: {points}</p>

          <div className="flex gap-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Seçenek ${i + 1}`}
                className={`w-48 h-48 cursor-pointer border-4 border-gray-300 hover:border-blue-500 ${isLoading ? "opacity-50" : ""}`}
                onClick={() => !isLoading && selectImage(i)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}