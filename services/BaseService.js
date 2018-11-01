/**
 * 服务层的基类
 * Created by fu_gh on 2017-10-10 17:59
 */
const CurrentUser = require('../lib/CurrentUser');
const BaseModel = require('../models/BaseModel');

class  BaseService {

    /**
     * 构造
     * @param req 当前httpRequest对象
     */
    constructor(req) {
        if (req) {
            this.currentUser = new CurrentUser(req);
        }
        this.baseModel = new BaseModel();
    }

    /**
     * 创建基础对象
     * @returns {{create_time: Date, create_by: number}}
     */
    createBaseObj() {
        return {
            create_time: new Date(),
            create_by: this.currentUser.getUser().id,
        };
    }

    /**
     *更新基础对象
     * @returns {{update_time: Date, update_by: number}}
     */
    updateBaseObj() {
        return {
            update_time: new Date(),
            update_by: this.currentUser.getUser().id,
        };
    }

    /**
     * 省市区域
     * @param callback
     */
    getRegion(callback) {
        let self = this;
        self.baseModel.getRegionList((err, data) => {
            let regions = [];
            if (!err && data.length) {
                let china = data[0];
                data.forEach(item => {
                    if (item.PARENT_ID == china.REGION_ID) {
                        let regionObj = {
                            id: item.REGION_ID,
                            name: item.REGION_NAME,
                            area: item.REGION_AREA,
                            level: 1,
                            child: []
                        };
                        self._createRegionChild(regionObj, data);
                        regions.push(regionObj);
                    }
                });
            }
            callback(err, regions);
        });
    }

    /**
     * 生成区域子集
     * @param region
     * @param list
     * @private
     */
    _createRegionChild(region,list) {
        list.forEach(item => {
            if (item.PARENT_ID == region.id) {
                let regionObj = {
                    id: item.REGION_ID,
                    name: item.REGION_NAME,
                    level: region.level + 1,
                    child: []
                };
                this._createRegionChild(regionObj,list);
                region.child.push(regionObj);
            }
        });
    }

}
module.exports = BaseService;