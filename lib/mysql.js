var config = require('../config/config').getInstance().config;
var logger = config.logger;
var mysql = require('mysql');
var mysql = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    debug:config.mysql.debug
    //database: config.mysql.database
});

//尝试连接是否成功
// mysql.getConnection(function (err, connection) {
//     if (err) {
//         console.log('connect mysql1 err');
//         console.log(err);
//         logger.log(err);
//         //process.exit(1);
//         return;
//     }
//     console.log('connect mysql1 ok.');
//     connection.release();
// });

module.exports = {
    'mysql':mysql
};
