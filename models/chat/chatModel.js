const mongoose = require("mongoose");
const messageSchema = require("./messageSchema");
const refIsValid = require("../validators/refIsValid");
const Configuration = require("../configuration/configurationModel");
const ChatBlock = require("../configuration/chatBlockModel");

const chatSchema = new mongoose.Schema({
  messages: [messageSchema],
  configuration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Configuration",
  },
  lastBlock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatBlock",
  },
}, {
  timestamps: true,
}
);

// Validators
chatSchema.path("configuration").validate((value, respond) => {
  return refIsValid(value, respond, Configuration);
}, "Invalid configuration ID.");

chatSchema.path("lastBlock").validate((value, respond) => {
  return refIsValid(value, respond, ChatBlock);
}, "Invalid last block ID.");

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
