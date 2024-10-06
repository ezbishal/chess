"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const gameManager_1 = require("./gameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
    (0, gameManager_1.addHandlers)(ws);
    ws.on("close", () => (0, gameManager_1.removeUser)(ws));
});
