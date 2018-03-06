const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  userInfo: state => state.user.userInfo,
  attendant: state => state.user.attendant,
  wallet : state => state.user.wallet,

  // id: state => state.user.userInfo.id,
  // name: state => state.user.userInfo.name,
  // vipLevel : state => state.user.userInfo.vipLevel,
  // vip_time : state => state.user.userInfo.vip_time,
  // avator: state => state.user.attendant.avator,
  // mobile : state => state.user.attendant.mobile,
  // qq : state => state.user.attendant.qq,
  // wechat : state => state.user.attendant.wechat,
  // deposit : state => state.user.wallet.deposit,
  // gold : state => state.user.wallet.gold ,
  // freeze_deposit : state => state.user.wallet.freeze_deposit ,
  pub_plans : state => state.user.pub_plans
}
export default getters
