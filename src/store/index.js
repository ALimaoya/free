import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import tagsView from './modules/tagsView'
import publishInfo from './modules/publishInfo'
import shopInfo from './modules/shopInfo'
import searchBar from './modules/searchBar'
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    publishInfo,
    shopInfo,
    searchBar
  },
  getters
});

export default store
