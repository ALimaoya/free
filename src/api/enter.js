import request from '@/utils/request'

//发布试用活动
export function enterApply(data){
    return request({
      url: '/center/merchant/checkin/add',
      method: 'post',
      data : data
    })
  }

  //  查询店铺是否被使用
  export function haveShopName(data){
    return request({
      url: `/center/merchant/checkin/exitShopName/${data}`,
      method: 'get',
    })
  }

  