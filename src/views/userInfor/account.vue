<template>
  <div class="account">
    <h1 class="title">
      <p>绑定支付宝</p>
      <div>
        <el-button style="padding : 0 0.05rem;text-align:center ;line-height: 0.4rem" type="primary" @click="binding">{{title}}</el-button>
        <span>支付宝关系到您的资金提现，请认真填写。</span>
      </div>

    </h1>
    <div v-if="accountBox" class="form">
      <p>{{title}}</p>
      <el-form ref="payForm" :model="payForm" :rules="payRule" center label-position="right">
        <el-form-item label="绑定手机号：" prop="mobile">
          <el-input v-model.trim="payForm.mobile" readonly ></el-input>
          <b class="blank" ></b>
        </el-form-item>
        <el-form-item label="验证码：" prop="pswVerify" >
          <el-input placeholder="请输入验证码" v-model.trim="payForm.pswVerify" ></el-input>
          <el-button class="getNum" @click="getNum" :disabled="disabled">{{ btntext }}</el-button>
        </el-form-item>
        <el-form-item label="支付宝姓名：" prop="name">
          <el-input v-model.trim="payForm.name"></el-input>
          <b class="blank" ></b>
        </el-form-item>
        <el-form-item label="支付宝账号："  prop="account">
          <el-input v-model.trim="payForm.account"></el-input>
          <b class="blank" ></b>
        </el-form-item>
        <span>温馨提示：如果您填写的支付宝账号不正确，可能无法成功返款，平台不承担由此产生的一切费用。</span>
        <el-form-item class="btn">
          <el-button type="primary" @click="onSubmit('payForm')">确定</el-button>
          <el-button @click="cancel('payForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="!userInfo&&!accountBox" class="accountImg">
      <img src="../../assets/imgs/u860.png" alt="" />
    </div>
    <div v-if="userInfo&&!accountBox" class="payInfo detail">
      <div>
        <img src="../../assets/imgs/apily.png" alt="">
      </div>
      <div class="mt20">
        <span class="f17 ">支付宝姓名：</span> {{ apilyInfo.thirdName}}
      </div>
      <div class="mt20">
        <span class="f17">支付宝账号：</span> {{ apilyInfo.thirdAccount}}
      </div>
    </div>

  </div>
</template>

<script>
  import ElForm from "element-ui/packages/form/src/form";
  import ElFormItem from "element-ui/packages/form/src/form-item";
  // import {getMobile} from '@/utils/auth'
  // import { setApilyAccount,getApilyInfo,getCaptcha } from "@/api/userInfor"
  import {
    getMobile
  } from '@/utils/auth'
  import {
    validatePhone,
    validateEmail,
    validateCode,
    validName
  } from '@/utils/validate'
  import {
    setApilyAccount,
    getThirdInfo,
    getCaptcha
  } from "@/api/userInfor"

  export default {
    name: "account",
    components: {
      ElFormItem,
      ElForm,
    },
    data() {
      const validateMobile = (rule, value ,callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else {
          if (!validatePhone(value)) {
            callback(new Error('请输入正确的手机号'))
          }
        }
        callback();
      };
      const validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入支付宝姓名'))
        } else {
          if (!validName(value)) {
            callback(new Error('请输入正确的支付宝姓名'))
          }
          if(value.length > 20 ){
            callback(new Error('支付宝姓名不得超过20个字符'))

          }
        }
        callback();
      };
      const validateAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入支付宝账号'))
        } else {
          let status = validatePhone(value) || validateEmail(value);
          if (!status) {
            callback(new Error('请输入正确的支付宝账号'))
          }
          if(value.length > 100 ){
            callback(new Error('支付宝账号不得超过100个字符'))
          }
        }
        callback();
      };
      const validateYZM = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else {
          if (!validateCode(value)) {
            callback(new Error('验证码有误，请重新输入'))
          } else {
            callback();
          }

        }
      };
      return {
        accountBox: false,
        userInfo: false,
        payForm: {
          mobile: getMobile(),
          name: '',
          account: '',
          pswVerify: '',
        },
        apilyInfo: {},
        getNew: false,
        disabled: false,
        btntext: ' 获取验证码',
        title: '绑定支付宝',
        payRule: {
          mobile : [{ required : true , trigger : 'blur', validator : validateMobile }],
          name: [{
            validator: validateName,
            required: true,
            trigger: 'blur'
          }],
          account: [{
            validator: validateAccount,
            required: true,
            trigger: 'blur'
          }],
          pswVerify: [{
            validator: validateYZM,
            trigger: 'blur',
            required: true
          }],

        }
      }
    },
    mounted() {
      this.getApilyAccount()
    },
    methods: {
      getApilyAccount() {
        getThirdInfo('1').then(res => {
          if (res.data.status == '000000000') {
            if (res.data.data.length > 0) {
              this.userInfo = true;
              this.apilyInfo = res.data.data[0];
              this.title = "修改支付宝账号";
            }
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            });
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      //获取验证码
      getNum() {
        var num = 60;
        this.getNew = false;
        var timer = setInterval(() => {
          this.btntext = `重新发送(${num}s)`;
          num--;
          this.disabled = true;
          if (this.getNew == true || num === 0) {
            this.btntext = "获取验证码";
            clearInterval(timer);
            this.disabled = false;

          }

        }, 1000)
        getCaptcha().then(
          res => {
            if (res.data.status == '000000000') {
              this.$message({
                message: '短信验证码发送成功',
                type: 'success',
                center: true
              });
              return
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                center: true
              });
              clearInterval(timer);
              this.disabled = false;
            }
          }
        ).catch(err => {
          clearInterval(timer);
          this.disabled = false;
          alert('服务器开小差啦，请稍等~')
        })
      },

      binding() {
        this.accountBox = true;
      },
      // 添加支付宝账号
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let formdata = new FormData()
            formdata.append('thirdName', this.payForm.name);
            formdata.append('captcha', this.payForm.pswVerify);
            formdata.append('thirdAccount', this.payForm.account);
            setApilyAccount(formdata).then(res => {
              if (res.data.status === '000000000') {
                this.$message({
                  type: 'success',
                  message: '支付宝绑定成功',
                  center: true
                });
                this.userInfo = true;
                this.accountBox=false;
                this.getApilyAccount();
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                });
                return
              }
            }).catch(err => {
              alert('服务器开小差啦，请稍等~')
            })

          }
        })
      },
      //解绑支付宝账号
      removeAccount() {
        this.payForm.name = '';
        this.payForm.account = '';
        this.userInfo = false;
      },

      cancel(formName) {
        this.$refs[formName].resetFields();
        this.accountBox = false;
      }

    }

  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .account {
    width: 100%;
    margin: 0 auto;
    /*padding: 0.3rem 0.2rem;*/
    box-sizing: border-box;
    font-size: 0.15rem;
    color: #333;
    .getNum {
      width: 1.3rem;
      margin-left: 0.3rem;
      padding: 0.12rem 0.15rem;

    }
    .title {
      width: 100%;
      margin : 0 ;
      padding : 0.2rem  0.4rem ;
      border-bottom : 1px solid #666 ;
      font-size : 0.22rem ;
      box-sizing: border-box;
      line-height : 0.4rem ;
      display: flex;
      p {
        /*width : 55% ;*/
        height: 0.4rem;
        font-size: 0.22rem;
        font-weight: bold;
        line-height: 2em;
        float: left;
        flex: 0 2 53%;

      }
      .el-button {
        float: left;
        height: 0.4rem;
      }
      span {
        float: left;
        margin-left: 0.2rem;
        height: 0.4rem;
        line-height: 0.4rem;
        /*display : block ;*/
        flex: 0 1 43%;
        font-size: 0.13rem;
      }

    }
    .form {
      width: 70%;
      margin: 0.3rem auto;
      padding: 0.2rem;
      border: 1px solid #aaa;
      border-radius: 0.06rem;

      p {
        width: 70%;
        height: 0.4rem;
        font-size: 0.18rem;
        color: #565656;
        line-height: 0.4rem;
        background: rgba(242, 242, 242, 1);
        margin: 0 auto 0.2rem;
        text-align: center;
      }
      .el-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-form-item {
          flex-direction: row;
          display: flex;
          flex : 1 ;
          width : 70% ;
          justify-content: flex-end;
        }
        .btn {
          justify-content: center;
          .el-button:nth-child(1) {
            margin-right: 0.3rem;
          }
        }
        .el-input {
          width: 2.5rem;
        }
        span {
          width: 100%;
          height: 0.5rem;
          line-height: 0.5rem;
          font-size: 0.12rem;
          color: #4a4a4a;
          display: block;
          text-align: center;

        }
        .blank{
          width : 1.1rem ;
          margin-right: 0.3rem;
          display : inline-block;
        }
      }

    }
    .payInfo {
      width: 5rem;
      margin: 0.3rem 0.5rem;
       border: 1px solid #aaa;
       padding: .2rem .4rem .5rem;
       .mt20{
         margin-top: 20px;
       }
       .f17{
         font-size: .17rem
       }

    }
    .accountImg {
      display: flex;
      height: 5rem;
      justify-content: center;
      align-items: center;

    }
  }

</style>
