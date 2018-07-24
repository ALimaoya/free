import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login','/register','/changePsw','/home']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  const token = getToken() ;
  if (token) {
    if (to.path === '/login'|| to.path === '/register' || to.path === '/changePsw'|| to.path === '/home') {
      next();
    } else{
      next()
    }

  } else {

    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login');
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done() // 结束Progress
});
