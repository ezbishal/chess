import { Chess } from "chess.js";
import { useState } from "react";

export interface ChessMove {
  from: string;
  to: string;
}

export default function Chessboard({
  chess,
  moveHandler,
  chessColor,
}: {
  chess: Chess;
  moveHandler: (chessMove: ChessMove) => void;
  chessColor: string;
}) {
  const [from, setFrom] = useState<string>("");

  if (!chess.board()) return;

  return (
    <div>
      {(chessColor === "w" ? chess.board() : chess.board().reverse()).map(
        (row, rowIndex) => {
          return (
            <div className="flex" key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const square =
                  cell?.square ??
                  `${String.fromCharCode(cellIndex + 97)}${chessColor === "w" ? 8 - rowIndex : rowIndex+1}`;
                const type = cell?.type ?? "";
                const color = (cellIndex + rowIndex) % 2 ? "b" : "w";
                const background =
                  square === from
                    ? "bg-blue-500"
                    : color === "w"
                    ? "bg-white"
                    : "bg-green-500";

                return (
                  <div
                    onClick={() => {
                      if (from == "") {
                        setFrom(square);
                        return;
                      }

                      moveHandler({ from: from, to: square });
                      setFrom("");
                    }}
                    className={`${background} font-bold w-20 h-20 py-2 px-4`}
                    key={cellIndex}
                  >
                    {cell?.color && (
                      <span className="text-blue-950">
                        {square}
                        <img
                          src={`../../public/images/${type}${cell?.color}.svg`}
                        />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
      )}
      Selected Square: {from}
    </div>
  );
}
