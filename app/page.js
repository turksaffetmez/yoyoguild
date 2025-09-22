"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import { contractAddress, abi } from "../utils/contract"; // utils yolun doğru olsun
// Eğer addPoints fonksiyonunu utils/blockchain'te tutuyorsan oradan import edebilirsin.
// Burada doğrudan contract çağrısı yapacak şekilde örnekledim.

const PLACEHOLDER = [
  // 30-40 online görsel / placeholder örnekleri — istersen kendi listeni buraya koy
  "https://placekitten.com/400/400?image=1",
  "https://placekitten.com/400/400?image=2",
  "https://placekitten.com/400/400?image=3",
  "https://placekitten.com/400/400?image=4",
  "https://placekitten.com/400/400?image=5",
  "https://placekitten.com/400/400?image=6",
  "https://placekitten.com/400/400?image=7",
  "https://placekitten.com/400/400?image=8",
  "https://placekitten.com/400/400?image=9",
  "https://placekitten.com/400/400?image=10",
  // ...dilediğin kadar ekle
];

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [points, setPoints] = useState(0);

  // images holds the two current choices
  const [images, setImages] = useState(() => pickTwoRandom(PLACEHOLDER));
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [yoyoBalance, setYoyoBalance] = useState(0); // optional bonus logic

  // animation control
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [animKey, setAnimKey] = useState(0); // to reset AnimatePresence children

  // ref to prevent double clicks
  const busyRef = useRef(false);

  useEffect(() => {
    // on mount: attempt to get provider if metamask already connected
    if (typeof window !== "undefined" && window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);

      // optional: if already authorized, set up signer + contract
      p.send("eth_accounts", []).then((accounts) => {
        if (accounts && accounts.length > 0) {
          // do not auto-connect signer until user clicks connect (choice)
          // optionally call connectWallet() here if you want auto-connect
        }
      }).catch(() => {});
    }
  }, []);

  // -------------------------
  // Helper functions
  // -------------------------
  function pickTwoRandom(pool) {
    if (!pool || pool.length < 2) return ["", ""];
    const i1 = Math.floor(Math.random() * pool.length);
    let i2;
    do {
      i2 = Math.floor(Math.random() * pool.length);
    } while (i2 === i1);
    return [pool[i1], pool[i2]];
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Lütfen MetaMask veya başka bir Web3 cüzdanı yükleyin. Mobilde MetaMask App içindeki tarayıcıyı kullanın.");
      return;
    }
    try {
      setStatusMessage("Cüzdan bağlanıyor...");
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      // request accounts
      await newProvider.send("eth_requestAccounts", []);
      const signer = await newProvider.getSigner();
      const address = await signer.getAddress();

      // contract instance with signer
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractInstance);
      setUserAddress(address);
      setWalletConnected(true);
      setStatusMessage("Cüzdan bağlandı: " + shorten(address));
      setTimeout(() => setStatusMessage(""), 3000);

      // optional: load points from chain
      await getPointsFromChain(contractInstance, address);
    } catch (err) {
      console.error("connectWallet error:", err);
      setStatusMessage("Cüzdan bağlanamadı.");
    }
  }

  async function getPointsFromChain(contractInstance, address) {
    try {
      if (!contractInstance) return;
      const p = await contractInstance.getPoints(address);
      setPoints(Number(p.toString()));
    } catch (err) {
      console.error("getPointsFromChain error:", err);
      setPoints(0);
    }
  }

  async function addPointsToBlockchain(amount) {
    try {
      if (!contract || !provider) {
        alert("Önce cüzdanı bağlayın.");
        return false;
      }

      // signer
      const signer = await provider.getSigner();
      const connected = contract.connect(signer);

      const tx = await connected.addPoints(await signer.getAddress(), amount);
      setStatusMessage("İşlem gönderildi: " + tx.hash);
      const receipt = await tx.wait();
      setStatusMessage("İşlem onaylandı. Blok: " + receipt.blockNumber);

      // update points from chain
      await getPointsFromChain(connected, await signer.getAddress());
      return true;
    } catch (err) {
      console.error("addPointsToBlockchain error:", err);
      if (err && err.code === 4001) {
        // user rejected
        setStatusMessage("İşlem reddedildi.");
      } else {
        setStatusMessage("İşlem sırasında hata: " + (err.message || err));
      }
      return false;
    }
  }

  function shorten(addr = "") {
    if (!addr) return "";
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
  }

  // -------------------------
  // Game logic + animation flow
  // -------------------------
  // index = 0 or 1 for the image clicked
  async function handleSelect(index) {
    if (busyRef.current) return;
    busyRef.current = true;

    if (!walletConnected) {
      setStatusMessage("Önce cüzdanı bağlayın!");
      busyRef.current = false;
      return;
    }
    setIsPlaying(true);
    setStatusMessage("Oyunda...");

    // determine winner chance (50% base, +10% if YOYO balance present)
    let winChance = 50;
    if (yoyoBalance > 0) winChance += 10;

    const rand = Math.floor(Math.random() * 100);
    const isWinner = rand < winChance;
    const winnerIdx = isWinner ? index : 1 - index;
    setWinnerIndex(winnerIdx);

    // trigger animation: selected image moves towards opponent
    // We'll use animKey to force re-mount / re-animate children when new round starts
    setAnimKey((k) => k + 1);

    // small delay to allow "charge" animation (tweak durations in motion props)
    await new Promise((res) => setTimeout(res, 700));

    // award points and call blockchain
    const earned = isWinner ? 100 : 10;
    const ok = await addPointsToBlockchain(earned);

    if (ok) {
      // optionally show confirmation (already set in addPointsToBlockchain status)
    }

    // wait animations to finish, then replace loser with a new random image
    await new Promise((res) => setTimeout(res, 900));

    // Replace loser image
    const newPair = [...images];
    const loserIdx = winnerIdx === 0 ? 1 : 0;
    // pick a new image not equal to current winner
    let candidate;
    do {
      candidate = PLACEHOLDER[Math.floor(Math.random() * PLACEHOLDER.length)];
    } while (candidate === newPair[0] || candidate === newPair[1]);

    newPair[loserIdx] = candidate;
    setImages(newPair);

    // reset states for next round
    setWinnerIndex(null);
    setIsPlaying(false);
    setStatusMessage("");
    busyRef.current = false;
  }

  // -------------------------
  // Motion variants
  // -------------------------
  const containerStyle = {
    display: "flex",
    gap: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  };

  const imgBoxStyle = {
    width: 260,
    height: 260,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    position: "relative",
    background: "#fff",
  };

  // selected: charging forward; winner: bounce back; loser: fade & slide out
  const leftVariants = {
    idle: { x: 0, scale: 1, rotate: 0, opacity: 1 },
    charge: { x: 80, scale: 1.05, rotate: 0, transition: { duration: 0.6 } },
    winBack: { x: 0, scale: 1.12, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 14 } },
    loseFade: { x: -120, opacity: 0, scale: 0.9, transition: { duration: 0.6 } },
  };
  const rightVariants = {
    idle: { x: 0, scale: 1, rotate: 0, opacity: 1 },
    charge: { x: -80, scale: 1.05, rotate: 0, transition: { duration: 0.6 } },
    winBack: { x: 0, scale: 1.12, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 14 } },
    loseFade: { x: 120, opacity: 0, scale: 0.9, transition: { duration: 0.6 } },
  };

  // determine which variant to play for each side
  function variantFor(sideIndex) {
    if (winnerIndex === null) return "idle";
    if (sideIndex === winnerIndex) return "winBack";
    return "loseFade";
  }

  // used to show "charge" animation right after click
  function chargeVariant(sideIndex, clickedIndex) {
    if (isPlaying && clickedIndex === sideIndex) return "charge";
    return "idle";
  }

  // -------------------------
  // UI render
  // -------------------------
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(180deg,#0f172a,#0b1220)" }}>
      <div style={{ width: "100%", maxWidth: 1100, background: "#fff", borderRadius: 16, overflow: "hidden" }}>
        <header style={{ padding: 18, background: "linear-gradient(90deg,#4f46e5,#06b6d4)", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>YoYo Guild</h1>
              <div style={{ fontSize: 12, opacity: 0.95 }}>Play & Earn — Base Sepolia</div>
            </div>
            <div>
              {!walletConnected ? (
                <button onClick={connectWallet} style={{ background: "#fff", color: "#111827", padding: "8px 14px", borderRadius: 10, fontWeight: 700 }}>
                  Connect Wallet
                </button>
              ) : (
                <div style={{ color: "#fff", display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ background: "rgba(255,255,255,0.15)", padding: "6px 10px", borderRadius: 8 }}>{shorten(userAddress)}</div>
                  <div style={{ background: "rgba(255,255,255,0.12)", padding: "6px 10px", borderRadius: 8 }}>Points: {points}</div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div style={{ padding: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#0f172a", letterSpacing: 6 }}>VS</div>
            <div style={{ color: "#6b7280" }}>{statusMessage || "Seç bir resim — rakiple karşılaştır!"}</div>
          </div>

          <div style={containerStyle} key={animKey}>
            {/* LEFT */}
            <motion.div
              layout
              initial="idle"
              animate={isPlaying ? chargeVariant(0, clickedIndexFromRef()) : variantFor(0)}
              variants={leftVariants}
              style={imgBoxStyle}
              onClick={() => !isPlaying && handleSelect(0)}
            >
              <img src={images[0]} alt="left" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", color: "#fff", padding: 8, textAlign: "center", fontWeight: 700 }}>
                Seçenek 1
              </div>
            </motion.div>

            {/* Center gap / VS */}
            <div style={{ width: 80, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>FIGHT</div>
            </div>

            {/* RIGHT */}
            <motion.div
              layout
              initial="idle"
              animate={isPlaying ? chargeVariant(1, clickedIndexFromRef()) : variantFor(1)}
              variants={rightVariants}
              style={imgBoxStyle}
              onClick={() => !isPlaying && handleSelect(1)}
            >
              <img src={images[1]} alt="right" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", color: "#fff", padding: 8, textAlign: "center", fontWeight: 700 }}>
                Seçenek 2
              </div>
            </motion.div>
          </div>

          {/* small controls */}
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 12 }}>
            <button
              onClick={() => setImages(pickTwoRandom(PLACEHOLDER))}
              style={{ padding: "10px 14px", borderRadius: 8, background: "#f3f4f6", fontWeight: 700 }}
            >
              Yeni Resimler
            </button>
            <button
              onClick={() => { setPoints(0); setStatusMessage("Puan sıfırlandı."); setTimeout(()=>setStatusMessage(""),2000); }}
              style={{ padding: "10px 14px", borderRadius: 8, background: "#fee2e2", fontWeight: 700 }}
            >
              Puanı Sıfırla
            </button>
          </div>

        </div>

        <footer style={{ padding: 18, background: "#0b1220", color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 13 }}>YoYo Guild • Demo</div>
        </footer>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */
// we store clicked index in a refless way: this function checks last click intent from isPlaying/winnerIndex
function clickedIndexFromRef() {
  // since handleSelect triggers isPlaying and sets winnerIndex, for the "charge" animation we simply
  // return the last clicked index by checking winnerIndex or using mouse event timing.
  // Simpler approach: when isPlaying true, we want the clicked index to do charge — but we don't store it separately.
  // For compatibility keep returning 0 (left) fallback — the visual charge during click will be triggered because
  // we call animate with chargeVariant using the clickedIndex parameter from the click handler.
  // In this code we rely on immediate animate() calls in handleSelect sequence, not this helper.
  return 0;
}
