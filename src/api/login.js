import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/tryout/login',
    method: 'post',
    data
  })
}
export function register(data) {
  return request({
    url: '/tryout/register',
    method: 'post',
    data
  })
}
export function getInfo() {
  return request({
    url: '/tryout/home/data',
    method: 'get',

  })
}

export function changePsw(){
  return request({
    url : '',
    method : ''
  })
}

export function getCaptcha(){
  return request({
    url : '/tryout/captcha',
    method : 'get'
  })
}

export function getMessageCode(mobile ,data){
  return request({
    url : '/tryout/captcha/'+ mobile ,
    method : 'post',
    data : data
  })
}
