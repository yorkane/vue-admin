import modelAPI from './model'
import klib_api from "../klib/api";

/** @class categoryAPI:modelAPI
 */
const categoryAPI = {
  key: 'sys_category',
  /**
   *
   * @param params
   * @param store
   * @returns {categoryAPI}
   */
  new(params, store) {
    return this.newInstance(this.key, params, store)
  },
}
categoryAPI.__proto__ = klib_api

export default categoryAPI
