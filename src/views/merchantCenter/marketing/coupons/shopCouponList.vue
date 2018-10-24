<template>
  <div class="shop-coupon-list tableBox" v-loading="loading"  element-loading-text="拼命加载中">
    <div class="search">
      <el-select size="mini" v-model="listStatus" clearable >
        <el-option v-for="item in statusList"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-select size="mini" v-model="channelType" clearable >
        <el-option v-for="item in channelList"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" round size="mini" @click="currentPage =1;getList()">搜索</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="优惠券名称" ></el-table-column>
      <el-table-column prop="parValue" label="面额（元）" width="100"></el-table-column>
      <el-table-column prop="needAmount" label="门槛" width="130">
        <template slot-scope="scope">
          <span>满{{scope.row.needAmount}}元可用</span>
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="推广渠道" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.channel === '1'">店铺公开券</span>
          <span v-if="scope.row.channel === '2'">店铺收藏券</span>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="182">
        <template slot-scope="scope">
        <span>{{scope.row.activityStartTime}}<br/> ~<br/>{{scope.row.activityEndTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用时间" width="182">
        <template slot-scope="scope" >
          <span v-if="scope.row.channel === '1'">
            <span>{{scope.row.useStartTime}}<br/> ~<br/>{{scope.row.useEndTime}}</span>
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期限（天）" width="182">
        <template slot-scope="scope">
          <span v-if="scope.row.channel === '2'">{{scope.row.useDays}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalQuantity" label="发行量" width="80"></el-table-column>
      <el-table-column prop="totallyGet" label="领取量" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.totallyGet !== null">{{scope.row.totallyGet}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="totallyUsed" label="使用量" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.totallyUsed !== null">{{scope.row.totallyUsed}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-button type="info" size="mini" class="status_btn" v-if="scope.row.status === '1' && (time > scope.row.activityEndTime)">已结束</el-button>
          <el-button type="success" size="mini" class="status_btn" v-else-if="scope.row.status === '1' && scope.row.totalQuantity-0 > scope.row.totallyGet-0">领取中</el-button>
          <el-button type="danger" size="mini" class="status_btn" v-else-if="scope.row.status === '1' && (scope.row.totalQuantity === scope.row.totallyGet)">已领完</el-button>
          <el-button type="info" size="mini" class="status_btn" v-if="scope.row.status === '0'">已结束</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="getData(scope.row.activityId)">数据</el-button>
          <el-button v-if="scope.row.status === '0'" type="text" @click="overCoupon(scope.row.activityId,'2')">删除</el-button>
          <el-button v-if="scope.row.status === '0'" type="text" @click="seeCouponData(scope.row.activityId)">查看</el-button>
          <span v-if="scope.row.status === '1' && (time > scope.row.activityEndTime)">
            <el-button type="text" @click="overCoupon(scope.row.activityId,'2')">删除</el-button>
            <el-button type="text" @click="seeCouponData(scope.row.activityId)">查看</el-button>
          </span>
          <span v-else-if="scope.row.status === '1'">
            <el-button v-if="scope.row.status === '1'" type="text" @click="overCoupon(scope.row.activityId,scope.row.status)">结束</el-button>
            <el-button v-if="scope.row.status === '1'" type="text" @click="amendCoupon(scope.row.activityId)">修改</el-button>
          </span>

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
    <el-dialog
      title="优惠券信息"
      :visible.sync="showCouponData"
      width="50%"
      center>
      <div class="CouponTop">
        <div class="topLeft">
          <p><span>￥</span><span>{{useCoupon.parValue}}</span></p>
          <p>店铺优惠券</p>
        </div>
        <div class="topright">
          <p>{{useCoupon.name}}</p>
          <p><span>发行{{useCoupon.totalQuantity}}张</span> | <span>限领{{useCoupon.limitQuantity}}张/人</span> |
            <span>推广渠道：<span v-if="useCoupon.channel === '1'">店铺公开券</span><span v-if="useCoupon.channel === '2'">店铺收藏券</span></span></p>
          <p v-if="useCoupon.channel === '1'"><span>{{useCoupon.useStartTime}}</span> ~ <span>{{useCoupon.useEndTime}}</span> 期间内有效</p>
          <p v-else> 使用有效期：{{useCoupon.useDays}}天</p>
        </div>
      </div>
      <ul class="CouponCenter">
        <li>
          <p>累计领取数</p>
          <p v-if="useCoupon.totallyGet !== null ">{{useCoupon.totallyGet}}</p>
          <p v-else>{{0}}</p>
        </li>
        <li>
          <p>累计使用数</p>
          <p v-if="useCoupon.totallyUsed !== null">{{useCoupon.totallyUsed}}</p>
          <p v-else>0</p>
        </li>
        <li>
          <p>累计使用率</p>
          <p>{{useRage*100}}%</p>
        </li>
        <li>
          <p>客单价(元)</p>
          <p>{{usePrice}}</p>
        </li>
        <li>
          <p>累计支付订单数</p>
          <p v-if="useCoupon.totallyPayNum !== null">{{useCoupon.totallyPayNum}}</p>
          <p v-else>0</p>
        </li>
        <li>
          <p>累计支付金额(元)</p>
          <p v-if="useCoupon.totallyPayMoney !== null">{{useCoupon.totallyPayMoney}}</p>
          <p v-else>0</p>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showCouponData = false">知道了</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="addCouponData"
      width="60%"
      center>
      <el-form :model="form" ref="tableData" label-position="right">
        <el-form-item   labelWidth="130px"  label="优惠券名称：" prop="name">
          <el-input class="inputInfo" size="small" v-model.trim="form.name" :disabled="true" style="width:50%"></el-input>
          <span class="tips">注：该名称仅商家可见</span>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="面额：" prop="parValue">
          <el-col :span="10">
            <el-input style="width:80%;" size="small" v-model.trim="form.parValue"  :disabled="true"></el-input><span> 元</span>
          </el-col>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="使用条件：" prop="needAmount">
          <el-col :span="12">
          <span>满 </span>
            <el-input style="width:50%" type="number" :maxlength="10" size="small" v-model.trim="form.needAmount" :disabled="true"></el-input>
          <span> 元可用</span>
          </el-col>

        </el-form-item>
        <el-form-item  labelWidth="130px"  label="发行活动时间：" >
          <el-col :span="10">
            <el-form-item prop="activityStartTime" style="margin: 0;">
              <el-input size="small" v-model="form.activityStartTime" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align:center">
            <span> 至 </span>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="activityEndTime" style="margin: 0;">
              <el-input size="small" v-model="form.activityEndTime" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item  labelWidth="130px"  label="使用时间："  v-if="form.channel === '1'">
          <el-col :span="10">
            <el-form-item prop="useStartTime" style="margin: 0;">
              <el-input size="small" v-model="form.useStartTime" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align:center">
            <span> 至 </span>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="useEndTime" style="margin: 0;">
              <el-input size="small" v-model="form.useEndTime" :disabled="true" ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item  labelWidth="130px"  label="有效期限：" v-if="form.channel === '2'">
          <el-col :span="10">
          <el-input style="width:80%;" size="small" v-model="form.useDays" :disabled="true" ></el-input><span> 天</span>
          </el-col>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="发行张数：" prop="totalQuantity">
          <el-col :span="8">
            <el-input  :maxlength="5" size="small" v-model.trim="form.totalQuantity" @change="checkInput(form.totalQuantity)" :disabled="isOver"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item labelWidth="130px" label="每人限额：" prop="limitQuantity">
          <el-col :span="8">
            <el-input  size="small" v-model="form.limitQuantity"   :disabled="true"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="!isOver">
        <el-button type="primary" @click="yesAddCouponData">发 布</el-button>
        <el-button plain @click="addCouponData = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      center
      title="提示"
      :visible.sync="finishCoupon"
      width="30%">
      <span>您确定要结束此优惠券活动吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="yesFinishCoupon">确 定</el-button>
        <el-button @click="noFinishCoupon">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import { int } from "@/utils/validate";
import userPhoto from "@/assets/404_images/fail.png";
import {
  couponList,
  getUseCoupon,
  getOverCoupon,
  seeCoupon,
  updateContent
} from "@/api/merchant";

export default {
  name: "shop-coupon-list",
  data() {
    return {
      title: "",
      isOver: false,
      totalQuantity: "",
      statusList: [
        {
          name: "全部",
          value: ""
        },
        {
          name: "领取中",
          value: "1"
        },
        {
          name: "已领完",
          value: "2"
        },
        {
          name: "已结束",
          value: "3"
        }
      ],
      channelList: [{ name: "店铺公开券", value: "1" }, { name: "店铺收藏券", value: "2" }],
      listStatus: "",
      channelType: "",
      tableData: [],
      imageDomain: process.env.IMAGE_DOMAIN,
      errorImg: 'this.src="' + userPhoto + '"',
      failImg: userPhoto,
      pageSize: 10,
      currentPage: 1,
      totalPages: 0,
      totalElements: 0,
      loading: false,
      showCouponData: false,
      useCoupon: {},
      useRage:"",
      usePrice:"",
      addCouponData: false,
      form: {},
      finishCoupon:false,
      finishCouponId:"",
      finishCouponStatus:"",
      time:""
    };
  },
  mounted() {
    this.time = parseTime(new Date());
    this.getList();
  },
  methods: {
    // 增加优惠券数量
    amendCoupon(id) {
      seeCoupon(id).then(res => {
        if (res.data.status === "000000000") {
          this.title = "增加优惠券";
          this.isOver = false;
          this.addCouponData = true;
          this.form = res.data.data;
          this.totalQuantity = res.data.data.totalQuantity;
        }
      });
    },
    //校验修改优惠券数据
    checkInput(val){
      if (!int(val)) {
        this.$message({
          message: '请填写大于0的整数',
          type: 'error',
          center: 'true'
        });
        this.form.totalQuantity = this.totalQuantity;
      }
      if (val > 50000) {
        this.$message({
          message: "优惠券发行张数最多只能有50000张",
          type: 'error',
          center: 'true'
        });
        this.form.totalQuantity = '50000';

      }
    },
    yesAddCouponData() {
      if (this.totalQuantity > this.form.totalQuantity || this.totalQuantity === this.form.totalQuantity) {
        this.$message({
          message: "新增优惠券数必须大于原始优惠券数",
          type: "error",
          center: true
        });
        this.form.totalQuantity = this.totalQuantity;
        return false
      } else if(this.form.totalQuantity-0 > 50000){
        this.$message({
          message: "新增优惠券数必须小于50000",
          type: "error",
          center: true
        });
        return false
      } else {
        updateContent(this.form.activityId, this.form.totalQuantity).then(
          res => {
            if (res.data.status === "000000000") {
              this.$message({
                message: "优惠券增加成功",
                type: "success",
                center: true
              });
              this.addCouponData = false;
              this.getList();
            }
          }
        );
      }
    },
    // 查看优惠券信息
    seeCouponData(id) {
      seeCoupon(id).then(res => {
        if (res.data.status === "000000000") {
          this.title = "查看优惠券";
          this.isOver = true;
          this.addCouponData = true;
          this.form = res.data.data;
        }
      });
    },
    // 结束 或者 删除 优惠券
    overCoupon(id, status) {
      if (status === "1") {
        this.finishCoupon = true;
        this.finishCouponId = id;
        this.finishCouponStatus = "0";
      } else if (status === "2") {
        status = "2";
        getOverCoupon(id, status).then(res => {
          if (res.data.status === "000000000") {
            this.$message({
              message: "此优惠券活动已删除",
              type: "success",
              center: true
            });
            this.getList();
          }
        });
      }
    },
    //  结束优惠券
    yesFinishCoupon(){
      getOverCoupon(this.finishCouponId, this.finishCouponStatus).then(res => {
          if (res.data.status === "000000000") {
            this.$message({
              message: "此优惠券活动已结束",
              type: "success",
              center: true
            });
            this.finishCoupon = false;
            this.getList();
          }
        });
    },
    noFinishCoupon(){
      this.finishCoupon = false;
    },
    getList() {
      let formData = new FormData();
      formData.append("EQ_type", "1");
      formData.append("EQ_channel", this.channelType);
      formData.append("EQ_activityType", this.listStatus);
      formData.append("currentPage", this.currentPage);
      formData.append("pageSize", this.pageSize);
      this.time = parseTime(new Date());
      couponList(formData).then(res => {
        if (res.data.status === "000000000") {
          this.tableData = res.data.data;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalElements;
        }
      });
    },

    //  查看数据
    getData(val) {
      this.showCouponData = true;
      getUseCoupon(val).then(res => {
        if (res.data.status === "000000000") {
          this.useCoupon = res.data.data;
          if(this.useCoupon.totallyGet !== 0 && this.useCoupon.totallyGet !== null &&
            this.useCoupon.totallyUsed !== 0 && this.useCoupon.totallyUsed !== null){
            this.useRage = (((this.useCoupon.totallyUsed-0)/(this.useCoupon.totallyGet-0))*100).toFixed(2);

          }else{
            this.useRage = "0";

          }
          if(this.useCoupon.totallyPayNum !== 0 && this.useCoupon.totallyPayNum !== null &&
            this.useCoupon.totallyPayMoney !== 0 && this.useCoupon.totallyPayMoney !== null){
            this.usePrice = (this.useCoupon.totallyPayMoney-0)/(this.useCoupon.totallyPayNum-0);
            if (this.usePrice+''.indexOf('.') !== -1) {
              this.usePrice = this.usePrice.toFixed(2) ;
            }
          }else{
            this.usePrice = "0";

          }
        }
      });
    },
    handelEditor() {
      this.addCouponData = true;
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
@import "src/styles/table.scss";

.search {
  margin-bottom: 0.2rem;
  .el-select {
    margin-right: 0.4rem;
  }
}
.el-table {
  width: 100% !important;
  margin: 0;
  .status_btn{
    padding: 0.1rem 0.15rem!important;
  }
}
.CouponTop {
  width: 90%;
  background-color: #f2f1f1;
  margin: 0.1rem auto;
  padding: 0.1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .topLeft {
    width: 22%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 0.2rem;

    p:nth-child(1) {
      font-size: 0.34rem;
      color: red;
    }
    p:nth-child(2) {
      font-size: 0.16rem;
      color: red;
    }
    p {
      display: block;
    }
  }
  .topright {
    flex: 1;
    flex-direction: column;
    /*display: inline-block;*/
    /*width: 75%;*/
    p {
      margin-bottom: 0;
      display: block;
    }
  }
}

.CouponCenter {
  width: 90%;
  background-color: #f2f1f1;
  margin: 0.1rem auto;
  padding: 0.1rem;
  li {
    display: inline-block;
    width: 32%;
    p:nth-child(1) {
      line-height: 0.5rem;
    }
    p:nth-child(2) {
      // line-height: 0.5rem;
      font-size: 0.34rem;
    }
    p {
      display: block !important;
      margin-bottom: 0 !important;
      // padding-left: 1rem;
      text-align: center;
    }
  }
}
  .tips{
    font-size: 0.14rem ;
    color: #999;
  }
</style>
