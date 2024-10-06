import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { ChessMove, Game, gameRepo, User } from "./gameRepository";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";
const INVALID_MOVE = "invalid_move";

export function handleUserConnected(socket: WebSocket)
{
    socket.on("message", (data) =>
    {
        const message = JSON.parse(data.toString());
        console.log("message", message);

        if (message.type === INIT_GAME)
            handleInit(socket);

        if (message.type === MOVE)
            handleMove(socket, message.move);
    })

}

export function handleUserDisconnected(socket: WebSocket)
{
    const games = gameRepo.getGames();
    console.log("user disconnected, found number of games", games?.length);

    const gameToRemove = games?.find(game => game.player1.socket == socket || game.player2.socket == socket);

    if (gameToRemove)
    {
        const deleteGameResult = gameRepo.deleteGame(gameToRemove.id);
        console.log("delete game result", deleteGameResult); 
    }
}


function handleMove(socket: WebSocket, move: ChessMove)
{
    const games = gameRepo.getGames();
    console.log("move made, found number of games", games?.length);

    const game = games?.find(game => game.player1.socket === socket || game.player2.socket === socket)

    if (!game)
    {
        console.log("associated game not found");
        return;
    }

    if (game.board.isGameOver() || game.board.isDraw() || game.board.isCheckmate())
    {
        console.log("ischeckmate or isdraw or isgameover")
        const message = JSON.stringify({
            type: GAME_OVER
        });

        game.player1.socket.send(message);
        game.player2.socket.send(message);
    }

    try
    {
        game.board.move({ from: move.from, to: move.to });

        const message = JSON.stringify({
            type: MOVE,
            move: move
        });

        game.player1.socket.send(message);
        game.player2.socket.send(message);
        console.log("move made", move);
    }
    catch
    {
        console.log("invalid move", move);
        socket.send(JSON.stringify({
            type: INVALID_MOVE
        }));
    }
}

function handleInit(socket: WebSocket)
{
    const pendingUser = gameRepo.getPendingUser();

    if (!pendingUser)
    {
        console.log("user put into queue");
        const user: User = { socket, color: "w" };
        const setPendingUserResult = gameRepo.setPendingUser(user);
        console.log("set pending user result", setPendingUserResult);
        return;
    }

    console.log("pending user found");

    const matchedUser: User = { socket, color: "b" };
    const game: Game = {
        id: uuidv4(),
        player1: pendingUser,
        player2: matchedUser,
        startTime: new Date(),
        board: new Chess(),
        moves: []
    };

    const setGameResult = gameRepo.setGame(game);
    console.log("set game result", setGameResult)
    const removePendingUserResult = gameRepo.removePendingUser();
    console.log("remove pending user result", removePendingUserResult);

    const message = (color: string) =>
        JSON.stringify({
            type: INIT_GAME,
            color: color
        });

    game.player1.socket.send(message(game.player1.color));
    game.player2.socket.send(message(game.player2.color));
    console.log("socket message sent to both players");
}