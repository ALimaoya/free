<template>
    <div class="success">
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
              this.time = '1111';
            },
          close(){
            for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
              if (v.path === this.$route.path) {
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
