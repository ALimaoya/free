import request from '@/utils/request'

export function shopList(data){
  return request({
    url : '/POST/tryout/shop/list',
    method : 'post',
    data
  })
}

export function shopInfo(data){
  return request({
    url : '/POST/tryout/shop/save',
    method : 'post',
    data
  })
}

export function shopDetail(data){
  return request({
    url : '/GET/shop/detail/{shopId}',
    method : 'get',
  })

}
