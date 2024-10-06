import { WebSocketServer } from 'ws';
import { addHandlers, removeUser } from './gameManager';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws)
{
  addHandlers(ws);

  ws.on("close", () => removeUser(ws))
});