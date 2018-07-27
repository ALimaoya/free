import request from '@/utils/request'

//首页状态
export function getStatus(){
  return request({
    url: '/center/index/merchant/status',
    method: 'get'
  })
}
//获取入驻状态
export function getApprovedStatus(){
  return request({
    url: '/center/merchant/checkin/isApproved',
    method : 'get'
  })
}
//首页信息
export function getShopInfo(){
  return request({
    url: '/center/query/transaction',
    method: 'get'
  })
}
//获取近期数据
export function getSaleNum(data){
  return request({
    url: '/center/query/sale/data',
    method: 'get',
    params : {
      dataType: data
    }
  })
}
//获取商家基本信息
export function getBasicInfo(){
  return request({
    url: '/center/merchant/checkin/getBasicInfo',
    method : 'get'
  })
}
//修改商家基本信息
export function editorBasicInfo(data){
  return request({
    url: '/center/merchant/checkin/editBasicInfo',
    method : 'post',
    data
  })
}
//获取商家资质信息
export function getAptitudeInfo(){
  return request({
    url: '/center/merchant/checkin/getAptitudeInfo',
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
    noTips: true

  })
}
//店铺信息查询
export function getShop(){
  return request({
    url : '/center/shop/detail',
    method : 'get',
    noTips: true
  })
}
//店铺信息上传
export function shopInfo(data){
  return request({
    url : '/center/shop/add',
    method : 'post',
    data
  })
}
//店铺信息修改
export function changeShop(data){
  return request({
    url : '/center/shop/edit',
    method : 'post',
    data
  })
}
//运费查询列表
export function carriageList(){
  return request({
    url : '/center/merchant/carriage/query',
    method :'get'
  })
}
//新增运费规则
export function addCarriage(data){
  return request({
    url : '/center/merchant/carriage/update',
    method : 'post',
    data
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
    params:{
      addressType : data.addressType
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
export function changeAddress(data){
  return request({
    url : '/center/merchant/address/edit',
    method : 'post',
    data
  })
}
//获取省份列表
export function getProvinceList(){
  return request({
    url: '/area/province',
    method: 'get'
  })
}

//保证金状态查询
export function getBond(){
  return request({
    url : '/center/merchant/wallet/query',
    method : 'get',
    needFailResponse:true,
    noTips: true

  })
}
//保证金详情查询
export function getBondDetail(){
  return request({
    url: '/center/recharge/query',
    method: 'get',
    needFailResponse:true,
    noTips: true

  })
}
//保证金缴纳
export function rechargeBond(data){
  return request({
    url: '/center/recharge/deposit',
    method: 'post',
    data,
    needFailResponse:true,
  })
}
//保证金相关操作
export function applyBond(){
  return request({
    url : '/center/merchant/wallet/free',
    method : 'get'
  })
}
//补缴保证金操作
export function addBond(data){
  return request({
    url : '/center/recharge/addDeposit',
    method : 'post',
    data,
    needFailResponse:true,
  })
}
