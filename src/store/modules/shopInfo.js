import {  getMobile } from '@/utils/auth'

const shopInfo = {
  state: {
    enterForm: {
      name: '',
      email: '',
      mobile: getMobile(),
      cardId:'',
      cardFaceImage: '',
      cardBackImage : '',
      cardSelfImage: '',
      cardDeadline: '',
      mainBusiness: '',
      shopName:'',
      // thirdShopUrl: '',
      thirdShopUrl:[{ platformName : '',url : ''}]
    },
    cardType:'',
    shopName:'',
    shopType:'',
    enterForm2: {
      name: '',
      email: '',
      mobile: getMobile(),
      legalRepName: '',
      legalRepMobile: '',
      cardId:'',
      cardFaceImage: '',
      cardBackImage : '',
      // halfBody: '',
      cardDeadline: '',
      mainBusiness: '',
      shopName:'',
      thirdShopUrl:[{ platformName : '',url : ''}],
      licenseCountryType: '1',
      licenseMergeType: '1',
      enterpriseName:'',
      companyAddress:{ province : '', detail: ''},
      socialCreditCode:'',
      businessImage: '',
      openLicenceImage: '',
      busLicenceDeadline: '',
      shopType: '',
      merchantBrandinfoReqDtos:[ {
        brandRegistType:'1',
        brandRegistCode: '',
        brandCertifyImage:'',
        brandAuthImage:'',
        brandAuthDeadline:'',
        brandAuthType:''
      }]
    },
    cardType2:'',
    editorId: {},
    listId: [],
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
    addEditorId(state,value){
        state.editorId = value
    },
    addListId(state,value){
        state.listId = value
    },
    addMerchantBrand(state,value){
        state.merchantBrandinfoReqDtos = value ;
    },
    clearForm(state){
        state = {
          enterForm: {
            name: '',
            email: '',
            mobile: getMobile(),
            cardId:'',
            cardFaceImage: '',
            cardBackImage : '',
            cardSelfImage: '',
            cardDeadline: '',
            mainBusiness: '',
            shopName:'',
            // thirdShopUrl: '',
            thirdShopUrl:[{ platformName : '',url : ''}]
          },
          cardType:'',
          shopName:'',
          shopType:'',
          enterForm2: {
            name: '',
            email: '',
            mobile: getMobile(),
            legalRepName: '',
            legalRepMobile: '',
            cardId:'',
            cardFaceImage: '',
            cardBackImage : '',
            // halfBody: '',
            cardDeadline: '',
            mainBusiness: '',
            shopName:'',
            thirdShopUrl:[{ platformName : '',url : ''}],
            licenseCountryType: '1',
            licenseMergeType: '1',
            enterpriseName:'',
            companyAddress:{ province : '', detail: ''},
            socialCreditCode:'',
            businessImage: '',
            openLicenceImage: '',
            busLicenceDeadline: '',
            shopType: '',
            merchantBrandinfoReqDtos:[ {
              brandRegistType:'1',
              brandRegistCode: '',
              brandCertifyImage:'',
              brandAuthImage:'',
              brandAuthDeadline:'',
              brandAuthType:''
            }]
          },
          cardType2:'',
          editorId: {},
          listId: [],
        }
    }
  },
};

export default shopInfo
