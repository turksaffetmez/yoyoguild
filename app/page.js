"use client";

import { useState } from "react";

// Geçici çevrimiçi resim URL'leri
const images = [
  "https://via.placeholder.com/150/FF0000?text=1",
  "https://via.placeholder.com/150/00FF00?text=2",
  "https://via.placeholder.com/150/0000FF?text=3",
  "https://via.placeholder.com/150/FFFF00?text=4",
  // … diğer URL'ler
];

export default function Page() {
  const [points, setPoints] = useState(0);
  const [plays, setPlays] = useState(50);
  const [choice, setChoice] = useState(null);
  const [result, setResult] = useState("");
  const [currentImages, setCurrentImages] = useState([images[0], images[1]]);

  const newImages = () => {
    let idx1 = Math.floor(Math.random() * images.length);
    let idx2;
    do {
      idx2 = Math.floor(Math.random() * images.length);
    } while (idx2 === idx1);
    setCurrentImages([images[idx1], images[idx2]]);
  };

  const playGame = () => {
    if (choice === null) return alert("Select an image first!");
    if (plays <= 0) return alert("No plays left today!");

    const winningIndex = Math.floor(Math.random() * 2);
    if (choice === winningIndex) {
      setPoints(points + 100);
      setResult("You won! +100 points 🎉");
    } else {
      setPoints(points + 10);
      setResult("You lost! +10 points 😅");
    }

    setPlays(plays - 1);
    setChoice(null);
    newImages();
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>YoYo Guild Game</h1>
      <p>Points: {points}</p>
      <p>Remaining Plays: {plays}</p>
      <p>{result}</p>
      <div>
        <img
          src={currentImages[0]}
          alt="Option 1"
          style={{ width: 150, height: 150, cursor: "pointer", margin: 10 }}
          onClick={() => setChoice(0)}
        />
        <img
          src={currentImages[1]}
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
