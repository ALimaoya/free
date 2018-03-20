import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间

});

// request拦截器
service.interceptors.request.use(config => {
  let status = config.url.indexOf('/tryout/captcha/') > 0 || config.url.indexOf('/tryout/account/register') > 0 || config.url.indexOf('/tryout/account/login') > 0||config.url.indexOf('/tryout/account/findpassword')>0 ||config.url.indexOf('/tryout/file/upload') >0
  if (!status) {
    if (store.getters.token) {
      config.headers['yb-tryout-merchant-token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
  }

  return config
}, error => {
  // Do something with request error // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response=>response,
  error => {
    // if(response.data.status=='401'){
    //   this.$message({
    //     message : '登录已失效，请重新登录',
    //     center : true ,
    //     type : 'error'
    //   });
    //   store.dispatch('LogOut').then(() => {
    //     location.reload() // 为了重新实例化vue-router对象 避免bug
    //   })
    // }
    // if (!getToken()) {
    //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //     confirmButtonText: '重新登录',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     store.dispatch('LogOut').then(() => {
    //       location.reload() // 为了重新实例化vue-router对象 避免bug
    //     })
    //   })
    // }
    // // return response
  }
);

export default service
