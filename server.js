import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

const clients = new Set(); //Tracking how many clients are connected to the server

wss.on("connection", (ws) => {
  clients.add(ws); //Tracking connected clients
  console.log(`Client connected. Total clients: ${clients.size}`);

  ws.on("message", (data) => {
    const message = data.toString();

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on("close", (ws) => {
    //connection close client delete
    clients.delete(ws);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
  });
});

console.log("websocket running on port 8080");
