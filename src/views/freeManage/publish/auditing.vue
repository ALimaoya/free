<template>
  <div class="auditing">
    <div class="title" >活动提交成功，等待<span v-if="this.type === 'flow'">活动开始</span><span v-else-if="this.type === 'group'">到达设定的任务开始时间</span><span v-else>审批通过</span>即可上线</div>
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
