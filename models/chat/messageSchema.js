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
  },
  {
    timestamps: true,
  }
);

// Virtuals
const isUserMessage = messageSchema.virtual("isUserMessage");
isUserMessage.get(async function (value, virtual, doc) {
  const block = await Block.findById(doc.block);
  return block.type === "awaitResponse";
});

// Validators
messageSchema.path("block").validate((value, respond) => {
  return refIsValid(value, respond, ChatBlock);
}, "Invalid block ID.");

module.exports = messageSchema;
