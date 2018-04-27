const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  userInfo: state => state.user.userInfo,
  attendant: state => state.user.attendant,
  wallet : state => state.user.wallet,
  pub_plans : state => state.user.pub_plans
};
export default getters
