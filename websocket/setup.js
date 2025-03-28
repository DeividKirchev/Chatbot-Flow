const WebSocket = require("ws");
const clients = new Set();
const websocketRoute = require("./websocketRouter");

let wss;

module.exports.setup = (server) => {
  wss = new WebSocket.Server({ noServer: true });

  server.server.on("upgrade", (request, socket, head) => {
    console.log("Received WebSocket upgrade request:", request.url);

    const foundRoute = websocketRoute(request);

    if (foundRoute) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        ws.connectionRequest = request;
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws) => {
    clients.add(ws);
    if (ws.connectionRequest.handler) {
      ws.connectionRequest.handler(ws);
    }
  });

  wss.on("close", () => {
    clients.delete(ws);
  });

  console.log("WebSocket server is running on /ws/chat");
};

module.exports.wss = wss;
