import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/changePsw', component: () => import('@/views/login/changePsw'), hidden: true },
  { path: '/register', component: () => import('@/views/register/index'), hidden: true },
  {
    path: '/publish',
    name: 'Publish',
    component: Layout,
    meta: { title: '发布试用', icon: 'pay' },
    children : [
      {
        path : 'step1',
        name : 'Step',
        // hidden : true ,
        component: () => import('@/views/publish/step'),
        meta: { title: '发布试用', icon: 'pay' ,noCache: true },

      },
      {
        path: 'step2/:id',
        name: 'Pay',
        component: () => import('@/views/publish/pay'),
        meta: { title: '支付押金', icon: 'pay',noCache: true  },
        hidden : true
      },
      {
        path: 'step3',
        name: 'Auditing',
        component: () => import('@/views/publish/auditing'),
        meta: { title: '等待审核', icon: 'auditing' },
        hidden : true
      },
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Center',
    meta: { title: '商家中心', icon: 'center' },
    children: [
      {
        path: 'index',
        name: 'Home',
        component: () => import('@/views/center/index'),
        meta: { title: '商家首页', icon: 'index' }
      },
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('@/views/center/shop'),
        meta: { title: '店铺管理', icon: 'shop' },

      },
      {
        path: 'newshop',
        name: 'Newshop',
        component: () => import('@/views/center/newshop'),
        meta: { title: '绑定店铺', icon: 'newshop' }
      }]
  },

  {
    path: '/activity',
    component: Layout,
    // redirect: '/activity/approval',
    name: 'Activity',
    meta: { title: '活动管理', icon: 'activity' },
    children: [
      {
        path: 'approval',
        name: 'Approval',
        component: () => import('@/views/activity/approval'),
        meta: { title: '试用管理', icon: 'approval' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/activity/order'),
        meta: { title: '订单查询', icon: 'order' }
      },
      {
        path: 'bonus',
        name: 'Bonus',
        component: () => import('@/views/activity/checkbonus'),
        meta: { title: '领奖审核', icon: 'bonus' }
      },
      {
        path: 'view',
        name: 'View',
        component: () => import('@/views/activity/checkview'),
        meta: { title: '评价审核', icon: 'view' }
      },

      // {
      //   path: 'feedback',
      //   name: 'Feedback',
      //   component: () => import('@/views/activity/feedback'),
      //   meta: { title: '投诉反馈', icon: 'feedback' }
      // },
      {
        path: 'detail/:order',
        name: 'Detail',
        component: () => import('@/views/activity/detail'),
        hidden: true ,
        meta: { title: '商品详情', icon: 'detail'  }
      },
    ]
  },
  {
    path: '/userInfor',
    component: Layout,
    // redirect: '/userInfor/approval',
    name: 'UserInfor',
    meta: { title: '账号信息', icon: 'userInfor' },
    children: [
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/userInfor/settings'),
        meta: { title: '基本设置', icon: 'settings' }
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/userInfor/account'),
        meta: { title: '绑定支付宝', icon: 'account' }
      },
      {
        path: 'vip',
        name: 'Vip',
        component: () => import('@/views/userInfor/vip'),
        meta: { title: '会员管理', icon: 'vip' }
      },
      {
        path: 'buyVip',
        name: 'BuyVip',
        component: () => import('@/views/userInfor/buyVip'),
        meta: { title: '开通会员', icon: 'vip' },
        hidden : true
      }
    ]
  },
  {
    path: '/fund',
    component: Layout,
    // redirect: '/userInfor/approval',
    name: 'Fund',
    meta: { title: '资金管理', icon: 'fund' },
    children: [
      {
        path: 'recharge',
        name: 'Recharge',
        component: () => import('@/views/fund/recharge/index'),
        meta: {title: '我要充值', icon: 'recharge'},
      },
      {
        path: 'cash',
        name: 'Cash',
        component: () => import('@/views/fund/cash'),
        meta: { title: '押金提现', icon: 'cash' }

      },
      {
        path: '/fund/history',
        name: 'History',
        component: () => import('@/views/fund/history/index'),
        meta: { title: '资金明细', icon: 'history' },
        children: [
          {
            path: 'money',
            name: 'Money',
            component: () => import('@/views/fund/history/money'),
            meta: { title: '资金记录', icon: 'money' }
          },
          {
            path: 'cash',
            name: 'cash',
            component: () => import('@/views/fund/history/cash'),
            meta: { title: '取现记录', icon: 'cash' }
          },
          // {
          //   path: 'coin',
          //   name: 'Coin',
          //   component: () => import('@/views/fund/history/coin'),
          //   meta: { title: '金币明细', icon: 'coin' }

          // }
        ]
      }
    ]
  },
  // {
  //   path: '/invitation',
  //   name: 'Invitation',
  //   component: Layout,
  //   meta: { title: '邀请返利', icon: 'invitation' },
  //   children: [
  //     {
  //       path: 'friends',
  //       name: 'Friends',
  //       component: () => import('@/views/invitation/friends'),
  //       meta: { title: '好友邀请', icon: 'friends' }
  //     },
  //     {
  //       path: 'rewards',
  //       name: 'Rewards',
  //       component: () => import('@/views/invitation/rewards'),
  //       meta: { title: '邀请奖励', icon: 'rewards' }
  //     }
  //   ]
  // },
  // {
  //   path: '/news',
  //   name: 'News',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'newsItems',
  //       component: () => import('@/views/news/index'),
  //       meta: { title: '消息中心', icon: 'news' }
  //     }]
  // },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

