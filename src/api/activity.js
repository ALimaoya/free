import request from '@/utils/request'

//发布试用活动
export function publishActivity(data){
  return request({
    url: '/tryout/activity/add',
    method: 'post',
    data : data
  })
}

//试用活动支付
export function activityPay(data){
  return request({
    url : '/tryout/activity/pay',
    method : 'post',
    data : data ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

//获取试用商品分类列表
export function getCategory(){
  return request({
    url : '/tryout/category/select/list',
    // url : '/tryout/category/select/list',
    method : 'get',
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

//获取试用店铺列表
export function getShopList(data){
  return request({
    url : `/tryout/shop/select/${data}/list`,
    // url : '/tryout/select/'+data+'/list',
    method : 'get',
    // headers : {
    //   'Content-Type' : 'multipart/form-data'
    // }
  })
}

//获取试用搜索类型列表
export function searchTypeList(data){
  return request({
    // url : '/GET/tryout/search/select/{platform}/list',
    url : `/tryout/search/select/${data}/list`  ,
    method : 'get'
  })
}

//获取试用活动列表
export function getActivity(data) {
  return request({
    // url: '/POST/activity/list',
    url : '/tryout/activity/list',
    method: 'post',
    data : data ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

//查看活动详情
export function getDetail(data) {
  return request({
    url: `/tryout/activity/detail/${data}`,
    method: 'get',

  })
}

//修改活动详情
export function changeDetail(data){
  return request({
    url: '/tryout/activity/update',
    method: 'post',
    data: data ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

export function getOrderList(data) {
  return request({
    url: '/tryout/order/list',
    method: 'post',
    data : data ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}

export function orderDetail(data) {
  return request({
    url: `/tryout/order/detail/${ data }`,
    method: 'get',
    headers : {
      'Content-Type' : 'application/json'
    }
  })
}

export function changeStatus(data) {
  return request({
    url: '/POST/order/updateStatus',
    method: 'post',
    data : data
  })
}

//上传图片
export function uploadImage(file){
  return request({
    url : "/tryout/file/upload" ,
    method : 'post' ,
    data : file ,
    headers : {
      'Content-Type' : 'multipart/form-data'
    }
  })
}



