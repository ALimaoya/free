const searchBar = {
  state : {
    goodsList : {
      account : {
        EQ_code: '',
        LIKE_productName: '',
        EQ_status: '',
        EQ_shelveStatus: '',
      },
      currentPage : 1,
      pageSize : 10,
      thirdType: '',
      secondType:''
    },
    transitionList: {
      transition : {
        EQ_payOrder: '',
        EQ_code: '',
        productCode: '',
        LIKE_payOrder: '',
        GT_createTime: '',
        LT_createTime: '',
        EQ_status: '',
        EQ_activityType:'',
      },
      currentPage : 1,
      pageSize : 10,
    },
    refundList: {
      refund : {
        orderId: '',
        subOrderId:'',
        status:'',
        startDate:'',
        endDate:''
      },
      currentPage : 1,
      pageSize : 10,
    },
    historyList: {
      settlement : {
        EQ_code: '',
        GT_settlementTime: '',
        LT_settlementTime: '',
        EQ_status: '',
      },
      currentPage : 1,
      pageSize : 10,
    },
    spreadList: {
      search : {
        startDate: "",
        endDate: "",
        status: ""
      },
      currentPage : 1,
      pageSize : 10,
    },
    secKillList : {
      history: {
        GTE_startDate: '',
        LTE_endDate:'',
        EQ_product: '',
        EQ_status:'',

      },
      currentPage : 1,
      pageSize : 10,
      type : ''
    },
    shareList : {
      history: {
        GTE_startDate: '',
        LTE_endDate:'',
        EQ_product: '',
        EQ_status:'',

      },
      currentPage : 1,
      pageSize : 10,
      type : ''
    }

  },
  mutations : {
    saveSearchGoods : (state,obj) => {
      state.goodsList = obj ;
    },
    saveTransition : (state,obj) => {
      state.transitionList = obj
    },
    saveRefund : (state,obj) => {
      state.refundList = obj ;
    },
    saveHistorySettlement : (state,obj) => {
      state.historyList = obj ;
    },
    saveSpread: (state,obj) => {
      state.spreadList = obj ;
    },
    saveSecKill : ( state,obj) => {
      state.secKillList = obj ;
    },
    saveShare: (state, obj) => {
      state.shareList = obj ;
    }

  }
};
export default searchBar ;
