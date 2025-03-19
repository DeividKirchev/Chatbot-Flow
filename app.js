const restify = require('restify');
const app = restify.createServer();
const { Configuration } = require('./models');
app.use(restify.plugins.bodyParser());

app.post("/", async (req, res) => {
  const newConfiguration = await new Configuration(req.body).save();
  res.send({
    message: "Hello World",
    body: req.body,
    newConfiguration,
  });
});

app.get("/", async (req, res) => {
  const configurations = await Configuration.find();
  res.send({
    message: "Hello World",
    configurations,
  });
});

module.exports = app;
