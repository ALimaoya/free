<template>
  <div class="settleHistory activityTable"  v-loading="loading"  element-loading-text="拼命加载中">
    <h1>历史结算</h1>
    <div class="search">
      <el-input size="small" :maxlength="40" v-model.trim="settlement.EQ_code" placeholder="结算单号"></el-input>
      <div class="block">
        <!--<span class="demonstration">结算开始时间：</span>-->
        <el-date-picker size="small" v-model="settlement.GT_settlementTime" value-format="yyyy-MM-dd" type="date" placeholder="选择结算开始时间">
        </el-date-picker>
      </div>
      <div class="block">
        <!--<span class="demonstration">结算结束时间：</span>-->
        <el-date-picker size="small" v-model="settlement.LT_settlementTime" value-format="yyyy-MM-dd" type="date" placeholder="选择结算结束时间">
        </el-date-picker>
      </div>
      <el-select  size="small" clearable v-model="settlement.EQ_status" filterable placeholder="请选择结算状态">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button  size="small" type="primary"  @click="getList()" class="searchOrder">查询</el-button>
      <el-button  size="small" type="primary"  @click="reset()" class="searchOrder">重置</el-button>
    </div>
    <el-table :data="tableData"  border fit>
      <el-table-column prop="orderCode" label="结算单号"></el-table-column>
      <el-table-column prop="settleTime" label="结算时间" ></el-table-column>
      <el-table-column prop="amount" label="结算金额（元）" ></el-table-column>
      <el-table-column prop="serviceAmount" label="服务费（元）"></el-table-column>
      <el-table-column prop="account" label="结算账号" ></el-table-column>
      <el-table-column prop="mobile" label="结算手机号" ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-button size="mini" plain v-if="scope.row.status !== ''" :type="statusList[scope.row.status].type">{{ statusList[scope.row.status].name}}</el-button>
          <!--<el-button size="mini" v-if="scope.row.status === '3'" type="primary">已结算</el-button>-->
          <!--<el-button size="mini" v-if="scope.row.status === '4'" type="danger">已拒绝</el-button>-->
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
  import { historyList } from "@/api/merchant"
    export default {
        name: "SettleHistory",
      data(){
          return{
            settlement: {
              EQ_code: '',
              GT_settlementTime: '',
              LT_settlementTime: '',
              EQ_status: ''
            },
            statusList: [
              {
                name : '全部状态',
                value : ''
              },
              // {
              //   name : '申请结算',
              //   value : '1'
              // },
              {
                name : '结算中',
                value : '1',
                type: 'primary'
              },
              {
                name: '已结算',
                value : '2',
                type: 'success'
              },
              {
                name : '已拒绝',
                value : '3',
                type: 'danger'
              }

            ],
            tableData : [],
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            loading : true ,

          }
      },
      mounted(){
        this.getList();

      },
      methods : {
        getList(){
          let formData = new FormData();
          formData.append('currentPage', this.currentPage);
          formData.append('pageSize', this.pageSize);
          formData.append('EQ_code', this.settlement.EQ_code);
          formData.append('GT_settlementTime', this.settlement.GT_settlementTime);
          formData.append('LT_settlementTime', this.settlement.LT_settlementTime);
          formData.append('EQ_status', this.settlement.EQ_status);
          this.loading = true ;

          historyList(formData).then( res => {
            this.loading = false ;

            this.tableData = res.data.data ;
                this.totalPages = res.data.totalPages;
                this.totalElements = res.data.totalElements
          })
        } ,

        reset(){
          this.settlement =  {
            EQ_code: '',
            GT_settlementTime: '',
            LT_settlementTime: '',
            EQ_status: ''
          };
          this.currentPage = 1 ;
          this.pageSize = 10 ;
          this.getList();
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
