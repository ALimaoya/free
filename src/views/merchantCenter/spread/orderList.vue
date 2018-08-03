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
        <el-table :data="tableData"  border  fit>
            <el-table-column  label="商品信息" >
                <template slot-scope="scope">
                    <div class="goodsWrap">
                        <img v-if="scope.row.ybProductResDto.productImages!== null &&  scope.row.ybProductResDto.productImages[0]!==undefined" :src="imageDomain + scope.row.ybProductResDto.productImages[0]" :onerror="errorImg">
                        <img :src="failImg" v-else >
                        <div class="detailWrap">
                          <span>{{scope.row.ybProductResDto.productName}}</span>
                          <span>商品编号：{{scope.row.ybProductResDto.code}}</span>
                          <span>￥{{scope.row.ybProductResDto.price}}</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="100"></el-table-column>
            <el-table-column prop="dealPrice" label="实际成交价格(元)" width="70"></el-table-column>
            <el-table-column prop="dealNum" label="成交商品数量" width="80"></el-table-column>
            <el-table-column prop="brokerageRate" label="佣金比例(%)" width="90">
              <template slot-scope="scope">
                <span>{{scope.row.brokerageRate}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="brokerage" label="佣金(元)" width="80"></el-table-column>
            <el-table-column prop="receiveTime" label="确认收货时间" width="100"></el-table-column>
            <el-table-column prop="settlementTime" label="结算时间" width="100"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="scope">
                <el-button v-if="scope.row.status !==''" plain :type='statusList[(scope.row.status*1+1)].type' size="mini">{{ statusList[(scope.row.status*1+1)].name }}</el-button>
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
import userPhoto from '@/assets/404_images/fail.png'

export default {
  name: "order-list",
  data() {
    return {
      loading: true,
      search: {},
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
          type: " "
        },
        {
          name: "已付款",
          value: "1",
          type: "success"
        },
        {
          name: "结算中",
          value: "2",
          type: "primary"
        },
        {
          name: "已结算",
          value: "3",
          type: "warning"
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
      totalPages: 0,
      errorImg:'this.src="' + userPhoto + '"',
      failImg: userPhoto,
    };
  },
  mounted() {
    this.search = this.$store.state.searchBar.spreadList.search ;
    this.currentPage = this.$store.state.searchBar.spreadList.currentPage ;
    this.pageSize = this.$store.state.searchBar.spreadList.pageSize ;

    this.getList()
  },
  methods: {
    getList() {
      let formData = new FormData();
      formData.append("currentPage", this.currentPage);
      formData.append("pageSize", this.pageSize);
      formData.append('EQ_status',this.search.status);
      formData.append('GT_createTime',this.search.startDate);
      formData.append('LT_createTime',this.search.endDate);
      let data = {
        search : { ...this.search },
        currentPage : this.currentPage ,
        pageSize: this.pageSize
      };
      this.$store.commit('saveSpread',data);
      getOrderLists(formData).then( res =>{
        this.loading= false;
        if(res.data.status ==="000000000"){
          this.tableData =  res.data.data;
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
.search {
  height: 100px !important;
  /*display: flex;*/
  /*flex-direction: row;*/
  /*justify-content: flex-start;*/
  /*flex-wrap: wrap;*/
  /*.el-input,*/
  /*.el-select,*/
  /*.block {*/
    /*width: 25% !important;*/
    /*margin-left: 0 !important;*/
    /*margin-right: 0.25rem !important;*/
  /*}*/
  .block {
    display: inline-block;
    width: 20%!important; ;
    margin-right: 0.25rem !important;

    .el-input {
      width: 100% !important;
    }
  }
  /*.el-button {*/
    /*height: 32px;*/
    /*margin-left: 0 !important;*/
  /*}*/
}

.goodsWrap{
  padding: 0.1rem ;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  img{
    width : 1rem ;
    height: 1rem ;
    margin: 0 0.2rem ;
  }
  .detailWrap{
    flex-direction: column;
    flex: 1 ;
    font-size: 0.16rem ;
    color : #666;
    span{
      display: inline-block;
      text-align: left;
      width: 100%;
    }
  }
}

</style>
