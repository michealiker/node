/**
 * 数据层基类
 * Created by fu_gh on 2017-10-11 15:10
 */

const Comm = require('../middlewares/comm');
const config = require('../config/config').getInstance().config;
const Async = require('async');

class BaseModel {

    /**
     * 构造
     */
    constructor() {
        //基础数据库
        this.baseDb = config.baseDb + '.';
    }

    /**
     * 执行sql
     * @param param
     * @param callback
     */
    execSql(param, callback) {
        Comm.execSql(config.baseDb, param, callback);
    }

    /**
     * 执行事物sql集合
     * @param sqls
     * @param callback
     */
    execTranSql(sqls,callback) {
        let self = this;
        if(Object.prototype.toString.call(sqls) != '[object Array]'){
            return callback('无效的参数');
        }
        Async.auto({
            conn: cb => {
                self._getConnection(cb);
            },
            beginTran: ['conn', (results, cb) => {
                results.conn.query('set autocommit = 0',cb);
            }],
            exec: ['beginTran', (results, cb) => {
                let conn = results.conn;
                Async.eachSeries(sqls, (item, scb) => {
                    if (item.option) {
                        conn.query(item.sql, item.option, scb);
                    } else {
                        conn.query(item.sql, scb);
                    }
                }, (err) => {
                    if (err) {
                        conn.query('rollback',(error)=>{
                            cb(err);
                        });
                    } else {
                        conn.query('commit',cb);
                    }
                });
            }]
        }, (err, data) => {
            if (data.conn) {
                data.conn.destroy();
            }
            callback(err);
        });
    }

    /**
     * 数据库连接对象
     * @param callback
     * @private
     */
    _getConnection(callback) {
        Async.auto({
            pool: cb => {
                Comm.getPoolSer(config.baseDb, cb);
            },
            conn: ['pool', (results, cb) => {
                results.pool.getConnection(cb);
            }]
        }, (err, data) => {
            callback(err, data.conn);
        });
    }

    /**
     * 取得带条件的sql
     * @param sql
     * @param option
     * @returns {{sql: *, options: *}}
     */
    getExecParamByOption(sql, options) {
        return {
            sql: sql,
            option: options,
        };
    }

    /**
     *  生成sql in 里面参数
     * @param values
     * @returns {string}
     */
    createSqlInParam(values) {
        let ids = '';
        values.forEach(item => {
            if (item) {
                ids += '"' + item + '",';
            }
        });
        if (ids) {
            ids = ids.substr(0, ids.length - 1);
        }
        return ids;
    }

    /**
     * 省市区域列表
     * @param callback
     */
    getRegionList(callback){
        let sql = 'select REGION_ID,REGION_CODE,REGION_NAME,PARENT_ID,REGION_AREA from '+this.baseDb+'b_region order by REGION_ID;'
        this.execSql({sql},callback);
    }
}

module.exports = BaseModel;