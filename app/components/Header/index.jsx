import { IoIosInformationCircle } from "react-icons/io";
import { CiCircleQuestion } from "react-icons/ci";
import { Tooltip } from "react-tooltip";

const Header = ({ difficultyLevel }) => (
  <>
    <Tooltip id="my-tooltip"/>
    <div className="text-4xl mb-4 text-green-600 flex items-center justify-center mt-10 font-start2p">
      <h1 className="mt-8 text-center text-red-500 max-md:text-2xl">Tower Quest</h1>
      
    </div>
    {difficultyLevel && (
      <div className="text-xs md:text-sm mb-4 flex items-center justify-center gap-2 font-start2p">
        Difficulty Level:{" "}
        {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
        <CiCircleQuestion
          data-tooltip-id="my-tooltip"
          data-tooltip-variant="info"
          data-tooltip-content={
            difficultyLevel === "normal"
              ? " 4 boxes (1 bomb, 3 gems) "
              : difficultyLevel === "medium"
              ? "3 boxes (1 bomb, 2 gems)"
              : difficultyLevel === "hard"
              ? "3 boxes (1 gem, 2 bombs)"
              : difficultyLevel === "impossible"
              ? "4 boxes (1 gem, 3 bombs)"
              : ""
          }
          size={16}
          className="cursor-pointer"
        />
      </div>
    )}
  </>
);

export default Header;
