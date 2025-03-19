const ChatBlock = require("../../models/configuration/chatBlockModel");

const getChatBlocks = async (req, res) => {
  const chatBlocks = await ChatBlock.find();
  res.send({ blocks: chatBlocks });
};

module.exports = getChatBlocks;
