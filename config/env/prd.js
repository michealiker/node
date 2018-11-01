/**
 * 生产环境配置信息
 * Created by fu_gh on 2017-11-28 19:41
 */
const path = require('path');

module.exports = {
    port: 5100,
    debug: false,
    mysql: {
        host: '172.16.1.90',
        user: 'zxbike',
        port: 3306,
        password: 'Zxbike#2017.com',
        database: '',
    },
    redis: {
        host: 'codis-tcp.zxbike.cn',
        db: 5,
        port: 36379,
        passwd: 'O&PGA!3hY2RL7J7g'
    },
    baseDb: 'mall',
    db: {
        'mall': 'mysql',
    },
}