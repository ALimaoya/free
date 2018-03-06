import request from '@/utils/request'

//充值押金
export function handleRecharge(data){
  return request({
    url: '/POST/tryout/recharge',
    method: 'post',
    data
  })
}

//提现押金
export function handleCash(data){
  return request({
    url: '/POST/tryout/cash',
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
export function getWallet(data){
  return request({
    url: '/POST/tryout/wallet/logs',
    method: 'post',
    data
  })
}
