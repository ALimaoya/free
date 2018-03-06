import request from '@/utils/request'

export function getHistory(data) {
  return request({
    url: '/POST//tryout/wallet/logs',
    method: 'post',
    data
})
}
