import request from '@/utils/request'

//获取用户个人联系方式及支付密码
export function getThirdAccount(data) {
  return request({
    url: '/tryout/settings/data',
    method: 'get',
})
}
//设置第三方账号
export function setThirdAccount(data) {
  return request({
    url: '/tryout/settings/editThirdAccount',
    method: 'post',
    data
})
}

//修改手机号
export function changeMobile(data){
  return request({
    url : '/tryout/settings/editMobile',
    // url : '/POST/tryout/settings/editMobile',
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
