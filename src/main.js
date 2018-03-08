import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import $ from 'jQuery'
import '@/permission' // permission control

// import '@/utils/rem.js'
Vue.use(ElementUI);
// Vue.use(VueResource);

Vue.config.productionTip = false ;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
