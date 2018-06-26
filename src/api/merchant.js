import request from '@/utils/request'



//商品列表
export function getGoodsList(data){
  return request({
    url : '/product/query',
    method : 'post',
    data
  })
}

//一级分类
export function firstList(){
  return request({
    url : '/category/class1List',
    method: 'get'
  })
}

//二级分类
export function secondList(data){
  return request({
    url : '/category/class2List',
    method: 'get',
    params: {
      class1Id : data
    }
  })
}

//三级分类
export function thirdList(){
  return request({
    url : '/category/class3List',
    method: 'get',
    params: {
      class2Id: data
    }
  })
}

//商品状态修改
export function changeStatus(id,type){
  return request({
    url: '/product/updateStatus/'+ id+ '/'+type,
    method : 'post'
  })
}

//新增商品
export function newGoogds(data){
  return request({
    url: '/product/add',
    method : 'post',
    data
  })
}

//修改商品
export function changeGoods(id){
  return request({
    url : '/product/toEdit/'+ id ,
    method : 'post'
  })
}

//品牌速查
export function getBrand(areaId,operation){
  return request({
    url : '/brand/quicksearch/index/'+areaId+ '/'+ operation,
    method: 'get'
  })
}

//退款查询
export function refusedList(){
  return request({
    url : '/refund/query',
    method: 'post'
  })
}
//退款单详情
export function refuseOrder(refundId){
  return request({
    url : '/refund/detail/'+ refundId ,
    method : 'post'
  })
}

//历史结算列表
export function historyList(){
  return request({
    url : '/settlement/history/query',
    method : 'post'
  })
}
