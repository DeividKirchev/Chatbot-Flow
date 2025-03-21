var router = new (require("restify-router").Router)();
const {
  getActiveConfigurationHandler,
} = require("../controllers/configuration/getActiveConfiguration");
const setActiveConfiguration = require("../controllers/configuration/setActiveConfiguration");

router.get("", getActiveConfigurationHandler);
router.post("", setActiveConfiguration);

module.exports = router;
