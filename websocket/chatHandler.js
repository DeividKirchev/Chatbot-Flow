const Chat = require("../models/chat/chatModel");
const {
  getActiveConfiguration,
} = require("../controllers/configuration/getActiveConfiguration");
const ChatMovementController = require("../controllers/chat/chatMovementController");

module.exports = async (ws) => {
  try {
    const activeConfiguration = await getActiveConfiguration();
    const configuration = activeConfiguration.configuration;
    const chat = new Chat({
      messages: [],
      configuration: activeConfiguration.configuration._id,
    });
    await chat.save();

    const chatMovementController = new ChatMovementController(
      configuration.blocks,
      configuration.entryBlock,
      ws,
      null,
      chat
    );

    const clients = new Set();

    clients.add(ws);
    ws.send(
      JSON.stringify({ status: "started", chatId: chat._id })
    );

    chatMovementController.moveChatFlow();
    ws.on("message", (response) => {
      const parsedResponse = JSON.parse(response);
      chatMovementController.startMovement(parsedResponse.message);
    });

    ws.on("close", async () => {
      clients.delete(ws);
      chatMovementController.cancelMovement();
      await chatMovementController.saveChat();
      ws.send(JSON.stringify({ status: "closed" }));
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
      chatMovementController.cancelMovement();
      ws.send(JSON.stringify({ status: "error", error: err.message }));
    });
  } catch (error) {
    console.error("Error with chat:", error);
    ws.send(JSON.stringify({ status: "error", error: error.message }));
  }
};
