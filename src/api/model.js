import service from '../utils/service'
import klib_api from '../klib/api'

/** @class modelAPI
 *
 */
const modelAPI = {
  /**
   *
   * @param key
   * @param params
   * @param store
   * @returns {modelAPI}
   */
  new(key, params, store = this.$store) {
    return this.newInstance(key, params, store)

  },
  getDataStruct() {
    let pro = this._getDataStruct(this.key,'/app/model/' + this.key + '/desc', this.params)
    pro.then(data => {
      this.isTree = data._IS_TREE
    })
    return pro
  },
  getData(params, forceReload) {
    // console.log('getData invoked', this.key)
    if (this.isTree) {
      return this.getTree(params, forceReload)
    }
    return this._getData(params, forceReload, this.key,'/app/model/' + this.key + '/list')
  },
  getTree(params, forceReload) {
    return this._getData(params, forceReload, this.key,'/app/model/' + this.key + '/tree', true)
  },
  getList(key, data) {
    return service({
      url: 'app/model/' + key + '/list',
      method: 'post',
      data
    })
  },
  batchUpdate(idList, data) {
    if (idList.join) {
      idList = idList.join(',')
    }
    return service({
      url: 'app/model/' + this.key + '/batch/' + idList,
      method: 'patch',
      data
    })
  },
  update(data) {
    return service({
      url: 'app/model/' + this.key + '/update',
      method: 'post',
      data
    })
  },
  deleteById(id) {
    return service({
      url: 'app/model/' + this.key + '/' + id,
      method: 'delete'
    })
  },
  insert(data) {
    return service({
      url: 'app/model/' + this.key + '/insert',
      method: 'post',
      data
    })
  },
}
modelAPI.__proto__ = klib_api

export default modelAPI
