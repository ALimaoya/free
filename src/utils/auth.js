import Cookies from 'js-cookie'

const TokenKey = 'admin'
const Mobile="mobile"
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getMobile() {
  return Cookies.get(Mobile)
}

export function setMobile(mobile) {
  return Cookies.set(Mobile, mobile)
}

