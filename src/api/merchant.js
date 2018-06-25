import request from '@/utils/request'

//资质上传
export function infoUpload(data){
  return request({
    url : '/shop/aptitudeAdd',
    method : 'post',
    data
  })
}
//资质查询
export function getInfo(){
  return request({
    url : '/aptitude/toEditOrQuery',
    method: 'get',

  })
}
//店铺信息查询
export function getShop(){
  return request({
    url : '/shop/toEditOrQuery',
    method : 'post'
  })
}
//店铺信息上传
export function shopInfo(){
  return request({
    url : '/shop/shopAdd',
    method : 'post'
  })
}

//商品列表
export function getGoodsList(data){
  return request({
    url : '/product/query',
    method : 'post',
    data
  })
}
