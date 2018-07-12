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
    data,
    headers: {
      'content-type': 'application/json'
    }
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
    method: 'get',
    needFailResponse:true,
    noTips: true

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
//当前发货结算列表
export function deliveryOrder(data){
  return request({
    url : '/center/settlement/delivery',
    method: 'post',
    data
  })
}
//当前退款结算列表
export function refundOrder(data){
  return request({
    url: '/center/settlement/refund',
    method: 'post',
    data
  })
}
//获取结算费用
export function amountDetail(){
  return request({
    url: '/center/settlement/amount',
    method: 'get',

  })
}

//结算申请
export function settlementApple(){
  return request({
    url: '/center/settlement/apply',
    method: 'post',
    needFailResponse:true,
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
    data,
    needFailResponse:true,
  })
}
//模板下载
export function deliverDemo(){
  return request({
    url: 'center/order/download/deliverTemplate',
    method: 'get'
  })
}
//导出错误列表
export function wrongDemo(data){
  return request({
    url: '/center/order/download/errorFile',
    method: 'get',
    params: {
      fileAddress : data
    }
  })
}
//导出订单列表
export function exportList(data){
  return request({
    url: '/center/order/export',
    method: 'post',
    data
  })
}

//获取淘宝商品详情
export function getTao(data){
  return request({
    url: '/thirdProduct/detail/tb',
    method:'post',
    headers: {
      'Content-Type': 'application/json',

    },
    data
  })
}
//获取待添加推广商品列表
export function getSpreadList(data){
  return request({
    url: '/center/extendProduct/extending/query',
    method: 'post',
    data
  })
}
//添加推广商品
export function addSpread(data){
  return request({
    url: '/center/extendProduct/extending/add',
    method: 'post',
    data
  })
}

//获取已添加推广商品列表
export function hasSpreadGoods(data){
  return request({
    url: '/center/extendProduct/extended/query',
    method: 'post',
    data
  })
}
//修改佣金比率
export function editorR(data){
  return request({
    url: '/center/extendProduct/extended/update',
    method: 'post',
    data
  })
}
//删除推广商品
export function deleteGoods(id,productId){
  return request({
    url: '/center/extendProduct/delete/'+id+ '/'+productId,
    method: 'post',
  })
}
//批量删除推广商品
export function batchDelete(data){
  return request({
    url: '/center/extendProduct/extending/batchDelete',
    method:'post',
    data
  })
}
//test
export function test(){
  return request({
    url: 'center/test/xss',
    method: 'post',

  })
}
