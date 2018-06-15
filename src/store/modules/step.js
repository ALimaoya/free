const step = {

  state : {
    // user : '',
    userInfo : {

    }
  },
  mutations : {
    // USER : state=> {
    //   state.user = ''
    // },
    GET_USERINFO : (state,userInfo) => {
      state.userInfo = userInfo ;
    }
  },

  actions : {
    // User : ( { commit }) => {
    //   commit('USER')
    // },
    GetUserInfo : ({ commit },user) => {
      return new Promise((resolve, reject) => {
        User(user).then(response => {
          const userInfo = response.data.data;
          // setToken(token);
          commit('GET_USERINFO', userInfo);
          // if(response.data.status === '000000000'){
          resolve(response);
          // }
        }).catch(error => {
          // console.log(error);
          reject(error)
        })
      })
    }
  }
}


export default step
