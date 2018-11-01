const auth = require('../lib/Auth').getInstance();

//路由主入口
module.exports = function (app) {

    app.use('/api/', (req, res, next) => {
        auth.check(req, res, next);
    });

    // not found 404 page
    app.use(function (req, res, next) {
        if (!res.headersSent) {
            res.send({
                code: 500,
                msg: '无效的接口地址',
            });
        }
    });
};
