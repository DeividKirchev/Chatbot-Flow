const mongoose = require("mongoose");
const activeConfigurationSchema = new mongoose.Schema(
  {
    configuration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Configuration",
    },
  },
  {
    capped: {
      size: 1024,
      max:1
    },
    timestamps: true,
  }
);

const ActiveConfiguration = mongoose.model(
  "ActiveConfiguration",
  activeConfigurationSchema
);

module.exports = ActiveConfiguration;
