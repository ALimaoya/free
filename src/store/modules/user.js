import { login, register, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    id : '',
    name: '',
    vipLevel : '',
    vip_time : '',
    avator: '',
    mobile : '',
    qq : '',
    wechat : '',
    deposit : '',
    gold : '' ,
    freeze_deposit : '',
    plan_title : '',
    url : '',
    plan_img : ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_UserInfo: (state,id, userInfo) => {
      state.id = userInfo.id
      state.name = userInfo.name
      state.vipLevel = userInfo.vipLevel
      state.vip_time = userInfo.vip_time

    },
    SET_Attendant: (state, attendant) => {
      state.avator = attendant.avator
      state.mobile = attendant.mobile
      state.qq = attendant.qq
      state.wechat = attendant.wechat
    },
    SET_Wallet: (state,wallet) => {
      state.deposit = wallet.deposit
      state.gold = wallet.gold
      state.freeze_deposit = wallet.freeze_deposit
    },
    SET_Pub_plans: (state,pub_plans) => {
      state.plan_title = pub_plans.plan_title
      state.url = pub_plans.url
      state.plan_img = pub_plans.plan_img

    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      console.log(userInfo)
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          console.log(response)
          const token = response.data.data
          setToken(token)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    // 注册
    Register({ commit }, userInfo) {
      console.log(userInfo)
      return new Promise((resolve, reject) => {
        register(userInfo).then(response => {
            const token = response.data.token
            setToken(token);
            console.log(response,token)
            commit('SET_TOKEN', token);
            resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          // console.log(response.data);
          const userInfo = response.data.userinfo
          const attendant = response.data.attendant
          const wallet = response.data.wallet
          const pub_plans = response.data.pub_plans
          commit('SET_UserInfo', userInfo)
          commit('SET_Attendant', attendant)
          commit('SET_Wallet',wallet)
          commit('SET_Pub_plans',pub_plans)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     login(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    //  登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
