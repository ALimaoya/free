import Cookies from 'js-cookie'

const TokenKey = 'admin';
const Mobile="mobile";
const User="user";
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUser(value){
  return Cookies.set(User,value, { expires: 7 })
}

export function getUser(){
  return Cookies.get(User)
}
export function removeUser(){
  return Cookies.remove(User);
}
export function getMobile() {
  return Cookies.get(Mobile)
}

export function setMobile(mobile) {
  return Cookies.set(Mobile, mobile)
}

export function removeMobile(){
  return Cookies.remove(Mobile)
}
