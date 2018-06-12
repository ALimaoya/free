<template>
  <div class="money">
    <div class="title">
        <p>类型：</p>
        <el-select clearable v-model="searchForm.detail" placeholder="全部明细" size="small">
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
          <el-button type="primary" style="padding : 0 0.1rem;line-height: 0.34rem;" size="mini" @click="search(searchForm)">查询</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%;"  border>
      <el-table-column prop="" label="编号">
          <template slot-scope="scope">
              {{scope.$index+1}}
          </template>
      </el-table-column>
      <el-table-column prop="changeType" label="交易类型">
          <template slot-scope="scope">
            <span v-if="scope.row.changeType=== '7'">店铺付款</span>
            <span v-else>{{options[scope.row.changeType].label}} </span>
          </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额(元)"></el-table-column>
      <el-table-column prop="remarks" label="资金备注"></el-table-column>
      <el-table-column prop="amountResult" label="当前结余(元)"></el-table-column>
      <!-- <el-table-column prop="options" label="交易状态"></el-table-column> -->
      <el-table-column prop="createTime" label="操作时间"></el-table-column>
    </el-table>
    <div class="block2" v-if="tableData.length">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout=" sizes, prev, pager, next, jumper"
        :total="moneyRecord.totalElements">
      </el-pagination>
      <span class="totalItems">共{{moneyRecord.totalPages}}页，{{moneyRecord.totalElements}}条记录</span>
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
                label : '全部类型',
                value : ''
              },
              {
                label : '账户充值',
                value : '1'
              },
              {
                label : '活动付款',
                value : '2'
              },
              {
                label : '账户提现',
                value : '3'
              },
              {
                label : '活动结算',
                value : '4'
              },
              {
                label : '购买会员',
                value : '5'
              },
              {
                label: '店铺付款',
                value : '7'
              }
            ],
            tableData : [],
            currentPage : 1 ,
            pageSize : 10,
            type:"",
            moneyRecord:{}
          }
      },
      mounted(){
        this.getMoneyList();
      },
      methods : {
        search(form){
          this.currentPage = 1 ;
          this.getMoneyList();
        },

        getMoneyList(){
          let formdata=new FormData();
          formdata.append('currentPage',this.currentPage);
          formdata.append('pageSize',this.pageSize);
          formdata.append('EQ_changeType',this.searchForm.detail);
          if(this.searchForm.startDate){
            formdata.append('GT_createTime',this.searchForm.startDate);
          }else{
            formdata.append('GT_createTime','');
          }
          if(this.searchForm.endDate){
            formdata.append('LT_createTime',this.searchForm.endDate);
          }else{
            formdata.append('LT_createTime','');
          }
          getWalletLog(formdata).then( res => {
            if( res.data.status === '000000000'){
              this.tableData = res.data.data;
              this.moneyRecord=res.data
              // console.log(this.tableData)
            }else{
              this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                });
                return
            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')
          })
        },

        handleSizeChange(val) {
          this.pageSize = val ;
          this.getMoneyList()
        },
        handleCurrentChange(val) {
          this.currentPage = val ;
          this.getMoneyList()
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
