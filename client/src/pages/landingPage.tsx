import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center bg-slate-800 h-screen text-white">
      <div className="flex flex-col w-2/3 gap-4 md:flex-row ">
        <div>
          <img src="../public/images/chessBoard.jpg" width={500} height={500} />
        </div>
        <div>
          <div className="h-[500px] w-[500px] flex justify-center items-center">
            <button className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate("/game")}>Play Game</button>
          </div>
        </div>
      </div>
    </div>
  );
};
