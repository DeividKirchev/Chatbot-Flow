var router = new (require("restify-router").Router)();
const getChatBlocks = require("../controllers/chatBlocks/getChatBlocks");
const getChatBlockTypes = require("../controllers/chatBlocks/getChatBlockTypes");


router.get("", getChatBlocks);
router.get("/types", getChatBlockTypes);

module.exports = router;

