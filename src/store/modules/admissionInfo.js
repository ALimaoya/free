
const admissionInfo = {
  state : {
    personalForm:{
      name: '',
      email: '',
      tel: '',
      idCard:'',
      front: '',
      back : '',
      halfBody: '',
      idCardDate: '',
      shopType: [],
      shopName:'',
      shopLink:''
    },
    enterpriseForm: {
      name1: '',
      email: '',
      tel1: '',
      name2: '',
      tel2: '',
      idCard:'',
      front: '',
      back : '',
      halfBody: '',
      idCardDate: '',
      shopType: [],
      shopName:'',
      shopLink:'',
      inner: '1',
      all: '1',
      companyName:'',
      companyAddr:{ provice : '', detail: ''},
      social_credit_code:'',
      business_license: '',
      opening_permit: '',
      licenseDate: '',
      registerType:'1',
      registerCode:'',
      certification: ''
    }
  },
  mutations : {
    SET_PERSONAL : (state,info) => {
      state.personalForm = info ;
    }
  },
  actions: {

  }
};

export default admissionInfo ;
