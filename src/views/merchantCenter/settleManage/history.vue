<template>
  <div class="settleHistory activityTable">
    <h1>历史结算</h1>
    <div class="search">
      <el-input size="small" :maxlength="20" v-model.trim="settlement.orderId" placeholder="结算单号"></el-input>
      <div class="block">
        <!--<span class="demonstration">结算开始时间：</span>-->
        <el-date-picker size="small" v-model="settlement.startDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结算开始时间">
        </el-date-picker>
      </div>
      <div class="block">
        <!--<span class="demonstration">结算结束时间：</span>-->
        <el-date-picker size="small" v-model="settlement.endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结算结束时间">
        </el-date-picker>
      </div>
      <el-select  size="small" clearable v-model="settlement.status" filterable placeholder="请选择结算状态">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button  size="small" type="primary"  @click="search()" class="searchOrder">查询</el-button>
      <el-button  size="small" type="primary"  @click="reset()" class="searchOrder">重置</el-button>
    </div>
    <el-table :data="tableData"  border fit>
      <el-table-column prop="order" label="结算单号"></el-table-column>
      <el-table-column prop="time" label="结算时间" ></el-table-column>
      <el-table-column prop="money" label="结算金额" ></el-table-column>
      <el-table-column prop="service" label="服务费"></el-table-column>
      <el-table-column prop="account" label="结算账号" ></el-table-column>
      <el-table-column prop="tel" label="结算手机号" ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.status === '1'" type="success">结算中</el-button>
          <el-button size="mini" v-if="scope.row.status === '2'" type="primary">已结算</el-button>
          <el-button size="mini" v-if="scope.row.status === '3'" type="danger">已拒绝</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="block2">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <span class="totalItems">共{{totalPages }}页，{{ totalElements }}条记录</span>
    </div>

  </div>
</template>

<script>
    export default {
        name: "SettleHistory",
      data(){
          return{
            settlement: {
              orderId: '',
              startDate: '',
              endDate: '',
              status: ''
            },
            statusList: [
              {
                name : '全部状态',
                value : ''
              },
              {
                name : '结算中',
                value : '1'
              },
              {
                name: '已结算',
                value : '2'
              },
              {
                name : '已拒绝',
                value : '3'
              }

            ],
            tableData : [],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
          }
      },
      mounted(){
        this.getList();

      },
      methods : {
        getList(){
          // this.tableData =
        } ,
        search(){

        },
        reset(){
          this.settlement =  {
            orderId: '',
            startDate: '',
            endDate: '',
            status: ''
          }
        },
        handleSizeChange(val) {

          this.pageSize = val ;
          this.getList();
        },

        handleCurrentChange(val) {

          this.currentPage = val ;
          this.getList();
        },
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/activityTable';
  @import '../../../styles/table';
  .search{
    height : 100px!important ;
    .block{
      width : 20%!important ;
      float : left!important ;
      margin-right : 0.25rem ;
      .el-input{
        width : 100%!important ;
      }
    }
  }

</style>
