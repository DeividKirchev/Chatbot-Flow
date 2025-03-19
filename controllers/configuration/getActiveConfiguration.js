const ActiveConfiguration = require("../../models/configuration/activeConfigurationModel");
const restifyErrors = require("restify-errors");

const getActiveConfiguration = (req, res, next) => {
  ActiveConfiguration.findOne()
    .populate({
      path: "configuration",
      populate: {
        path: "blocks",
      },
    })
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

module.exports = getActiveConfiguration;
