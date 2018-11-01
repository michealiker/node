/**
 * 控制器的基类
 * Created by fu_gh on 2017-10-10 15:04
 */

const Async = require('async');
const DataTypeEnum = require('../lib/enum/DataType');
const CurrentUser = require('../lib/CurrentUser');
const EnumHelper = require('../lib/EnumHelper');

class BaseController {

    /**
     * 构造
     */
    constructor(req) {
        if (req) {
            this.currentUser = new CurrentUser(req);
        }
        //数据类型枚举
        this.dataTypeEnum = DataTypeEnum;
        this.EnumHelper = EnumHelper;
        //默认分页页面数据大小
        this.DEFAULT_PAGE_SIZE = 10;
    }

    /**
     * 参数有效性检验
     * @param params
     * @param callback
     */
    checkParam(params, callback) {
        let self = this;
        if (!params || !params.length) {
            callback(null);
            return;
        }
        Async.each(params, function (item, cb) {
            let msg = '参数不完整';
            let error = false;
            if (!item.value) {
                error = true;
            }
            if (!error && (item.type == self.dataTypeEnum.number || item.type == self.dataTypeEnum.int)) {
                if (isNaN(item.value)) {
                    error = true;
                } else {
                    item.value = Number(item.value);
                    if (item.min !== undefined && item.value < item.min) {
                        error = true;
                        msg = '超出取值范围';
                    }
                    if (item.max !== undefined && item.value > item.max) {
                        error = true;
                        msg = '超出取值范围';
                    }
                }
            }
            if (!error && item.rangeValue) {
                error = self._checkValueRange(item.value, item.rangeValue);
                if (error) {
                    msg = '不是有效的范围';
                }
            }
            if (!error && self.dataTypeEnum.identity === item.type) {
                error = self._checkIdentity(item.value);
                if (error) {
                    msg = '请输入正确的身份证号码';
                }
            }
            if (!error && self.dataTypeEnum.mobilePhone === item.type) {
                error = self._checkPhone(item.value);
                if (error) {
                    msg = '请输入正确的手机号';
                }
            }
            if (!error && self.dataTypeEnum.date === item.type) {
                error = self._checkDate(item.value);
                if (error) {
                    msg = '请输入正确的日期';
                }
            }
            if (error) {
                cb(msg);
            } else {
                cb(null);
            }
        }, function (err) {
            callback(err);
        });
    }

    /**
     * 检查值是否在范围之内
     * @param value
     * @param ranges
     * @returns {boolean}
     * @private
     */
    _checkValueRange(value, ranges) {
        return !ranges.some(el => el == value);
    }

    /**
     * 检查是否日期
     * @param value
     * @returns {boolean}
     * @private
     */
    _checkDate(value) {
        return new Date(value) == 'Invalid Date';
    }

    /**
     * 检查身份证
     * @param value
     * @returns {boolean}
     * @private
     */
    _checkIdentity(value) {
        return !(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/i.test(value));
    }

    /**
     * 检查手机号
     * @param value
     * @returns {boolean}
     * @private
     */
    _checkPhone(value) {
        return !/^1\d{10}$/.test(value);
    }

    /**
     *接口返回对象
     * @param err
     * @returns {{code: number, msg: *}}
     */
    getReturnObj(err) {
        let returnObj = {
            code: 200,
            msg: err,
        };
        if (err) {
            returnObj.code = 500;
        }
        return returnObj;
    }

    /**
     * 分页对象
     * @param pageNo 第几页 从1开始
     * @returns {{page_start: number, page_size: number}}
     */
    getPageObj(pageNo) {
        return {
            page_start: (pageNo * this.DEFAULT_PAGE_SIZE) - this.DEFAULT_PAGE_SIZE,
            page_size: this.DEFAULT_PAGE_SIZE,
        }
    }

    /*
     * 去除字符串中空格
     * */
    trimString(str, is_global) {
        let result;
        result = str.replace(/(^\s+)|(\s+$)/g, '');
        if (is_global.toLowerCase() == 'g') {
            result = result.replace(/\s/g, '');
        }
        return result;
    }

}

module.exports = BaseController;