import { Chess, Color } from "chess.js";
import { WebSocket } from "ws";

export interface ChessMove { from: string; to: string; }

export interface User { socket: WebSocket; color: Color; }

export interface Game
{
    id: string;
    board: Chess;
    player1: User;
    player2: User;
    moves: string[];
    startTime: Date;
}

const games: Game[] = [];
let pendingUser: User | null = null;

const setGame = (game:Game) => games.push(game);

const deleteGame = (id: string) => {
    const index = games.findIndex(game => game.id === id)
    if(index != -1) games.splice(index, 1);
}

const getGames = () => games;
const setPendingUser = (user: User | null) => pendingUser = user;
const getPendingUser = () => pendingUser;
const removePendingUser = () => pendingUser = null;

export const gameRepo = { setGame, deleteGame, getGames, setPendingUser, getPendingUser, removePendingUser };