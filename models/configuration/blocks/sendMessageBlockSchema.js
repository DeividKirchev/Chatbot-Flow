const mongoose = require("mongoose");
const ChatBlock = require("../chatBlockModel");

const title = "Send message";
const description = "Send message to the user";

const sendMessageBlockSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});
ChatBlock.discriminator("sendMessage", sendMessageBlockSchema);

module.exports.schema = sendMessageBlockSchema;
module.exports.title = title;
module.exports.description = description;
