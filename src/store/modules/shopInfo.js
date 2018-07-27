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
      thirdShopUrl:''
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
      thirdShopUrl:'',
      licenseCountryType: '1',
      licenseMergeType: '1',
      enterpriseName:'',
      companyAddress:{ province : '', detail: ''},
      socialCreditCode:'',
      businessImage: '',
      openLicenceImage: '',
      busLicenceDeadline: '',
      // registerType:'1',
      // registerCode:'',
      // certification: '',
      merchantBrandinfoReqDtos:[
        {
          brandRegistType:'1',
          brandRegistCode: '',
          brandCertifyImage:'',
          brandAuthImage:'',
          brandAuthDeadline:'',
          brandAuthType:''
        }
      ]
    },
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
