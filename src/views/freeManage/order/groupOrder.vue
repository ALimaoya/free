<template>
  <div class="groupOrder tableBox"    v-loading="loading"  element-loading-text="拼命加载中">
    <h1>开团提醒订单查询</h1>
    <search-bar @searchobj="getData" :groupActivityType="true" :activity-shop="true" :group-status="true" :activity-code="true" :group="'groupOrder'" :date="true"></search-bar>
    <!--<div class="note">备注：以上搜索条件可根据单一条件进行搜索，当单独试客淘宝号搜索不到有用信息时，可尝试输入淘宝订单编号，反之亦然</div>-->
    <el-table :data="tableData" border>
      <el-table-column label="序号" width="80" prop="orderId" ></el-table-column>
      <el-table-column prop="orderCode" label="订单流水号" ></el-table-column>
      <el-table-column prop="shopName" label="店铺名称" ></el-table-column>
      <el-table-column prop="activityCode" label="活动编号" ></el-table-column>
      <el-table-column prop="platform" label="活动类型">
        <template slot-scope="scope">
          {{ platformOptions[scope.row.platform].name }}
        </template>
      </el-table-column>
      <el-table-column prop="thirdAccount" label="试客第三方账号"></el-table-column>
      <el-table-column prop="createTime" label="订单创建时间" ></el-table-column>
      <el-table-column prop="orderImageList" label="开团提醒截图">
        <template slot-scope="scope">
          <img v-if="scope.row.orderImageList!==null && scope.row.orderImageList.length!== 0" class="showPic" @click="showImg( scope.row.orderImageList[0].imageUrl )" :src=" imageDomain + scope.row.orderImageList[0].imageUrl " :onerror="errorImg"/>
          <img :src="failImg"  v-else class="showPic">
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==99">已完成</span>
          <span v-else-if="scope.row.status==11">订单失败</span>
          <span v-else-if="scope.row.status==4">审核中</span>
          <span v-else-if="scope.row.status==3">已接单</span>
          <!--<span v-else>{{ options[scope.row.status].name}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="goDetail(scope.$index,scope.row.orderId)">查看详情</el-button>
          <!-- <el-button v-if="scope.row.status==4"  type="text" @click="goAudit(scope.$index,scope.row.orderId)">审核</el-button> -->
          <!--<el-button  type="text"  @click="handleCheck(scope.$index,'2')">审核失败</el-button>-->
          <!--<el-button  type="text"  @click="refuseReason(scope.$index)">查看拒绝原因</el-button>-->

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
    <div v-if="mask" @click="close" class="mask">
      <img :src=" imageDomain + bigImg" alt="" />
    </div>
  </div>
</template>

<script>
import {
  getOrderList,
  changeStatus,
  orderDetail,
  checkOrder
} from "@/api/activity";
import searchBar from "@/components/searchBar";
import userPhoto from "@/assets/404_images/fail.png";

export default {
  name: "flow-order",
  components: {
    searchBar
  },

  data() {
    return {
      platformOptions: [
        {
          value: "",
          name: "全部平台"
        },
        {
          value: "1",
          name: "淘抢购"
        },
        {
          value: "2",
          name: "聚划算"
        },
        {
          value: "3",
          name: "京东秒杀"
        }
      ],
      order: {},
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      complaintOrder: "",
      complainBox: false,
      imageDomain: process.env.IMAGE_DOMAIN,
      mask: false,
      bigImg: "",
      loading: true,
      errorImg: 'this.src="' + userPhoto + '"',
      failImg: userPhoto,
      detail: {},
      platForm: ["", "淘抢购", "聚划算", "京东秒杀"],
    };
  },
  mounted() {
    this.order = this.$store.state.searchBar.groupOrder.order;
    this.currentPage = this.$store.state.searchBar.groupOrder.currentPage;
    this.pageSize = this.$store.state.searchBar.groupOrder.pageSize;
    this.getList();
  },
  methods: {

    //获取订单列表
    getList() {
      // console.log('order',this.order)
      let formData = new FormData();
      if (
        this.order.groupActivityType === "" ||
        this.order.groupActivityType === undefined ||
        this.order.groupActivityType === null
      ) {
        formData.append("IN_activityType", "5,6,7");
      } else {
        formData.append("EQ_activityType", this.order.groupActivityType);
      }
      let reg = /^[0-9]*$/;
      if (reg.test(this.order.activityCode)) {
        formData.append(
          "EQ_tryoutActivity.activityCode",
          this.order.activityCode
        );
      } else {
        formData.append("EQ_tryoutActivity.activityCode", "");
      }

      // formData.append("EQ_activityType", this.order.EQ_activityType);
      formData.append(
        "EQ_tryoutActivity.tryoutMerchantShop.shopId",
        this.order.EQ_activityShop
      );
      formData.append("EQ_status", this.order.EQ_status);
      if (this.order.activityStartTime === null) {
        formData.append("activityStartTime", "");
      } else {
        formData.append("activityStartTime", this.order.activityStartTime);
      }
      if (this.order.activityEndTime === null) {
        formData.append("activityEndTime", "");
      } else {
        formData.append("activityEndTime", this.order.activityEndTime);
      }
      formData.append("currentPage", this.currentPage);
      formData.append("pageSize", this.pageSize);
      this.loading = true;
      let dataStorage = {
        order: {
          ...this.order
        },
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      // console.log('dataStorage',dataStorage)
      this.$store.commit("saveGroupOrder", dataStorage);
      getOrderList(formData).then(res => {
        //  console.log(res)
        this.loading = false;
        if (res.data.status === "000000000") {
          this.tableData = res.data.data;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalElements;
        }
      });
    },
    //根据搜索条件获取订单列表
    getData(res) {
      // this.order ={
      (this.order.groupActivityType =
        res.groupActivityType === undefined ? "" : res.groupActivityType),
        (this.order.activityCode =
          res.activityCode === undefined ? "" : res.activityCode),
        (this.order.EQ_activityShop =
          res.EQ_activityShop === undefined ? "" : res.EQ_activityShop),
        (this.order.activityStartTime =
          res.activityStartTime === undefined ? "" : res.activityStartTime),
        (this.order.activityEndTime =
          res.activityEndTime === undefined ? "" : res.activityEndTime),
        (this.order.EQ_activityType =
          res.EQ_activityType === undefined ? "" : res.EQ_activityType),
        (this.order.LIKE_addServiceType =
          res.LIKE_addServiceType === undefined ? [] : res.LIKE_addServiceType),
        (this.order.LIKE_addServiceType2 =
          res.LIKE_addServiceType2 === undefined
            ? ""
            : res.LIKE_addServiceType2),
        // }  ;

        // this.currentPage = 1 ;

        this.getList();
    },
    //查看订单详情
    goDetail(index, order) {
      this.$router.push("/freeManage/order/groupDetail/" + order);
    },
    //查看宝贝大图
    showImg(url) {
      this.mask = true;
      this.bigImg = url;
    },
    close() {
      this.mask = false;
      this.bigImg = "";
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
@import "src/styles/table";
.contentList {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.detailInfor {
  width: 100%;
  float: left;

  .keys {
    padding-left: 0.3rem;
    font-size: 0.14rem;
  }
}
li {
  width: 50%;
  line-height: 0.4rem;
  /*height : 0.4rem ;*/
  font-size: 0.16rem;
  float: left;
  span {
    display: block;
    line-height: 0.4rem;
    float: left;
    &:nth-child(1) {
      width: 40%;
      text-align: right;
    }
    &:nth-child(2) {
      width: 60%;
      text-indent: 0.3rem;
    }
  }
}
.faileReason{
      width : 100% ;
      span:nth-child(1){
        width : 20% ;
        text-align: right ;

      }
      span:nth-child(2){
        width : 80% ;
        padding-left : 0.3rem ;
        box-sizing: border-box;
        text-indent : 0 ;

      }
    }
    .detailPic{
      /*padding-top : 0.2rem ;*/
      width : 100% ;
      display : flex ;
      flex-direction: row;

      div{
        flex : 1 ;
        display : flex ;
        margin : 0.3rem 0 1rem ;
        flex-wrap: wrap;
        justify-content: space-between;
        height : 4rem ;
        dl{
          width : 45% ;
          font-weight : 100 ;
          /*margin-left : 0.52rem ;*/
          height : 3.5rem ;
          &:nth-child(n){
            margin-left : 0.7rem ;
          }
          &:nth-child(2n){
            margin-left : 0 ;
          }

          dt{
            width : 100% ;
            text-align : center;
            font-size : 0.16rem ;
            line-height : 0.4rem ;
            height : 0.4rem ;
          }
          dd{
            margin : 0.2rem auto;
            width : 1.5rem !important;
            height : 2.5rem ;
            display : flex ;
            /*justify-content: center;*/
            align-items: center;
            img{
              width : 100% ;
              max-height : 100% ;
              border : 1px solid #D3D3D3;
              /*border-radius : 0.05rem ;*/
            }
          }
        }
      }
      .noImg{
        margin : 0 ;
        /*font-size : 0.18rem ;*/
        height : 0.3rem ;
        line-height : 0.3rem ;
        padding-left : 2rem ;
      }
    }
</style>
