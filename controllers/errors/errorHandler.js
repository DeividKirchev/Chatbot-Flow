module.exports = (req, res, err, callback) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.code = "ValidationError";

    res.send(err.statusCode, {
      code: err.code,
      message: err.message,
    });
  }

  if (err.name === "StrictModeError") {
    err.statusCode = 400;
    err.code = "InvalidSchema";

    res.send(err.statusCode, {
      code: err.code,
      message: err.message,
    });
  }

  return callback();
};
