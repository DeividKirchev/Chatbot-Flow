const chatHandler = require("./chat/chatHandler");
const websocketRouteParams = require("./paramParser");

const routeHandlers = {
  "/ws/chat": chatHandler,
  "/ws/chat/:id": chatHandler,
};

const websocketRoute = (req) => {
  for (const route in routeHandlers) {
    const match = websocketRouteParams(route, req);
    if (match) {
      req.handler = routeHandlers[route];
      req.params = match.params;
      return true;
    }
  }
  return false;
};

module.exports = websocketRoute;
