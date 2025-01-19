import React from 'react';

const AutoPlayControls = ({
  handleStartAutoPlay,
  handleStopAutoPlay,
  roundsToPlay,
  setRoundsToPlay,
  autoPlay,
  gameStatus,
}) => {
  const handleRoundsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setRoundsToPlay(value);
    }
  };

  if (gameStatus !== "playing") {
    return;
  }

  return (
    <div className="flex flex-wrap font-start2p gap-4 justify-center items-center mt-5 -mb-4 max-md:text-xs">
      <button
        onClick={handleStartAutoPlay}
        className={`transition-colors duration-200 py-2 px-4 rounded-lg text-white
          ${roundsToPlay > 0 && gameStatus === "playing" && !autoPlay
            ? "bg-red-400 hover:bg-red-500 active:bg-red-600"
            : "bg-gray-400 cursor-not-allowed"
          }`}
        disabled={roundsToPlay === 0 || gameStatus !== "playing" || autoPlay}
      >
        Start Auto-Play ({roundsToPlay || 0} rounds left)
      </button>
      
      {autoPlay && (
        <button
          onClick={handleStopAutoPlay}
          className="transition-colors duration-200 bg-red-500 hover:bg-red-600 
            active:bg-red-700 text-white py-2 px-4 rounded-lg"
        >
          Stop Auto-Play
        </button>
      )}
      
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max="100"
          value={roundsToPlay}
          onChange={handleRoundsChange}
          disabled={autoPlay}
          className={`border rounded-lg p-2 text-center w-20 text-black
            ${autoPlay 
              ? "bg-gray-100 cursor-not-allowed" 
              : "border-gray-300 hover:border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            }`}
        />
        <span>rounds</span>
      </div>
    </div>
  );
};

export default AutoPlayControls;