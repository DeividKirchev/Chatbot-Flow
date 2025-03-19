const mongoose = require("mongoose");
const ChatBlock = require("../chatBlockModel");

const title = "Wait for user message";
const description = "Wait for user message and send it to the next block";

const awaitResponseBlockSchema = new mongoose.Schema();
ChatBlock.discriminator("awaitResponse", awaitResponseBlockSchema);

module.exports.schema = awaitResponseBlockSchema;
module.exports.title = title;
module.exports.description = description;
