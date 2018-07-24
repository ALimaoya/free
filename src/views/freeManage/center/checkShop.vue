<template>
  <div class="checkShop">
    <div class="title">店铺支付成功，等待审批通过即可发布试用活动</div>
    <!--<img src="" alt="" />-->
    <div class="btn"><el-button type="primary" @click="goShopList">返回店铺管理</el-button></div>
  </div>
</template>

<script>
    export default {
      name: "checkShop",
      methods : {
        goShopList(){
            this.$router.push('/freeManage/shop')
          }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .checkShop{
    width : 70% ;
    margin : 0 auto;
    .title{
      width : 100% ;
      height : 150px ;
      line-height : 150px;
      font-size : 0.26rem ;
      font-weight : bold ;
      color : #333 ;
      margin-top : 0.2rem ;
      text-align: center ;
    }
    img{
      width : 70% ;
      height : 0.6rem ;
      margin : 0.3rem auto ;
    }
    .btn{
      display : flex ;
      justify-content: center ;
    }
  }
</style>
