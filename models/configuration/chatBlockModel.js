const mongoose = require("mongoose");
const refIsValid = require("../validators/refIsValid");
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
    originalId: {
      type: String,
    },
    originalNextBlock: {
      type: String,
    },
  },
  {
    discriminatorKey: "type",
    timestamps: true,
  }
);

const blocks = require("./blocks/index");
const types = Object.entries(blocks).map(([key, block]) => block.type);

// Validator Functions
const validateType = function (next, doc) {
  if (!types.includes(doc.type)) {

    const err = new mongoose.Error.ValidationError();
    err.addError(
      "type",
      new mongoose.Error.ValidatorError({ message: "Invalid block type" })
    );
    return next(err);
  }
  return next();
};

// Validators
baseBlockSchema.pre("save", function (next) {
  return validateType(next, this);
});
baseBlockSchema.pre("insertMany", (next, docs) => {
  docs.forEach((doc) => {
    validateType(next, doc);
  });
});
baseBlockSchema.path("nextBlock").validate((value, respond) => {
  return refIsValid(value, respond, ChatBlock);
}, "Invalid nextBlock ID.");

const ChatBlock = mongoose.model("ChatBlock", baseBlockSchema);


ChatBlock.discriminator(
  blocks.awaitResponseBlockSchema.type,
  blocks.awaitResponseBlockSchema.schema
);
ChatBlock.discriminator(
  blocks.recognizeIntentBlockSchema.type,
  blocks.recognizeIntentBlockSchema.schema
);
ChatBlock.discriminator(
  blocks.sendMessageBlockSchema.type,
  blocks.sendMessageBlockSchema.schema
);

module.exports = ChatBlock;
