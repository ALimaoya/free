import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['yb-tryout-merchant-token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => response,

  response => {
//     // const res = response
    if (response.data.code !== '000000000') {
      Message({
            message: '服务器开小差了，请稍等~',
            type: 'error',
            duration: 5 * 1000
          });
    }
//
    if (response.message !== 'success') {

        Message({
          message: response.message,
          type: 'error',
          duration: 5 * 1000
        })
        // store.dispatch('LogOut').then(() => {
        //   location.reload()// 为了重新实例化vue-router对象 避免bug
        // })
      }
// //     // //
// //     // //
// //     // //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (getToken() == '') {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
//     //   return Promise.reject('error')
//     // } else {
//     //   return response.data
//     // }
// //   },
// //   error => {
// //     console.log('err' + error)// for debug
// //     Message({
// //       message: '服务开小差了，请稍等~',
// //       type: 'error',
// //       duration: 5 * 1000
// //     })
// //     return Promise.reject(error)
  }
)

export default service
