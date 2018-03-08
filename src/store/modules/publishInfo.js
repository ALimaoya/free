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
        'sortType' : '',
        'searchKeyword' : '',
        'searchCondition' : ''
      }],
      activityStartTime : '',
      activityCalendar : [],
      productName : '',
      productDetail : ''
    },
    imgUrl : {
      showImg : '',
      mainImg : '',
    }

    // goodsAmount : [],
  },
  mutations : {
    SAVE_PUBLISHINFO : (state,form)=>{
      state.publishForm = form
    },
    SAVE_IMAGEURL : (state,obj) => {
      state.imageUrl = obj
    }
  },
  actions : {
    savePublishInfo( { commit } ,form){
      commit('SAVE_PUBLISHINFO',form)
    },
    saveTryoutItem( { commit } ,obj ){
      console.log(obj);

      commit('SAVE_IMAGEURL',obj)
    }
  }
}

export default publishInfo
