const chatBlockTypes = require("../../models/configuration/blocks");

const getChatBlockTypes = (req, res, next) => {
  const types = [];
  Object.entries(chatBlockTypes).forEach(([key, value]) => {
    types.push({
      type: value.type,
    });
  });
  res.send({
    types,
  });
};

module.exports = getChatBlockTypes;
