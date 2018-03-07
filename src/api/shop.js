import request from '@/utils/request'

//获取商铺列表
export function shopList(data){
  return request({
    url : '/POST/tryout/shop/list',
    method : 'post',
    data
  })
}

//修改商店信息
export function shopInfo(data){
  return request({
    url : '/POST/tryout/shop/save',
    method : 'post',
    data
  })
}

//获取店铺详情
export function shopDetail(data){
  return request({
    url : '/GET/shop/detail/{shopId}',
    method : 'get',
  })

}

//获取店铺验证码
export function shopCaptcha(){
  return request({
    url : '/GET/tryout/shop/captcha',
    // url : '/tryout/shop/captcha',
    method : 'get'
  })
}
