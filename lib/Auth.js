/**
 * 认证类
 * Created by fu_gh on 2017-10-11 13:57
 */
const config = require('../config/config').getInstance().config;
const Async = require('async');
const request = require('request');

class  Auth {
    /**
     * 认证检查
     * @param req
     * @param res
     * @param next
     */
    check(req, res, next) {
        let self = this;
        let token = req.cookies.oms_token;
        if (config.debug) {
            token = 12;
        }
        //是否认证
        let hasAuth = false;
        //是否第一次登录
        let hasFirstLogin = false;
        Async.auto({
            hasAuth: (cb) => {
                if (token && req.session.token) {
                    self._refreshToken(res,token);
                    hasAuth = true;
                }
                if (!req.session.token) {
                    hasFirstLogin = true;
                }
                cb(null);
            },
            getUser: ['hasAuth', (results, cb) => {
                if (!hasAuth && hasFirstLogin && token) {
                    //未认证并且是第一次登录从SSO系统里取用户信息
                    self._getUserInfoByToken(token, (err, data) => {
                        cb(err, data);
                    });
                } else {
                    cb(null);
                }
            }],
            saveSession: ['getUser', (results, cb) => {
                if (!hasAuth && hasFirstLogin && token) {
                    req.session.regenerate(() => {
                        req.session.token = results.getUser;
                        hasAuth = true;
                        cb(null);
                    });
                } else {
                    cb(null);
                }
            }]
        }, function (err, data) {
            if (!hasAuth || err) {
                res.send({code: 300, msg: '未登录', data: {sso: config.sso}});
            } else {
                next();
            }
        });
    }

    /**
     * 通过token取用户信息
     * @param token
     * @param callback
     * @private
     */
    _getUserInfoByToken(token,callback) {
        let employee;
        request({
            url: config.sso + '/api/employee/info',
            method: 'POST',
            form: {token},
        }, function (err, res, body) {
            if (!err) {
                try {
                    let bodyJson = JSON.parse(body);
                    if (bodyJson.code == 200) {
                        employee = bodyJson.data;
                    } else {
                        err = bodyJson.msg;
                    }
                } catch (e) {
                    err = e;
                }
            }
            callback(err, employee);
        });
    }

    /**
     * 刷新token
     * @param token
     * @private
     */
    _refreshToken(res,token) {
        res.cookie('oms_token', token, {domain: config.domain, httpOnly: false, maxAge: 1000 * 60 * 60 * 2});
    }
}


let authInstance = null;

/**
 * 取得认证的单例对象
 * @returns {*}
 */
module.exports.getInstance = ()=>{
    if(!authInstance){
        authInstance = new Auth();
    }
    return authInstance;
}