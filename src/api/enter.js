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

