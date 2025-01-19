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

  const backgroundMusic = new Howl({
    src: ["/audio/background-music.mp3"],
    loop: true,
  });
  const gemWin = new Howl({
    src: ["/audio/win.mp3"],
  });
  const bombLoss = new Howl({
    src: ["/audio/lose.mp3"],
  });

  const handleBoxClick = (floorIndex, boxValue, selectedBoxIndex) => {
    if (gameStatus !== "playing" || floorIndex + 1 !== currentFloor) return;

    toast.dismiss();

    setSelectedBoxHistory((prevHistory) => ({
      ...prevHistory,
      [floorIndex]: selectedBoxIndex,
    }));

    if (boxValue === 1) {
      if (currentFloor === totalFloors) {
        setGameStatus("won");
        setAutoPlay(false);
        gemWin.play();
      } else {
        setCurrentFloor(currentFloor + 1);
        switch (difficultyLevel) {
          case "normal":
            toast("You've found 💎");
            setBoxesPerFloor(4);
            setPoints(points + 10);
            break;
          case "medium":
            toast("You've found 💎");
            setBoxesPerFloor(3);
            setPoints(points + 10);
            break;
          case "hard":
            toast("You've found 💎");
            setBoxesPerFloor(3);
            setPoints(points + 5);
            break;
          case "impossible":
            toast("You've found 💎");
            setBoxesPerFloor(4);
            setPoints(points + 5);
            break;
          default:
            break;
        }
      }
    } else {
      setBombSelected(true);
      setIsRevealing(true);
      setAutoPlay(false);
      bombLoss.play();
      const newPoints = points - 15;
      setPoints(newPoints);
      setTimeout(() => {
        if (newPoints <= 0) {
          setGameStatus("lost");
        } else {
          toast("Ops! That's a bomb 😭", {
            icon: "💣",
          });
          setTimeout(() => {
            setGameStatus("playing");
            setCurrentFloor(1);
            setRoundsToPlay(5);
            setBombSelected(false);
            setIsRevealing(false);
            setSelectedBoxHistory({});
            setResetKey((prevKey) => prevKey + 1);
          }, 2000);
        }
      }, 1000);
    }
  };

  const handleStartAutoPlay = () => {
    if (
      roundsToPlay > 0 &&
      gameStatus === "playing" &&
      !bombSelected &&
      !isRevealing
    ) {
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
    setSelectedBoxHistory({});
    setRoundsToPlay(5);
    setBombSelected(false);
    setIsRevealing(false);
    setAutoPlay(false); 
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

  useEffect(() => {
    backgroundMusic.play();
    return () => {
      backgroundMusic.stop();
    };
  }, []);

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

  useEffect(() => {
    if (
      autoPlay &&
      roundsToPlay > 0 &&
      gameStatus === "playing" &&
      !bombSelected &&
      !isRevealing
    ) {
      const timeout = setTimeout(() => {
        let successProbability;
        switch (difficultyLevel) {
          case "normal":
            successProbability = 0.95;
            break;
          case "medium":
            successProbability = 0.75;
            break;
          case "hard":
            successProbability = 0.55;
            break;
          case "impossible":
            successProbability = 0.15;
            break;
          default:
            successProbability = 0.5;
        }

        const selectedBoxIndex = Math.floor(Math.random() * boxesPerFloor);
        const isSuccessful = Math.random() < successProbability;
        setSelectedBoxHistory((prevHistory) => ({
          ...prevHistory,
          [currentFloor - 1]: selectedBoxIndex,
        }));
        handleBoxClick(
          currentFloor - 1,
          isSuccessful ? 1 : 0,
          selectedBoxIndex
        );
        if (isSuccessful && !bombSelected) {
          setRoundsToPlay((prev) => prev - 1);
        }
        if (roundsToPlay === 1) {
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
    difficultyLevel,
    boxesPerFloor,
    bombSelected,
    isRevealing,
  ]);

  return (
    <div className="flex flex-col items-center justify-center max-md:px-4 h-screen ">
      {!gameStarted && (
        <DialogBox
          setDifficultyLevel={setDifficultyLevel}
          setGameStarted={handleGameActivation}
        />
      )}
      {gameStarted && (
        <div className="shadow-2xl p-6 rounded-lg bg-slate-700 text-white font-start2p">
          <Header difficultyLevel={difficultyLevel} />
          <div className="flex flex-col-reverse max-md:max-w-[340px] gap-4 place-content-center">
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
            <div className="text-xl text-green-600 text-center">
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
