const mongoose = require("mongoose");

const baseBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    nextBlock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatBlock",
    },
  },
  {
    discriminatorKey: "type",
    timestamps: true,
  }
);

const ChatBlock = mongoose.model("ChatBlock", baseBlockSchema);

module.exports = ChatBlock;


require("./blocks/index");
