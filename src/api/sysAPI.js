import klib_api from "../klib/api";
import service from "../utils/service";

const key = 'jit_api1'
/** @class ipAPI:modelAPI
 */
const sysAPI = {
  getInfo(class_name, method_name) {
    return service({
      url: '/app/v1/api/' + class_name + '/' + method_name,
      method: 'get',
    })
  }
}

export default sysAPI
