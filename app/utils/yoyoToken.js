// YOYO Token utilities
import { ethers } from 'ethers';

// Base Mainnet YOYO Token Address
export const YOYO_TOKEN_ADDRESS = "0x4bDF5F3Ab4F894cD05Df2C3c43e30e1C4F6AfBC1";

// YOYO Token ABI (sadece gerekli fonksiyonlar)
export const YOYO_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// YOYO balance kontrolü
export const checkYoyoBalance = async (address, provider) => {
  try {
    const yoyoContract = new ethers.Contract(YOYO_TOKEN_ADDRESS, YOYO_TOKEN_ABI, provider);
    const balance = await yoyoContract.balanceOf(address);
    const decimals = await yoyoContract.decimals();
    const formattedBalance = Number(ethers.formatUnits(balance, decimals));
    return formattedBalance > 0;
  } catch (error) {
    console.error("YOYO balance check failed:", error);
    return false;
  }
};

// YOYO balance miktarını getir
export const getYoyoBalance = async (address, provider) => {
  try {
    const yoyoContract = new ethers.Contract(YOYO_TOKEN_ADDRESS, YOYO_TOKEN_ABI, provider);
    const balance = await yoyoContract.balanceOf(address);
    const decimals = await yoyoContract.decimals();
    return Number(ethers.formatUnits(balance, decimals));
  } catch (error) {
    console.error("YOYO balance get failed:", error);
    return 0;
  }
};

// YOYO token info
export const getYoyoTokenInfo = async (provider) => {
  try {
    const yoyoContract = new ethers.Contract(YOYO_TOKEN_ADDRESS, YOYO_TOKEN_ABI, provider);
    const symbol = await yoyoContract.symbol();
    const decimals = await yoyoContract.decimals();
    return { symbol, decimals };
  } catch (error) {
    console.error("YOYO token info failed:", error);
    return { symbol: "YOYO", decimals: 18 };
  }
};