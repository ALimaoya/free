<template>
    <div class="partner">
      <h1 class="h_title">第三方合作伙伴</h1>
      <ul>
        <li @click="goOther">
          <img src="../../../assets/imgs/kd.png" alt="" />
          <p>快打</p>
          <div>快打是一款简单易学的网页版打单软件，超强筛单，批量打印发货...</div>
          <span>河北为艾通商贸有限公司</span>
        </li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "partner",
        data() {
            return {}
        },
        mounted() {
        },
        methods: {
          goOther(){
            window.open('http://www.kuaidaa.com//sdk/yb/platSession.php');
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .h_title{
    border-bottom : 0;
    border-left : 2px solid #1890FF ;
    padding : 0 0.2rem ;
  }
  ul{
    margin : 0.3rem 0 ;
    li{
      border : 1px solid #eee ;
      padding : 0.2rem ;
      width : 20% ;
      img{
        width : 1rem ;
        height : 1rem ;
        margin : 0 auto ;
        display: block;
      }
      p,div,span{
        text-align: center;

      }
      p{
        font-size : 0.22rem ;
        line-height : 0.8rem ;
      }
      div{
        font-size : 0.14rem ;
        color : #aaa ;
        line-height : 0.3rem ;
      }
      span{
        display: inline-block;
        color : #ccc ;
        font-size : 0.12rem ;
        line-height : 0.6rem ;
        width: 100%;
      }
    }
  }
</style>
