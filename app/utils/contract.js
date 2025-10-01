export const contractAddress = "0x9e3e2978cfc8e35ac574ecffa8371439ddc4397a";

export const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_yoyoToken",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "won",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "points",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalGames",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalWins",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "winStreak",
                "type": "uint256"
            }
        ],
        "name": "GamePlayed",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "DAILY_LIMIT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "LOSE_POINTS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WIN_POINTS_NORMAL",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WIN_POINTS_YOYO",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLeaderboard",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPointValues",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "name": "getPlayerInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalPoints",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "gamesPlayedToday",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "dailyLimit",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "hasYoyoBoost",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "totalGames",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalWins",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalLosses",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "winStreak",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxWinStreak",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "winRate",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTopPlayers",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "playGame",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];