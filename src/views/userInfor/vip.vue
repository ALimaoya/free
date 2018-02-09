<template>
  <div class="vip">
    <!--<top></top>-->
    <div class="title">会员管理</div>
    <p>会员状态：</p>
    <el-table :data="statusData" border style="width: 100%">
      <el-table-column prop="type" label="会员类型" ></el-table-column>
      <el-table-column prop="date" label="到期时间" ></el-table-column>
      <el-table-column prop="action" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleVip(scope.$index,scope.row)" type="text" size="small">购买正式会员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p>会员充值记录：</p>
    <el-table border :data="historyData" stripe style="width: 100%">
      <el-table-column prop="date" label="时间" ></el-table-column>
      <el-table-column prop="startDate" label="开通时间" ></el-table-column>
      <el-table-column prop="money" label="充值金额"></el-table-column>
      <el-table-column prop="type" label="充值类型" ></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  // import  Top  from '@/components/Top'

  export default {
      name:    "vip",
    // components: {
    //   Top
    // },
    data(){
      return{
        statusData : [

          {
            type: '非会员',
            date : '----',
            action : ''
          }
        ] ,
        historyData : []
      }
    },
    methods : {
      handleVip(row){
        this.$router.push('/userInfor/buyVip');
      }
    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .vip{

    .title{
      width : 100% ;
      height : 0.4rem ;
      line-height : 0.4rem ;
      font-size : 0.2rem ;
      margin : 0.4rem  0;
      border-bottom : 1px solid #aaa ;
      text-indent : 0.3rem ;
    }
    p{
      width : 100% ;
      height : 0.4rem ;
      font-size : 0.16rem ;
      line-height : 0.4rem ;
      text-indent : 0.4rem ;
      margin-top : 0.2rem ;
    }
    .el-table--border, .el-table--group{
      border-color : #D3D3D3 ;
      border-radius : 0.05rem ;
    }
    .el-table__row{
      padding : 0.08rem  0;
    }


  }
</style>
