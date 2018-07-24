<template>
    <div class="successAdd">
      <div class="s_icon"><span><i></i></span></div>
      <p class="s_p">恭喜您的店铺已成功入驻</p>
      <div class="tips_warn">发发发方法{{ shopName }}</div>
      <div class="s_d"> 商家后台完整功能将在审核通过后开启，快来登录体验吧</div>
      <div class="btn_wrap">
        <el-button type="primary" @click="goHome">前往特卖商城首页</el-button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "successAdd",
        data() {
            return {
              shopName: ''
            }
        },
        mounted() {
        },
        methods: {
          goHome(){
            this.$router.push('/merchantCenter/index')
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .successAdd{
    width : 60% ;
    margin : 0.7rem auto ;
    .s_icon{
      width : 10% ;
      height : 0.9rem ;
      margin : 0 auto 0.5rem ;
      span{
        width : 100% ;
        height : 100%;
        display: inline-block;
        background : url('../../../assets/imgs/u1810.png') no-repeat center ;
        background-size : 90% ;
        position : relative ;
        i{
          background : url('../../../assets/imgs/u1811.png') no-repeat center ;
          background-size : 50% ;
          position : absolute ;
          top : 0 ;
          bottom : 0;
          left : 0;
          right : 0;
          margin : auto ;


        }
      }
    }
    .s_p,.s_d{
      width: 100% ;
      text-align : center ;
      font-size : 0.28rem ;
      font-weight : bold ;
      color : #333 ;
      height : 0.7rem ;
      line-height : 0.7rem;
    }
    .tips_warn{
      font-size : 0.24rem ;
      line-height : 0.5rem ;
      text-align : center;
    }
    .s_d{
      color : #aaa ;
      font-weight : 100;
    }
    .btn_wrap{
      text-align: center;
      margin-top : 0.5rem;
    }
  }
</style>
