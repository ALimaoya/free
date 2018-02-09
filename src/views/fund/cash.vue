<template>
  <div class="cash">
    <div class="title">押金提现</div>
    <p class="subTitle">填写提现金额</p>
    <ul class="deposit">
      <li><p class="tag">可用押金：</p><span>￥{{restMoney}}</span></li>
      <li>
        <p class="tag">可用支付宝：</p>
        <div v-if="userInfo" class="payInfo">
          <div class="alipayImg">
            <img src="../../assets/imgs/u878.png" alt="" />
          </div>
          <div class="detail">
            <span>支付宝姓名：{{ payForm.name}}</span>
            <span>支付宝账号：{{ payForm.account}}</span>
          </div>
        </div>
        <router-link v-else  class="noAli" to="/userInfor/account">还没有绑定支付宝，点我前去绑定</router-link></li>
      <li>
        <p class="tag">提现金额：</p><el-input placeholder="请输入内容" v-model="money" size="small"></el-input>
        <span class="note">单次最少提现500元，提现操作平台将收取1%的手续费</span>
        <span class="note">预计2个工作日内（国家法定节假日和双休日顺延）平台完成提现操作。到账时间以各大银行为准，预计3-5个工作日左右。</span>
      </li>
      <li>
        <p class="tag">实际到账金额：</p><span class="explain">（实际提现金额*99%，例如最低取现500元，实际到账495元）</span>
      </li>
      <li><p class="tag">支付密码：</p><el-input placeholder="请输入内容" size="small"></el-input></li>
      <li><el-button type="primary" size="small">确认提现</el-button></li>
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
    export default {
        name: "cash",
      data(){
          return{
            userInfo : false ,
            money : '',
            restMoney : '',
            payForm : {
              name : '',
              account : ''
            }
          }
      },
      methods : {

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
        .noAli{
          color : #00CCeF;
          font-size : 0.13rem ;
          /*display : block;*/
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
        }
        .explain{
          color : #ff0000 ;
          font-size : 0.13rem ;
        }
        &:nth-last-child(1){
          margin-top : 0.4rem ;
          padding-left : 1.6rem ;
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
