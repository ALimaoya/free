const shopInfo = {
  state: {
    enterForm: '',
    cardType:'',
    shopName:'',
    shopType:'',
    enterForm2: '',
    cardType2:'',
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
      },
      shopType(state,item){
        state.shopType = item
      },
      addForm2(state,item){
        state.enterForm2 = item
    },
    addCardType2(state,item){
      state.cardType2 = item
    },
  },
}

export default shopInfo