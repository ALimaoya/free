const publishInfo ={
  state : {
    publishForm : {
      platformType: '',
      receiveHours : '24',
      categoryId : '',
      activityTitle : '',
      productUrl: '',
      shopId : '' ,
      mainImageUrl : '',
      showImageUrl : '',
      buyProductSpec:'',
      buyProductQuantity : '1',
      buyProductAmount : '',
      post : '1',
      productShareUrl : '',
      keyword : [{
        'searchId' : '',
        'sortType' : '1',
        'searchKeyword' : '',
        'searchCondition' : ''
      }],
      activityStartTime : '',
      activityCalendar : [],
      productName : '',
      productDetail : ''
    },

    // goodsAmount : [],
  },
  mutations : {
    SAVE_PUBLISHINFO : (state,form)=>{
      state.publishForm = form
    },
    SAVE_TRYOUTITEM : (state,obj) => {
      state.tryoutItem = obj
    }
  },
  actions : {
    savePublishInfo( { commit } ,form){
      commit('SAVE_PUBLISHINFO',form)
    },
    saveTryoutItem( { commit } ,obj ){
      console.log(obj);

      commit('SAVE_TRYOUTITEM',obj)
    }
  }
}

export default publishInfo
