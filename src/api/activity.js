import request from '@/utils/request'

//发布试用活动
export function publishActivity(data){
  return request({
    url: '/activity/add',
    method: 'post',
    data : data
  })
}

//修改发布活动
export function changeDetail(data){
  return request({
    url: '/activity/update',
    method: 'post',
    data: data ,
    // headers : {
    //   'Content-Type' : 'multipart/form-data'
    // }
  })
}

//取消发布活动
export function cancelActivity(data){
  return request({
    url : `/activity/cancel/${data}` ,
    method : 'post',
    headers : {
      'Content-Type' : 'application/json'
    }
  })
}

//获取试用活动支付详情
export function getPayDetail(order){
  return request({
    url : '/activity/payParams',
    method : 'get',
    params : {
      activityId : order
    }
  })
}

//试用活动支付
export function activityPay(data){
  return request({
    url : '/activity/pay',
    method : 'post',
    data : data ,
    headers : {
      'Content-Type' : 'application/json'
    }
  })
}

//获取试用商品分类列表
export function getCategory(){
  return request({
    url : '/category/select/list',
    method : 'get',
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

//获取试用店铺列表
export function getShopList(data){
  return request({
    url : '/shop/select/list',
    // url : '/select/'+data+'/list',
    method : 'get',
    params : {
      platform : data
    }
    // headers : {
    //   'Content-Type' : 'multipart/form-data'
    // }
  })
}

//获取试用搜索类型列表
export function searchTypeList(data){
  return request({
    // url : '/GET/search/select/{platform}/list',
    url : `/search/select/${data}/list`  ,
    method : 'get'
  })
}

//获取试用活动列表
export function getActivity(data) {
  return request({
    // url: '/POST/activity/list',
    url : '/activity/list',
    method: 'post',
    data : data ,
    // headers : {
    //   'Content-Type' : 'multipart/form-data'
    // }
  })
}

//查看活动详情
export function getDetail(data) {
  return request({
    url: `/activity/detail/${data}`,
    method: 'get',

  })
}

//修改试用活动状态
export function changeStatus(data) {
  return request({
    url: '/activity/updateStatus',
    method: 'post',
    data : data
  })
}

//申请结算
export function applyPay(id){
  return request({
    url : '/settlement/apply/'+ id ,
    method : 'post'
  })
}

//取消结算
export function cancelPay(id){
  return request({
    url : '/settlement/cancel/' + id ,
    method : 'post'
  })
}

//获取订单列表
export function getOrderList(data) {
  return request({
    url: '/order/list',
    method: 'post',
    data : data
  })
}

//订单详情
export function orderDetail(data) {
  return request({
    url: `/order/detail/${ data }`,
    method: 'get',
    headers : {
      'Content-Type' : 'application/json'
    }
  })
}

//订单审核
export function checkOrder(data){
  return request({
    url : '/order/updateStatus',
    method : 'post' ,
    data ,

  })
}

//领取审核
// export function checkBonus(id){
//   return request({
//     url : '',
//     method : ''
//   })
// }
//
// //评价审核
// export function checkView(id){
//   return request({
//     url : '',
//     method : ''
//   })
// }

//上传图片
export function uploadImage(file,token){
  return request({
    url : "/file/upload" ,
    method : 'post' ,
    data : file ,
    headers : {
      'yb-tryout-merchant-token':token
    }
  })
}

//获取京东平台下的商品详情
export function getJDetail(url){
  return request({
    url : '/thirdProduct/detail/jd',
    method : 'get',
    params : {
      productUrl : url
    }
  })
}

//修改活动关键词
export function updateKeyword(data){
  return request({
    url : '/activity/updateKeyword',
    method : 'post',
    data
  })
}

//获取活动佣金
export function getCommission(){
  return request({
    url : '/activity/getCommission',
    method : 'post'
  })
}

