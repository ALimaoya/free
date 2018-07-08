import request from '@/utils/request'

//充值押金
export function handleRecharge(data){
  return request({
    url: '/tryout/recharge/deposit',
    method: 'post',
    data
  })
}

//提现押金
export function handleCash(data){
  return request({
    url: '/tryout/cash/add',
    method: 'post',
    data,
    needFailResponse:true
  })
}

//充值金币
export function handleGold(data){
  return request({
    url: '/POST/tryout/gold/recharge',
    method: 'post',
    data
  })
}

//获取资金记录
export function getWalletLog(data){
  return request({
    url: '/tryout/wallet/logs',
    method: 'post',
    data
  })
}
//获取押金金额
export function getDeposit(){
  return request({
    url: '/tryout/merchant/deposit',
    method: 'get',
  })
}
//获取取现列表
export function getCashList(data){
  return request({
    url: '/tryout/cash/list',
    method: 'post',
    data:data
  })
}