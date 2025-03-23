const ActiveConfiguration = require("../../models/configuration/activeConfigurationModel");
const restifyErrors = require("restify-errors");

const getActiveConfiguration = async () => {
  const activeConfiguration = await ActiveConfiguration.findOne().populate({
    path: "configuration",
    populate: {
      path: ["blocks", "entryBlock"],
    },
  });
  return activeConfiguration;
};

const getActiveConfigurationHandler = async (req, res) => {
  const activeConfiguration = await getActiveConfiguration();
  if (!activeConfiguration) {
    throw new restifyErrors.NotFoundError("No active configuration found");
  }
  res.send({
    activeConfiguration,
  });
};

module.exports.getActiveConfiguration = getActiveConfiguration;
module.exports.getActiveConfigurationHandler = getActiveConfigurationHandler;
