import service from '../utils/service'
import klib_api from '../klib/api'

const key = 'sys_text_history'
const textHistory = {
  new(params, store) {
    return this.newInstance(key, params, store)
  },
  getDataStruct() {
    return this._getDataStruct(key, '/lor/text/desc')
  },
  getData(params, forceReload) {
    return this._getData(params, forceReload, key, '/lor/text/list')
  },
  update(data) {
    return service({
      url: 'lor/text/update',
      method: 'post',
      data
    })
  },
  deleteById(id) {
    return service({
      url: 'lor/text/' + id,
      method: 'delete'
    })
  },
  insert(data) {
    return service({
      url: 'lor/text/insert',
      method: 'post',
      data
    })
  },
}
textHistory.__proto__ = klib_api

export default textHistory
