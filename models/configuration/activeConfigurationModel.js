const mongoose = require("mongoose");
const refIsValid = require("../validators/refIsValid");
const Configuration = require("./configurationModel");

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
// Validators
activeConfigurationSchema.path("configuration").validate((value, respond) => {
  return refIsValid(value, respond, Configuration);
}, "Invalid configuration ID.");

const ActiveConfiguration = mongoose.model(
  "ActiveConfiguration",
  activeConfigurationSchema
);

module.exports = ActiveConfiguration;
