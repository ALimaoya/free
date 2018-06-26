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
//运费删除
export function deleteCarriage(id){
  return request({
    url : '/merchant/carriage/delete/'+ id ,
    method : 'post'
  })
}
//查询商户地址
export function getAddress(){
  return request({
    url : '/merchant/address/query',
    method : 'get'
  })
}
//修改地址状态
export function changeAddrStatus(){
  return request({
    url : '/merchant/address/set',
    method: 'post'
  })
}
//新增商户地址
export function newAddress(){
  return request({
    url: '/merchant/address/add',
    method : 'post'
  })

}
//修改商户地址
export function changeAddress(){
  return request({
    url : '/merchant/address/edit',
    method : 'post'
  })
}

//保证金查询
export function getBond(){
  return request({
    url : '/merchant/wallet/index',
    method : 'get'
  })
}
//保证金相关操作
export function applyBond(){
  return request({
    url : '/merchant/wallet/free',
    method : 'get'
  })
}
