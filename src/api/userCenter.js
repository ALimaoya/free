import request from '@/utils/request'

//首页状态
export function getStatus(){
  return request({
    url: '/center/index/merchant/status',
    method: 'get'
  })
}
//资质上传
export function infoUpload(data){
  return request({
    url : '/center/aptitude/add',
    method : 'post',
    data
  })
}
//资质查询
export function getInfo(){
  return request({
    url : '/center/aptitude/detail',
    method: 'get',

  })
}
//店铺信息查询
export function getShop(){
  return request({
    url : '/center/shop/detail',
    method : 'get'
  })
}
//店铺信息上传
export function shopInfo(){
  return request({
    url : '/center/shop/add',
    method : 'post'
  })
}
//运费删除
export function deleteCarriage(id){
  return request({
    url : '/center/merchant/carriage/delete/'+ id ,
    method : 'post'
  })
}
//查询商户地址列表
export function getAddress(){
  return request({
    url : '/center/merchant/address/query',
    method : 'get'
  })
}
//查询地址详情
export function getAddrDetail(id){
  return request({
    url: '/center/merchant/address/detail/'+ id ,
    method: 'get'
  })
}
//修改地址状态
export function changeAddrStatus(data){
  return request({
    url : '/center/merchant/address/set/'+data.addressId,
    method: 'post',
    data: {
      addressType: data.addressType
    }
  })
}
//新增商户地址
export function newAddress(data){
  return request({
    url: '/center/merchant/address/add',
    method : 'post',
    data

  })

}
//修改商户地址
export function changeAddress(){
  return request({
    url : '/center/merchant/address/edit',
    method : 'post'
  })
}
//获取省份列表
export function getProvinceList(){
  return request({
    url: '/center/province/query',
    method: 'get'
  })
}

//保证金查询
export function getBond(){
  return request({
    url : '/center/merchant/wallet/query',
    method : 'get'
  })
}
//保证金相关操作
export function applyBond(){
  return request({
    url : '/center/merchant/wallet/free',
    method : 'get'
  })
}
