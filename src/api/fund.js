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
    url: '/tryout/recharge/deposit',
    method: 'post',
    data
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

//获取资金明细
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