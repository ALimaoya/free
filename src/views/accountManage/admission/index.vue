<template>
  <div class="admissionManage">
    <div class="publish">
      <ul>
        <li><img src="../../../assets/imgs/u922.png" alt="" /></li>
        <li><img src="../../../assets/imgs/u923.png" alt="" /></li>
        <li><img src="../../../assets/imgs/u924.png" alt="" /></li>
        <li><img src="../../../assets/imgs/logo.png" alt="" /></li>
      </ul>
      <el-button @click="goTryout">发布第三方试用活动</el-button>
    </div>
    <div class="shopCenter">
      <img src="../../../assets/imgs/logo.png" />
      <el-button @click="goShop">我要入驻商城卖货</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "admissionManage",
      data(){
          return{

          }
      },
      methods : {
        goTryout(){
          this.$router.push({ name : 'TryoutActivity'})
        },
        goShop(){
          this.$router.push({ name : 'MerchantCenter-home'})
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .admissionManage{
    width : 90% ;
    margin : 1rem auto ;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .publish,.shopCenter{
      width : 25% ;
      border : 1px solid rgba(255, 0, 0, 1);
      border-radius : 0.1rem ;
      justify-content: center;
      display: flex;
      flex-direction: column;
      padding : 0.3rem ;
      box-sizing: border-box;
    }
    .publish{
      ul{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        li{
          width :45%;
          img{
            width : 100% ;
          }
        }
      }

    }
    .shopCenter{
      img{
        width : 90% ;
        margin : auto ;
      }
    }
    .el-button{
      background : rgba(255, 0, 0, 0.6);
      color : #fff ;
      margin : 0.5rem auto ;
      width: 90%;
      font-size: 0.14rem;
      padding: 0.2rem;

    }
    .el-button:hover{
      background : rgba(255, 0, 0, 1);
    }
  }
</style>
