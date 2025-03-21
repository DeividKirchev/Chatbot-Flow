const mongoose = require("mongoose");

const type = "awaitResponse";

const awaitResponseBlockSchema = new mongoose.Schema();

// Virtuals
const execute = awaitResponseBlockSchema.virtual("execute");
execute.get(function (value, virtual, doc) {
  return async (service, message) => {
    return { awaitResponse: true, nextBlock: doc.nextBlock };
  };
});

module.exports.schema = awaitResponseBlockSchema;
module.exports.type = type;
