import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'
import FreeManage from '../views/layout/components/FreeManage'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

export const constantRouterMap = [
  {
    path : '/freeManage',
    name : 'FreeManage',
    redirect: '/freeManage/index',
    component : Layout,
    meta : { title : '试用中心',icon : 'FreeManage'},
    children : [
      {
        path: '/',
        component: FreeManage,
        redirect: '/freeManage/index',
        name: 'Center',
        meta: { title: '商家中心', icon: 'center' },
        children: [
          {
            path: '/freeManage/index',
            name: 'CenterHome',
            component: () => import('@/views/freeManage/center/index'),
            meta: { title: '商家首页', icon: 'index' }
          },
          {
            path: '/freeManage/shop',
            name: 'Shop',
            component: () => import('@/views/freeManage/center/shop'),
            meta: { title: '店铺管理', icon: 'shop' },

          },
          {
            path: '/freeManage/buyshop/:id',
            name: 'buyShop',
            component: () => import('@/views/freeManage/center/buyShop'),
            meta: { title: '店铺支付', icon: 'pay',noCache: true  },
            hidden : true
          },
          {
            path: '/freeManage/checkshop',
            name: 'WaitingCheck',
            component: () => import('@/views/freeManage/center/checkShop'),
            meta: { title: '等待审核', icon: 'auditing' },
            hidden : true
          },
          {
            path: '/freeManage/newshop',
            name: 'Newshop',
            component: () => import('@/views/freeManage/center/newshop'),
            meta: { title: '绑定店铺', icon: 'newshop' }
          }]
      },
      {
        path: '/freeManage/publish',
        name: 'Publish',
        component: FreeManage,
        meta: { title: '发布活动', icon: 'pay' },
        children : [
          {
            path : 'tryout_step1',
            name : 'TryoutActivity',
            // hidden : true ,
            component: () => import('@/views/freeManage/publish/tryoutActivity'),
            meta: { title: '发布试用活动',noCache: true },

          },
          {
            path: 'tryout_step2/:id',
            name: 'TryoutPay',
            component: () => import('@/views/freeManage/publish/tryoutPay'),
            meta: { title: '试用活动支付', icon: 'tryoutPay',noCache: true  },
            hidden : true
          },
          {
            path : 'flow_step1',
            name : 'FlowActivity',
            // hidden : true ,
            component: () => import('@/views/freeManage/publish/flowActivity'),
            meta: { title: '发布流量任务',noCache: true },

          },
          {
            path: 'flow_step2/:id',
            name: 'FlowPay',
            component: () => import('@/views/freeManage/publish/flowPay'),
            meta: { title: '流量活动支付', icon: 'flowPay',noCache: true  },
            hidden : true
          },
          {
            path: 'step3',
            name: 'Auditing',
            component: () => import('@/views/freeManage/publish/auditing'),
            meta: { title: '等待审核', icon: 'auditing' },
            hidden : true
          },
        ]
      },
      {
        path: '/freeManage/activity',
        component: FreeManage,
        // redirect: '/activity/approval',
        name: 'Activity',
        meta: { title: '活动管理', icon: 'activity' },
        children: [
          {
            path: 'approval',
            name: 'Approval',
            component: () => import('@/views/freeManage/activity/approval'),
            meta: { title: '试用管理', icon: 'approval' }
          },
          {
            path: 'flow',
            name: 'Flow',
            component: () => import('@/views/freeManage/activity/flow'),
            meta: { title: '流量模式', icon: 'flow' }
          }
          // {
          //   path: 'flowDetail/:order',
          //   name: 'FlowDetail',
          //   component: () => import('@/views/activity/flowDetail'),
          //   hidden : true ,
          //   meta: { title: '流量活动任务详情', icon: 'flowDetail' }
          // }


        ]
      },
      {
        path : '/freeManage/order',
        component : FreeManage,
        name : 'Order',
        meta : { title : '订单管理', icon : 'order'},
        children : [
          {
            path: 'activityOrder',
            name: 'ActivityOrder',
            component: () => import('@/views/freeManage/order/activityOrder'),
            meta: { title: '试用订单查询', icon: 'activityOrder' }
          },
          {
            path: 'flowOrder',
            name: 'FlowOrder',
            component: () => import('@/views/freeManage/order/flowOrder'),
            meta: { title: '流量订单查询', icon: 'flowOrder' }
          },
          {
            path: 'bonus',
            name: 'Bonus',
            component: () => import('@/views/freeManage/order/checkbonus'),
            meta: { title: '试用领奖审核', icon: 'bonus' }
          },
          {
            path: 'view',
            name: 'View',
            component: () => import('@/views/freeManage/order/checkview'),
            meta: { title: '试用评价审核', icon: 'view' }
          },
          {
            path: 'checkFlow',
            name: 'CheckFlow',
            component: () => import('@/views/freeManage/order/checkFlow'),
            meta: { title: '流量订单审核', icon: 'checkFlow' }
          },
          // {
          //   path: 'feedback',
          //   name: 'Feedback',
          //   component: () => import('@/views/activity/feedback'),
          //   meta: { title: '投诉反馈', icon: 'feedback' }
          // },
          {
            path: 'tryoutDetail/:order',
            name: 'TryoutDetail',
            component: () => import('@/views/freeManage/order/tryoutDetail'),
            hidden: true ,
            meta: { title: '试用活动订单详情', icon: 'tryoutDetail'  }
          },
          {
            path: 'flowDetail/:order',
            name: 'FlowDetail',
            component: () => import('@/views/freeManage/order/flowDetail'),
            hidden: true ,
            meta: { title: '流量任务订单详情', icon: 'flowDetail'  }
          }
        ]
      },
      {
        path: '/freeManage/userInfor',
        component: FreeManage,
        // redirect: '/userInfor/approval',
        name: 'UserInfor',
        meta: { title: '账号信息', icon: 'userInfor' },
        children: [
          {
            path: 'settings',
            name: 'Settings',
            component: () => import('@/views/freeManage/userInfor/settings'),
            meta: { title: '基本设置', icon: 'settings' }
          },
          {
            path: 'account',
            name: 'account',
            component: () => import('@/views/freeManage/userInfor/account'),
            meta: { title: '绑定支付宝', icon: 'account' }
          },
          {
            path: 'vip',
            name: 'Vip',
            component: () => import('@/views/freeManage/userInfor/vip'),
            meta: { title: '会员管理', icon: 'vip' }
          },
          {
            path: 'buyVip',
            name: 'BuyVip',
            component: () => import('@/views/freeManage/userInfor/buyVip'),
            meta: { title: '开通会员', icon: 'vip' },
            hidden : true
          }
        ]
      },
      {
        path: '/freeManage/fund',
        component: FreeManage,
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
    ]
  },
  { path: '/merchantCenter',
    // name: 'Home',
    redirect : '/merchantCenter/index',
    component : Layout,
    // meta: { title: '特卖商城', icon: 'center' },
    hidden: true,
    children :[
      {
        path: '/',
        redirect : '/merchantCenter/index',
        // name: 'MerchantCenter',
        component: FreeManage ,
        hidden : true ,
          children : [
            {
              path: 'index',
              name: 'MerchantCenter-home',
              component:() => import('@/views/merchantCenter/center/index'),
              hidden : true ,
              meta: { title: '商户中心首页', icon: 'merchantCenter' },

            }
          ]
      },
      {
        path: '/merchantCenter/base',
        name: 'Base',
        component: FreeManage,
        meta: { title: '基础管理', icon: 'base' },
        children : [
          {
            path: 'userManage',
            name: 'UserManage',
            component: () => import('@/views/merchantCenter/base/userManage'),
            meta: { title: '用户管理', icon: 'userManage' },

          },
          {
            path: 'newAccount',
            name: 'NewAccount',
            component: () => import('@/views/merchantCenter/base/newAccount'),
            meta: { title: '新增账户', icon: 'newAccount' },

          },
        ]
      },
      {
        path: '/merchantCenter/goods',
        name: 'Goods',
        component: FreeManage,
        meta: { title: '商品管理', icon: 'goods' },
        children : [
          {
            path: 'goodsList',
            name: 'GoodsList',
            component: () => import('@/views/merchantCenter/goods/goodsList'),
            meta: { title: '商品清单', icon: 'goodsList' },

          },
          {
            path: 'newGoods',
            name: 'NewGoods',
            component: () => import('@/views/merchantCenter/goods/newGoods'),
            meta: { title: '新增商品', icon: 'newGoods' },

          },
        ]
      },
      {
        path: '/merchantCenter/userCenter',
        name: 'UserCenter',
        component: FreeManage,
        meta: { title: '商户中心', icon: 'userCenter' },
        children : [
          {
            path: 'infoUpload',
            name: 'InfoUpload',
            component: () => import('@/views/merchantCenter/userCenter/infoUpload'),
            meta: { title: '资质上传', icon: 'infoUpload' },

          },
          {
            path: 'openShop',
            name: 'OpenShop',
            component: () => import('@/views/merchantCenter/userCenter/OpenShop'),
            meta: { title: '我要开店', icon: 'OpenShop' },

          },
          {
            path: 'settlement',
            name: 'Settlement',
            component: () => import('@/views/merchantCenter/userCenter/settlement'),
            meta: { title: '结算账户', icon: 'settlement' },

          },
          {
            path: 'postSetting',
            name: 'PostSetting',
            component: () => import('@/views/merchantCenter/userCenter/postSetting'),
            meta: { title: '运费设置', icon: 'postSetting' },

          },
          {
            path: 'addressManage',
            name: 'AddressManage',
            component: () => import('@/views/merchantCenter/userCenter/addressManage'),
            meta: { title: '地址管理', icon: 'addressManage' },

          },
          {
            path: 'bond',
            name: 'Bond',
            component: () => import('@/views/merchantCenter/userCenter/bond'),
            meta: { title: '保证金设置', icon: 'bond' },

          },
        ]
      },
      {
        path: '/merchantCenter/transaction',
        name: 'Transaction',
        component: FreeManage,
        meta: { title: '交易管理', icon: 'transaction' },
        children : [
          {
            path: 'search',
            name: 'Search',
            component: () => import('@/views/merchantCenter/transaction/search'),
            meta: { title: '交易查询', icon: 'search' },

          },
          {
            path: 'refund',
            name: 'Refund',
            component: () => import('@/views/merchantCenter/transaction/refund'),
            meta: { title: '退款管理', icon: 'refund' },

          },
          {
            path: 'transitionOrder/:id',
            name: 'transitionOrder',
            component: () => import('@/views/merchantCenter/transaction/transitionOrder'),
            meta: { title: '交易详情', icon: 'transitionOrder' },
            hidden: true
          },
          {
            path: 'refundOrder/:id',
            name: 'RefundOrder',
            component: () => import('@/views/merchantCenter/transaction/refundOrder'),
            meta: { title: '退款详情', icon: 'refundOrder' },
            hidden: true
          },
        ]
      },
      {
        path: '/merchantCenter/settleManage',
        name: 'SettleManage',
        component: FreeManage,
        meta: { title: '结算管理', icon: 'settleManage' },
        children : [
          {
            path: 'current',
            name: 'Current',
            component: () => import('@/views/merchantCenter/settleManage/current'),
            meta: { title: '当前结算', icon: 'current' },

          },
          {
            path: 'history',
            name: 'SettleHistory',
            component: () => import('@/views/merchantCenter/settleManage/history'),
            meta: { title: '历史结算', icon: 'history' },

          },
        ]
      },
      {
        path: '/merchantCenter/shopManage',
        name: 'ShopManage',
        component: FreeManage,
        meta: { title: '店铺管理', icon: 'shopManage' },
        children : [
          {
            path: 'shopInfo',
            name: 'ShopInfo',
            component: () => import('@/views/merchantCenter/shopManage/shopInfo'),
            meta: { title: '商家/店铺信息', icon: 'shopInfo' },

          },
          {
            path: 'subAccount',
            name: 'SubAccount',
            component: () => import('@/views/merchantCenter/shopManage/subAccount'),
            meta: { title: '子账号管理', icon: 'subAccount' },

          },
        ]
      },
      {
        path: '/merchantCenter/tool',
        name: 'Tool',
        component: FreeManage,
        meta: { title: '商家工具', icon: 'tool' },
        children : [
          {
            path: 'getGoods',
            name: 'GetGoods',
            component: () => import('@/views/merchantCenter/tool/getGoods'),
            meta: { title: '一键抓取商品', icon: 'getGoods' },

          },
          {
            path: 'sourceGoods',
            name: 'SourceGoods',
            component: () => import('@/views/merchantCenter/tool/sourceGoods'),
            meta: { title: '查看源宝贝', icon: 'sourceGoods' },

          },
        ]
      },

    ]
  },

  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/changePsw', component: () => import('@/views/login/changePsw'), hidden: true },
  { path: '/register', component: () => import('@/views/register/index'), hidden: true },
  {
    path : '/',
    component : Layout,
    redirect: '/home',
    hidden: true,
    // children : []
  },
  { path: '/home',
    // name: 'Home',
    // redirect : '/home',
    component : Layout,
    meta: { title: '首页', icon: 'center' },
    hidden: true,
    children :[
      {
        path: '/home',
        // name: 'Home',
        component: () => import('@/views/home/index'),

      }
    ]
  },
  { path: '/ruleCenter',
    redirect : '/ruleCenter/index',
    component : Layout,
    // meta: { title: '特卖商城', icon: 'center' },
    hidden: true,
    children :[
      {
        path: '/ruleCenter/index',
        name: 'RuleCenter',
        component: () => import('@/views/ruleCenter/index'),

      }
    ]
  },
  { path: '/accountManage',
    redirect : '/accountManage/index',
    component : Layout,
    // meta: { title: '特卖商城', icon: 'center' },
    hidden: true,
    children :[
      {
        path: '/accountManage/index',
        name: 'AccountManage',
        component: () => import('@/views/accountManage/index'),

      }
    ]
  },
  // { path: '/a',
  //   // name: 'Test',
  //   component : Layout,
  //   redirect : '/a/index',
  //   meta: { title: 'test', icon: 'center' },
  //   hidden: true,
  //   children :[
  //     {
  //       path: '/a/index',
  //       name: 'Test',
  //       component: () => import('@/views/merchantCenter/test'),
  //
  //     }
  //   ]
  // },

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

