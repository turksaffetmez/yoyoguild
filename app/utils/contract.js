export const contractAddress = "0x6f8c7b60425c683397993519ed0f95427af40baa";

export const abi = [
  {
    "inputs": [
      {"internalType": "address", "name": "_yoyoToken", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
      {"indexed": false, "internalType": "bool", "name": "won", "type": "bool"},
      {"indexed": false, "internalType": "uint256", "name": "points", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "GamePlayed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "currentSeason",
    "outputs": [
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "duration", "type": "uint256"},
      {"internalType": "uint256", "name": "seasonNumber", "type": "uint256"},
      {"internalType": "bool", "name": "active", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentSeasonLeaderboard",
    "outputs": [
      {"internalType": "address[]", "name": "", "type": "address[]"},
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSeasonTimeLeft",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "player", "type": "address"}],
    "name": "getPlayerInfo",
    "outputs": [
      {"internalType": "uint256", "name": "totalPoints", "type": "uint256"},
      {"internalType": "uint256", "name": "currentSeasonPoints", "type": "uint256"},
      {"internalType": "uint256", "name": "gamesPlayedToday", "type": "uint256"},
      {"internalType": "uint256", "name": "dailyLimit", "type": "uint256"},
      {"internalType": "uint256", "name": "season", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bool", "name": "win", "type": "bool"}],
    "name": "playGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];