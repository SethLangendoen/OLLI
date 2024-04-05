import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import SnNavBar from "../NavBars/SnNavBar";
import useSpeechSynthesis from '../HomeComponents/Helpers/TextToSpeech';
import "./snPage.css"; // Import the CSS file

export default function HomePage({ user }) {
  const navigate = useNavigate(); // Initialize navigate function
  const Speak = useSpeechSynthesis();
  const handleGameClick = (gameName) => {

    // Handle click event for each game button
    console.log(`Clicked on ${gameName}`);

    // Check if the clicked game is Tetris, then navigate to "/tetris"
    if (gameName === "Tetris") {
      navigate("/tetris");
    }
  };

  return (
    <div>
      <SnNavBar user={user} />
      <div className="game-container">
        <h2>Games</h2>
        <div className="gameBtn-container">
          <button id="tetrisBtn" className="gameBtn" onClick={() => handleGameClick("Tetris")} onMouseOver={() => { Speak('Tetris') }}>
            Tetris
          </button>

        </div>
      </div>
    </div>
  );
}
