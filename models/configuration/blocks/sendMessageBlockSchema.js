const mongoose = require("mongoose");

const type = "sendMessage";

const sendMessageBlockSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

// Virtuals
const execute = sendMessageBlockSchema.virtual("execute");

execute.get(function (value, virtual, doc) {
  return async (service, message) => {
    return {
      send: doc.message,
      nextBlock: doc.nextBlock,
    };
  };
});

module.exports.schema = sendMessageBlockSchema;
module.exports.type = type;
