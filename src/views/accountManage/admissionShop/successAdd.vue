<template>
  <div class="successAdd">
    <!--<div class="s_icon"><span><i></i></span></div>-->
    <!--<p class="s_p">恭喜您的店铺已成功入驻</p>-->
    <!--<div class="tips_warn">{{ this.$store.state.shopInfo.shopName }}</div>-->
    <!--<div class="s_d"> 商家后台完整功能将在审核通过后开启，快来登录体验吧</div>-->
    <!--<div class="btn_wrap">-->
      <!--<el-button type="primary" @click="goHome">前往特卖商城首页</el-button>-->
      <div class="s_icon"><span><i></i></span></div>
      <p class="s_p">您入驻商城的信息已成功提交</p>
      <p class="s_d">您的店铺正在审核中</p>
      <div class="tips_warn">您的店铺：{{ shopName }}</div>
      <div class="s_d"> 商家管理后台完整功能将在审核通过后开启，请耐心等候~</div>
      <!--<div class="btn_wrap">-->
        <!--<el-button type="primary" @click="goHome">前往特卖商城首页</el-button>-->
      <!--</div>-->
    <!--</div>-->

  <!--</div>-->
  </div>
</template>

<script>
  import { getStatus } from "@/api/enter"


  export default {
    name: "successAdd",
    data() {
      return {
        shopName: '',
        lastName : ['旗舰店','专卖店','专营店','']
        // checking:''
      }
    },
    mounted() {
      // this.checking = this.$route.query.checking ;
      // if(this.checking !== undefined && this.checking === '1'){
        this.getUserInfo();
      // }
    },
    methods: {
      getUserInfo() {
        getStatus().then( res => {
          if(res.data.status === '000000000'){
            if(res.data.data.status !== '0'&& res.data.data.status !== '3'){
              if(res.data.data.belongType === '2'){
                this.shopName = res.data.data.name + this.lastName[res.data.data.shopType-0];

              }else{
                this.shopName = res.data.data.name
              }
              if(res.data.data.status !== '1'){
                this.$message({
                  message : '您已成功入驻，快去特卖商城查看吧~',
                  center : true,
                  type : 'success',
                  duration : 1500
                });
                setTimeout(() => {
                  this.$router.push( '/merchantCenter/index')

                },2000)
              }
            }else if(res.data.data.status === '3'){
              for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
                if (v.path === this.$route.path) {
                  this.$store.state.tagsView.visitedViews.splice(i, 1);
                  this.$router.push( '/accountManage/admission/admissionShop/failAdd')
                }
              }

            }

          }
        })
      },
      // goHome(){
      //   this.$router.push('/merchantCenter/index')
      // }
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
