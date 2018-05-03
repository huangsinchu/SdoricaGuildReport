const Koa = require('koa'),
    path = require('path'),
    server = require('koa-static'),
    router = require('koa-router')(),
    json = require('koa-json'),
    logger = require('koa-logger'),
    //cookieParser = require('cookie-parser');
    session = require('koa-session2'),
    historyApiFallback = require('koa-history-api-fallback')();
    bodyParser = require('koa-bodyparser');

const koaRouter = require('./koarouter.js');

const app = new Koa();
app.use(session({
    key: "SESSIONID",   //default "koa:sess"
    maxAge: 1209600000
}));

app.use(json());
app.use(logger());
app.use(bodyParser());

app.on('error', function (err, ctx) {
    console.log('server error', err);
});

app.use(koaRouter.routes());

app.use(historyApiFallback);
app.use(server(path.resolve('dist')));

app.listen(8889, () => {
    console.log('Koa is listening in 8889');
});

module.exports = app;
