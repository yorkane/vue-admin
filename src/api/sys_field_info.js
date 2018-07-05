import service from '../utils/service'
import klib_api from '../klib/api'
import ds from './datastruct/sys_field_info'

const key = 'sys_field_info';
/** @class sys_field_infoAPI:klib_api
 *
 */
const sys_field_infoAPI = {
  /**
   *
   * @param params
   * @param store
   * @returns {sys_field_infoAPI}
   */
  new(params, store = this.$store) {
    let ds = require('./datastruct/' + key + '.js')
    let inst = this.newInstance(key, params, store)
    if (ds) {
      inst.loadDataStruct(ds.default)
    }
    return inst
  },
  getDataStruct() {
    if (this.dataStruct) {
      return new Promise((resolve, reject) => {
        resolve(this.dataStruct)
      });
    }
    return this._getDataStruct(key)
  },
  getData(params, forceReload) {
    return this._getData(params, forceReload, key, '/app/model/sys_field_info/list')
  },
  update(data) {
    return service({
      url: 'app/sys_field/update',
      method: 'post',
      data
    })
  },
  deleteById(id) {
    return service({
      url: 'app/model/sys_field_info/' + id,
      method: 'delete',
    })
  },
  insert(data) {
    return service({
      url: 'app/model/sys_field_info/insert',
      method: 'post',
      data
    })
  },

  batchUpdate(idList, data) {
    if (idList.join) {
      idList = idList.join(',')
    }
    return service({
      url: 'app/model/sys_field_info/batch/' + idList,
      method: 'patch',
      data
    })
  },
}
sys_field_infoAPI.__proto__ = klib_api

export default sys_field_infoAPI
