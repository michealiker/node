/**
 * redis客服端封装
 * Created by fu_gh on 2017-11-10 14:05
 */

const conf = require('../config/config').getInstance().config;
const redis = require('redis');

class RedisClient {

    /**
     * 构造
     */
    constructor() {
        this.client = redis.createClient({port: conf.redis.port, host: conf.redis.host, db: conf.redis.db});
        this.client.auth(conf.redis.passwd);
        this.client.on('error', (err) => {
            if (err) {
                console.log('connect to redis error: ');
                console.log(err);
                process.exit(1);
            }
        });
        this.client.on('connect', () => {
            console.log('connect redis ok.');
        });
    }

    /**
     * 取得客户端对象
     * @returns {*}
     */
    getClient() {
        return this.client;
    }

    /**
     * 设置对象并设过期时间
     * @param key
     * @param obj
     * @param expireSecond
     * @param callback
     */
    setObjectAndExpire(key, obj, expireSecond, callback) {
        this.client.set(key,JSON.stringify(obj),(err)=>{
            if(!err){
                this.client.expire(key,expireSecond,callback);
            }else {
                callback(err);
            }
        });
    }

    /**
     * 取得对象
     * @param key
     * @param callback
     */
    getObject(key, callback) {
        this.client.get(key, (err, reData) => {
            if (reData) {
                reData = JSON.parse(reData);
            }
            callback(err, reData);
        });
    }
}

let redisClientInstance = null;

module.exports.getInstance = ()=>{
    if(!redisClientInstance){
        redisClientInstance = new RedisClient();
    }
    return redisClientInstance;
}