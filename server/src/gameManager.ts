import { Chess, Color } from "chess.js";
import { WebSocket } from "ws";

interface ChessMove
{
    from: string;
    to: string;
}

interface User
{
    socket: WebSocket,
    color: Color
}

interface Game
{
    board: Chess,
    player1: User,
    player2: User,
    moves: string[],
    startTime: Date
}

let games: Game[] = [];
let users: User[] = [];
let pendingUser: User | null = null;

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";
const INVALID_MOVE = "invalid_move";

export function removeUser(socket: WebSocket)
{
    users = users.filter(user => user.socket !== socket)
    games = games.filter(game => users.includes(game.player1) && users.includes(game.player2))
    console.log("current games count", games.length)
    console.log("current users count", users.length)
}

export function addHandlers(socket: WebSocket)
{
    socket.on("message", (data) =>
    {
        const message = JSON.parse(data.toString());

        if (message.type === INIT_GAME)
            handleInit(socket);

        if (message.type === MOVE)
            handleMove(socket, message.move);
    })

}

function handleMove(socket: WebSocket, move: ChessMove)
{
    const game = games.find(game => game.player1.socket === socket || game.player2.socket === socket)

    if (!game)
    {
        return;
    }

    if (game.board.isGameOver() || game.board.isDraw() || game.board.isCheckmate())
    {
        console.log('ischeckmate')
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
    }
    catch
    {
        socket.send(JSON.stringify({
            type: INVALID_MOVE
        }));
    }
}

function handleInit(socket: WebSocket)
{

    if (pendingUser)
    {
        const matchedUser: User = { socket, color: "b" };
        users.push(matchedUser);

        const game: Game = {
            player1: pendingUser,
            player2: matchedUser,
            startTime: new Date(),
            board: new Chess(),
            moves: []
        };

        games.push(game);
        pendingUser = null;

        const message1 = JSON.stringify({
            type: INIT_GAME,
            color: game.player1.color
        });

        const message2 = JSON.stringify({
            type: INIT_GAME,
            color: game.player2.color
        });

        game.player1.socket.send(message1);
        game.player2.socket.send(message2);
    }
    else
    {
        pendingUser = { socket, color: "w" };
        users.push(pendingUser);
    }
    console.log("current games count", games.length)
    console.log("current users count", users.length)
}

