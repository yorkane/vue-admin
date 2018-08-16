import axios from 'axios'
import {Message} from 'element-ui'
import {app} from '../main'
import store from '../store'
import {getAuthToken, setAuthToken, isLogin, expiredToken} from '../utils/auth'
import mockData from '../api/MockData'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.SYS_API, // api的base_url
  timeout: 15000                  // 请求超时时间
})

function getTimestamp() {
  return Math.floor(Date.now() / 10000) * 10
}

function console_error(res, err) {
  let url = res.config.url
  if (url.indexOf('/') === 0) {
    url = location.origin + url
  }
  console.error('%c axios response failed:', 'background:yellow;color:red', err, '\n' + res.config.method + ' : ', url, ' Data: ', res.config.data)
}

// request拦截器
service.interceptors.request.use(req => {
  if (process.env.IS_MOCK) {
    console.log('mock request start', req.url) // for debug
    return req
  }
  // if (req.url.indexOf('?') > 0) {
  //   req.url += '&t=' + getTimestamp()
  // } else {
  //   req.url += '?t=' + getTimestamp()
  // }
  // if (store.getters.token) {
  let token = getAuthToken()
  if (token) {
    req.headers['x-gtoken'] = token// 让每个请求携带自定义token 请根据实际情况自行修改
    // console.log(getAuthToken())
  }
  return req
}, error => {
  if (process.env.IS_MOCK) {
    console.log('mock request error end') // for debug
    return
  } else {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    let url = response.config.url
    if (process.env.IS_MOCK) {
      let murl = url.replace(response.config.baseURL, '')
      let data = {data: mockData.getData(murl)}
      console.log('mock get response', response.config.url) // for debug
      return data
      // return response;
    } else {
      const res = response;
      let token = response.headers['set-gtoken']
      if (token) {
        setAuthToken(token)
      }
      if (res.data && res.data.err) {
        console_error(res, res.data.err)
        Message({
          message: res.data.err,
          type: 'error',
          duration: 3 * 1000
        });
        return Promise.reject(res.data.err)
      }
      // console.debug('axios-request:', url, ' \nResponse:', res, '\nData:', res.data)

      return res
    }
  },
  error => {
    if (process.env.IS_MOCK) {
      let url = error.config.url
      url = url.replace(error.config.baseURL, '')
      let data = {data: mockData.getData(url)}
      console.log('mock get error response, overwrite with mock data', error.config.url) // for debug
      return Promise.resolve(data)
    } else {
      let msg
      try {
        msg = JSON.stringify(error.response)
      } catch (e) {
        msg = 'JSON parse err:' + e
      }
      console_error(res, msg)
      if (error.response && error.response.data) {
        msg = error.response.data
        msg = msg.err || error.message
        Message({
          message: msg,
          type: 'error',
          duration: 3 * 1000
        })
      }

      // console.log(router)
      if (msg && msg.indexOf('401') > -1) {
        app.$notify.warning({title: '系统错误', message: msg});
        expiredToken()
      }
      return Promise.reject(error)
    }
  }
)

export default service
