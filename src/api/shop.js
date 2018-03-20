import request from '@/utils/request'

//获取商铺列表
export function shopList(data){
  return request({
    url : '/tryout/shop/list',
    method : 'post',
    data : data ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

//添加商店信息
export function shopInfo(data){
  return request({
    url : '/tryout/shop/save',
    method : 'post',
    data ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

//修改商店信息
export function changeInfo(data){
  return request({
    url : '/tryout/shop/update',
    method : 'post',
    data ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

//获取店铺支付信息
export function shopPayDetail(id){
  return request({
    url : '/tryout/shop/payParams',
    method : 'get',
    params : {
      shopId : id
    }
  })
}

//支付店铺
export function buyShop(data){
  return request({
    url : '/tryout/shop/pay',
    method : 'post' ,
    data
  })
}


//获取店铺详情
export function shopDetail(data){
  return request({
    url : `/tryout/shop/detail/${data}`,
    method : 'get',
  })

}

//获取店铺验证码
export function shopCaptcha(){
  return request({
    // url : '/GET/tryout/shop/captcha',
    url : '/tryout/shop/captcha',
    method : 'get'
  })
}
