/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { FaBomb, FaGem, FaGift } from "react-icons/fa";
import { Howl } from "howler";

const Floor = ({
  floorIndex,
  currentFloor,
  boxesPerFloor,
  handleBoxClick,
  difficulty,
  selectedBoxHistory,
  setSelectedBoxHistory,
  gameOver,
  onGameOver,
  onReset,
  bombSelect,
  isRevealing,
}) => {
  const gemSound = new Howl({
    src: ["/audio/success.mp3"], 
  });
  
  const bombSound = new Howl({
    src: ["/audio/bomb.mp3"], 
  });
  
  const selectionSound = new Howl({
    src: ["/audio/ting.mp3"],
  });
  const [boxIndices, setBoxIndices] = useState(
    Array.from({ length: boxesPerFloor }, (_, index) => index)
  );
  const [initialRandomization, setInitialRandomization] = useState(false);
  const [bombSelected, setBombSelected] = useState(false);
  const [chosenBoxes, setChosenBoxes] = useState(
    Array(boxesPerFloor).fill(false)
  );
  const [revealAll, setRevealAll] = useState(false);

  useEffect(() => {
    const randomizeBoxIndices = () => {
      const randomizedIndices = Array.from(
        { length: boxesPerFloor },
        (_, index) => index
      );
      for (let i = randomizedIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomizedIndices[i], randomizedIndices[j]] = [
          randomizedIndices[j],
          randomizedIndices[i],
        ];
      }
      setBoxIndices(randomizedIndices);
    };

    if (!initialRandomization || currentFloor === 1 || gameOver) {
      randomizeBoxIndices();
      setInitialRandomization(true);
      setBombSelected(false);
      setChosenBoxes(Array(boxesPerFloor).fill(false));
      setRevealAll(false);

      if (setSelectedBoxHistory) {
        setSelectedBoxHistory((prev) => ({
          ...prev,
          [floorIndex]: null,
        }));
      }
    }
  }, [
    boxesPerFloor,
    currentFloor,
    initialRandomization,
    gameOver,
    floorIndex,
    setSelectedBoxHistory,
  ]);

  const getGameParameters = () => {
    switch (difficulty) {
      case "normal":
        return { gems: 3, bombs: 1 };
      case "medium":
        return { gems: 2, bombs: 1 };
      case "hard":
        return { gems: 1, bombs: 2 };
      case "impossible":
        return { gems: 1, bombs: 3 };
      default:
        return { gems: 0, bombs: 0 };
    }
  };

  const { gems: numGems } = getGameParameters();

  const handleClick = (boxIndex, boxValue) => {
    if (boxValue === 0) {
      setBombSelected(true);
      setRevealAll(true); 
      bombSound.play();

      if (onGameOver) {
        onGameOver();
      }
      setTimeout(() => {
        if (onReset) {
          onReset();
        }
        setRevealAll(false);
      }, 2000);
    } else if (boxValue === 1) {
      gemSound.play();
      setSelectedBoxHistory((prev) => ({
        ...prev,
        [floorIndex]: boxIndex,
      }));
    }else {
      selectionSound.play();
    }

    handleBoxClick(floorIndex, boxValue);
    const updatedChosenBoxes = [...chosenBoxes];
    updatedChosenBoxes[boxIndex] = true;
    setChosenBoxes(updatedChosenBoxes);
  };

  if (!boxesPerFloor || boxesPerFloor <= 0) {
    return <div>Invalid floor configuration</div>;
  }

  return (
    <div className="flex justify-between items-center shadow-2xl rounded-lg transition-all max-md:gap-4 duration-300 py-2">
      <div className="text-xs mb-2 mx-2 mt-4 font-start2p gap-2 flex">Floor <span className="text-red-600 animate-pulse">'{floorIndex + 1}'</span></div>
      {boxIndices.map((boxIndex) => {
        let boxValue = boxIndex < numGems ? 1 : 0;
        let content =
          boxValue === 0 ? (
            <FaBomb size={28} className="text-black" />
          ) : (
            <FaGem size={28} className="text-sky-500" />
          );

        const isCurrentFloor = currentFloor === floorIndex + 1;
        const wasGemSelected =
          selectedBoxHistory[floorIndex] === boxIndex && boxValue === 1;
        const shouldReveal =
          chosenBoxes[boxIndex] ||
          currentFloor > floorIndex + 1 ||
          (bombSelected && isCurrentFloor) ||
          isRevealing;

        return (
          <div
            key={boxIndex}
            className={`h-10 w-20 flex items-center justify-center rounded-lg 
              ${
                isCurrentFloor && !bombSelected
                  ? "bg-slate-800 transform shadow-md cursor-pointer"
                  : wasGemSelected
                  ? "bg-red-300 ring-2 ring-red-500"
                  : bombSelected && boxValue === 0
                  ? "bg-red-500"
                  : currentFloor > floorIndex + 1
                  ? "bg-gray-200"
                  : "bg-gray-800 opacity-50"
              }
              ${
                isRevealing
                  ? "transition-all duration-500"
                  : "transition-all duration-100"
              }
              `}
            onClick={
              isCurrentFloor && !bombSelected && !isRevealing
                ? () => handleClick(boxIndex, boxValue)
                : null
            }
          >
            {shouldReveal ? (
              content
            ) : (
              <div className="transform transition-all duration-300 hover:scale-110">
                    <FaGift size={28} className="text-rose-500" />
                  </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Floor;
