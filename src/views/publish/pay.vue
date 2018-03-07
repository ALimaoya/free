<template>
  <div class="pay">
    <div class="stepImg"><img src="../../assets/imgs/u258.png" alt="" /></div>
    <p>您现在为<b>“&nbsp;{{ activity.activityTitle }}&nbsp;”</b>存入试用活动款（合计总费用）：<b>{{ activity.activityTotalAmount }}</b>元</p>
    <div class="note">费用说明：</div>
    <table border="1" bordercolor="#d3d3dd">
      <tr>
        <td>商品担保金</td>
        <td>{{ activity.activityDepositAmount }}元</td>
        <!--{{ form.buyProductAmount}}*{{ form.activityCalendar.buyProductQuantity}}*{{ form.buyProductQuantity}}-->
      </tr>
      <tr>
        <td>活动服务费</td>
        <td>  {{ activity.activityServiceAmount }} 元</td>
      </tr>
      <tr>
        <td>合计</td>
        <td>{{ activity.activityTotalAmount }} 元</td>
      </tr>
    </table>
    <div class="result">您当前的押金余额为：{{ activity.totalDeposit }}元，本次总共要支付的金额为：{{ activity.activityTotalAmount }}元。</div>
    <div class="btn">
      <el-button type="primary" @click="checkPay">确认支付</el-button>
      <el-button type="text" @click="goActivity">试用活动管理</el-button>
      <el-button type="text" @click="back">返回编辑活动</el-button>
    </div>
  </div>
</template>

<script>
  import { publishActivity } from "@/api/activity"

  export default {
        name: "pay" ,
      data(){
          return{

            form : {},
            tryoutObj : {},
            activity :{}
          }
      },

      mounted(){
        this.form = this.$store.state.publishInfo.publishForm ;
        console.log(this.form);
        publishActivity(this.form).then( res => {
          if(res.data.status === '000000000'){
            this.activity = res.data.data ;
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        });

      },
      methods : {
        checkPay(){
          this.$router.push('/publish/step3')
        },
        goActivity(){
          this.$router.push('/activity/approval')
        },
        back(){

          // this.$store.dispatch('saveTryoutItem',this.tryoutObj);
          this.$store.dispatch('savePublishInfo',this.form);
          this.$router.push('/publish/step1');

        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .pay{
    width : 80% ;
    margin : 0 auto ;
    .stepImg{
      width : 100% ;
      margin : 0.5rem 0;

      img{
        width : 80% ;
        height : 100% ;
        margin : 0 auto ;
      }
    }
    b{
      color : #ff0011 ;
    }
    p,.note,.result{
      color : #333 ;
      font-weight : bold ;
      font-size : 0.18rem ;
    }
    p{
      width : 80% ;
      text-align : center ;
      height : 0.4rem ;
      line-height : 0.4rem ;

    }
    .note{
      width : 50% ;
      margin : 0.3rem 0 ;
    }
    table{
      border-collapse: collapse;
      width : 60% ;
      margin : auto 1.2rem 0.3rem ;
      tr{
        height : 0.4rem ;
        text-align : center ;

      }
    }
    .result{
      margin-left : 2rem ;
      margin-bottom : 0.5rem ;
    }
    .btn{
      display: flex ;
      justify-content: center;
      .el-button:nth-child(1){
        margin-right : 0.3rem ;
      }
    }
  }
</style>
