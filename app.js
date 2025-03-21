const restify = require("restify");
const app = restify.createServer();
const configurationRouter = require("./routes/configurationRouter");
const chatBlockRouter = require("./routes/chatBlockRouter");
const chatRouter = require("./routes/chatRouter");

app.use(restify.plugins.bodyParser());

configurationRouter.applyRoutes(app, "/api/v1/configuration");
chatBlockRouter.applyRoutes(app, "/api/v1/blocks");
chatRouter.applyRoutes(app, "/api/v1/chat");

const chatWebSocket = require("./websocket/setup");
chatWebSocket.setup(app);

const errorHandler = require("./controllers/errors/errorHandler");
app.on("restifyError", errorHandler);

module.exports = app;
