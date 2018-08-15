import Cookies from 'js-cookie'

const AuthKey = '_g_auth'

function getRootDomain() {
  let host = location.host
  let m = host.match(/\w+\.[a-z]+\w+$/i);
  if (m) {
    return m[0]
  }
  return host.replace(/:\d+/, '')
}


export function getName() {
  let t = getAuthToken()
  if (t) {
    return t.split('|')[0]
  }
}

export function getRole() {
  let t = getAuthToken()
  if (t) {
    let arr = t.split('!')[0]
    return arr[0].split('|')[1]
  }
}

export function isAdmin() {
  let t = getAuthToken()
  if (t) {
    let arr = t.split('|')
    if (arr[0] === 'admin') {
      return true
    }
    let role = arr[1].split('!')[0]
    console.log(role, arr, t)
    if (role === '1' || role === '26') {
      return true
    }
  }
}

export function isLogin() {
  let t = getAuthToken()
  // alert('getAuthToken:' + t)
  // console.log('getAuthToken:', t)
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
