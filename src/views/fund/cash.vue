<template>
  <div class="cash">
    <h1 class="title">押金提现</h1>
    <p class="subTitle">填写提现金额</p>
    <ul class="deposit">
      <li>
        <p class="tag">可用押金：</p>
        <span class="money_color" >￥{{deposit.deposit}}</span>
      </li>
      <el-form :model="payCash" ref="payCash" :rules="payRule">
        <li>
          <p class="tag">可用支付宝：</p>
          <div v-if="userInfo" class="payInfo">
            <div class="detail">
              <span>{{ apilyInfo.thirdAccount}}</span>
            </div>
          </div>
          <router-link v-else class="noAli" to="/userInfor/account">绑定支付宝</router-link>
        </li>
        <li>
          <el-form-item prop="money">
            <p class="tag">提现金额：</p>
            <el-input placeholder="请输入提现金额" type ="number" auto-complete="off" v-model.number="payCash.money" size="small" ></el-input>&nbsp;&nbsp;元
          </el-form-item>
          <span class="note">单次最少提现100元，提现操作平台将收取{{deposit.rate*100}}%的手续费</span>
          <span class="note">预计3-5个工作日内（国家法定节假日和双休日顺延）平台完成提现操作,到账时间以各大银行为准。</span>
        </li>
        <li>
          <p class="tag">实际到账金额：</p>
          <span v-if="payCash.money!=0">{{ realityMoney }}元</span>
          <span class="explain">（实际提现金额*{{100-deposit.rate*100}}%，例如最低取现100元，实际到账{{100-100*deposit.rate}}元）</span>
        </li>
        <li>
          <el-form-item prop="payPsw">
            <p class="tag">支付密码：</p>
            <el-input :type="pwdType" class="pswIpt" v-model.trim="payCash.payPsw" placeholder="请输入支付密码" size="small"></el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eyeopen" v-if="pwdType===''" />
              <svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon>
            </span>
            <router-link to="/userInfor/settings" v-if="!settingPsw">
              <span style="color:#409EFF">设置支付密码</span>
            </router-link>
          </el-form-item>
        </li>
        <li>
          <el-form-item>
            <el-button type="primary" size="small" @click="submit('payCash')">确认提现</el-button>
            <el-button size="small" @click="cancel('payCash')">取消</el-button>
          </el-form-item>
        </li>
      </el-form>

    </ul>
    <ul class="tips">
      <p>温馨提示：</p>
      <li>1、信用卡支付时银行会自动提示风险安全提醒，可继续支付，请勿担心；</li>
      <li>2、请注意您的银行卡充值限制，以便造成不便；</li>
      <li>3、禁止洗钱、信用卡套现、虚假交易等行为，一经发现并确认，将终止该账号的使用；</li>
      <li>4、如果充值金额没有及时到账，请联系客服。</li>
    </ul>
  </div>
</template>

<script>
  import ElForm from "element-ui/packages/form/src/form";
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import {
    handleCash,
    getDeposit
  } from "@/api/fund"
  import {
    getThirdInfo
  } from "@/api/userInfor"
  import { checkFloat } from "@/utils/validate"
  export default {
    components: {
      ElFormItem,
      ElForm
    },
    name: "cash",
    data() {
      // const validAlipay = (rule ,value ,callback) => {
      //   if(value === ''){
      //     callback(new Error('请选择支付宝账号'))
      //   }else{
      //     callback();
      //   }
      // };
      const validMoney = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入提现金额'))
        } else {
          if (value < 100) {
            callback(new Error('单次最少提现100元，请重新输入提现金额'))
          }
          if(value > 9999999){
            callback(new Error('输入的金额数值不得超过9999999'))
          }
          if( !checkFloat(value)){
            callback( new Error('输入的小数不能超过两位，请重新输入'))
          }

            callback()
        }
      };
      const validPsw = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入支付密码'))
        } else {
          let rule = /^[0-9]{6}$/ ;
          if (!rule.test(value)) {
            callback(new Error('请输入6位数字组合的支付密码'))
          }
          callback();
        }
      };
      return {
        userInfo: false,
        payPassword: '',
        payCash: {
          // name: '',
          // account: '',
          money: 0,
          payPsw: ''
        },
        deposit: {
          rate : '',
          deposit : 0
        },
        apilyInfo: {},
        payRule: {
          // account : [
          //   {
          //     required : true , validator : validAlipay
          //   }
          // ],
          money: [{
            required: true,
            validator: validMoney,
            trigger: 'blur'
          }],
          payPsw: [{
            required: true,
            validator: validPsw,
            trigger: 'blur'
          }]
        },
        settingPsw: true,
        pwdType: 'password',
        // realityMoney : ''
      }
    },
    computed : {
      realityMoney: function(){
        let money = this.payCash.money-(this.payCash.money * this.deposit.rate) ;
        return money.toFixed(2) ;
      }
    },
    mounted() {
      this.getApilyAccount();
      this.getDepositMoney();
    },
    methods: {
      getDepositMoney() {
        getDeposit().then(res => {
          // console.log(res);
          if (res.data.status === '000000000') {
            this.deposit = res.data.data;
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
      getApilyAccount() {
        getThirdInfo('1').then(res => {
          if (res.data.status === '000000000') {
            if (res.data.data.length > 0) {
              this.userInfo = true;
              this.apilyInfo = res.data.data[0];
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
      //  确认提现
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.userInfo) {
              this.$message({
                message: '提现前应先绑定您的支付宝账号',
                center: true,
                type: 'error'
              });
              return false ;
            } else if (this.deposit.deposit < this.payCash.money) {
              this.$message({
                message: '账户押金不足',
                center: true,
                type: 'error'
              });
              return false ;
            } else {
              let _data = {
                amount: this.payCash.money,
                thirdId: this.apilyInfo.thirdId,
                payPassword: this.payCash.payPsw
              };
              handleCash(_data).then(res => {

                if (res.data.status === '000000000') {
                  this.$message({
                    message: '提现成功',
                    center: true,
                    type: 'success',
                    duration : 1000
                  });
                  this.$router.push('/fund/history/cash')
                } else {
                  if(res.data.status === '013001002'){
                    this.settingPsw = false
                  } else {
                    this.settingPsw= true
                  }
                  this.$message({
                    message: res.data.message,
                    type: 'error',
                    center: true
                  });
                }
              }).catch(err => {
                alert('服务器开小差啦，请稍等~')
              })
            }

          } else {
            return false;
          }

        })
      },

      //  取消选择
      cancel(formName) {
        this.$refs[formName].resetFields();

      },

      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },

    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .cash {
    width: 100%;
    /*margin: 0 auto;*/
    .title {
      margin : 0 ;
      padding : 0.2rem  0.4rem ;
      border-bottom : 1px solid #666 ;
      font-size : 0.22rem ;
      line-height : 0.4rem ;
      /*width: 100%;*/
      /*height: 0.5rem;*/
      /*line-height: 0.5rem;*/
      /*font-size: 0.25rem;*/
      /*font-weight: bold;*/
      /*color: #333;*/
      /*text-indent: 0.3rem;*/
      /*border-bottom: 1px solid #aaa;*/
      /*margin-bottom: 0.3rem;*/

    }
    .subTitle {
      width: 90%;
      height: 0.5rem;
      line-height: 0.5rem;
      padding-left: 0.3rem;
      font-size: 0.18rem;
      margin: 0 auto;

    }
    .deposit {
      width: 90%;
      height: auto;
      padding: 0 0.3rem 0.2rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      li {
        width: 100%;
        float: left;
        .el-form-item {
          margin-bottom: 0;
        }
        .tag {
          width: 130px;
          height: 40px;
          line-height: 40px;
          text-align: right;
          float: left;
        }
        span,
        .noAli {
          line-height: 40px;
          display: inline-block;
          margin-left: 0.3rem;

        }
        .pswIpt {
          position: relative;
        }
        .show-pwd {
          position: absolute;
          left: 350px;
          top: 3px;
          font-size: 0.16rem;
          color: #889aa4;
          cursor: pointer;
          user-select: none;
        }

        .noAli {
          color: #409EFF;
          font-size: 0.13rem;
          /*display : block;*/
        }
        .payInfo {
          width: 2.5rem;
          .alipayImg {
            width: 100%;
            height: 0.5rem;
            position: relative;
            margin-bottom: 0.1rem;
            img {
              width: 100%;
              height: 100%;
            }
            span {
              position: absolute;
              top: 0;
              right: 0;
              width: 0.6rem;
              height: 0.2rem;
              line-height: 0.2rem;
              font-size: 0.1rem;
              text-align: center;
              display: block;
              color: #138CDD;
              border: 1px solid #aaa;
              border-radius: 0.06rem;
            }
          }
          .detail {
            border-radius: 0.05rem;
            width: 100%;
            /* height : 0.8rem ; */
            padding: 0 0.1rem;
            span {
              width: 100%;
              line-height: 40px;
              height: 40px;
              font-size: 0.14rem;
              color: #333;
              display: block;
              margin-left: 150px;
            }
          }
        }

        .el-input {
          width: 250px;
          margin-left: 0.28rem;
        }
        .note {
          margin-left: 160px;
          font-size: 0.13rem;
          width: 100%;
          &:nth-of-type(1) {
            margin-top: 0.3rem;

          }
          &:nth-of-type(2) {
            margin-bottom: 0.3rem;
          }
        }
        .explain {
          color: #ff0000;
          font-size: 0.13rem;
        }
        &:nth-last-child(1) {
          margin-top: 0.4rem;
          padding-left: 160px;
          .el-button {
            min-width: 80px;
            &:nth-last-child(1) {
              margin-left: 0.5rem;
            }
          }
        }
      }
    }
    .tips {
      width: 90%;
      padding: 0.2rem 0.3rem;
      box-sizing: border-box;
      font-size: 0.14rem;
      color: #606266;
      /*float : left ;*/
      display: flex;
      flex-direction: column;
      border-radius: 0.05rem;
      margin: 0 auto 0.4rem;
      /*margin-bottom : 0.4rem ;*/
      p {
        width: 100%;
        height: 0.4rem;
        line-height: 0.4rem;
        float: left;

      }
      li {
        font-size: 0.13rem;
        height: 0.3rem;
        line-height: 0.3rem;
        padding-left: 0.2rem;
        width: 100%;
        box-sizing: border-box;
        float: left;

      }
    }

  }

</style>
