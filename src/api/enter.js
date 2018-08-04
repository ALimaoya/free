import request from '@/utils/request'

//提交入驻信息
export function enterApply(data,type){
    return request({
      url: '/center/merchant/checkin/add/'+type,
      method: 'post',
      data : data
    })
  }

  //  查询店铺是否被使用
  export function haveShopName(data,id){
    return request({
      url: `/center/merchant/checkin/exitShopName/${data}/${id}`,
      method: 'get',
    })
  }

  //获取入驻信息
  export function getRegisterInfo(type,shopType){
  return request({
    url: '/center/merchant/checkin/applyInfo/'+ type + '/'+shopType,
    method:'get'
  })
  }

  //修改入驻信息
export function editorRegisterInfo(data,type){
  return request({
    url: '/center/merchant/checkin/editBasicInfo/'+ type,
    method : 'post',
    data
  })
}

//查询入驻状态
export function getStatus(){
  return request({
    url: '/center/merchant/checkin/isApprovedByManage',
    method : 'get'
  })
}
//获取报名活动时间段
export function getTimeList(){
  return request({
    url : 'center/SecKillTime/query',
    method : 'get'
  })
}
//查询店铺状态
export function getShopStatus(){
  return request({
    url: 'center/shop/getShopStatus',
    method :'get'
  })
}

//获取秒杀活动商品详情
export function getActivityGoods(id) {
  return request({
    url : 'center/SecKillActivity/getDetail/'+ id,
    method : 'get'
  })
}
//获取分享购活动商品详情
export function getShareDetail(id){
  return request({
    url : '/center/shareBuyActivity/getDetail/'+id ,
    method : 'get'
  })
}
//获取报名活动商品列表
export function getSecondsList(data){
  return request({
    url : '/center/product/query/extending',
    method : 'post',
    data
  })
}
//新增秒杀活动
export function addSecKill(data){
  return request({
    url : 'center/SecKillActivity/add/activity',
    method : 'post',
    data
  })
}
//修改秒杀活动状态
export function editSecStatus(id){
  return request({
    url : '/center/SecKillActivity/update/'+id +'/3' ,
    method : 'get'
  })
}
//修改分享购活动状态
export function editShareStatus(id){
  return request({
    url : '/center/shareBuyActivity/update/'+id +'/3',
    method : 'get'
  })
}
//新增分享购活动
export function addShare(data){
  return request({
    url : '/center/shareBuyActivity/add/shareActivity',
    method : 'post',
    data
  })
}

//获取秒杀活动报名记录
export function getActivityHistory(data){
  return request({
    url : '/center/SecKillActivity/queryInfo',
    method : 'post',
    data
  })
}
//获取分享购活动报名记录
export function getShareHistory(data){
  return request({
    url : 'center/shareBuyActivity/query/listInfo',
    method : 'post',
    data

  })
}
