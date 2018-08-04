<template>
    <div class="activityApply">
      <h1 class="h_title"><span>活动报名</span>
        <!--<el-button type="danger" size="mini" style="float:right;">我报名的活动</el-button>-->
      </h1>
      <ul class="activityList">
        <li>
          <dl><dd><svg-icon icon-class="u9"></svg-icon></dd><dt>0.9秒杀</dt></dl>
          <div class="activityType"><p>首页——0.9元秒杀频道活动报名<span>{{ progress[0]}}</span></p><p>活动时间：长期招商</p></div>
          <div class="btn_wrap">
            <el-button class="sign_btn" type="danger" size="small" @click="goSign('1')">立即报名</el-button>
            <el-button  type="text" @click="goList('1')">报名记录</el-button>
          </div>
        </li>
        <li>
          <dl><dd><svg-icon icon-class="u22"></svg-icon></dd><dt>分享购</dt></dl>
          <div class="activityType"><p>首页——推荐商品分享购大图资源位活动报名<span>{{ progress[0]}}</span></p><p>活动时间：长期招商</p></div>
          <div class="btn_wrap">
            <el-button class="sign_btn" type="danger" size="small"  @click="goSign('2')">立即报名</el-button>
            <el-button  type="text" @click="goList('2')">报名记录</el-button>

          </div>
        </li>
      </ul>
    </div>
</template>

<script>

    export default {
      name: "index",
        data() {
            return {
              progress : ['进行中']
            }
        },
        mounted() {
        },
        methods: {
          goSign(type){
            this.$router.push('/merchantCenter/marketing/signUp?type='+ type);
          },
          goList(type){
            this.$router.push('/merchantCenter/marketing/history?type=' + type);
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .activityList{
      width : 90% ;
    margin : 0.5rem auto ;
    li{
      display: flex ;
      flex-direction: row;
      /*padding : 0.4rem 0.3rem 0.2rem;*/
      box-sizing: border-box;
      border : 1px solid rgba(255, 204, 51, 1);
      border-radius : 0.07rem ;
      margin-bottom : 0.3rem ;
      align-items: center;
      color : #333 ;
      dl{
        width : 15% ;
        border-right : 1px solid rgba(255, 204, 51, 1);
        padding :0.4rem 0.2rem 0.2rem;
        dd{
          height : 0.5rem ;
          text-align: center;

          .svg-icon{
            height : 100% ;
            width : 50% ;
            margin :auto;
          }
        }
        dt{
          font-size : 0.18rem ;
          height : 0.6rem ;
          line-height : 0.6rem ;
          text-align: center;
        }
      }
      .activityType{
        display: flex;
        flex-direction: column;
        width : 65% ;
        padding : 0.4rem 0.3rem 0.2rem;
        p{
          height : 0.5rem ;
          line-height : 0.5rem ;
          font-weight : bold ;
          font-size : 0.26rem ;
          text-indent : 0.3rem ;
          span{
            font-size : 0.16rem ;
            color : #ff0011;
            border : 1px solid #ff0011;
            border-radius: 0.05rem;
            padding  :0.07rem 0.2rem ;
            margin-left : 0.3rem ;
            font-weight : 100;
          }
        }
      }
      .btn_wrap{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .sign_btn{
          width : 2rem ;
          height : 0.5rem ;
          padding: 0;
          text-align: center;
          line-height : 0.5rem ;
        }
        .el-button:nth-child(2){
          padding-bottom : 0;
          margin-left : 0;
        }
      }

    }
  }
</style>
