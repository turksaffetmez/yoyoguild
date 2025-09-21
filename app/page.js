"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./utils/contract"; // ← buradan alıyoruz

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [contract, setContract] = useState(null);

  async function connectWallet() {
    try {
      if (!window.ethereum) return alert("MetaMask yok!");

      // MetaMask ile cüzdan bağla
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);

      setContract(contractInstance);
      const address = await signer.getAddress();
      setUserAddress(address);
      setWalletConnected(true);

      console.log("✅ Cüzdan bağlandı:", address);
      console.log("Contract instance:", contractInstance);
      alert(`Cüzdan bağlandı: ${address}`);
    } catch (err) {
      console.error("Cüzdan bağlanamadı:", err);
      alert("Cüzdan bağlanamadı. Konsolu kontrol et.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">YoYo Guild - Connect Wallet Test</h1>

      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="text-center">
          <p className="mb-2">✅ Cüzdan Bağlandı!</p>
          <p>Adres: {userAddress}</p>
        </div>
      )}
    </main>
  );
}
