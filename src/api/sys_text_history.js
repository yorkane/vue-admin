import service from '../utils/service'
import klib_api from '../klib/api'

const key = 'sys_text_history'
const textHistory = {
  new(params, store) {
    return this.newInstance(key, params, store)
  },
  getDataStruct() {
    return this._getDataStruct(key, '/app/text/desc')
  },
  getData(params, forceReload) {
    return this._getData(params, forceReload, key, '/app/text/list')
  },
  update(data) {
    return service({
      url: 'app/text/update',
      method: 'post',
      data
    })
  },
  deleteById(id) {
    return service({
      url: 'app/text/' + id,
      method: 'delete'
    })
  },
  insert(data) {
    return service({
      url: 'app/text/insert',
      method: 'post',
      data
    })
  },
  getLatestById(id) {
    return service({
      url: 'app/text/lastest/' + id,
      method: 'get',
    })
  },
}
textHistory.__proto__ = klib_api

export default textHistory
