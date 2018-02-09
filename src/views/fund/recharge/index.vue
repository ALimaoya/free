<template>
  <div class="recharge">
    <div class="credit">
      <p class="title">我要充值</p>
      <ul class="step">
        <li>
          <p>1、充值方式</p>
          <dl>
            <dt>
              <el-radio v-model="method" label="1">支付宝</el-radio>
            </dt>
            <dd><img src="../../../assets/imgs/pay3.png" alt="" /></dd>
          </dl>
          <dl>
            <dt>
              <el-radio v-model="method" label="2">微信</el-radio>
            </dt>
            <dd><img src="../../../assets/imgs/pay2.png" alt="" /></dd>
          </dl>
        </li>
        <li>
          <p>2、选择充值类型</p>
          <el-radio v-model="type" label="1">押金充值</el-radio>
          <el-radio v-model="type" label="2">金币充值</el-radio>
        </li>
        <li>
          <p>3、填写充值金额</p>
          <span class="rest">可用押金：<b></b>元</span>
          <el-form ref="form" :model="form" :rules="rule">
            <el-form-item label="充值金额：">
              <el-input v-model.number="form.money" placeholder="请输入内容" size="small"></el-input>
              <span>每次充值不得少于1元</span>
            </el-form-item>
            <el-form-item class="check">
              <el-button type="primary" size="small" @click="confirm('form')">确认充值</el-button>
            </el-form-item>
          </el-form>
          <span class="attention">注意：在第三方页面支付时，请在15分钟内完成支付。</span>
        </li>
      </ul>
    </div>
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
    import ElButton from "element-ui/packages/button/src/button";

    export default {
      components: {
        ElButton,
        ElFormItem,
        ElForm
      },
      name: "index" ,
      data(){
        const validMoney = (rule, value ,callback) => {
          if(value == ''){
            callback(new Error('请输入金额'))
          }else {
            if( value < 1){
              callback(new Error('请输入大于等于1的数值'))
            }
            callback();
          }
        };
          return{
            method : '',
            type : '',
            form : {
              money : ''
            },
            rule : {
              money : [{ validator : validMoney , required : true , trigger : 'blur'}]
            }
          }
      } ,
      methods : {
        confirm(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              this.$message({
                type : 'success',
                message : '提交成功',
                center : true
              })
            }else{
              this.$message({
                type : 'error',
                message : '提交失败',
                center : true
              });
              return false
            }
          })
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .recharge{
    width : 70% ;
    margin : 0 auto ;
    .credit{
      width : 100% ;
      margin : 0.2rem auto 0;
      border : 1px solid #aaa ;
      padding : 0.3rem  0.6rem;
      box-sizing: border-box;
      border-radius  : 0.05rem ;
      height : auto ;
      float : left ;
      .title{
        width : 100% ;
        height : 0.5rem ;
        font-size : 0.2rem ;
        font-weight : bold ;
        color :#553 ;
        line-height : 0.5rem ;
      }
      .step{
        width : 100% ;
        height : auto ;
        padding-left : 0.2rem ;
        box-sizing: border-box;
        li{
          width : 100%  ;
          height : auto ;
          margin-bottom : 0.25rem ;
          float : left ;
          p{
            width: 100% ;
            height : 0.4rem ;
            line-height : 0.4rem ;
            float : left ;

          }

          dl{
            width : 15% ;
            float : left ;
            margin-left : 0.3rem ;

            dt{
              width : 100% ;
              height : 0.5rem ;
              line-height : 0.5rem;
              font-size : 0.14rem ;
              float : left ;
            }
            dd{
              width : 100% ;
              float : left ;
              padding-left : 0.2rem ;

            }
          }

          &:nth-child(2){
            .el-radio{
              /*width : 10% ;*/
              /*margin: 0.1rem 0.28rem 0 0.27rem ;*/
              width : 15% ;
              float : left ;
              margin-left : 0.3rem ;
              margin-top : 0.15rem ;
            }
          }

          &:nth-child(3){
            .rest{
              font-size : 0.12rem ;
              padding-left : 0.25rem ;
              height : 0.4rem ;
              line-height : 0.4rem ;
              b{
                color : #ff0000 ;
                font-weight : 100 ;
              }
            }
            .el-form{
              padding : 0 0.25rem ;
              .el-input{
                width : 2.5rem ;
              }
              span{
                margin-left : 0.2rem ;
                color : #606266 ;
                font-size : 0.13rem ;
              }
              .check{
                /*display : flex ;*/
                /*justify-content: center;*/
                margin-left : 0.83rem ;
              }
            }
            .attention{
              font-size : 0.13rem ;
              color : #606266 ;
              padding-left : 0.2rem ;
            }
          }
        }
      }

    }
    .tips{
      width : 100% ;
      border : 1px solid #aaa ;
      border-top : 0 ;
      padding : 0.2rem 0.3rem ;
      box-sizing: border-box;
      font-size : 0.14rem ;
      color : #606266 ;
      float : left ;
      border-radius  : 0.05rem ;
      margin-bottom : 0.4rem ;
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
