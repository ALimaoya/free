import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import tagsView from './modules/tagsView'
import publishInfo from './modules/publishInfo'
import shopInfo from './modules/shopInfo'
import searchBar from './modules/searchBar'
import signUp from './modules/signUp'
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    publishInfo,
    shopInfo,
    searchBar,
    signUp
  },
  getters
});

export default store
