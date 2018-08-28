<template>
    <div class="success">
      <div class="s_icon"><span><i></i></span></div>
      <h1>恭喜您，已经成功报名<span v-if="type==='1'">0.9秒杀</span><span v-else="type==='2'">分享购</span>频道活动</h1>
      <p>请等待审核，审核结果可在报名记录中进行查看</p>
      <p>活动时间： {{time}}</p>
      <div class="btn_wrap">
        <el-button type="primary" size="mini" @click="close">我知道了</el-button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "success",
        data() {
            return {
              type: '',
              time: ''
            }
        },
        mounted() {
           this.type = this.$route.query.type ;
           this.getTime();
        },
        methods: {
            getTime(){
              if(this.type === '1'){
                this.time = this.$store.state.signUp.secondKill.startDate  + ' ' +
                  this.$store.state.signUp.secondKill.startTime;

              }else if(this.type === '2'){
                this.time = this.$store.state.signUp.secondKill.startDate  + ' 00:00:00'+ ' —— '+

                  this.$store.state.signUp.secondKill.endDate + ' 23:59:59'
              }
            },
          close(){
            for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
              if (v.fullPath === this.$route.fullPath) {
                this.$store.state.tagsView.visitedViews.splice(i, 1);
                this.$router.push('/merchantCenter/marketing/activityApply');
              }
            }

          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .success{
    width : 80% ;
    margin : 0.5rem auto ;
    text-align: center;
    color : #333 ;
    .s_icon{
      width : 10% ;
      height : 0.9rem ;
      margin : 0 auto 0.5rem ;
      span{
        width : 100% ;
        height : 100%;
        display: inline-block;
        background : url('../../../assets/imgs/u1810.png') no-repeat center ;
        background-size : 70% ;
        position : relative ;
        i{
          background : url('../../../assets/imgs/u1811.png') no-repeat center ;
          background-size : 40% ;
          position : absolute ;
          top : 0 ;
          bottom : 0;
          left : 0;
          right : 0;
          margin : auto ;


        }
      }
    }
    h1,p{
      height : 0.8rem ;
      line-height : 0.8rem ;

    }
    p{
      font-size : 0.2rem ;

    }
    .btn_wrap{
      margin-top : 0.5rem ;
    }
  }
</style>
