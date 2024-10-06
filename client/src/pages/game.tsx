import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import Chessboard, { ChessMove } from "../components/chessBoard";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";
const INVALID_MOVE = "invalid_move";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState<Chess>(new Chess());
  const [color, setColor] = useState<string>("");
  const [moves, setMoves] = useState<ChessMove[]>([]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (e: MessageEvent) => {
      const message = JSON.parse(e.data);
      console.log(`Received message:`, message);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setColor(message.color);
          setMoves([]);
          break;
        case MOVE:
          console.log(`Processing move:`, message.move);
          setMoves((previousMoves) => [...previousMoves, message.move]);
          setChess((prevChess) => {
            const tempChess = new Chess(prevChess.fen());
            try {
              tempChess.move(message.move);
            } catch (error) {
              console.error("Invalid move:", error);
            }
            return tempChess;
          });
          break;
        case INVALID_MOVE:
          console.log("Invalid move received");
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
      }
    };

    socket.onmessage = handleMessage;
    socket.send(JSON.stringify({ type: INIT_GAME }));

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  const move = (move: ChessMove) => {
    console.log("Local move:", move);
    socket?.send(
      JSON.stringify({
        type: MOVE,
        move: move,
      })
    );
  };

  return (
    <div className="flex flex-row justify-around items-center bg-slate-800 h-screen text-white">
      <Chessboard moveHandler={move} chess={chess} chessColor={color} />
      {moves.map((move, index) => (
        <div className="grid bg-black p-2 gap-3 grid-cols-2">
          <span
            className={
              index === 0
                ? "bg-white p-1 text-black"
                : "bg-white p-1 text-black hidden"
            }
          >
            From
          </span>
          <span
            className={
              index === 0
                ? "bg-white p-1 text-black"
                : "bg-white p-1 text-black hidden"
            }
          >
            To
          </span>
          <span
            key={`${index}${move.from}`}
            className="bg-white p-1 text-black"
          >
            {move.from}
          </span>
          <span key={`${index}${move.to}`} className="bg-white p-1 text-black">
            {move.to}
          </span>
        </div>
      ))}
    </div>
  );
};
