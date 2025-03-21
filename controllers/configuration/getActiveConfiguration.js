const ActiveConfiguration = require("../../models/configuration/activeConfigurationModel");
const restifyErrors = require("restify-errors");

const getActiveConfiguration = async () => {
  const activeConfiguration = await ActiveConfiguration.findOne().populate(
    {
      path: "configuration",
      populate: {
        path: ["blocks", "entryBlock"],
      },
    },
  );
  return activeConfiguration;
};

const getActiveConfigurationHandler = (req, res, next) => {
  getActiveConfiguration()
    .then((activeConfiguration) => {
      if (!activeConfiguration) {
        throw new restifyErrors.NotFoundError("No active configuration found");
      }
      res.send({
        activeConfiguration,
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getActiveConfiguration = getActiveConfiguration;
module.exports.getActiveConfigurationHandler = getActiveConfigurationHandler;
