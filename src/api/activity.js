import request from '@/utils/request'

//发布试用活动
export function publishActivity(data){
  return request({
    url: '/POST/tryouut/activity/add',
    method: 'post',
    data : data
  })
}

//获取试用商品分类列表
export function getCategory(){
  return request({
    url : '/GET/tryout/category/select/list',
    // url : '/tryout/category/select/list',
    method : 'get'
  })
}

//获取试用店铺列表
export function getShopList(data){
  return request({
    url : '/GET/tryout/select/{platform}/list',
    // url : `/tryout/select/${data}/list`,
    method : 'get'
  })
}

//获取试用搜索类型列表
export function searchTypeList(data){
  return request({
    url : '/GET/tryout/search/select/{platform}/list',
    // url : `/tryout/search/select/${data}/list`  ,
    method : 'get'
  })
}

//获取试用活动列表
export function getActivity(data) {
  return request({
    // url: '/POST/activity/list',
    url : '/activity/list',
    method: 'post',
    data : data
  })
}

//获取活动详情
export function getDetail(data) {
  return request({
    url: '/GET/activity/detail/{activityId}',
    method: 'get',

  })
}

export function getOrderList(data) {
  return request({
    url: '/POST/order/list',
    method: 'post',
    data : data
  })
}

export function orderDetail(data) {
  return request({
    url: '/GET/order/detail/{orderId}',
    method: 'get',

  })
}

export function changeStatus(data) {
  return request({
    url: '/POST/order/updateStatus',
    method: 'post',
    data : data
  })
}
