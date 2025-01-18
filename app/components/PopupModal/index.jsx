/** @format */

"use client";
import { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { IoIosInformationCircle } from "react-icons/io";
import { Tooltip } from "react-tooltip";

const DialogBox = ({ setDifficultyLevel, setGameStarted }) => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onCloseModal = () => {
    setOpen(false);
    setGameStarted(true);
  };

  const handleDifficultyLevelSelect = (difficulty) => {
    setDifficultyLevel(difficulty);
    onCloseModal();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        closeOnOverlayClick={false}
        showCloseIcon={false}
        closeOnEsc={false}
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
          overlayAnimationIn: "customEnterOverlayAnimation",
          overlayAnimationOut: "customLeaveOverlayAnimation",
          modalAnimationIn: "customEnterModalAnimation",
          modalAnimationOut: "customLeaveModalAnimation",
        }}
        styles={{
          modal: {
            width: "auto",
            maxWidth: isMobile ? "unset" : "500px",
          },
        }}
      >
        <h2 className="text-lg  flex items-center font-start2p justify-center gap-2  flex-wrap">
          <span className="text-center">
            Hello there, <br />
            Lets begin to play
          </span>{" "}
          <span className="font-bold text-red-500">Tower Quest</span>{" "}
          <IoIosInformationCircle
            data-tooltip-id="my-tooltip"
            data-tooltip-variant="info"
            data-tooltip-content="Tower Quest features eight floors, each with a set number of boxes. Players begin at the  floor 1 and select a box. If you uncover a gem, you advance to the next floor; if you reveal a bomb, the game resets to the beginning until your points become zero. The goal is to ascend to the top floor by selecting gems while avoiding bombs."
            size={20}
            className="cursor-pointer"
          />
        </h2>
        <p className="text-center my-3 text-black text-xs  font-start2p font-start">
          You have 50 points out of which 20 points will be deducted to activate
          the game.
        </p>
        <p className="text-center my-3 text-black font-start2p text-[8px]">
          Please choose the difficulty level
        </p>
        <div className="flex flex-col justify-center font-start2p">
          <button
            onClick={() => handleDifficultyLevelSelect("normal")}
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out m-2"
          >
            Normal
          </button>
          <button
            onClick={() => handleDifficultyLevelSelect("medium")}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out m-2"
          >
            Medium
          </button>
          <button
            onClick={() => handleDifficultyLevelSelect("hard")}
            className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out m-2"
          >
            Hard
          </button>
          <button
            onClick={() => handleDifficultyLevelSelect("impossible")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out m-2"
          >
            Impossible
          </button>
        </div>
        <Tooltip id="my-tooltip" />
      </Modal>
    </div>
  );
};

export default DialogBox;
