import klib_api from "../klib/api";

const key = 'sys_ip'
/** @class ipAPI:modelAPI
 */
const ipAPI = {
  /**
   *
   * @param params
   * @param store
   * @returns {ipAPI}
   */
  new(params, store) {
    return this.newInstance(key, params, store)
  },
}
ipAPI.__proto__ = klib_api

export default ipAPI
