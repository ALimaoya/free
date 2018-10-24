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
    },
    brandRecommendList : {
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
    shop : {
      selectShop : {
        EQ_platformType : '',
        EQ_status : '',
        EQ_payStatus : ''
      },
      currentPage : 1,
      pageSize : 10,
    },
    approval : {
      activity : {
        EQ_platformType : '',
        EQ_activityCode : '',
        EQ_activityType : '',
        EQ_activityStatus : '',
        GT_activityEndTime: '',
        LT_activityStartTime : '',
      },
      currentPage : 1,
      pageSize : 10,
    },
    flow : {
      activity : {
        EQ_platformType : '',
        EQ_activityCode : '',
        EQ_activityStatus : '',
        GT_activityEndTime : '',
        LT_activityStartTime : '',
        shopId : '',
        EQ_activityType : '4',
        LIKE_addServiceType : [],
        LIKE_addServiceType2:''
      },
      currentPage : 1,
      pageSize : 10,
    },
    group : {
      activity : {
        groupActivityType : '',
        EQ_activityCode : '',
        EQ_status : '',
        GT_activityEndTime : '',
        LT_activityStartTime : '',
        shopId : '',
        EQ_activityType : '',
        EQ_activityStatus : '',
      },
      currentPage : 1,
      pageSize : 10,
    },
    groupOrder : {
      order : {
        groupActivityType : '' ,
        activityCode : '',
        orderCode: '',
        EQ_activityShop : '',
        activityStartTime : '',
        activityEndTime : '',
        EQ_activityType : '',
        EQ_status: '',
      },
      currentPage : 1,
      pageSize : 10,
    },
    checkGroup : {
      order : {
        groupActivityType : '' ,
        activityCode : '',
        orderCode: '',
        EQ_activityShop : '',
        activityStartTime : '',
        activityEndTime : '',
        EQ_activityType : '',
        EQ_status: '',
      },
      currentPage : 1,
      pageSize : 10,
    },
    activityOrder : {
      order : {
        EQ_status: '',
        EQ_activityType:'',
        platformType : '' ,
        activityCode : '',
        orderCode: '',
        thirdOrderCode: '',
      },
      currentPage : 1,
      pageSize : 10,
    },
    flowOrder : {
      order : {
        EQ_status: '',
        platformType : '' ,
        activityCode : '',
        orderCode: '',
        EQ_activityShop : '',
        activityStartTime : '',
        activityEndTime : '',
        EQ_activityType : '4',
        LIKE_addServiceType : [],
        LIKE_addServiceType2:''
      },
      currentPage : 1,
      pageSize : 10,
    },
    bonus:{
      order : {
        EQ_status: '',
        EQ_activityType:'',
        platformType : '' ,
        activityCode : '',
        orderCode: '',
        thirdOrderCode: '',
      },
      currentPage : 1,
      pageSize : 10,
    },
    view:{
      order : {
        EQ_status: '',
        EQ_activityType:'',
        platformType : '' ,
        activityCode : '',
        orderCode: '',
        thirdOrderCode: '',
      },
      currentPage : 1,
      pageSize : 10,
    },
    checkFlow : {
      order : {
        EQ_status: '4',
        platformType : '' ,
        activityCode : '',
        orderCode: '',
        thirdOrderCode: '',
        EQ_activityShop : '',
        activityStartTime : '',
        activityEndTime : '',
        EQ_activityType : '4',
        LIKE_addServiceType : [],
        LIKE_addServiceType2:''
      },
      currentPage : 1,
      pageSize : 10,
    },
    moneyHistory: {
      searchForm : {
        detail : '',
        startDate : '',
        endDate : ''
      },
      currentPage : 1,
      pageSize : 10,
    },
    cashHistory : {
      searchForm : {
        detail: '',
        startDate: '',
        endDate: ''
      },
      currentPage : 1,
      pageSize : 10,
    },
    brandList : {
      brand : {
        brandCnName:'',
        brandEnName:'',
        EQ_status:''
      },
      currentPage : 1,
      pageSize : 10,
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
    },
    savebrandRecommend:(state, obj)=>{
      state.brandRecommendList = obj
    },
    saveselectShop : (state,obj) => {
      state.shop = obj ;
    },
    saveApproval : (state,obj) => {
      state.approval = obj ;
    },
    saveFlow : (state,obj) => {
      state.flow = obj ;
    },
    saveActivityOder : (state,obj) => {
      state.activityOrder = obj ;
    },
    saveFlowOrder : (state,obj) => {
      state.flowOrder = obj ;
    },
    saveBonus : (state,obj) => {
      state.bonus = obj ;
    },
    saveView : (state,obj) => {
      state.view = obj ;
    },
    saveCheckFlow : (state,obj) => {
      state.checkFlow = obj ;
    },
    saveMoneyList : (state,obj) => {
      state.moneyHistory = obj ;
    },
    saveCashList : (state,obj) => {
      state.cashHistory = obj ;
    },
    saveBrandList : (state,obj) => {
      state.brandList = obj ;
    },
    saveGroup : (state,obj) => {
      state.group = obj ;
    },
    saveGroupOrder : (state,obj) => {
      state.groupOrder = obj ;
    },
    saveCheckGroup : (state,obj) => {
      state.checkGroup = obj ;
    },
    deleteSearchGoods: (state) => {
      state.goodsList ={
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
      }
    }
  }
};
export default searchBar ;
