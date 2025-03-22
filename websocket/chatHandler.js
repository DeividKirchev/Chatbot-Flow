const Chat = require("../models/chat/chatModel");
const {
  getActiveConfiguration,
} = require("../controllers/configuration/getActiveConfiguration");
const ChatMovementController = require("../controllers/chat/chatMovementController");

const chatHandler = async (ws) => {
  try {
    const connectionParsed = await handleConnection(ws);

    if (
      !connectionParsed ||
      !connectionParsed.chat ||
      !connectionParsed.configuration
    ) {
      return;
    }
    const { chat, configuration, entryBlock, message } = connectionParsed;

    const chatMovementController = new ChatMovementController(
      configuration.blocks,
      entryBlock || configuration.entryBlock,
      ws,
      message,
      chat
    );

    ws.send(JSON.stringify({ status: "started", chatId: chat._id }));

    chatMovementController.moveChatFlow();

    // Handle events
    ws.on("message", (response) => {
      const parsedResponse = JSON.parse(response);
      chatMovementController.startMovement(parsedResponse.message);
    });

    ws.on("close", async () => {
      chatMovementController.cancelMovement();
      await chatMovementController.saveChat();
      ws.send(JSON.stringify({ status: "closed" }));
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
      chatMovementController.cancelMovement();
      ws.send(JSON.stringify({ status: "error", error: err.message }));
      ws.close();
    });
  } catch (error) {
    console.error("Error with chat:", error);
    ws.send(JSON.stringify({ status: "error", error: error.message }));
    ws.close();
  }
};

const sendHistory = (ws, messages) => {
  ws.send(JSON.stringify({ status: "history", messages: messages.sort((a, b) => a.sentAt - b.sentAt) }));
};

const handleConnection = async (ws) => {
  let chat;
  let configuration;
  let entryBlock;
  let message;

  if (ws.connectionRequest?.params?.id) {
    chat = await Chat.findById(ws.connectionRequest.params.id).populate({
      path: "configuration",
      populate: {
        path: ["blocks", "entryBlock"],
      },
    }).populate("lastBlock");

    if (!chat) {
      ws.send(JSON.stringify({ status: "error", error: "Chat not found" }));
      ws.close();
      return null;
    }

    configuration = chat.configuration;

    const lastMessage = chat.messages.reduce((lastMessage, message) => {
      if (
        message.isUserMessage &&
        (!lastMessage || message.sentAt > lastMessage.sentAt)
      ) {
        return message;
      }
      return lastMessage;
    }, null);
    if (lastMessage) {
      message = lastMessage.content;
    }

    if (chat.lastBlock) {
      entryBlock = chat.lastBlock;
    }

    sendHistory(ws, chat.messages);
  } else {
    const activeConfiguration = await getActiveConfiguration();
    configuration = activeConfiguration.configuration;
    chat = new Chat({
      messages: [],
      configuration: activeConfiguration.configuration._id,
    });
    await chat.save();
  }

  return { chat, configuration, entryBlock, message };
};

module.exports = chatHandler;
