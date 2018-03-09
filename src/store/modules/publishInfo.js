
import { publishActivity ,getDetail , changeDetail , activityPay } from "@/api/activity"

const publishInfo ={
  state : {
    publishForm : {
      platformType: '',
      receiveHours : '24',
      categoryId : '',
      productId : '',
      activityTitle : '',
      productUrl: '',
      shopId : '' ,
      mainImageUrl : '',
      showImageUrl : '',
      buyProductSpec:'',
      buyProductQuantity : '1',
      buyProductAmount : '',
      post : '1',
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
    changePublish : {
      activityId : '',
      platformType: '',
      receiveHours : '24',
      categoryId : '',
      productId : '',
      activityTitle : '',
      productUrl: '',
      shopId : '' ,
      mainImageUrl : '',
      showImageUrl : '',
      buyProductSpec:'',
      buyProductQuantity : '1',
      buyProductAmount : '',
      post : '1',
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
    activity : {
      activityTitle : '',
      activityDepositAmount : '',
      activityTotalAmount : '',
      totalDeposit : '',
      activityId : '',
      activityServiceAmount : '',
    }

    // goodsAmount : [],
  },
  mutations : {
    SAVE_PUBLISHINFO : (state,form)=>{
      state.publishForm = form
    },

    SAVE_ACTIVITY : (state , obj) => {
      state.activity = obj
    },

    CHANGE_PUBLISHINFO : ( state, form ) => {
      state.changePublish = form ;
    },

    GET_DETAIL : (state ,form ) => {
      state.publishForm = form ;
    }
  },
  actions : {
    savePublishInfo( { commit } ,form){
      return new Promise((resolve, reject) => {
        publishActivity(form).then(response => {

          const data = response.data.data ;
          commit('SAVE_PUBLISHINFO',data);

          resolve(response)
        }).catch(error => {

          reject(error)
        })
      })
    },

    saveActivity( { commit } ,form ){
      return new Promise((resolve, reject) => {
        activityPay(form).then(response => {

          const data = response.data.data ;
          commit('SAVE_ACTIVITY' ,form) ;

          resolve(response)
        }).catch(error => {

          reject(error)
        })
      })
    },

    changePublishInfo({ commit } ,form){
      return new Promise((resolve, reject) => {
        changeDetail(form).then(response => {

          const data = response.data.data ;
          commit('CHANGE_PUBLISHINFO',data);

          resolve(response)
        }).catch(error => {

          reject(error)
        })
      })
    },

    getPublishDetail({ commit } ,order ){
      return new Promise((resolve, reject) => {
        getDetail(order).then(response => {

          const data = response.data.data ;
          commit('GET_DETAIL',data);

          resolve(response)
        }).catch(error => {

          reject(error)
        })
      })
    }

  }
};

export default publishInfo
