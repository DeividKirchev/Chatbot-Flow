const restify = require("restify");
const app = restify.createServer();
const configurationRouter = require("./routes/configurationRouter");
const chatBlockRouter = require("./routes/chatBlockRoutes");
app.use(restify.plugins.bodyParser());

configurationRouter.applyRoutes(app, "/api/v1/configuration");
chatBlockRouter.applyRoutes(app, "/api/v1/blocks");

const errorHandler = require("./controllers/errors/errorHandler");
app.on("restifyError", errorHandler);

module.exports = app;
