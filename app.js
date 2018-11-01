var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var config = require('./config/config').getInstance().config;
var logg = config.logger;
var moment = require('moment');
var comm = require('./middlewares/comm');
var routes = require('./routes/index');
const http = require('http');
//const healthCheck = require('./healthCheck');

var app = express();
app.set('env', config.debug ? 'development' : 'production');
app.set('port', process.env.PORT || config.port);
app.set('trust proxy', config.proxy); 		// 指定子网和 IP 地址
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

//session redis存储
const store = new RedisStore({
    host: config.redis.host,
    port: config.redis.port,
    pass: config.redis.passwd,
});
//设置session
// app.use(session({
//     store: store,
//     name: 'oms_id',
//     secret: 'zxbike_oms',
//     resave: true,
//     rolling: true,
//     saveUninitialized: false,
//     cookie: {domain: config.domain,maxAge: 1000 * 60 * 60 * 2}
// }));

routes(app);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    logg.error(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send({
        code: 500,
        msg: '无效的接口地址',
    });
});

/* istanbul ignore next */
if (!module.parent) {
    const server = http.createServer(app);
    // healthCheck.check(server);
    server.listen(config.port, function () {
        console.log('listening on port: ' + config.port);
    });
}
module.exports = app;
