
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
      payStatus : ''

    },


    // goodsAmount : [],
  },
  mutations : {
    SAVE_PUBLISHINFO : (state,form)=>{
      state.publishForm  = form
    },

    CHANGE_PUBLISHINFO : ( state, form ) => {
      state.changePublish = form ;
    },
    PAY_DETAIL : ( state ,data) => {
      state.activity = data ;
    },

    GET_DETAIL : (state ,form ) => {
      state.changePublish = form ;
    }
  },
  actions : {
    savePublishInfo( { commit } ,form){
      return new Promise((resolve, reject) => {
        publishActivity(form).then(response => {

          const data = response.data.data ;
          commit('SAVE_PUBLISHINFO',form);
          commit('PAY_DETAIL',data);

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
          commit('CHANGE_PUBLISHINFO',form);
          commit('PAY_DETAIL',data);
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
    },

    getPayDetail({ commit } ,order ){
      return new Promise((resolve,reject) => {
        getPayInfo(order).then(response => {
          const data = response.data ;
          commit('PAY_DETAIL',data);
          resolve(response);
        }).catch( err => {
          reject(err);
        })
      })
    }

  }
};

export default publishInfo
