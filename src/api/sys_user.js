import service from '../utils/service'
import klib_api from '../klib/api'

const key = 'sys_user';
/** @class userAPI:klib_api
 *
 */
const userAPI = {
  /**
   *
   * @param params
   * @param store
   * @returns {userAPI}
   */
  new(params, store = this.$store) {
    return this.newInstance(key, params, store)
  },
  getDataStruct() {
    return this._getDataStruct(key, '/lor/sys_user/desc')
  },
  getData(params, forceReload) {
    return this._getData(params, forceReload, key, '/lor/sys_user/list')
  },
  getUserInfo() {
    return service({
      url: 'lor/sys_user/info',
      method: 'get'
    })
  },
  update(data) {
    return service({
      url: 'lor/sys_user/update',
      method: 'post',
      data
    })
  },
  deleteById(id) {
    return service({
      url: 'lor/sys_user/' + id,
      method: 'delete',
    })
  },
  insert(data) {
    return service({
      url: 'lor/sys_user/insert',
      method: 'post',
      data
    })
  },
  signUp(data) {
    return service({
      url: 'lor/sys_user/signup',
      method: 'post',
      data
    })
  },
  selfService(data) {
    return service({
      url: 'lor/sys_user/self_service',
      method: 'post',
      data
    })
  },
  changePassword(data) {
    return service({
      url: 'lor/sys_user/change_password',
      method: 'post',
      data
    })
  },
  resetPasswordStep1(data) {
    return service({
      url: 'lor/sys_user/reset_password_step1',
      method: 'post',
      data
    })
  },
  resetPasswordStep2(data) {
    return service({
      url: 'lor/sys_user/reset_password_step2',
      method: 'post',
      data
    })
  },
  mailNotify(data) {
    return service({
      url: 'lor/sys_user/send_mail',
      method: 'post',
      data
    })
  },
  batchUpdate(idList, data) {
    if (idList.join) {
      idList = idList.join(',')
    }
    return service({
      url: 'lor/sys_user/batch/' + idList,
      method: 'patch',
      data
    })
  },
}
userAPI.__proto__ = klib_api

export default userAPI
