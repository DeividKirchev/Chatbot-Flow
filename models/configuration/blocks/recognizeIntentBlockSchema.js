const mongoose = require("mongoose");
const ChatBlock = require("../chatBlockModel");

const title = "Recognize intent";
const description = "Recognize user intent and choose the next block";

const recognizeIntentBlockSchema = new mongoose.Schema({
  intents: [
    {
      intent: {
        type: String,
        required: true,
      },
      nextBlock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatBlock",
      },
    },
    {
      required: true,
    },
  ],
  errorIntentNextBlock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatBlock",
  },
});
ChatBlock.discriminator("recognizeIntent", recognizeIntentBlockSchema);

module.exports.schema = recognizeIntentBlockSchema;
module.exports.title = title;
module.exports.description = description;
