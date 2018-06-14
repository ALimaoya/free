<template>
  <div class="rewards">
    <p class="title">邀请奖励</p>
    <el-table :data="tableData" border height="0.3rem" >
      <el-table-column prop="name" label="被邀请商家" ></el-table-column>
      <el-table-column prop="date" label="被邀商家注册时间" ></el-table-column>
      <el-table-column prop="isVip" label="被邀商家是否购买过会员" ></el-table-column>
      <el-table-column prop="firstTime" label="被邀商家首次购买会员时间" ></el-table-column>
    </el-table>

  </div>
</template>

<script>
    export default {
        name: "rewards",
      data(){
          return{
            tableData : []
          }
      },
      created(){

      },
      methods : {

      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .rewards{
    width : 90% ;
    margin : 0 auto ;
    .title{
      width : 100% ;
      height : 0.6rem ;
      line-height : 0.6rem ;
      font-size :0.22rem ;
      font-weight : bold ;
      color : #333 ;
      border-bottom : 1px solid #aaa ;
      text-indent : 0.3rem ;
      margin-bottom : 0.3rem ;

    }
    .el-table{
      width : 90% ;
      margin : 0 auto ;
      border-color : #aaa ;
      border-radius : 0.05rem ;
    }
  }
</style>
