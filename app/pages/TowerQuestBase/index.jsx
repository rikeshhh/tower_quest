/** @format */

"use client";
import { useState, useEffect, useRef } from "react";
import DialogBox from "../../components/PopupModal";
import Floor from "../../components/Floor";
import Header from "../../components/Header";
import { toast } from "react-hot-toast";
import Footer from "../../components/Footer";
import AutoPlayControls from "../../components/Autoplay";
import Message from "../../components/Message";

const Game = () => {
  const [bombSelected, setBombSelected] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [totalFloors, setTotalFloors] = useState(8);
  const [boxesPerFloor, setBoxesPerFloor] = useState(3);
  const [gameStatus, setGameStatus] = useState("playing");
  const [currentFloor, setCurrentFloor] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [roundsToPlay, setRoundsToPlay] = useState(5);
  const [points, setPoints] = useState(50);
  const [selectedBoxHistory, setSelectedBoxHistory] = useState({});
  const [resetKey, setResetKey] = useState(0);

  const gemWin = new Howl({
    src: ["/audio/win.mp3"],
  });
  const bombLoss = new Howl({
    src: ["/audio/lose.mp3"],
  });
  useEffect(() => {
    let newTotalFloors = 8;
    let newBoxesPerFloor = 3;
    switch (difficultyLevel) {
      case "normal":
        newBoxesPerFloor = 4;
        break;
      case "medium":
        newBoxesPerFloor = 3;
        break;
      case "hard":
        newBoxesPerFloor = 3;
        break;
      case "impossible":
        newBoxesPerFloor = 4;
        break;
      default:
        break;
    }
    setTotalFloors(newTotalFloors);
    setBoxesPerFloor(newBoxesPerFloor);
  }, [difficultyLevel]);

  const handleBoxClick = (floorIndex, boxValue) => {
    if (gameStatus !== "playing" || floorIndex + 1 !== currentFloor) return;
    toast.dismiss();

    if (boxValue === 1) {
      if (currentFloor === totalFloors) {
        setGameStatus("won");
        gemWin.play();
        setAutoPlay(false);
      } else {
        setCurrentFloor(currentFloor + 1);
      }
    } else {
      setBombSelected(true);
      setIsRevealing(true);
      setPoints(points - 15);
      bombLoss.play();
      setTimeout(() => {
        if (points - 15 <= 0) {
          setGameStatus("lost");
          setAutoPlay(false);
        } else {
          toast("Ops! That's a bomb 😭", {
            icon: "💣",
          });

          setGameStatus("playing");
          setCurrentFloor(1);
          setRoundsToPlay(5);
          setBombSelected(false);
          setIsRevealing(false);
          setSelectedBoxHistory({});
          setResetKey((prevKey) => prevKey + 1);
          bombLoss.play();
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (autoPlay && roundsToPlay > 0 && gameStatus === "playing") {
      const timeout = setTimeout(() => {
        let boxValue;
        switch (difficultyLevel) {
          case "normal":
            boxValue = Math.random() < 0.95 ? 1 : 0;
            break;
          case "medium":
            boxValue = Math.random() < 0.75 ? 1 : 0;
            break;
          case "hard":
            boxValue = Math.random() < 0.55 ? 1 : 0;
            break;
          case "impossible":
            boxValue = Math.random() < 0.15 ? 1 : 0;
            break;
          default:
            boxValue = Math.random() < 0.5 ? 0 : 1;
            break;
        }
        handleBoxClick(currentFloor - 1, boxValue);
        setRoundsToPlay(roundsToPlay - 1);
        if (roundsToPlay === 1 || gameStatus !== "playing") {
          setAutoPlay(false);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [
    autoPlay,
    roundsToPlay,
    gameStatus,
    currentFloor,
    handleBoxClick,
    difficultyLevel,
  ]);

  const handleStartAutoPlay = () => {
    if (roundsToPlay > 0 && gameStatus === "playing") {
      setAutoPlay(true);
    }
  };

  const handleStopAutoPlay = () => {
    setAutoPlay(false);
  };

  const handleChangeDifficulty = () => {
    window.location.reload();
  };

  const handleRestart = () => {
    setGameStatus("playing");
    setCurrentFloor(1);
    setPoints(30);
  };

  const handleGameActivation = () => {
    const activationCost = 20;
    if (points >= activationCost) {
      setPoints(points - activationCost);
      setGameStarted(true);
    } else {
      alert("Not enough points to activate the game.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full md:h-screen ">
      {!gameStarted && (
        <DialogBox
          setDifficultyLevel={setDifficultyLevel}
          setGameStarted={handleGameActivation}
        />
      )}
      {gameStarted && (
        <div className="shadow-2xl p-6 rounded-lg bg-slate-700 text-white">
          <Header difficultyLevel={difficultyLevel} />
          <div className="grid grid-cols-1 gap-4 place-content-center">
            {Array.from({ length: totalFloors }).map(
              (_, floorIndex) =>
                gameStatus === "playing" && (
                  <Floor
                    key={`${resetKey}-${floorIndex}`}
                    floorIndex={floorIndex}
                    currentFloor={currentFloor}
                    boxesPerFloor={boxesPerFloor}
                    handleBoxClick={handleBoxClick}
                    difficulty={difficultyLevel}
                    selectedBoxHistory={selectedBoxHistory}
                    setSelectedBoxHistory={setSelectedBoxHistory}
                    bombSelected={bombSelected}
                    isRevealing={isRevealing}
                  />
                )
            )}
          </div>
          {gameStatus === "won" && (
            <div className="text-xl text-green-600">
              Congratulations! You've reached the top!
            </div>
          )}
          <Message gameStatus={gameStatus} difficultyLevel={difficultyLevel} />
          <AutoPlayControls
            handleStartAutoPlay={handleStartAutoPlay}
            handleStopAutoPlay={handleStopAutoPlay}
            roundsToPlay={roundsToPlay}
            setRoundsToPlay={setRoundsToPlay}
            autoPlay={autoPlay}
            gameStatus={gameStatus}
          />
          <Footer
            gameStatus={gameStatus}
            handleRestart={handleRestart}
            handleChangeDifficulty={handleChangeDifficulty}
            points={points}
            difficultyLevel={difficultyLevel}
          />
        </div>
      )}
    </div>
  );
};

export default Game;
