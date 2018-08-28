const signUp = {
  state : {
    secondKill :{
      startDate : '' ,
      endDate : '' ,
      startTime: '',
      endTime: ''
    },

  },
  mutations : {
    addSecondKill : (state,value) => {
      state.secondKill = value ;
    }

  }
};
export default signUp ;
