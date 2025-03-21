const WebSocket = require("ws");
const chatHandler = require("./chatHandler");
const clients = new Set();

module.exports.setup = (server) => {
  const wss = new WebSocket.Server({ noServer: true });

  server.server.on("upgrade", (request, socket, head) => {
    console.log("Received WebSocket upgrade request:", request.url);

    if (request.url === "/ws/chat") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws) => {
    clients.add(ws);
    chatHandler(ws);
  });

  console.log("WebSocket server is running on /ws/chat");
};
