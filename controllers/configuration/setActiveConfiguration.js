const ActiveConfiguration = require("../../models/configuration/activeConfigurationModel");
const ChatBlock = require("../../models/configuration/chatBlockModel");
const Configuration = require("../../models/configuration/configurationModel");
const restifyErrors = require("restify-errors");
const mongoose = require("mongoose");
const applyFunctionToBlocks = require("../../utils/common/applyFunctionToBlocks");

const setActiveConfiguration = async (req, res) => {
  try {
    let blocks = req.body.blocks;

    if (!blocks || blocks.length === 0) {
      throw new restifyErrors.BadRequestError(
        `Cannot set active configuration. Missing blocks.`
      );
    }

    const mapping = {};
    const fieldFunctions = {
      nextBlock: (value, parent) => {
        parent.originalNextBlock = value;
        delete parent.nextBlock;
      },
      errorIntentNextBlock: (value, parent) => {
        parent.originalErrorIntentNextBlock = value;
        delete parent.errorIntentNextBlock;
      },
      _id: (value, parent) => {
        mapping[value] = new mongoose.Types.ObjectId();
        parent.originalId = value;
        parent._id = mapping[value];
      },
    };
    applyFunctionToBlocks(blocks, fieldFunctions);

    if (req.body.entryBlock && !mapping[req.body.entryBlock]) {
      throw new restifyErrors.BadRequestError(
        `Cannot set entry block. Missing block with id ${req.body.entryBlock}`
      );
    }

    blocks = await ChatBlock.insertMany(blocks);

    const fieldFunctionsUpdate = {
      originalNextBlock: (value, parent) => {
        parent.nextBlock = mapping[value];
      },
      originalErrorIntentNextBlock: (value, parent) => {
        parent.errorIntentNextBlock = mapping[value];
      },
    };
    applyFunctionToBlocks(blocks, fieldFunctionsUpdate);
    await ChatBlock.bulkSave(blocks);

    let entryBlock = null;
    if (req.body.entryBlock) {
      entryBlock = blocks.find(
        (block) => block.originalId === req.body.entryBlock
      );
    } else {
      entryBlock = blocks[0];
    }

    const configuration = new Configuration({
      blocks: blocks,
      entryBlock: entryBlock._id,
    });
    const savedConfiguration = await configuration.save();

    const activeConfiguration = await ActiveConfiguration.findOneAndUpdate(
      {},
      
      { $set: { configuration: savedConfiguration._id } },
      { upsert: true, returnOriginal: false }
    ).populate({
      path: "configuration",
      populate: {
        path: "blocks",
      },
    });
    res.send({
      activeConfiguration,
    });
  } catch (error) {
    console.error(error);
    throw new restifyErrors.BadRequestError(error.message);
  }
};

module.exports = setActiveConfiguration;
