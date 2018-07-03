import request from '@/utils/request'



//商品列表
export function getGoodsList(data){
  return request({
    url : '/center/product/query',
    method : 'post',
    data
  })
}

//一级分类
export function firstList(){
  return request({
    url : '/center/category/class1List',
    method: 'get'
  })
}

//二级分类
export function secondList(data){
  return request({
    url : '/center/category/class2List',
    method: 'get',
    params: {
      class1Id : data
    }
  })
}

//三级分类
export function thirdList(data){
  return request({
    url : '/center/category/class3List',
    method: 'get',
    params: {
      class2Id: data
    }
  })
}

//商品状态修改
export function changeStatus(id,type,name){
  return request({
    url: '/center/product/updateStatus/'+ id+ '/'+type+ '/'+ name,
    method : 'get'
  })
}

//新增商品
export function newGoogds(data,user){
  return request({
    url: '/center/product/add/'+ user,
    method : 'post',
    data
  })
}

//获取已有商品信息
export function getGoodsDetail(id){
  return request({
    url : '/center/product/getInfo/'+ id ,
    method : 'get'
  })
}
//修改商品
export function changeGoods(data,id){
  return request({
    url: '/center/product/edit/'+ id ,
    method: 'post',
    data
  })
}
//获取店铺状态
export function getShopInfo(){
  return request({
    url: '/center/product/isHaveShop',
    method: 'get'
  })
}

//品牌速查
export function getBrand(brandName,currentPage,pageSize){
  return request({
    url : '/center/brand/query',
    method: 'get',
    params: {
      brandName,
      currentPage,
      pageSize
    }
  })
}

//退款查询
export function refusedList(data){
  return request({
    url : '/center/refund/query',
    method: 'post',
    data
  })
}
//退款单详情
export function refuseOrder(refundId){
  return request({
    url : '/center/refund/detail/'+ refundId ,
    method : 'get'

  })
}
//确认退款
export function refusedAffirm(data){
  return request({
    url :  '/center/refund/confirm',
    method : 'post',
    data
  })
}

//历史结算列表
export function historyList(data){
  return request({
    url : '/center/settlement/history/query',
    method : 'post',
    data
  })
}
//当前结算列表
export function currentSettlement(){
  return request({
    url : '/center/settlement/query',
    method: 'get'
  })
}

//结算申请
export function settlementApple(id){
  return request({
    url: '/settlement/apply/'+ id,
    method: 'post'
  })
}
//获取交易列表
export function getOrderList(data){
  return request({
    url: '/center/order/query',
    method: 'post',
    data
  })
}
//交易详情
export function getOrderDetail(id){
  return request({
    url: '/center/order/detail/'+id,
    method: 'get',
  })
}
//确认发货
export function confirmDeliver(data){
  return request({
    url: '/center/order/deliver',
    method: 'post',
    data
  })
}
//导入发货列表
export function importDeliver(data){
  return request({
    url: '/center/order/importDeliver',
    method: 'post',
    data
  })
}
//模板下载
export function deliverDemo(){
  return request({
    url: 'center/order/download/deliverTemplate',
    method: 'get'
  })
}
