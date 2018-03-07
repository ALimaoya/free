import request from '@/utils/request'

export function getThirdAccount(data) {
  return request({
    url: '/GET/tryout/settings/data',
    method: 'get',
})
}
export function setThirdAccount(data) {
  return request({
    url: '/POST/tryout/settings/editThirdAccount',
    method: 'post',
    data
})
}