/**
 * 枚举帮助类
 * Created by fu_gh on 2017-10-16 16:35
 */

class EnumHelper {

    /**
     * 取得所有枚举值和描述的集合
     * @param enumObj
     * @returns {Array}
     */
    static getAllEnums(enumObj) {
        let returnArr = [];
        if (typeof (enumObj) === 'object') {
            let keys = Object.keys(enumObj);
            keys.forEach(function (item) {
                returnArr.push(enumObj[item]);
            });
        }
        return returnArr;
    }

    /**
     *  将枚举类型转换成字典类型
     * @param enumObj
     * @returns {{}}
     */
    static getAllEnumDict(enumObj) {
        let returnDict = {};
        if (typeof (enumObj) === 'object') {
            let keys = Object.keys(enumObj);
            keys.forEach(function (item) {
                let enumValue = enumObj[item];
                let dictKey = enumValue.value;
                if (!(dictKey in returnDict)) {
                    returnDict[dictKey] = enumValue;
                }
            });
        }
        return returnDict;
    }
}

module.exports = EnumHelper;