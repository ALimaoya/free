import request from '@/utils/request'

//获取用户个人联系方式及支付密码
export function getThirdAccount(data) {
  return request({

    url: '/settings/data',

})
}
//设置第三方账号
export function setThirdAccount(data) {
  return request({
    url: '/settings/editThirdAccount',
    method: 'post',
    data
})
}
//修改绑定支付宝账号
export function setApilyAccount(data) {
  return request({
    url: '/settings/alipay',
    method: 'post',
    data
})
}
//查询第三方账号信息
export function getThirdInfo(type) {
  return request({
    url: '/settings/third/'+type,
    method: 'get',
})
}
//修改手机号
export function changeMobile(data){
  return request({

    // url : '/POST/settings/editMobile',
    url : '/settings/editMobile',
    method : 'post',
    data : data
  })
}
//修改登录密码
export function editLoginPsw(data){
  return request({
    url : '/settings/editPassword',
    method : 'post',
    data : data
  })
}
//修改设置支付密码
export function editPayPsw(data){
  return request({
    url : '/settings/editPayPassword',
    // url : '/POST/settings/editPayPassword',
    method : 'post',
    data : data
  })
}
//获取验证码
export function getCaptcha(){
  return request({
    url : '/loginStatus/captcha',
    method : 'get',
    needFailResponse:true,
  })
}

//获取会员信息
export function getMember(){
  return request({
    url : '/member/data',
    method : 'get',
    needFailResponse:true,   
  })
}
//获取会员订单列表
export function getMemberOrder(data){
  return request({
    url : '/member/orders',
    method : 'post',
    data:data
  })
}
//获取会员类型列表
export function getVipType(){
  return request({
    url : '/vip/list',
    method : 'get',
  })
}
//购买会员
export function buyVip(data){
  return request({
    url : '/vip/buy',
    method : 'post',
    data:data,
    needFailResponse:true,
  })
}
