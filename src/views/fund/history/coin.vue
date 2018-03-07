<template>
  <div class="money">
    <div class="title">
      <p>类型：</p>
      <el-select v-model="coinSearch.detail" placeholder="全部明细" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <p class="timeSetting">时间设置：</p>
      <div class="block">
        <span class="demonstration">开始时间：</span>
        <el-date-picker size="small" v-model="coinSearch.startDate" value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="block">
        <span class="demonstration">结束时间：</span>
        <el-date-picker size="small" v-model="coinSearch.endDate" value-format="yyyy-MM-dd HH:mm:ss"
             type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <el-button type="primary" size="mini" @click="search(coinSearch)">查询</el-button>
    </div>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" border height="0.3rem">
      <el-table-column prop="ID" label="编号"></el-table-column>
      <el-table-column prop="type" label="交易类型"></el-table-column>
      <el-table-column prop="amount" label="金币数量"></el-table-column>
      <el-table-column prop="rest" label="金币余额"></el-table-column>
      <el-table-column prop="note" label="备注"></el-table-column>
      <el-table-column prop="time" label="操作时间"></el-table-column>
    </el-table>
    <div class="block2" v-if="tableData.length">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout=" sizes, prev, pager, next, jumper"
        :total="tableData.length">
      </el-pagination>
      <span class="totalItems">共{{Math.ceil(tableData.length/pageSize)}}页，{{tableData.length}}条记录</span>
    </div>
  </div>
</template>

<script>
  import { getWallet } from "@/api/fund"

  export default {
    name: "coin",
    data(){
      return{
        coinSearch:{
          detail : '',
          startDate : '',
          endDate : ''
        },
        options : [
          {
            label : '金币充值记录',
            value : '1'
          },
          {
            label : '金币收入记录',
            value : '2'
          },
          {
            label : '金币支出记录',
            value : '3'
          }
        ],
        tableData : [
          {
            ID : '1',
            type : '111',
            amount : '111',
            rest : '1',
            note : 'csdodfj',
            time : 'fsdfs'
          }
        ] ,
        currentPage : 1 ,
        pageSize : 10
      }
    },

    mounted(){
      // this.getList();
    },
    methods : {
      search(form){
        // this.getList(form);

        console.log(form)
      },

      getList(){
        // getWallet().then( res => {
        //   if(  res.data.code === '000000000'){
        //     this.tableData = res.data.data ;
        //   }
        // }).catch( err => {
        //   alert('服务器开小差啦，请稍等~')
        // })
      },

      handleSizeChange(val) {
        this.pageSize = val
        // this.tableData.slice(this.currentPage-1,val);
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val ;
        console.log(`当前页: ${val}`);
      }
    }

  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .money{
    width : 95% ;
    margin : 0 auto ;
    .title{
      width : 100% ;
      margin : 0.2rem 0 0.4rem ;
      height : 0.7rem ;
      line-height : 0.7rem ;
      border-bottom : 1px solid #aaa ;
      color : #444455 ;
      display : flex ;
      flex-direction: row;
      p{
        font-size : 0.18rem ;
        font-weight : bold ;
        width : 0.8rem ;
        margin-left : 0.1rem ;

      }
      .timeSetting{
        width : 1.2rem ;
        margin-left : 0.2rem ;
        text-align : right ;
      }

      .demonstration{
        font-size : 0.14rem ;
        margin-left : 0.15rem ;
      }
      .el-date-editor{
        width : 60% ;
      }
      .el-button{
        width : 1rem ;
        height : 0.36rem ;
        margin-left : 0.25rem ;
        margin-top : 0.17rem ;
      }
    }
    .el-table{
      border-color : #aaa ;
      border-radius : 0.05rem ;
    }
    .block2{
      padding : 0.3rem ;
      width : 100% ;
      box-sizing: border-box;
      .totalItems{
        display : block ;
        height : 0.3rem ;
        color : #666 ;
        text-align : right ;
        margin-top : 0.3rem ;
      }
    }
  }
</style>

