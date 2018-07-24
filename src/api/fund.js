import request from '@/utils/request'

//充值押金
export function handleRecharge(data){
  return request({
    url: '/recharge/deposit',
    method: 'post',
    data
  })
}

//提现押金
export function handleCash(data){
  return request({
    url: '/cash/add',
    method: 'post',
    data,
    needFailResponse:true
  })
}

//充值金币
export function handleGold(data){
  return request({
    url: '/gold/recharge',
    method: 'post',
    data
  })
}

//获取资金记录
export function getWalletLog(data){
  return request({
    url: '/wallet/logs',
    method: 'post',
    data
  })
}
//获取押金金额
export function getDeposit(){
  return request({
    url: '/merchant/deposit',
    method: 'get',
  })
}
//获取取现列表
export function getCashList(data){
  return request({
    url: '/cash/list',
    method: 'post',
    data:data
  })
}
