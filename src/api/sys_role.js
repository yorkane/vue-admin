import service from '../utils/service'
import klib_api from '../klib/api'


const key = 'sys_role';
/**
 * @class roleAPI:klib_api
 * */
const roleAPI = {
  /**
   *
   * @param key
   * @param params
   * @param store
   * @returns {roleAPI}
   */
  new(params, store) {
    return this.newInstance(key, params, store)
  },
  IS_TREE: true,
  getDataStruct() {
    return this._getDataStruct(key, '/lor/role/desc')
  },
  getData(params, forceReload) {
    return this._getData(params, forceReload, key, '/lor/role/tree', true)
  },
  getTree(params, forceReload) {
    return this._getData(params, forceReload, key, '/lor/role/tree', true)
  },
  update(data) {
    return service({
      url: 'lor/role/update',
      method: 'post',
      data
    })
  },
  deleteById(params) {
    return service({
      url: 'lor/role/delete',
      method: 'get',
      params
    })
  },
  info(id) {
    return service({
      url: 'lor/role/info/' + id,
      method: 'get',
    })
  },
  insert(data) {
    return service({
      url: 'lor/role/insert',
      method: 'post',
      data
    })
  }
}
roleAPI.__proto__ = klib_api

export default roleAPI
