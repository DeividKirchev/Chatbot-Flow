const mongoose = require("mongoose");
const messageSchema = require("./messageSchema");
const conversationSchema = new mongoose.Schema({
  messages: [messageSchema],
  configuration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Configuration",
  },
}, {
  timestamps: true,
}
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
