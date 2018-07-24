import request from '@/utils/request'

export function login(data) {

  return request({
    // url: '/login',
    url: '/account/login',
    method: 'post',
    headers : {
      'Content-Type' : 'multipart/form-data'
    },
    data: data,
    needFailResponse:true
  })
}
export function register(data) {

  return request({
    // url: '/POST/account/register',
    url: '/account/register',
    method: 'post',
    needFailResponse:true, 
    headers : {
      'Content-Type' : 'multipart/form-data'
    },
    data : data
  })
}
export function getInfo() {
  return request({
    url: '/home/data',
    // url: '/home/data',
    method: 'GET',

  })
}

export function changePsw(data){
  return request({
    url : '/account/findpassword',
    method : 'post',
    data:data
  })
}

export function getCaptcha(){
  return request({
    url : '/captcha',
    method : 'get',
    needFailResponse:true,   
  })
}

export function getMessageCode(mobile ,data){
  return request({
    url : '/captcha/'+ mobile ,
    method : 'post',
    data : data ,
    needFailResponse:true,   
    headers : {
      'Content-Type' : 'multipart/form-data'
    },
  })
}
