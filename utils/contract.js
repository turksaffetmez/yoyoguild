// Kontrat adresini kendi Remix’te deploy ettiğin adres ile değiştir!
export const contractAddress = "0xbd6b6feb5d0e00c30fe0adbc6d0205653e594a6f";

export const abi = [
  {
    "inputs": [
      { "internalType": "address", "name": "player", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "addPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "player", "type": "address" }
    ],
    "name": "getPoints",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "pointsEarned", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalPoints", "type": "uint256" }
    ],
    "name": "Played",
    "type": "event"
  }
];
