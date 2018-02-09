import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login','/register'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login'|| to.path === '/register') {
      next()
      console.log(1)
    } else{
      next()
      console.log(2)
      // store.dispatch('GetInfo').then(res => { // 拉取用户信息
      //     console.log(res);
      //     next()
      //   }).catch(() => {
      //     store.dispatch('LogOut').then(() => {
      //       Message.error('获取用户信息失败,请重新登录')
      //       next({ path: '/login' })
      //     })
      //   })

    }
      // if (store.getters.name.length !== 0) {

      // } else {
      //   next()
      // }
  } else {

    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
