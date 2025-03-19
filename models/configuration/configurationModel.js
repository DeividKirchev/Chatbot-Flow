const mongoose = require("mongoose");
const refIsValid = require("../validators/refIsValid");
const ChatBlock = require("./chatBlockModel");

const configurationSchema = new mongoose.Schema(
  {
    blocks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatBlock",
      },
    ],
    entryBlock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatBlock",
    },
  },
  {
    timestamps: true,
  }
);


// Validators
configurationSchema.path("entryBlock").validate((value, respond) => {
  return refIsValid(value, respond, ChatBlock);
}, "Invalid entryBlock ID.");

configurationSchema.path("blocks").validate((value, respond) => {
  return refIsValid(value, respond, ChatBlock);
}, "Invalid blocks ID.");

const Configuration = mongoose.model("Configuration", configurationSchema);
module.exports = Configuration;
