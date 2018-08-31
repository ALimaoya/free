const signUp = {
  state : {
    secondKill :{
      startDate : '' ,
      endDate : '' ,
      startTime: '',
      endTime: '',
      startSevenDay:'',
      endSevenDay:''
    },

  },
  mutations : {
    addSecondKill : (state,value) => {
      state.secondKill = value ;
    }

  }
};
export default signUp ;
