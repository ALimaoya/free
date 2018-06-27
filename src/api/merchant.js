import request from '@/utils/request'



//商品列表
export function getGoodsList(data){
  return request({
    url : '/tryout/center/product/query',
    method : 'post',
    data
  })
}

//一级分类
export function firstList(){
  return request({
    url : '/tryout/center/category/class1List',
    method: 'get'
  })
}

//二级分类
export function secondList(data){
  return request({
    url : '/tryout/center/category/class2List',
    method: 'get',
    params: {
      class1Id : data
    }
  })
}

//三级分类
export function thirdList(){
  return request({
    url : '/tryout/center/category/class3List',
    method: 'get',
    params: {
      class2Id: data
    }
  })
}

//商品状态修改
export function changeStatus(id,type){
  return request({
    url: '/tryout/center/product/updateStatus/'+ id+ '/'+type,
    method : 'post'
  })
}

//新增商品
export function newGoogds(data,user){
  return request({
    url: '/tryout/center/product/add'+ user,
    method : 'post',
    data
  })
}

//修改商品
export function changeGoods(id){
  return request({
    url : '/tryout/center/product/toEdit/'+ id ,
    method : 'post'
  })
}

//品牌速查
export function getBrand(areaId,operation){
  return request({
    url : '/tryout/center/brand/quicksearch/index/'+areaId+ '/'+ operation,
    method: 'get'
  })
}

//退款查询
export function refusedList(){
  return request({
    url : '/tryout/center/refund/query',
    method: 'post'
  })
}
//退款单详情
export function refuseOrder(refundId){
  return request({
    url : '/tryout/center/refund/detail/'+ refundId ,
    method : 'post'
  })
}

//历史结算列表
export function historyList(){
  return request({
    url : '/tryout/center/settlement/history/query',
    method : 'post'
  })
}
//当前结算列表
export function currentSettlement(){
  return request({
    url : '/tryout/center/settlement/query',
    method: 'post'
  })
}

//结算申请
export function settlementApple(id){
  return request({
    url: '/tryout/settlement/apply/'+ id,
    method: 'post'
  })
}
