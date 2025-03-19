const mongoose = require("mongoose");

const type = "sendMessage";

const sendMessageBlockSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});

module.exports.schema = sendMessageBlockSchema;
module.exports.type = type;
