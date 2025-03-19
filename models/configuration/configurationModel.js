const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema({
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


const Configuration = mongoose.model("Configuration", configurationSchema);
module.exports = Configuration;

