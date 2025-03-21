var router = new (require("restify-router").Router)();
const getChatHistory = require("../controllers/chat/getChatHistory");

router.get("", getChatHistory);
router.get("/:id", getChatHistory);


module.exports = router;
