<template>
  <div class="rewards">
    <p class="title">邀请奖励</p>
    <el-table :data="tableData" border height="0.3rem" style="width: 80%" fit>
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
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .rewards{
    .title{
      width : 100% ;
      height : 0.7rem ;
      line-height : 0.7rem ;
      font-size : 0.22rem ;
      color : #333 ;
      font-weight : bold ;
      text-indent : 2rem ;
      /*text-align : center ;*/
    }
    .el-table{
      margin : 0 auto ;
      border-color : #aaa ;
      border-radius : 0.05rem ;
    }
  }
</style>
