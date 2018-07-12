<template>
    <div class="order-list activityTable" v-loading="loading"  element-loading-text="拼命加载中">
        <h1>推广订单明细</h1>
        <div class="search">
            <div class="block">
                <el-date-picker size="small" v-model="search.startDate" value-format="yyyy-MM-dd" type="date" placeholder="选择订单创建起始时间">
                </el-date-picker>
            </div>
            <div class="block">
                <el-date-picker size="small" v-model="search.endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择订单创建结束时间">
                </el-date-picker>
            </div>
            <el-select  size="small" clearable v-model="search.status" filterable placeholder="退款状态">
                <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="getList()">查询</el-button>
        </div>
        <el-table :data="tableData"  border  align="center" fit>
            <el-table-column  label="商品信息" width="430">
                <template slot-scope="scope">
                    <div class="img">
                        <img v-if="scope.row.ybProductResDto.productImages!== null &&  scope.row.ybProductResDto.productImages[0]!==undefined" :src="imageDomain + scope.row.ybProductResDto.productImages[0]" alt="">
                        <img v-else src="../../../assets/404_images/fail.png" alt="">
                    </div>
                    <ul class="particulars">
                      <li>{{scope.row.ybProductResDto.productName}}</li>
                      <li>商品编号：{{scope.row.ybProductResDto.code}}</li>
                      <li>￥{{scope.row.ybProductResDto.price}}</li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="dealPrice" label="实际成交价格"></el-table-column>
            <el-table-column prop="dealNum" label="成交商品数量"></el-table-column>
            <el-table-column prop="brokerageRate" label="佣金比例">
              <template slot-scope="scope">
                <span>{{(scope.row.brokerageRate)*100}}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="brokerage" label="佣金"></el-table-column>
            <el-table-column prop="receiveTime" label="确认收货时间"></el-table-column>
            <el-table-column prop="settlementTime" label="结算时间"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-button v-if="scope.row.statu !==''" plain :type='orderStatus[(scope.row.status-0)].type' size="mini">{{ orderStatus[(scope.row.status-0)].name }}</el-button>
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
import {getOrderLists} from '@/api/merchant';
export default {
  name: "order-list",
  data() {
    return {
      loading: true,
      search: {
        startDate: "",
        endDate: "",
        status: ""
      },
      tableData: [
        {
          brokerage:'',
          brokerageRate:'',
          createTime:'',
          dealNum:'',
          dealPrice:'',
          settlementTime:'',
          status:'',
          ybProductResDto:{
            productImages:[],
            productName:'',
            code:'',
            price:''
          }
        }
      ],
      imageDomain : process.env.IMAGE_DOMAIN ,
      statusList: [
        {
          name: "全部状态",
          value: "",
          type: ""
        },
        {
          name: "未付款",
          value: "0",
          type: "primary"
        },
        {
          name: "已付款",
          value: "1",
          type: "success"
        },
        {
          name: "结算中",
          value: "2",
          type: "info"
        },
        {
          name: "已结算",
          value: "3",
          type: "danger"
        },
        {
          name: "已失效",
          value: "4",
          type: "info"
        }
      ],
      orderStatus: [
        {
          name: "未付款",
          value: "0",
          type: "primary"
        },
        {
          name: "已付款",
          value: "1",
          type: "success"
        },
        {
          name: "结算中",
          value: "2",
          type: "info"
        },
        {
          name: "已结算",
          value: "3",
          type: "danger"
        },
        {
          name: "已失效",
          value: "4",
          type: "info"
        }
      ],
      currentPage: 1,
      pageSize: 10,
      totalElements: 0,
      totalPages: ""
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let formData = new FormData();
      formData.append("currentPage", this.currentPage);
      formData.append("pageSize", this.pageSize);
      formData.append('EQ_status',this.search.status)
      formData.append('GT_createTime',this.search.startDate)
      formData.append('LT_createTime',this.search.endDate)

      getOrderLists(formData).then( res =>{
        console.log('res',res)
        this.loading= false;
        if(res.data.status =="000000000"){
          this.tableData =  res.data.data
          this.totalPages = res.data.totalPages ;
          this.totalElements = res.data.totalElements ;
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../styles/activityTable";
@import "../../../styles/table";
.search {
  height: 100px !important;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  .el-input,
  .el-select,
  .block {
    width: 25% !important;
    margin-left: 0 !important;
    margin-right: 0.25rem !important;
  }
  .block {
    .el-input {
      width: 100% !important;
    }
  } 
  .el-button {
    height: 32px;
    margin-left: 0 !important;
  }
}
.el-table .particulars,
.img {
  display: inline-block;
}
.el-table .img {
  width: 1rem;
  height: 1rem;
  vertical-align: top;
  margin-right: 0.2rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.el-table .particulars {
  width: 3rem;
  li {
    text-align: left;
    margin-bottom: 2px;
    &:nth-of-type(1) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
