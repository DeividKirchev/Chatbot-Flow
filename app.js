const restify = require('restify');
const app = restify.createServer();

app.use(restify.plugins.bodyParser());

app.get('/', (req, res, next) => {
    res.send('Hello World' + process.env.OPENAI_API_KEY + " " + process.env.NODE_ENV);
    return next();
});

module.exports = app;
