import klib_api from "../klib/api";
import service from "../utils/service";

const api = '/app/v1/api/'
/** @class ipAPI:modelAPI
 */
const sysAPI = {
  getInfo(id) {
    return service({
      url: api + id,
      method: 'get',
    })
  },
  runSchedule(id) {
    return service({
      url: api + 'approot.scheduler.init/run_by_id',
      method: 'post',
      data: {schedule_id: id},
    })
  },
}

export default sysAPI
