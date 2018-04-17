import service from '../utils/service'
import klib_api from "../klib/api";

export function getList(params) {
  return service({
    url: 'lor/menu/tree?tname=sys_menu',
    method: 'get',
    params
  })
}


export function desc(params) {
  return service({
    url: 'lor/menu/desc',
    method: 'get',
    params
  })
}


export function update(data) {
  return service({
    url: 'lor/menu/update',
    method: 'post',
    data
  })
}

export function deleteById(params) {
  return service({
    url: 'lor/menu/delete',
    method: 'get',
    params
  })
}

export function insert(data) {
  return service({
    url: 'lor/menu/insert',
    method: 'post',
    data
  })
}

const key = 'sys_menu';
/**
 * @class menuAPI:klib_api
 * */
const menuAPI = {
  /**
   *
   * @param params
   * @param store
   * @returns {menuAPI}
   */
  new(params, store) {
    return this.newInstance(key, params, store)
  },

  getDataStruct() {
    return this._getDataStruct(key, '/lor/menu/desc')
  },
  getTree(params, forceReload) {
    return this._getData(params, forceReload, key, '/lor/menu/tree', true)
  },
  getData(params, forceReload) {
    return this._getData(params, forceReload, key, '/lor/model/' + key + '/list')
  },
  update(data) {
    return service({
      url: 'lor/menu/update',
      method: 'post',
      data
    })
  },
  deleteById(params) {
    return service({
      url: 'lor/menu/delete',
      method: 'get',
      params
    })
  },

  insert(data) {
    return service({
      url: 'lor/menu/insert',
      method: 'post',
      data
    })
  }
}
menuAPI.__proto__ = klib_api

export default menuAPI
