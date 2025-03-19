module.exports = (value, res, modelName) => {
  return modelName
    .countDocuments({ _id: value })
    .exec()
    .then(function (count) {
      return count > 0;
    })
    .catch(function (err) {
      throw err;
    });
};
