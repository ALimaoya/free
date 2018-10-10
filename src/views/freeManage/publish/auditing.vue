<template>
  <div class="auditing">
    <div class="title" >活动提交成功，等待<span v-if="this.type === 'flow'|| this.type === 'group'">活动开始</span><span v-if="this.type === 'group'">到达设定的任务开始时间</span><span v-else="this.type === 'tryout'">审批通过</span>即可上线</div>
    <!--<img src="" alt="" />-->
    <div class="btn"><el-button type="primary" @click="goCenter">返回商家中心首页</el-button></div>
  </div>
</template>

<script>
    export default {
      name: "auditing",
      data() {
        return {
          type : ''
        }
      },
      beforeRouteLeave (to,from,next){
        for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
          if (v.fullPath === this.$route.fullPath) {
            this.$store.state.tagsView.visitedViews.splice(i, 1);
            // this.$router.push('/freeManage/publish/step3');
            next()
          }
        }
      },
      mounted(){
        if(this.$route.params.type !== ''){
          this.type = this.$route.params.type ;
        }
      },
      methods : {
          goCenter(){
            this.$router.push('/freeManage/index' )
          }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .auditing{
    width : 70% ;
    margin : 1rem auto;
    .title{
      width : 100% ;
      height : 2rem ;
      line-height : 2rem ;
      font-size : 0.22rem ;
      font-weight : bold ;
      color : #333 ;
      margin : auto;
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
