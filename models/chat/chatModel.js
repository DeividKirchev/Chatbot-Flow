const mongoose = require("mongoose");
const messageSchema = require("./messageSchema");
const refIsValid = require("../validators/refIsValid");
const Configuration = require("../configuration/configurationModel");

const chatSchema = new mongoose.Schema({
  messages: [messageSchema],
  configuration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Configuration",
  },
}, {
  timestamps: true,
}
);

// Validators
chatSchema.path("configuration").validate((value, respond) => {
  return refIsValid(value, respond, Configuration);
}, "Invalid configuration ID.");

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
