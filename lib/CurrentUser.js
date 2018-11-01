/**
 *  当前登录用户类
 * Created by fu_gh on 2017-10-11 13:18
 */
//总部机构代码
const DEFAULT_HQ_CODE = '101030000';

class CurrentUser {

    /**
     * 构造
     * @param req 当前httpRequest对象
     */
    constructor(req) {
        if (req) {
            //当前httpRequest对象
            this._req = req;
            //当前登录用户
            this._user = req.session.token.user;
            this._menus = req.session.token.menus;
            this._subSystems = req.session.token.subSystems;
            this._authCode = req.session.token.authCode;
            this._custom = req.session.token.custom;
            this._department = req.session.token.department;
        }
    }

    /**
     * 取得用户
     * @returns {*}
     */
    getUser() {
        return this._user;
    }

    /**
     * 业务子系统
     * @param subSystemCode
     * @returns {*}
     */
    getSubSystems(subSystemCode) {
        let arr = [];
        let currSys = null;
        this._subSystems.find((item) => {
            if (item.code == subSystemCode) {
                currSys = item;
            } else {
                arr.push(item);
            }
        });
        return currSys ? [currSys].concat(arr) : [];
    }

    /**
     * 业务子系统名称
     * @param subSystemCode
     */
    getSubSystemName(subSystemCode){
        let name = '';
        for (let i = 0; i < this._subSystems.length; i++) {
            if (this._subSystems[i].code == subSystemCode) {
                name = this._subSystems[i].name;
                break;
            }
        }
        return name;
    }

    /**
     * 取得菜单集合
     * @param subSystemCode 子系统编码
     * @returns {*}
     */
    getMenus(subSystemCode) {
        let arr = [];
        for (let i = 0; i < this._menus.length; i++) {
            if (this._menus[i].subsystemCode == subSystemCode) {
                arr = this._menus[i].subs;
                break;
            }
        }
        return arr;
    }

    /**
     * 根据授权编码取得对应的机构集合
     * @param authCode
     * @param hasHeadOffice 是否有总公司
     * @returns {Array}
     */
    getCompanys(authCode, hasHeadOffice) {
        let companyMap = new Map();
        if (this.hasAuth(authCode)) {
            let companys = [];
            if (this._user.is_custom) {
                //员工自定义机构
                let jobs = this._authCode[authCode];
                if (jobs && jobs.length) {
                    jobs.forEach(id => {
                        if (id.toString() in this._custom) {
                            companys = companys.concat(this._custom[id.toString()]);
                        }
                    });
                }
            } else {
                companys = this._department;
            }
            companys.forEach(item => {
                //去除重复的机构
                if (item && !companyMap.has(item.id)) {
                    if (item.id == DEFAULT_HQ_CODE) {
                        if (hasHeadOffice) {
                            companyMap.set(item.id, item);
                        }
                    } else {
                        companyMap.set(item.id, item);
                    }
                }
            });
        }
        return [...companyMap.values()];
    }

    /**
     * 根据授权编码,机构类型，机构地区取得机构集合
     * @param authCode
     * @param type 机构类型
     * @param area 机构地区
     * @param hasHeadOffice 是否有总公司
     * @returns {Array}
     */
    getCompanysByTypeAndArea(authCode, type, area, hasHeadOffice) {
        let allCompanys = this.getCompanys(authCode, hasHeadOffice);
        let searchMethod;
        if (!type && !area) {
            searchMethod = 1;
        }
        if (!type && area) {
            searchMethod = 2;
        }
        if (type && !area) {
            searchMethod = 3;
        }
        if (type && area) {
            searchMethod = 4;
        }
        let companys = [];
        if (searchMethod != 1) {
            allCompanys.forEach(item => {
                if (searchMethod == 2) {
                    if (area == item.area) {
                        companys.push(item);
                    }
                } else if (searchMethod == 3) {
                    if (type == item.type) {
                        companys.push(item);
                    }
                } else {
                    if (type == item.type && area == item.area) {
                        companys.push(item);
                    }
                }
            });
        } else {
            companys = allCompanys;
        }
        return companys;
    }

    /**
     * 是否授权
     * @param authCode 授权编码
     * @returns {boolean}
     */
    hasAuth(authCode) {
        let result = false;
        if (this._authCode && authCode && authCode in this._authCode) {
            result = true;
        }
        return result;
    }
}

module.exports = CurrentUser;