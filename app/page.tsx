"use client";

import { useState } from "react";

export default function Page() {
  const [points, setPoints] = useState(0);
  const [plays, setPlays] = useState(50);
  const [choice, setChoice] = useState<number | null>(null);
  const [result, setResult] = useState("");

  const playGame = () => {
    if (choice === null) return alert("Select an image first!");
    if (plays <= 0) return alert("No plays left today!");

    const blockchainChoice = Math.floor(Math.random() * 2);
    if (choice === blockchainChoice) {
      setPoints(points + 100);
      setResult("You won! +100 points");
    } else {
      setPoints(points + 10);
      setResult("You lost! +10 points");
    }
    setPlays(plays - 1);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>YoYo Guild Game</h1>
      <p>Points: {points}</p>
      <p>Remaining Plays: {plays}</p>
      <p>{result}</p>
      <div>
        <img
          src="https://via.placeholder.com/150/FF0000/FFFFFF?text=Image+1"
          alt="Option 1"
          style={{ width: 150, height: 150, cursor: "pointer", margin: 10 }}
          onClick={() => setChoice(0)}
        />
        <img
          src="https://via.placeholder.com/150/0000FF/FFFFFF?text=Image+2"
          alt="Option 2"
          style={{ width: 150, height: 150, cursor: "pointer", margin: 10 }}
          onClick={() => setChoice(1)}
        />
      </div>
      <br />
      <button onClick={playGame}>Play Game</button>
    </div>
  );
}
