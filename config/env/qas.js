/**
 * 质量保证环境配置信息
 * Created by fu_gh on 2017-11-28 19:40
 */
const path = require('path');

module.exports = {
    port: 5100,
    debug: false,
    mysql: {
        host: '219.142.131.131',
        user: 'zxbike',
        port: 3306,
        password: 'Zxbike2017.com',
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