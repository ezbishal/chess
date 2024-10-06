"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.addUser = void 0;
const chess_js_1 = require("chess.js");
let games = [];
let users = [];
let pendingUser = null;
const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";
function addUser(socket) {
    users.push(socket);
    addHandler(socket);
}
exports.addUser = addUser;
function removeUser(socket) {
    users = users.filter(user => user === socket);
}
exports.removeUser = removeUser;
function addHandler(socket) {
    socket.on("message", (data) => {
        const message = JSON.parse(data.toString());
        if (message.type === INIT_GAME)
            handleInit(socket);
        if (message.type === MOVE)
            handleMove(socket, message.data);
    });
}
function handleMove(socket, data) {
    const game = games.find(game => game.player1 === socket || game.player2 === socket);
    if (!game)
        return;
}
function handleInit(socket) {
    if (pendingUser) {
        const game = {
            player1: pendingUser,
            player2: socket,
            startTime: new Date(),
            board: new chess_js_1.Chess(),
            moves: []
        };
        games.push(game);
        pendingUser = null;
    }
    else {
        pendingUser = socket;
    }
}
