"use client"; // Mutlaka en üstte olmalı

import { useState } from "react";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask yok!");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletConnected(true);
      alert("Cüzdan bağlandı!");
    } catch (err) {
      console.error("Cüzdan bağlanamadı:", err);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      {!walletConnected ? (
        <button
          onClick={connectWallet}
          style={{
            backgroundColor: "#1D4ED8",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <p>✅ Cüzdan Bağlandı!</p>
      )}
    </main>
  );
}