<template>
  <div class="content">
    <h1>投诉反馈</h1>
    <el-table v-if="tableData.length"
      :data="tableData"
      stripe border highlight-current-row
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="number"
        label="试客订单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="投诉原因">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="result"
        label="处理结果">
      </el-table-column>
      <el-table-column
        prop="others"
        label="备注">
      </el-table-column>
    </el-table>
    <div class="noRecord" v-else>
      <img src="../../assets/imgs/u753.jpg" alt="" />
      <p>您当前没有投诉记录哦~</p>
    </div>
  </div>
</template>

<script>

  export default {
    name: "feedback" ,

    data(){
      return{
        tableData : []
      }
    }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .content{

    h1{
      margin : 0.3rem 0 ;
      padding : 0.2rem  0.4rem ;
      border-bottom : 1px solid #666 ;
    }
    .noRecord{
      display : flex ;
      flex : 1 ;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top : 1rem ;
      img{
        width : 1rem ;

      }
      p{
        font-size : 0.18rem ;
        height : 1rem ;
        line-height : 1rem ;
        color : #777 ;
      }
    }
  }
</style>
