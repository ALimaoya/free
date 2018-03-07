import { login, register, getInfo ,changePsw } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userInfo : {},
    attendant : {},
    wallet : {},
    pub_plans : []

  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_UserInfo: (state , userInfo) => {
      state.userInfo = userInfo
    },
    SET_Attendant: (state, attendant) => {
      state.attendant = attendant
    },
    SET_Wallet: (state,wallet) => {
      state.wallet = wallet
    },
    SET_Pub_plans: (state,pub_plans) => {
      state.pub_plans = pub_plans
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const token = response.data.data;
          setToken(token);
          commit('SET_TOKEN', token);
          // if(response.data.status === '000000000'){
            resolve(response);
          // }
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })
    },
    // 注册
    Register({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        register(userInfo).then(response => {
            const token = response.data.token;
            setToken(token);
            commit('SET_TOKEN', token);
            resolve(response);
        }).catch(error => {
          console.log(error);
          reject(error)
        })
      })
    },
    //修改密码
    ChangePsw({ commit }, form){
      return new Promise((resolve,reject) => {
        changePsw(form).then( response => {
          console.log(response);

          resolve();
        }).catch( error => {
          console.log(error);
          reject(error);
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit } ) {
      // console.log(token)
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data.data ;
          // console.log(response.data);
          const userInfo = data.userinfo ;
          const attendant = data.attendant;
          const wallet = data.wallet;
          const pub_plans = data.pub_plans;
          commit('SET_UserInfo', userInfo);
          commit('SET_Attendant', attendant);
          commit('SET_Wallet',wallet);
          commit('SET_Pub_plans',pub_plans);
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
        commit('SET_TOKEN', '');
        removeToken();
        resolve()
      })
    }
  }
};

export default user
