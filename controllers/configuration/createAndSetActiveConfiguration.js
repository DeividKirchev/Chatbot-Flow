const ActiveConfiguration = require("../../models/configuration/activeConfigurationModel");
const ChatBlock = require("../../models/configuration/chatBlockModel");
const Configuration = require("../../models/configuration/configurationModel");
const restifyErrors = require("restify-errors");
const createAndSetActiveConfiguration = async (req, res) => {
  const blocks = req.body.blocks;

  blocks.forEach((block) => {
    block.originalNextBlock = block.nextBlock;
    block.originalId = block._id;

    delete block.nextBlock;
    delete block._id;

    if (block.type === "recognizeIntent") {
      block.intents.forEach((intent) => {
        intent.originalNextBlock = intent.nextBlock;
        delete intent.nextBlock;
      });
      block.originalErrorIntentNextBlock = block.errorIntentNextBlock;
      delete block.errorIntentNextBlock;
    }
  });

  const insertedBlocks = await ChatBlock.insertMany(blocks);
  const nextMapping = {};
  const updatedBlocks = [];

  insertedBlocks.forEach((block) => {
    let isBlockUpdated = false;
    isBlockUpdated = mapNextBlocks(block, nextMapping, insertedBlocks, block);

    // Recognise Intent Block
    if (block.type === "recognizeIntent") {
      block.intents.forEach((intent) => {
        isBlockUpdated =
          mapNextBlocks(intent, nextMapping, insertedBlocks, block) ||
          isBlockUpdated;
      });
      isBlockUpdated =
        mapNextBlocks(
          block,
          nextMapping,
          insertedBlocks,
          block,
          "errorIntentNextBlock",
          "originalErrorIntentNextBlock"
        ) || isBlockUpdated;
    }

    if (isBlockUpdated) {
      updatedBlocks.push(block);
    }
  });

  if (updatedBlocks.length > 0) {
    await ChatBlock.bulkSave(updatedBlocks);
  }

  const configuration = new Configuration({
    blocks: insertedBlocks,
  });
  const savedConfiguration = await configuration.save();

  const activeConfiguration = await ActiveConfiguration.findOneAndUpdate(
    {},
    { $set: { configuration: savedConfiguration._id } },
    { upsert: true }
  ).populate({
    path: "configuration",
    populate: {
      path: "blocks",
    },
  });

  res.send({
    activeConfiguration,
  });
};

const mapNextBlocks = (
  obj,
  nextMapping,
  insertedBlocks,
  block,
  fieldToCheck = "nextBlock",
  originalFieldToCheck = "originalNextBlock"
) => {
  if (obj[originalFieldToCheck]) {
    if (nextMapping[obj[originalFieldToCheck]]) {
      obj[fieldToCheck] = nextMapping[obj[originalFieldToCheck]];
    } else {
      const originalBlock = insertedBlocks.find(
        (b) => b.originalId === obj[originalFieldToCheck]
      );
      if (!originalBlock) {
        throw new restifyErrors.BadRequestError(
          `Missing block with id ${obj[originalFieldToCheck]} for block type ${
            block.type
          }${block.originalId && `, _id:${block.originalId}`}`
        );
      }
      obj[fieldToCheck] = originalBlock._id;
      nextMapping[obj[originalFieldToCheck]] = obj[fieldToCheck];
    }
    return true;
  }
  return false;
};

module.exports = createAndSetActiveConfiguration;
