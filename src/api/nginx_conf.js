import service from '../utils/service'
import klib_api from '../klib/api'

const key = 'nginx_conf'
const NginxConfAPI = {
  new(params, store) {
    return this.newInstance(key, params, store)
  },
  getDataStruct() {
    return this._getDataStruct(key, '/app/nginx/desc')
  },

  getData(params, forceReload) {
    return this._getData(params, forceReload, key, '/app/nginx/list')
  },
  update(data) {
    return service({
      url: 'app/nginx/update',
      method: 'post',
      data
    })
  },
  deleteById(id) {
    return service({
      url: 'app/nginx/' + id,
      method: 'delete'
    })
  },
  insert(data) {
    return service({
      url: 'app/nginx/insert',
      method: 'post',
      data
    })
  },
}
NginxConfAPI.__proto__ = klib_api
export default NginxConfAPI
