import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const AuthKey = '__gate__auth'

function getRootDomain() {
  let host = location.host
  let m = host.match(/\w+\.[a-z]+\w+$/i);
  if (m) {
    return m[0]
  }
  return host.replace(/:\d+/, '')
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getName() {
  let t = getAuthToken()
  if (t) {
    return t.split('!')[0]
  }
}

export function isLogin() {
  let t = getAuthToken()
  //Has name!xxxxxxx
  if (t && t.split('!')[1]) {
    return true
  }
  return false
}

export function expiredToken() {
  let name = getName()
  removeAuthToken()
  if (name) {
    setAuthToken(name)
  }
  // setTimeout(()=>{
  //   alert('您的登录已经失效，请重新登录')
  // },10)
}

export function getAuthToken() {
  return Cookies.get(AuthKey)
}

export function setAuthToken(token) {
  let rootDomain = getRootDomain()
  console.log('set cookie', AuthKey, token, {expires: 30, path: '/', domain: rootDomain})
  return Cookies.set(AuthKey, token, {expires: 30, path: '/', domain: rootDomain})
}

export function removeAuthToken() {
  console.log('removeAuthToken', getAuthToken())
  Cookies.set(AuthKey, '', {expires: -1, path: '/', domain: location.host})
  Cookies.set(AuthKey, '', {expires: -1, path: '/', domain: getRootDomain()})
  return Cookies.remove(AuthKey)
}
