<template>
  <div class="checkbonus">
    <h1>领取审核</h1>
    <div class="search">
      <el-select size="small"  v-model="order.platformType" filterable placeholder="请选择试用平台">
        <el-option
          v-for="item in platformOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input size="small" v-model.trim="order.activityCode" placeholder="请输入试客试用活动编号"></el-input>
      <el-input size="small" v-model.trim="order.thirdOrderCode" placeholder="请输入第三方订单编号"></el-input>
      <el-button size="small"  @click="getList()" class="searchOrder">查询</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="activityCode" label="试客任务编号" width="180"></el-table-column>
      <el-table-column prop="orderCode" label="试客子订单编号" width="180"></el-table-column>
      <el-table-column prop="activityTitle" label="商品名称"></el-table-column>
      <el-table-column prop="platform" label="平台类型">
        <template slot-scope="scope">
          {{ platformOptions[scope.row.platform].name }}
        </template>
      </el-table-column>
      <el-table-column prop="thirdAccount" label="试客第三方账号"></el-table-column>
      <el-table-column prop="thirdOrderCode" label="第三方订单编号"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="goDetail(scope.$index,scope.row.orderId)">审核</el-button>
          <el-button  type="text" @click="handleOrder(scope.$index,scope.row.orderId)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block2" v-if="tableData.length>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <span class="totalItems">共{{ totalPages }}页，{{totalElements}}条记录</span>
    </div>
  </div>
</template>

<script>
  import { getOrderList ,checkBonus  } from "@/api/activity"

  export default {
        name: "checkbonus" ,
      data(){
          return {
            platformOptions : [
              {
                value: '',
                name : '全部平台'
              },
              {
                value: '1',
                name : '淘宝'
              },
              {
                value : '2',
                name : '天猫'
              },
              {
                value : '3',
                name : '京东'
              },
              // {
              //   value : '4',
              //   name : '拼多多'
              // }
            ],
            order : {
              EQ_status: '',
              // thirdAccount: '',
              platformType : '' ,
              activityCode : '',
              thirdOrderCode: '',
              // currentPage : 1,
              // pageSize : 10
            },
            tableData : [],
            currentPage : 1 ,
            pageSize : 10 ,
            totalPages : '',
            totalElements : 0 ,
          }
      },
      mounted(){
          this.getList();
      },
      methods : {

        //  获取订单列表
        getList(){
          let formData = new FormData();
          formData.append('EQ_tryoutActivity.platformType',this.order.platformType);
          formData.append('EQ_tryoutActivity.activityCode', this.order.activityCode);
          formData.append('EQ_tryoutOrderWin.thirdOrderCode',this.order.thirdOrderCode);
          formData.append('currentPage', this.currentPage);
          formData.append('EQ_status','4');
          formData.append('pageSize', this.pageSize);
          getOrderList(formData).then( res=> {
            if(res.data.status === '000000000'){
              this.tableData = res.data.data ;
              this.totalPages = res.data.totalPages ;
              this.totalElements = res.data.totalElements ;
              console.log( this.totalElements)
            }
          }).catch( err => {
            alert('服务开小差啦，请稍等~');

          })
        },

        //查看订单详情
        goDetail(index,order){
          this.$router.push('/Activity/detail/'+ order) ;

        },

        //进行审核操作
        handleOrder(index ,order){

        },

        handleSizeChange(val) {
          this.pageSize = val ;
          this.getList();
        },
        handleCurrentChange(val) {
          console.log(val);
          this.currentPage = val ;
          this.getList();
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "src/styles/table.scss" ;

  .checkbonus{
    .search{
      border-bottom : 1px solid #aaa ;
    }
  }
</style>
