"use client";
import { useState, useEffect } from "react";

export default function WalletConnection({
  walletConnected,
  userAddress,
  points,
  yoyoBalance,
  onDisconnect,
  onConnect,
  isMobile,
  onShowWalletOptions,
  remainingGames
}) {
  const [isCopied, setIsCopied] = useState(false);

  const formatAddress = (address) => {
    if (!address) return "Not Connected";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (userAddress) {
      await navigator.clipboard.writeText(userAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-3xl p-6 shadow-2xl border-2 border-purple-500/20 mb-8 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
        
        {/* Connection Status */}
        <div className="flex items-center space-x-4">
          <div className={`relative w-4 h-4 rounded-full ${walletConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}>
            <div className={`absolute inset-0 rounded-full ${walletConnected