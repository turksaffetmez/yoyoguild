import { ethers } from "ethers";
import { contractAddress, abi } from "./contract";

export async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask yok!");
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  return contract;
}

export async function addPointsToBlockchain(amount) {
  const contract = await connectWallet();
  const tx = await contract.addPoints(await contract.signer.getAddress(), amount);
  await tx.wait();
  console.log("Points added:", amount);
}

export async function getPointsFromBlockchain(player) {
  const contract = await connectWallet();
  const points = await contract.getPoints(player);
  return points.toString();
}
