import request from '@/utils/request'
// import { getToken } from '@/utils/auth' // 验权

export function login(data) {
  return request({
    url: '/POST//tryout/login',
    method: 'post',
    data
  })
}
export function register(data) {
  return request({
    url: '/POST//tryout/register',
    method: 'post',
    data
  })
}
export function getInfo() {
  return request({
    url: '/GET//tryout/home/data',
    method: 'get',
    // header : {
    //   'yb-tryout-merchant-token' : token
    // }
  })
}

