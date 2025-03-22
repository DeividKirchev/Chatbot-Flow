const mongoose = require("mongoose");
const ChatBlock = require("../configuration/chatBlockModel");
const refIsValid = require("../validators/refIsValid");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BaseBlock",
      required: true,
    },
    isUserMessage: {
      type: Boolean,
      required: true,
    },
    sentAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// Validators
messageSchema.path("block").validate((value, respond) => {
  return refIsValid(value, respond, ChatBlock);
}, "Invalid block ID.");

module.exports = messageSchema;
