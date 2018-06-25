import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import tagsView from './modules/tagsView'
import publishInfo from './modules/publishInfo'
import step from './modules/step'
import admissionInfo from './modules/admissionInfo'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    publishInfo,
    step,
    admissionInfo
  },
  getters
});

export default store
