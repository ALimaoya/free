const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  id: state => state.user.id,
  name: state => state.user.name,
  vipLevel : state => state.user.vipLevel,
  vip_time : state => state.user.vip_time,
  avator: state => state.user.avator,
  mobile : state => state.user.mobile,
  qq : state => state.user.qq,
  wechat : state => state.user.wechat,
  deposit : state => state.user.deposit,
  gold : state => state.user.gold ,
  freeze_deposit : state => state.user.freeze_deposit,
  plan_title : state => state.user.plan_title,
  url : state => state.user.url,
  plan_img : state => state.user.plan_img
}
export default getters
