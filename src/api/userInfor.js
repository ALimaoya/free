import request from '@/utils/request'

//获取用户个人联系方式及支付密码
export function getThirdAccount(data) {
  return request({

    url: 'tryout/settings/data',

})
}
//设置第三方账号
export function setThirdAccount(data) {
  return request({
    url: 'tryout/settings/editThirdAccount',
    method: 'post',
    data
})
}
//修改绑定支付宝账号
export function setApilyAccount(data) {
  return request({
    url: 'tryout/settings/editAlipay',
    method: 'post',
    data
})
}
//查询支付宝账号信息
export function getApilyInfo(data) {
  return request({
    url: '/tryout/settings/queryThird',
    method: 'get',
    data
})
}
//修改手机号
export function changeMobile(data){
  return request({

    // url : '/POST/tryout/settings/editMobile',
    url : 'tryout/settings/editMobile',
    method : 'post',
    data : data
  })
}
//修改登录密码
export function editLoginPsw(data){
  return request({
    url : '/tryout/settings/editPassword',
    method : 'post',
    data : data
  })
}
//修改设置支付密码
export function editPayPsw(data){
  return request({
    url : '/tryout/settings/editPayPassword',
    // url : '/POST/tryout/settings/editPayPassword',
    method : 'post',
    data : data
  })
}
//获取验证码
export function getCaptcha(){
  return request({
    url : 'tryout/loginStatus/captcha',
    method : 'get',
  })
}

