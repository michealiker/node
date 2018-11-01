/**
 * 环境配置类
 * Created by fu_gh on 2017-11-28 19:33
 */

const path = require('path');
const moment = require('moment');
const mkdirp = require('mkdirp');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const envType = require('./envType');
const dateFormat = function () {
	return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
};
//日志文件夹自动创建
const logDir = './logs/';

//当前环境类型
const currentDevType = envType.dev;

class EnvConfig {

    /**
	 * 构造
     */
	constructor(){
		try {
            mkdirp.sync(logDir);
            this.config = require(process.cwd()+'/config/env/'+currentDevType);
            //错误日志配置
            this.config.logger = new (winston.Logger)({
                transports: [
                    new DailyRotateFile({
                        name: 'info-file',
                        filename: path.join(logDir, 'info.log'),
                        level: 'info',
                        timestamp: dateFormat,
                        localTime: true,
                        maxsize: 1024 * 1024 * 10,
                        datePattern: '.yyyy-MM-dd'
                    }),
                    new DailyRotateFile({
                        name: 'error-file',
                        filename: path.join(logDir, 'error.log'),
                        level: 'error',
                        timestamp: dateFormat,
                        localTime: true,
                        maxsize: 1024 * 1024 * 10,
                        datePattern: '.yyyy-MM-dd'
                    })
                ]
            });
		} catch (e){
			console.log('初始化环境配置信息失败！',e);
		}
	}
}

//崩溃日志
winston.handleExceptions(new winston.transports.File({
	filename: path.join(logDir, 'crash.log'),
	handleExceptions: true,
	timestamp: dateFormat,
	humanReadableUnhandledException: true,
	json: false
}));

let envConfigInstance = null;

/**
 * 环境配置单例
 * @returns {*}
 */
module.exports.getInstance = ()=>{
	if(!envConfigInstance){
		envConfigInstance = new EnvConfig();
	}
	return  envConfigInstance;
}
