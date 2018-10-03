<template>
    <div class="group activityTable"  v-loading="loading"  element-loading-text="拼命加载中">
        <search-bar @searchobj="getSearchData" :groupActivityType="true" :activity-shop="true" :task-status="true" :activity-code="true" :group="'groupActivity'" :date="true"></search-bar>
        <el-table :data="tableData"  border fit>
            <el-table-column prop="activityId" label="序号"></el-table-column>
            <el-table-column prop="shopName" label="商铺名称" ></el-table-column>
            <el-table-column prop="code" label="活动编号" ></el-table-column>
            <el-table-column prop="platform" label="活动类型" >
                <template slot-scope="scope">
                {{ platformOptions[scope.row.platform].name}}
                </template>
            </el-table-column>
            <el-table-column prop="mainImageUrl" label="活动图片" >
                <template slot-scope="scope">
                <img v-if="scope.row.mainImageUrl" class="showImg" @click="showImg(scope.row.mainImageUrl)" :src="imageDomain + scope.row.mainImageUrl" :onerror="errorImg"/>
                <img :src="failImg" v-else />
                </template>
            </el-table-column>
            <el-table-column prop="date" label="任务时间" >
                <template slot-scope="scope">
                <span class="time">{{ scope.row.startTime}}<br/> ~<br/>{{ scope.row.endTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="总单量" width="85" prop="tryoutQuantity"></el-table-column>
            <!--<el-table-column label="待接取" width="85"></el-table-column>-->
            <el-table-column prop="payStatus" label="支付状态">
                <template slot-scope="scope">
                <span v-if="scope.row.payStatus === '0'">未支付</span>
                <span v-else>支付完成</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="任务状态">
                <template slot-scope="scope">
                <span v-if="scope.row.status==='9'">结算成功</span>
                <span v-else-if="scope.row.payStatus==='0'">待支付</span>
                <span v-else-if="scope.row.status==='5'&& scope.row.startTime > time">待开始</span>
                <span v-else-if="scope.row.status==='5'&& scope.row.startTime <= time&&time< scope.row.endTime&&scope.row.payStatus === '1'">进行中</span>
                <span v-else-if="scope.row.status==='5'&& scope.row.endTime <= time">已结束</span>
                <span v-else-if="scope.row.status==='6'">下架</span>
                <span v-else-if="scope.row.status==='7'">申请结算</span>
                </template>
            </el-table-column>
            <el-table-column  label="操作">
                <template slot-scope="scope">
                <el-button class="check" style="padding : 0 ;" type="text"  @click="detail(scope.$index,scope.row.activityId)">查看详情</el-button>
                <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.payStatus==='0'" @click="editor(scope.$index,scope.row.activityId, scope.row.payStatus)">修改</el-button>
                <!--<el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='4'" @click="reason(scope.$index,scope.row.reason)">查看原因</el-button>-->
                <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='5'&& scope.row.endTime > time&& scope.row.payStatus==='1'" @click="handleShelves(scope.row.activityId,scope.row.status)">下架</el-button>
                <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='6'&& scope.row.endTime > time&&scope.row.payStatus === '1'" @click="handleShelves(scope.row.activityId,scope.row.status)">上架</el-button>
                <el-button class="check" style="padding : 0 ;" type="text" v-if="(scope.row.status==='6'|| (scope.row.status==='5'&& scope.row.endTime < time )) && scope.row.payStatus==='1'" @click="applyAccounts(scope.$index,scope.row.activityId)">申请结算</el-button>
                <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status==='7'" @click="cancelAccounts(scope.$index,scope.row.activityId)">取消结算</el-button>
                <!--<el-button class="check" style="padding : 0 ;" type="text" @click="publish(scope.$index,scope.row.activityId)">克隆活动</el-button>-->
                <!--<el-button class="check" style="padding : 0 ;" type="text" @click="handleCancel(scope.$index,scope.row.activityId)">删除任务</el-button>-->
                <!--<el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.status ==='2' || scope.row.status==='4'" @click="handleCancel(scope.$index,scope.row.activityId)">取消发布</el-button>-->
                <el-button class="check" style="padding : 0 ;" type="text" v-if="scope.row.payStatus==='0'" @click="toPay(scope.$index,scope.row.activityId)">去支付</el-button>
                <!-- <el-button class="check" style="padding : 0 ;" type="text" @click="changeKeys(scope.$index,scope.row.activityId)">修改关键词</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div v-if="mask" @click="close" class="mask">
            <img :src=" imageDomain + bigImg"  />
        </div>
    </div>
</template>
<script>
import { getActivity, getDetail, applyPay, changeStatus ,cancelPay } from "@/api/activity";
import SearchBar from "@/components/searchBar";
import userPhoto from "@/assets/404_images/fail.png";
import { parseTime } from "@/utils";
export default {
  name: "group",
  components: {
    SearchBar
  },
  data() {
    return {
      loading: false,
      activity: {},
      tableData: [],
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
      mask: false,
      imageDomain: process.env.IMAGE_DOMAIN, //获取图片的外链域名
      errorImg: 'this.src="' + userPhoto + '"',
      failImg: userPhoto,
      time: ""
    };
  },
  mounted() {
    this.activity = this.$store.state.searchBar.group.activity;
    this.currentPage = this.$store.state.searchBar.group.currentPage;
    this.pageSize = this.$store.state.searchBar.group.pageSize;
    this.getData();
    let now = new Date();
    this.time = parseTime(now);
    console.log('this.activity ',this.activity)
  },
  methods: {
    //请求数据
    getData() {
      // console.log(form);
      let formData = new FormData();
      let reg = /^[0-9]*$/;
      if (reg.test(this.activity.EQ_activityCode)) {
        formData.append("EQ_activityCode", this.activity.EQ_activityCode);
      } else {
        formData.append("EQ_activityCode", "");
      }
      formData.append("EQ_activityStatus", this.activity.EQ_activityStatus);
      let start = "";
      let end = "";
      if (this.activity.GT_activityEndTime !== null) {
        start = this.activity.GT_activityEndTime;
      }
      if (this.activity.LT_activityStartTime !== null) {
        end = this.activity.LT_activityStartTime;
      }
      formData.append("EQ_tryoutMerchantShop.shopId", this.activity.shopId);
      formData.append("EQ_activityType", this.activity.EQ_activityType);
      formData.append("GT_activityEndTime", start);
      formData.append("LT_activityStartTime", end);
      formData.append("currentPage", this.currentPage);
      formData.append("pageSize", this.pageSize);
      this.loading = true;
      let dataStorage = {
        activity: {
          ...this.activity
        },
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      console.log('this.activity',this.activity)
      this.$store.commit("saveGroup", dataStorage);
      getActivity(formData).then(res => {
        this.loading = false;
        this.tableData = res.data.data;
        this.totalPages = res.data.totalPages;
        this.totalElements = res.data.totalElements;
      });
    },
    //根据搜索条件获取订单列表
    getSearchData(res) {
      console.log('res',res);
      // this.activity.EQ_platformType =
      //   res.platformType === undefined ? "" : res.platformType;
      this.activity.groupActivityType =
        res.groupActivityType === undefined ? "" : res.groupActivityType;
      this.activity.EQ_activityStatus =
        res.EQ_activityStatus === undefined ? "" : res.EQ_activityStatus;
      this.activity.shopId =
        res.EQ_activityShop === undefined ? "" : res.EQ_activityShop;
      this.activity.EQ_activityCode =
        res.activityCode === undefined ? "" : res.activityCode;
      // this.currentPage = 1 ;
      console.log(this.activity);
      this.getData();
    },
    //获取活动详情数据
    detail(index, order) {
      getDetail(order).then(res => {
        if (res.data.status === "000000000") {
          this.activityDetail = res.data.data;
          this.$router.push({
            path: "/freeManage/publish/flow_step1",
            query: { editor: "2", order: order }
          });
        }
      });
    },
    //去支付
    toPay(index, order) {
      this.$router.push({ name: "FlowPay", params: { id: order } });
    },

    //申请结算
    applyAccounts(index, id) {
      this.loading = true;
      applyPay(id).then(res => {
        this.loading = false;
        if (res.data.status === "000000000") {
          this.$message({
            message: "申请结算成功，请稍后确认",
            center: true,
            type: "success",
            duration: 1000
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      });
    },
    //取消结算
    cancelAccounts(index, id) {
      this.loading = true;
      cancelPay(id).then(res => {
        this.loading = false;
        if (res.data.status === "000000000") {
          this.$message({
            message: "取消结算成功，请稍后确认",
            type: "success",
            center: true,
            duration: 1000
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      });
    },
    //修改指定试用发布内容
    editor(index, order, payStatus) {
      this.$router.push({
        path: "/freeManage/publish/flow_step1",
        query: { editor: "1", order: order, payStatus: payStatus }
      });
      // console.log(order) ;
    },
    //上架/下架操作
    handleShelves(id, status) {
      let formData = new FormData();
      formData.append("activityId", id);
      formData.append("activityStatus", status);
      this.loading = true;
      changeStatus(formData).then(res => {
        this.loading = false;
        if (res.data.status === "000000000") {
          this.$message({
            message: "操作成功",
            type: "success",
            center: true,
            duration: 1000
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      });
    },
    //查看大图
    showImg(url) {
      this.mask = true;
      this.bigImg = url;
    }
  }
};
</script>
<style scoped lang="scss">
@import "src/styles/activityTable.scss";
</style>