import fetch from '../utils/fetch'

export function login(username, password) {
  return fetch({
    url: '/user/login.json',
    method: 'get',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info.json',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return fetch({
    url: '/user/logout.json',
    method: 'get'
  })
}
