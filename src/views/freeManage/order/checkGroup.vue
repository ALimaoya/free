<template>
  <div class="groupOrder tableBox"    v-loading="loading"  element-loading-text="拼命加载中">
    <h1>开团提醒订单审核</h1>
    <search-bar @searchobj="getData" :groupActivityType="true" :activity-shop="true"  :activity-code="true" :group="'groupOrder'" :date="true"></search-bar>
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
          <img v-if="scope.row.orderImageList.length>0 && scope.row.orderImageList[0].imageUrl!==null" class="showPic"
               @click="showImg( scope.row.orderImageList[0].imageUrl )"
               :src=" imageDomain + scope.row.orderImageList[0].imageUrl " :onerror="errorImg"/>
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
          <el-button v-if="scope.row.status==4"  type="text" @click="goAudit(scope.$index,scope.row)">审核</el-button>
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
    <el-dialog width="50%" :visible.sync="detailInfo" center top="10vh" title="开团提醒订单审核" >
      <div class="contentList">
        <ul class="detailInfor">
          <li><span>订单流水号：</span><span>{{ detail.orderCode}}</span></li>
          <li><span>活动编号：</span><span>{{ detail.activityCode}}</span></li>
          <li><span>商铺名称：</span><span v-if="detail.shopName">{{ detail.shopName }}</span><span v-else>暂无</span></li>
          <li><span>活动类型：</span><span v-if="detail.platform">{{ platForm[detail.platform] }}</span><span v-else>暂无</span></li>
          <!--<li><span>第三方单号：</span><span v-if="detailInfo.thirdOrderCode">{{ detailInfo.thirdOrderCode }}</span><span v-else>暂无</span></li>-->
          <li><span>完成时间：</span><span v-if="detail.winTime">{{ detail.winTime }}</span><span v-else>暂无</span></li>
          <!--<li><span>订单价格：</span><span v-if="detailInfo.amount">{{ detailInfo.amount }} 元</span><span v-else>暂无</span></li>-->
          <li><span>试客第三方账号：</span><span v-if="detail.thirdAccount">{{ detail.thirdAccount }} </span><span v-else>暂无</span></li>
          <li class="faileReason"><span>用户上传图片详情：</span><span v-if="detail.orderImageList == 0 && detail.mainImageUrl == null" class="noImg">暂无图片</span></li>
          <li class="detailPic">
            <div >
              <dl v-if="detail.mainImageUrl !== null" >
                <dt>宝贝主图</dt>
                <dd>
                  <img v-if="detail.mainImageUrl !== null" @click="showImg(detail.mainImageUrl)" :src="imageDomain + detail.mainImageUrl"  :onerror="errorImg"/>
                  <img :src="failImg"  v-else>
                </dd>
              </dl>
              <dl v-if="detail.orderImageList != 0" v-for="(item,index) in detail.orderImageList" :key="index">
                <dt>开团提醒截图</dt>
                <dd>
                  <img v-if="item.imageUrl!==''" @click="showImg(item.imageUrl)" :src="imageDomain + item.imageUrl"  :onerror="errorImg"/>
                  <img :src="failImg"  v-else>
                </dd>
              </dl>
            </div>

          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="check('1')">审核成功</el-button>
        <el-button type="error" @click="check('2')">审核拒绝</el-button>
        <el-button type="info" @click="detailInfo = false; searchImg = '';likeImg = ''">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝原因" :visible.sync="reasonBox" center top="20vh"  width="30%" >
      <span>备注：</span>
      <el-input :rows="4" type="textarea" :maxlength="40" v-model.trim="reason" placeholder="审核拒绝时不能为空，可输入字符最大长度为40"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReason">提 交</el-button>
        <el-button type="info" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
      detailInfo: false,
      detail: {},
      platForm: ["", "淘抢购", "聚划算", "京东秒杀"],
      reasonBox: false,
      reason: "",
      activityType:''
    };
  },
  mounted() {
    this.order = this.$store.state.searchBar.checkGroup.order;
    this.currentPage = this.$store.state.searchBar.checkGroup.currentPage;
    this.pageSize = this.$store.state.searchBar.checkGroup.pageSize;
    this.getList();
  },
  methods: {
    // 评价审核详情
    goAudit(index, order) {
      this.orderId = order.orderId;
      this.detailInfo = true;
      this.viewImg = "";
      this.loading = true;
      this.activityType = order.activityType;

      orderDetail(order.orderId).then(res => {
        this.loading = false;
        if (res.data.status === "000000000") {
          this.detail = res.data.data;

        }
      });
    },

    //审核操作
    check(type) {
      if (type === "1") {
        this.status = "99";
        this.handelRefuse();
      } else {
        this.status = "11";
        this.reasonBox = true;
      }
      // console.log(this.orderId ,  this.status , this.refuseReason);
    },

    handelRefuse() {
      this.loading = true;

      checkOrder({
        orderId: this.orderId,
        status: this.status,
        reason: this.refuseReason,
        activityType: this.activityType
      }).then(res => {
        this.loading = false;
        if (res.data.status === "000000000") {
          this.$message({
            message: "审核提交成功，请稍后确认",
            center: true,
            type: "success"
          });
          // return false
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      });
      this.detailInfo = false;
      this.viewImg = "";
    },

    //提交拒绝原因
    submitReason() {
      this.refuseReason = this.reason;
      // console.log(this.orderId ,  this.status , this.refuseReason ,2);

      if (this.refuseReason === "") {
        this.$message({
          message: "请填写拒绝原因",
          type: "error",
          center: "true"
        });
        return false;
      } else {
        if (this.refuseReason.length > 100) {
          this.$message({
            message: "拒绝原因不得超过100个字符",
            type: "error",
            center: "true"
          });
        } else {
          this.handelRefuse();
          this.reasonBox = false;
          // this.reason = '' ;
        }
      }
    },

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
      formData.append('EQ_status','4');
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
      this.$store.commit("saveCheckGroup", dataStorage);
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
      this.order.groupActivityType =
        res.groupActivityType === undefined ? "" : res.groupActivityType,
        this.order.activityCode =
          res.activityCode === undefined ? "" : res.activityCode,
        this.order.EQ_activityShop =
          res.EQ_activityShop === undefined ? "" : res.EQ_activityShop,
        this.order.activityStartTime =
          res.activityStartTime === undefined ? "" : res.activityStartTime,
        this.order.activityEndTime =
          res.activityEndTime === undefined ? "" : res.activityEndTime,
        this.order.activityType =
          res.EQ_activityType === undefined ? "" : res.EQ_activityType,
        this.order.LIKE_addServiceType =
          res.LIKE_addServiceType === undefined ? [] : res.LIKE_addServiceType,
        this.order.LIKE_addServiceType2 =
          res.LIKE_addServiceType2 === undefined
            ? ""
            : res.LIKE_addServiceType2
        // }  ;

        // this.currentPage = 1 ;
        this.getList();
    },
    //查看订单详情
    goDetail(index, order) {
      this.$router.push("/freeManage/order/groupDetail/" + order);
    },
    //  去审核
    // goAudit(index,order){
    //     // this.$router.push("/freeManage/order/groupAudit/" + order);
    //     console.log(order)

    // },
    //关闭窗口
    cancel() {
      this.reasonBox = false;
      this.reason = "";
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
