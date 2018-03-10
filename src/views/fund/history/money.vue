<template>
  <div class="money">
    <div class="title">
        <p>类型：</p>
        <el-select v-model="searchForm.detail" placeholder="全部明细" size="small">
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
        <el-date-picker size="small"
          v-model="searchForm.startDate" value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
          <div class="block">
        <span class="demonstration">结束时间：</span>
        <el-date-picker size="small"
            v-model="searchForm.endDate" value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
          <el-button type="primary" size="mini" @click="search(searchForm)">查询</el-button>
    </div>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" border height="0.3rem">
      <el-table-column prop="ID" label="编号"></el-table-column>
      <el-table-column prop="type" label="交易类型"></el-table-column>
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="note" label="资金备注"></el-table-column>
      <el-table-column prop="rest" label="当前结余"></el-table-column>
      <el-table-column prop="status" label="交易状态"></el-table-column>
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

  import ElFormItem from "element-ui/packages/form/src/form-item";
  import { getWalletLog } from "@/api/fund"
  export default {
    components: {ElFormItem},
    name: "money",
      data(){
          return{
            searchForm : {
              detail : '',
              startDate : '',
              endDate : ''
            },
            options : [
              {
                label : '账户充值',
                value : '1'
              },
              {
                label : '活动付款',
                value : '2'
              },
              {
                label : '活动结算',
                value : '3'
              },
              {
                label : '购买会员',
                value : '4'
              },
              {
                label : '账户提现',
                value : '5'
              },
            ],
            tableData : [],
            currentPage : 1 ,
            pageSize : 10,
            type:""
          }
      },
      mounted(){
        this.getMoneyList();
      },
      methods : {
        search(form){
          // this.getList(form);
          console.log(form)
        },

        getMoneyList(){
          let _data={
            page:this.currentPage,
            size:this.pageSize,
            type:this.type,
          };
          getWalletLog(_data).then( res => {
            if(  res.data.code === '000000000'){
              this.tableData = res.data.data ;
            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')
          })
        },

        handleSizeChange(val) {
          this.pageSize = val ;
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
