const Chat = require("../../models/chat/chatModel");
const restifyErrors = require("restify-errors");
const getChatHistory = async (req, res) => {
  if (req.params.id) {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      throw new restifyErrors.NotFoundError("Chat not found");
    }
    res.send({ chat });
  }

  const chats = await Chat.find().sort({ createdAt: -1 });
  res.send({ chats });
};

module.exports = getChatHistory;
