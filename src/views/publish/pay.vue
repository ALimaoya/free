<template>
  <div class="pay">
    <div class="stepImg"><img src="../../assets/imgs/u258.png" alt="" /></div>
    <p>您现在为{{ title }}存入试用活动款（合计总费用）{{ money }}元</p>
    <div class="note">费用说明：</div>
    <table border="1" bordercolor="#d3d3dd">
      <tr>
        <td>商品担保金</td>
        <td>下单价格*发放份数*拍的数量</td>
      </tr>
      <tr>
        <td>活动服务费</td>
        <td>商品担保金*费率</td>
      </tr>
      <tr>
        <td>合计</td>
        <td>商品担保金*活动服务费</td>
      </tr>
    </table>
    <div class="result">您当前的押金余额为：{{ rest }}元，本次总共要支付的金额为：{{ recharge }}元。</div>
    <div class="btn">
      <el-button type="primary">确认支付</el-button>
      <el-button type="text" @click="goActivity">试用活动管理</el-button>
      <el-button type="text" @click="back">返回编辑活动</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "pay" ,
      data(){
          return{
            title : '',
            money : '',
            rest : '',
            recharge : ''
          }
      },
      methods : {
        goActivity(){
          this.$router.push('/activity/approval')
        },
        back(){
          window.history.go(-1) ;
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
