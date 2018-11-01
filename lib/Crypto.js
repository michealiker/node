/**
 * 加密类
 * Created by fu_gh on 2017-11-03 17:00
 */
const crypto = require('crypto');

class Crypto {

    /**
     * md5算法
     * @param str
     * @returns {*}
     * @constructor
     */
    static MD5(str) {
        return crypto
            .createHash('md5')
            .update(str, 'utf8')
            .digest('hex');
    }

    /**
     * RSASHA1 算法
     * @param str
     * @param privateKey
     * @returns {*}
     * @constructor
     */
    static RSASHA1(str, privateKey) {
        var sign = crypto.createSign('RSA-SHA1');
        sign.update(str);
        return sign.sign(privateKey, 'base64');
    }

    /**
     * RSA-SHA256
     * @param data
     * @param key
     * @returns {*|number}
     * @constructor
     */
    static RSASHA256(data, key) {
        return crypto.createSign('RSA-SHA256')
            .update(data)
            .sign(key, 'base64');
    }

    /**
     * SHA1算法
     * @param str
     * @returns {*}
     * @constructor
     */
    static SHA1(str) {
        var md5sum = crypto.createHash('sha1');
        md5sum.update(str, 'utf8');
        str = md5sum.digest('hex');
        return str;
    }
}

module.exports = Crypto;