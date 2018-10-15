<template>
  <div class="shop-coupon-list tableBox" v-loading="loading"  element-loading-text="拼命加载中">
    <div class="search">
      <el-select size="mini" v-model="listStatus" clearable>
        <el-option v-for="item in statusList"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" round size="mini" @click="getList">搜索</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="优惠券名称" ></el-table-column>
      <el-table-column prop="parValue" label="面额" ></el-table-column>
      <el-table-column prop="needAmount" label="门槛" >
        <template slot-scope="scope">
          <span>满{{scope.row.needAmount}}元可用</span>
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="推广渠道">
        <template slot-scope="scope">
          <span v-if="scope.row.channel === '1'">店铺公开券</span>
          <span v-if="scope.row.channel === '2'">店铺收藏券</span>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="100">
        <template slot-scope="scope">
        <span>{{scope.row.activityStartTime}}</span>~<span>{{scope.row.activityEndTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalQuantity" label="发行量" width="100"></el-table-column>
      <el-table-column prop="limitQuantity" label="领取量" width="100"></el-table-column>
      <el-table-column prop="useDays" label="使用量" width="100"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1' && scope.row.totalQuantity-0 > scope.row.limitQuantity-0">领取中</span>
          <span v-if="scope.row.status === '1' && scope.row.totalQuantity === scope.row.limitQuantity">已领完</span>
          <span v-if="scope.row.status === '0'">已结束</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="getData(scope.row.activityId)">数据</el-button>
          <el-button v-if="scope.row.status === '0'" type="text" @click="handleStop">删除</el-button>
          <el-button v-if="scope.row.status === '0'" type="text" @click="handleStop">查看</el-button>
          <el-button v-if="scope.row.status === '1'" type="text" @click="handleStop">结束</el-button>
          <el-button v-if="scope.row.status === '1'" type="text" @click="handelEditor">修改</el-button>
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
      <img :src=" imageDomain + bigImg"  />
    </div>

    <el-dialog
      title="优惠券信息"
      :visible.sync="showCouponData"
      width="60%"
      center>
      <div class="CouponTop">
        <div class="topLeft">
          <p><span>￥</span><span>{{useCoupon.parValue}}</span></p>
          <p>店铺优惠券</p>
        </div>
        <div class="topright">
          <p>{{useCoupon.name}}</p>
          <p><span>发行{{useCoupon.totalQuantity}}张</span>|<span>限领{{useCoupon.limitQuantity}}张/人</span>|<span>推广渠道：<span v-if="useCoupon.channel === '1'">店铺公开券</span><span v-if="useCoupon.channel === '2'">店铺收藏券</span></span></p>
          <p><span>{{useCoupon.activityStartTime}}</span> ~ <span>{{useCoupon.activityEndTime}}</span> 期间内有效</p>
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
          <p v-if="useCoupon.totallyGet !== null && useCoupon.totallyGet !== 0">{{(useCoupon.totallyUsed-0)/(useCoupon.totallyGet-0).toFixed(2)}}%</p>
          <p v-else>0</p>
        </li>
        <li>
          <p>客单价(元)</p>
          <p v-if="useCoupon.totallyPayNum !== null && useCoupon.totallyPayNum !== 0">{{(useCoupon.totallyPayMoney-0)/(useCoupon.totallyGet-0).toFixed(2)}}</p>
          <p v-else>0</p>
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
        <el-button type="primary" @click="showCouponData = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="增发优惠券"
      :visible.sync="addCouponData"
      width="60%"
      center>
      <el-form :model="form" ref="tableData" :rules="formRule" label-position="right">
        <el-form-item   labelWidth="130px"  label="优惠券名称：" prop="name">
          <el-input class="inputInfo" size="small" v-model.trim="form.name" :disabled="true" style="width:50%"></el-input>
          <span>注：该名称仅商家可见</span>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="面额：" prop="parValue">
          <el-select  size="small" clearable v-model="form.parValue"  :disabled="true">
            <el-option
              v-for="item in parValueList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="使用条件：" prop="needAmount">
          <span>满 </span><el-input style="width:50%" type="number" :maxlength="10" size="small" v-model.trim="form.needAmount" :disabled="true"></el-input><span> 元可用</span>
        </el-form-item>
        <el-form-item  labelWidth="130px"  label="发行活动时间：" >
          <el-col :span="8">
            <el-form-item prop="activityStartTime" style="margin: 0;">
              <el-date-picker  value-format="yyyy-MM-dd 00:00:00" size="small"
                    v-model="form.activityStartTime" clearable type="date" :disabled="true" >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align:center">
            <span> 至 </span>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="activityEndTime" style="margin: 0;">
              <el-date-picker size="small" v-model="form.activityEndTime"  clearable
                              type="date"  value-format="yyyy-MM-dd 23:59:59" :disabled="true" >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="发行张数：" prop="totalQuantity">
          <el-input style="width:50%" type="number" :maxlength="6" size="small" v-model.trim="form.totalQuantity" placeholder="请输入发行张数"></el-input>
        </el-form-item>
        <el-form-item labelWidth="130px" label="每人限额：" prop="limitQuantity">
          <el-select  size="small" clearable v-model="form.limitQuantity"  filterable :disabled="true">
            <el-option
              v-for="item in limitQuantityList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCouponData = false">发 布</el-button>
        <el-button  @click="addCouponData = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userPhoto from "@/assets/404_images/fail.png";
import { couponList,getUseCoupon } from "@/api/merchant";

export default {
  name: "shop-coupon-list",
  data() {
    return {
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
      listStatus: "",
      tableData: [],
      imageDomain: process.env.IMAGE_DOMAIN,
      errorImg: 'this.src="' + userPhoto + '"',
      failImg: userPhoto,
      pageSize: 10,
      currentPage: 1,
      totalPages: 0,
      totalElements: 0,
      mask: false,
      bigImg: "",
      loading: false,
      showCouponData: false,
      useCoupon:{},
      addCouponData: false,
      formRule: {
        name: [
          { required: true, message: "请选择没人使用限额", trigger: "change" }
        ],
        parValue: [
          { required: true, message: "请选择没人使用限额", trigger: "change" }
        ],
        limitQuantity: [
          {
            required: true,
            message: "请选择没人使用限额张数",
            trigger: "change"
          }
        ]
      },
      form: {
        name: "哈哈出行",
        price: "10",
        conditions: "满20可用",
        methods: "店铺收藏券",
        activityTime: "2018-2019",
        givenMount: "100",
        getMount: "20",
        useMount: "20",
        status: "领取中",
        parValue:"6",
        needAmount:"8",
        activityStartTime:"2018-01-01 00:00:00",
        activityEndTime:"2018-01-02 23:59:59",
        totalQuantity:"10",
        limitQuantity:"1"
      },
      parValueList: [
        { name: "2元", id: "2" },
        { name: "3元", id: "3" },
        { name: "4元", id: "4" },
        { name: "5元", id: "5" },
        { name: "6元", id: "6" },
        { name: "7元", id: "7" },
        { name: "8元", id: "8" },
        { name: "9元", id: "9" },
        { name: "10元", id: "10" },
        { name: "15元", id: "15" },
        { name: "20元", id: "20" },
        { name: "30元", id: "30" },
        { name: "40元", id: "40" },
        { name: "50元", id: "50" },
        { name: "100元", id: "100" },
        { name: "200元", id: "200" },
        { name: "300元", id: "300" },
        { name: "999元", id: "999" }
      ],
      limitQuantityList: [
        { name: "1张", id: "1" },
        { name: "2张", id: "2" },
        { name: "3张", id: "3" }
      ]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let formData = new FormData();
      formData.append("EQ_type", "1");
      formData.append("EQ_activityType", this.listStatus);
      couponList(formData).then(res => {

        if(res.data.status === "000000000"){
          this.tableData = res.data.data
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalElements
        }
      });
    },
    getData() {

    },
    handleStop() {

    },
    handelEditor() {

    },
    getData(val) {
      this.showCouponData = true;
      getUseCoupon(val).then( res =>{
        if(res.data.status === "000000000"){
          this.useCoupon = res.data.data
          console.log('res',this.useCoupon)
        }

      })
    },
    handleStop() {},
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
}
.CouponTop {
  width: 90%;
  background-color: #f2f1f1;
  margin: 0.1rem auto;
  padding: 0.1rem;
  .topLeft {
    width: 22%;
    margin-right: 1%;
    display: inline-block;
    padding-left: 0.5rem;
    p:nth-child(1) {
      font-size: 0.4rem;
      color: red;
    }
    p:nth-child(2) {
      font-size: 0.15rem;
      color: red;
    }
    p {
      display: block;
    }
  }
  .topright {
    display: inline-block;
    width: 75%;
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
    width: 33%;
    p:nth-child(1) {
      line-height: 0.5rem;
    }
    p:nth-child(2) {
      // line-height: 0.5rem;
      font-size: 0.4rem;
    }
    p {
      display: block !important;
      margin-bottom: 0 !important;
      // padding-left: 1rem;
      text-align: center;
    }
  }
}
</style>
