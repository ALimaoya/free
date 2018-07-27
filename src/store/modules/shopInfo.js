const shopInfo = {
  state: {
    enterForm: '',
    cardType:'',
    shopName:''
  },
  mutations:{
      addForm(state,item){
          state.enterForm = item
      },
      addCardType(state,item){
        state.cardType = item
      },
      shopName(state,item){
        state.shopName = item
      }
  },
}

export default shopInfo