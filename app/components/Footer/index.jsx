const Footer = ({
  gameStatus,
  handleRestart,
  points,
  handleChangeDifficulty,
}) => {
  const displayPoints = points < 0 ? 0 : points;

  return (
    <div className="font-start2p">
      <div className="flex gap-4 my-4 justify-center">
        {!["playing"].includes(gameStatus) && (
          <button
            onClick={handleRestart}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Restart again
          </button>
        )}
        {!["playing"].includes(gameStatus) && (
          <button
            onClick={handleChangeDifficulty}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
          >
            Change difficulty
          </button>
        )}
      </div>
      <div className="text-sm md:text-lg w-fit mx-auto  rounded-md bg-black text-white border border-black p-2 hover:bg-white hover:text-black">
        {gameStatus === "won" ? "Total Points" : "Remaining Points"}:{" "}
        {displayPoints}
      </div>
      {gameStatus === "playing" && (
        <div className="text-xs md:text-base font-extrabold mt-3 text-center text-red-800 animate-bounce">
          Note: You will lose once the point reaches 0
        </div>
      )}
    </div>
  );
};

export default Footer;
