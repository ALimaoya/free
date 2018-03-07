<template>
  <div class="cash">
    <div class="title">押金提现</div>
    <p class="subTitle">填写提现金额</p>
    <ul class="deposit">
      <li><p class="tag">可用押金：</p><span v-if="restMoney!=''">￥{{restMoney}}元</span></li>
      <el-form :model="payForm" ref="payForm" :rules="payRule">
          <li>
              <p class="tag">可用支付宝：</p>
              <div v-if="payForm.account!=''" class="payInfo">
                <div class="alipayImg">
                  <img src="../../assets/imgs/u878.png" alt="" />
                </div>
                  <div class="detail">
                    <span>支付宝姓名：{{ payForm.name}}</span>
                    <span>支付宝账号：{{ payForm.account}}</span>
                  </div>
              </div>
              <router-link v-else  class="noAli" to="/userInfor/account">还没有绑定支付宝，点我前去绑定</router-link>
              <span v-if="acconutWarn==true" class="acconutWarn">请选择可用支付宝账号</span>
          </li>
          <li>
            <el-form-item prop="money">
              <p class="tag">提现金额：</p><el-input placeholder="请输入提现金额" type="number" v-model.number="payForm.money" size="small"></el-input>&nbsp;&nbsp;元
            </el-form-item>
            <span class="note">单次最少提现500元，提现操作平台将收取1%的手续费</span>
            <span class="note">预计2个工作日内（国家法定节假日和双休日顺延）平台完成提现操作。到账时间以各大银行为准，预计3-5个工作日左右。</span>
          </li>
          <li>
          <p class="tag">实际到账金额：</p><span v-if="payForm.money!=0">{{payForm.money*0.99}}元</span><span class="explain">（实际提现金额*99%，例如最低取现500元，实际到账495元）</span>
        </li>
          <li>
            <el-form-item prop="payPsw">
              <p class="tag">支付密码：</p>
              <el-input :type="pwdType" class="pswIpt" v-model.trim="payForm.payPsw" placeholder="请输入支付密码" size="small"></el-input>
              <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eyeopen" v-if="pwdType===''" /><svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon></span>
            </el-form-item>
          </li>
          <li>
            <el-form-item>
              <el-button type="primary" size="small" @click="submit('payForm')">确认提现</el-button>
              <el-button size="small" @click="cancel('payForm')">取消</el-button>
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
    import { handleCash } from "@/api/fund"
    export default {
      components: {
        ElFormItem,
        ElForm
      },
      name: "cash",
      data(){
        // const validAlipay = (rule ,value ,callback) => {
        //   if(value === ''){
        //     callback(new Error('请选择支付宝账号'))
        //   }else{
        //     callback();
        //   }
        // };
        const validMoney = (rule ,value ,callback) => {
          if(value === ''){
            callback(new Error('请输入提现金额'))
          }else{
            // if(!isNaN(value)){
              if( value < 500 ){
                callback(new Error('单次最少提现500元，请重新输入提现金额'))
              }else{
                callback()
              }
            // }else{
            //   callback(new Error('请输入数值'))
            //
            // }

          }
        };
        const validPsw = (rule , value ,callback)=> {
          if(value === ''){
            callback(new Error('请输入支付密码'))
          }else{
            if(value != this.payPassword){
              callback(new Error('支付密码输入有误，请确认后重新输入'))
            }else{
              callback();
            }
          }
        }
          return{
            userInfo : false ,
            restMoney : '',
            payPassword : '111',
            payForm : {
              name : '111',
              account : '11111',
              money : '',
              payPsw : ''
            },
            payRule:{
              // account : [
              //   {
              //     required : true , validator : validAlipay
              //   }
              // ],
              money : [
                {
                  required : true ,validator : validMoney , trigger : 'blur'
                }
              ],
              payPsw : [
                {
                  required : true ,validator : validPsw , trigger : 'blur'
                }
              ]
            },
            acconutWarn : false ,
            pwdType : 'password'
          }
      },
      mounted(){

      },
      methods : {
        //  确认提现
        submit(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){

              if(this.payForm.account === ''){
                this.acconutWarn = true ;

              }else{
                this.acconutWarn = false ;
                this.$message({
                  message : '信息提交成功，将为您进行提现操作',
                  center : true ,
                  type : 'success'
                });
                // handleCash({ data : this.payForm}).then( res => {
                //     if(  res.data.code === '000000000'){
                //       console.log(res)
                //     }
                //   }).catch( err => {
                //     alert('服务器开小差啦，请稍等~')
                //   })

                // setTimeout(()=>{
                //
                // },3000)
              }

            }else{
              this.$message({
                message : '信息提交失败，请确定信息后重新提交',
                type : 'error',
                center : true
              });

              return false ;
            }

          })
        },

        //  取消选择
        cancel(formName){
          this.$refs[formName].resetFields();

        } ,

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
  .cash{
    width : 90% ;
    margin : 0 auto ;
    .title{
      width : 100% ;
      height : 0.5rem ;
      line-height : 0.5rem ;
      font-size : 0.25rem ;
      font-weight : bold ;
      color : #333 ;
      text-indent : 0.3rem ;
      border-bottom : 1px solid #aaa ;
      margin-bottom : 0.3rem ;

    }
    .subTitle{
      width : 90% ;
      height : 0.5rem ;
      line-height : 0.5rem ;
      padding-left : 0.3rem ;
      font-size : 0.18rem ;
      margin : 0 auto ;

    }
    .deposit{
      width : 90% ;
      height : auto ;
      padding : 0 0.3rem 0.2rem ;
      box-sizing: border-box;
      display : flex ;
      flex-direction: column;
      margin : 0 auto ;
      li{
        width : 100% ;
        float : left ;
        .el-form-item{
          margin-bottom : 0;
        }
        .tag{
          width : 1.3rem ;
          height : 0.4rem ;
          line-height : 0.4rem ;
          text-align : right ;
          float : left ;
        }
        span,.noAli{
          line-height : 0.4rem ;
          display : inline-block;
          margin-left : 0.3rem ;

        }
        .pswIpt{
          position : relative ;
        }
        .show-pwd {
          position: absolute;
          left: 3.5rem;
          top: 0.03rem;
          font-size: 0.16rem;
          color: #889aa4;
          cursor: pointer;
          user-select:none;
        }

        .noAli{
          color : #00CCeF;
          font-size : 0.13rem ;
          /*display : block;*/
        }
        .acconutWarn{
          color : #f56c6c ;
          font-size : 0.12rem ;
        }
        .payInfo{
          width : 2.5rem ;
          margin : 0.15rem 1.58rem 0.3rem;
          .alipayImg{
            width : 100% ;
            height : 0.5rem ;
            position : relative ;
            margin-bottom : 0.1rem ;
            img{
              width : 100% ;
              height : 100% ;
            }
            span{
              position : absolute ;
              top : 0;
              right : 0;
              width : 0.6rem ;
              height : 0.2rem ;
              line-height : 0.2rem ;
              font-size : 0.1rem ;
              text-align : center;
              display : block ;
              color : #138CDD;
              border : 1px solid #aaa ;
              border-radius : 0.06rem ;
            }
          }
          .detail{
            border : 1px solid #aaa ;
            border-radius : 0.05rem ;
            width : 100% ;
            height : 0.8rem ;
            padding : 0 0.1rem ;
            span{
              width : 100% ;
              line-height : 0.4rem ;
              height : 0.4rem ;
              font-size : 0.14rem ;
              color : #333 ;
              display : block ;
              margin : 0;
            }
          }
        }

        .el-input{
          width : 2.5rem ;
          margin-left : 0.28rem ;
        }
        .note{
          margin-left : 1.6rem ;
          font-size : 0.13rem ;
          width : 100% ;
          &:nth-of-type(1){
            margin-top : 0.3rem ;

          }
          &:nth-of-type(2){
            margin-bottom : 0.3rem ;
          }
        }
        .explain{
          color : #ff0000 ;
          font-size : 0.13rem ;
        }
        &:nth-last-child(1){
          margin-top : 0.4rem ;
          padding-left : 1.6rem ;
          .el-button{
            width : 0.8rem ;
            &:nth-last-child(1) {
              margin-left : 0.5rem ;
            }
          }
        }
      }
    }
    .tips{
      width : 90% ;
      padding : 0.2rem 0.3rem ;
      box-sizing: border-box;
      font-size : 0.14rem ;
      color : #606266 ;
      /*float : left ;*/
      display : flex;
      flex-direction: column;
      border-radius  : 0.05rem ;
      margin : 0 auto 0.4rem ;
      /*margin-bottom : 0.4rem ;*/
      p{
        width : 100% ;
        height : 0.4rem ;
        line-height : 0.4rem ;
        float : left ;

      }
      li{
        font-size : 0.13rem ;
        height : 0.3rem ;
        line-height : 0.3rem ;
        padding-left : 0.2rem ;
        width : 100% ;
        box-sizing: border-box;
        float : left ;

      }
    }

  }


</style>
