const mongoose = require("mongoose");
const refIsValid = require("../../validators/refIsValid");
const getResponse = require("../../../LLM/openAI/getResponse");
const {
  recognizeIntent: instructions,
} = require("../../../LLM/openAI/instructions");

const type = "recognizeIntent";

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
      originalNextBlock: String,
    },
    {
      required: true,
    },
  ],
  errorIntentNextBlock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatBlock",
  },
  originalErrorIntentNextBlock: {
    type: String,
    required: [true, "Next block for an error intent is required."],
  },
});

// Validators
recognizeIntentBlockSchema
  .path("errorIntentNextBlock")
  .validate(function (value, respond) {
    const ChatBlock = require("../chatBlockModel");
    return refIsValid(value, respond, ChatBlock);
  }, "Invalid errorIntentNextBlock ID.");

recognizeIntentBlockSchema
  .path("intents.nextBlock")
  .validate(function (value, respond) {
    const ChatBlock = require("../chatBlockModel");
    return refIsValid(value, respond, ChatBlock);
  }, "Invalid nextBlock ID.");

// Virtuals
const execute = recognizeIntentBlockSchema.virtual("execute");
execute.get(function (value, virtual, doc) {
  return async (service, message) => {
    const input = `
    {
      intents: [${doc.intents.map((intent) => `"${intent.intent}"`).join(",")}],
      userMessage: "${message}"
    }
    `;
    const intentMessage = await getResponse(input, instructions);
    const intentBlock = doc.intents.find(
      (intentBlock) => intentBlock.intent === intentMessage
    );
    if (intentBlock) {
      return { nextBlock: intentBlock.nextBlock };
    }
    return { nextBlock: doc.errorIntentNextBlock };
  };
});

module.exports.schema = recognizeIntentBlockSchema;
module.exports.type = type;
