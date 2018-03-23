import service from '../utils/service'
import klib_api from '../klib/api'

const key = 'nginx_timer'
/**
 * @class timerAPI:klib_api
 * */
const timerAPI = {
  /**
   *
   * @param params
   * @param store
   * @returns {timerAPI}
   */
  new(params, store) {
    return this.newInstance(key, params, store)
  },

  getDataStruct() {
    return this._getDataStruct(key, '/lor/timer/desc')
  },
  getData(params, forceReload) {
    return this._getData(params, forceReload, key, '/lor/timer/list')
  },
  getTree() {
    return 'not implemented'
  },
  tree() {
    // return klib_api.tree.call(this)
    return 'not implemented'
  },
  update(data) {
    return service({
      url: 'lor/timer/pause/' + data,
      method: 'post',
    })
  },
  deleteById(id) {
    return service({
      url: 'lor/timer/' + id,
      method: 'delete',
    })
  },

  insert(data) {
    return service({
      url: 'lor/timer/insert',
      method: 'post',
      data
    })
  }
}
timerAPI.__proto__ = klib_api
export default timerAPI
