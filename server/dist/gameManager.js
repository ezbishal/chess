"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHandlers = exports.removeUser = void 0;
const chess_js_1 = require("chess.js");
let games = [];
let users = [];
let pendingUser = null;
const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";
const INVALID_MOVE = "invalid_move";
function removeUser(socket) {
    users = users.filter(user => user.socket !== socket);
    games = games.filter(game => users.includes(game.player1) && users.includes(game.player2));
    console.log("current games count", games.length);
    console.log("current users count", users.length);
}
exports.removeUser = removeUser;
function addHandlers(socket) {
    socket.on("message", (data) => {
        const message = JSON.parse(data.toString());
        if (message.type === INIT_GAME)
            handleInit(socket);
        if (message.type === MOVE)
            handleMove(socket, message.move);
    });
}
exports.addHandlers = addHandlers;
function handleMove(socket, move) {
    const game = games.find(game => game.player1.socket === socket || game.player2.socket === socket);
    if (!game) {
        return;
    }
    if (game.board.isGameOver() || game.board.isDraw() || game.board.isCheckmate()) {
        console.log('ischeckmate');
        const message = JSON.stringify({
            type: GAME_OVER
        });
        game.player1.socket.send(message);
        game.player2.socket.send(message);
    }
    try {
        game.board.move({ from: move.from, to: move.to });
        const message = JSON.stringify({
            type: MOVE,
            move: move
        });
        game.player1.socket.send(message);
        game.player2.socket.send(message);
    }
    catch (_a) {
        socket.send(JSON.stringify({
            type: INVALID_MOVE
        }));
    }
}
function handleInit(socket) {
    if (pendingUser) {
        const matchedUser = { socket, color: "b" };
        users.push(matchedUser);
        const game = {
            player1: pendingUser,
            player2: matchedUser,
            startTime: new Date(),
            board: new chess_js_1.Chess(),
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
    else {
        pendingUser = { socket, color: "w" };
        users.push(pendingUser);
    }
    console.log("current games count", games.length);
    console.log("current users count", users.length);
}
