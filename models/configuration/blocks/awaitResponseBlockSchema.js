const mongoose = require("mongoose");

const type = "awaitResponse";

const awaitResponseBlockSchema = new mongoose.Schema();

module.exports.schema = awaitResponseBlockSchema;
module.exports.type = type;
