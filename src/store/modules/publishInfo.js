const publishInfo ={
  state : {
    publishForm : {
      type : '1',
      platformType : '',
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
      people :'',
      activityStartTime : '',
      activityCalendar : [],
      dayNum : '',
    },
    tryoutItem : {
      // goodsAmount : [],
      dayNum : '',
      choosePlat : ''
    }
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
