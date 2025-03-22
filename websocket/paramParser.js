const { match } = require("path-to-regexp");

module.exports = function websocketRouteParams(routePattern, req) {
  const matcher = match(routePattern, { decode: decodeURIComponent });
  return matcher(req.url);
};
