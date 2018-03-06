import request from '@/utils/request'

export function publishActivity(data){
  return request({
    url: '/POST/tryouut/activity/add',
    method: 'post',
    data : data
  })
}

export function getActivity(data) {
  return request({
    url: '/POST/activity/list',
    method: 'post',
    data : data
  })
}

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
