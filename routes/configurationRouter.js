var router = new (require("restify-router").Router)();
const getActiveConfiguration = require("../controllers/configuration/getActiveConfiguration");
const createAndSetActiveConfiguration = require("../controllers/configuration/createAndSetActiveConfiguration");

router.get("", getActiveConfiguration);
router.post("", createAndSetActiveConfiguration);

module.exports = router;
