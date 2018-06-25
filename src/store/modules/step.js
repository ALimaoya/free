const step = {

  state : {
    // user : '',
    uploadInfo : {
      name : '',
      email : '',
      cardId : '',
      enterpriseName : '',
      businessImage : '',
      authorizeImage:'',
      cardFaceImage:'',
      cardBackImage:'',

    },
    shopInfo: {
      account:'',
      verify:'',
      shopName: '',
      main:'',
      type:'1',
      intro:'',
      logo: ''
    }
  },
  mutations : {

    GET_USERINFO : (state,userInfo) => {
      state.userInfo = userInfo ;
    },

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
