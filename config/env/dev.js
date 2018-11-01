/**
 * 开发环境配置信息
 * Created by fu_gh on 2017-11-28 19:37
 */
const path = require('path');

module.exports = {
    port: 5100,
    debug: true,
    mysql: {
        host: '192.168.50.86',
        user: 'root',
        port: 3306,
        password: '123456',
        database: '',
    },
    redis: {
        host: 'codis-tcp.zxbike.top',
        db: 5,
        port: 36379,
        passwd: 'o0OE%3wGAFSR'
    },
    baseDb: 'mall',
    db: {
        'mall': 'mysql',
    },
}