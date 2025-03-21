var router = new (require("restify-router").Router)();
const getActiveConfiguration = require("../controllers/configuration/getActiveConfiguration");
const setActiveConfiguration = require("../controllers/configuration/setActiveConfiguration");

router.get("", getActiveConfiguration);
router.post("", setActiveConfiguration);

module.exports = router;
