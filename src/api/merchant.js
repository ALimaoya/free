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
export function changeStatus(id,type){
  return request({
    url: '/center/product/updateStatus/'+ id+ '/'+type,
    method : 'get'
  })
}

//新增商品
export function newGoogds(data){
  return request({
    url: '/center/product/add',
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
export function changeGoods(data){
  return request({
    url: '/center/product/edit' ,
    method: 'post',
    data
  })
}
//商品详情
export function shopParticulars(id){
  return request({
    url: '/center/product/getInfo/'+id ,
    method: 'get',
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
//判断是否可导出
export function isExport(data){
  return request({
    url: '/center/order/export/validate',
    method:'post',
    data,
    needFailResponse:true
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
//获取京东商品详情
export function getJD(data){
  return request({
    url: '/thirdProduct/detail/jdProduct?productId='+data,
    method: 'get'
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
//推广订单 列表
export function getOrderLists(data){
  return request({
    url: '/center/extend/order/list',
    method: 'post',
    data
  })
}
//查询品牌列表
export function getBrandList(data){
  return request({
    url : '/brand/querySelf',
    method : 'post',
    data
  })
}
//删除品牌
export function deleteBrand(id){
  return request({
    url : '/brand/delete/'+id,
    method : 'get'
  })
}
//新增商品
export function addBrand(data){
  return request({
    url : '/center/brand/add',
    method : 'post',
    data
  })
}
//校验中文品牌名
export function checkCnName(data){
  return request({
    url : '/center/brand/validate/brandCnName',
    method : 'get',
    params : {
      brandCnName : data
    }
  })
}
//校验英文品牌名
export function checkEnName(data){
  return request({
    url : '/center/brand/validate/brandEnName',
    method : 'get',
    params : {
      brandEnName : data
    }
  })
}
//test
export function test(){
  return request({
    url: 'center/test/xss',
    method: 'post',

  })
}

//  新增优惠券活动
export function addCoupon(data){
  return request({
    url: '/couponActivity/add',
    method: 'post',
    data
  })
}

// 优惠券活动列表查询
export function couponList(data){
  return request({
    url: '/couponActivity/findInfoList',
    method: 'post',
    data
  })
}

//获取优惠券的使用数据信息
export function getUseCoupon(activityId){
  return request({
    url: '/couponActivity/getCouponAllInfo/'+activityId,
    method: 'get',
  })
}

//修改优惠券的使用状态
export function getOverCoupon(activityId,status){
  return request({
    url: '/couponActivity/updateStatus/'+activityId+'/'+status,
    method: 'get',
  })
}

//修改优惠券的使用状态
export function seeCoupon(activityId){
  return request({
    url: '/couponActivity/getCouponActivityInfo/'+activityId,
    method: 'get',
  })
}

//更新活动优惠券的数量
export function updateContent(activityId,totalQuantity){
  return request({
    url: '/couponActivity/updateContent/'+activityId+'/'+totalQuantity,
    method: 'get',
  })
}

// 获取指定优惠券活动的商品列表
export function couponGoodsList(data){
  return request({
    url: '/couponActivity/findProductList',
    method: 'post',
    data
  })
}