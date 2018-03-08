import request from '@/utils/request'

export function login(data) {

  return request({
    // url: '/POST/tryout/login',
    url: '/tryout/account/login',
    method: 'post',
    headers : {
      'Content-Type' : 'multipart/form-data'
    },
    data: data
  })
}
export function register(data) {

  return request({
    // url: '/POST/tryout/account/register',
    url: '/tryout/account/register',
    method: 'post',
    headers : {
      'Content-Type' : 'multipart/form-data'
    },
    data : data
  })
}
export function getInfo() {
  return request({
    url: '/tryout/home/data',
    // url: '/tryout/home/data',
    method: 'GET',

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
    method : 'get',

  })
}

export function getMessageCode(mobile ,data){
  console.log(data);
  return request({
    url : '/tryout/captcha/'+ mobile ,
    method : 'post',
    data : data ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    },
  })
}
