import { WebSocketServer } from 'ws';
import { handleUserConnected, handleUserDisconnected } from './gameHandler';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws)
{
  handleUserConnected(ws);
  ws.on("close", () => handleUserDisconnected(ws))
});

function cleanup() {
  console.log("clean up");
}

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});