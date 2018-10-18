<template>
  <div class="goods-coupon-list tableBox" v-loading="loading"  element-loading-text="拼命加载中">
    <div class="search">
      <el-select size="mini" v-model="listStatus" clearable >
        <el-option v-for="item in statusList"
                   :key="item.value"
                   :label="item.name"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-input  v-model.trim="goodsCode" :maxlength="20" placeholder="请输入商品编号" size="mini" clearable ></el-input>
      <el-button type="primary" round size="mini" @click="currentPage =1;getList()">搜索</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="name" label="优惠券名称" ></el-table-column>
      <el-table-column prop="parValue" label="面额（元）" width="80"></el-table-column>
      <el-table-column prop="productResDto" label="可用商品" width="256">
        <template slot-scope="scope">
          <div class="goodsWrap" >
            <img v-if="scope.row.productResDto.mainImageUrl !== ''&& scope.row.productResDto.mainImageUrl !== undefined &&
            scope.row.productResDto.mainImageUrl !== null" :src="imageDomain + scope.row.productResDto.mainImageUrl" :onerror="errorImg">
            <img :src="failImg" v-else>
            <div class="goodsContent">
              <div class="goodsTitle">{{scope.row.productResDto.productName}}</div>
              <div class="goodsCode">商品编号：{{scope.row.productResDto.code}}</div>
              <el-button v-if="scope.row.productNum > 1" type="text" @click="getMore(scope.row.activityId)">查看更多</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="推广渠道" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.channel === '1'">商品公开券</span>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="182">
        <template slot-scope="scope">
          <span>{{scope.row.activityStartTime}}<br/> ~<br/>{{scope.row.activityEndTime}}</span>
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
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-button type="info" size="mini" class="status_btn" v-if="scope.row.status === '1' && (time > scope.row.activityEndTime)">已结束</el-button>
          <el-button type="success" size="mini" class="status_btn" v-else-if="scope.row.status === '1' && scope.row.totalQuantity-0 > scope.row.totallyGet-0">领取中</el-button>
          <el-button type="danger" size="mini" class="status_btn" v-else-if="scope.row.status === '1' && (scope.row.totalQuantity === scope.row.totallyGet)">已领完</el-button>
          <el-button type="info" size="mini" class="status_btn" v-if="scope.row.status === '0'">已结束</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
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
    <div class="block2">
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
    <!--<div v-if="mask" @click="close" class="mask">-->
      <!--<img :src=" imageDomain + bigImg"  />-->
    <!--</div>-->
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
             <span>推广渠道：<span v-if="useCoupon.channel === '1'">商品公开券</span>
             <span v-if="useCoupon.channel === '2'">商品收藏券</span></span></p>
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
          <!-- <p v-if="useCoupon.totallyGet !== null && useCoupon.totallyGet !== 0">{{(useCoupon.totallyUsed-0)/(useCoupon.totallyGet-0).toFixed(2)}}%</p> -->
          <p>{{useRage}}%</p>
        </li>
        <li>
          <p>客单价(元)</p>
          <!-- <p v-if="useCoupon.totallyPayNum !== null && useCoupon.totallyPayNum !== 0">{{(useCoupon.totallyPayMoney-0)/(useCoupon.totallyGet-0).toFixed(2)}}</p> -->
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
        <el-form-item  labelWidth="130px" label="面额（元）：" prop="parValue">
          <el-col :span="8">
            <el-input  size="small" v-model="form.parValue"  :disabled="true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="使用条件：" prop="needAmount">
          <el-col :span="12">
            <span>满 </span><el-input style="width:50%" type="number" :maxlength="10" size="small" v-model.trim="form.needAmount" :disabled="true"></el-input><span> 元可用</span>
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
        <el-form-item   labelWidth="130px"  label="发行张数：" >
          <el-col :span="8">
            <el-input  type="number" :maxlength="6" size="small" v-model.trim="form.totalQuantity"  :disabled="isOver"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item labelWidth="130px" label="每人限额：" >
          <el-col :span="8">
            <el-input  size="small"  v-model="form.limitQuantity"  :disabled="true"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="可用商品：" >
          <div class="goodsWrap" style="justify-content: left">
            <img v-if="form.productResDto.mainImageUrl !== ''|| form.productResDto.mainImageUrl !== undefined" :src="imageDomain + form.productResDto.mainImageUrl"
                                :onerror="errorImg">
            <img :src="failImg" v-else>
            <div class="goodsContent">
              <div class="goodsTitle">{{form.productResDto.productName}}</div>
              <div class="goodsCode">商品编号：{{form.productResDto.code}}</div>
              <span v-if="form.productNum > 1" class="tips">仅展示一个商品，其余商品可前往优惠券列表查看本活动全部商品</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="!isOver">
        <el-button type="primary" @click="yesAddCouponData">发 布</el-button>
        <el-button plain @click="addCouponData = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看优惠券可用商品" :visible.sync="checkVisible" width="70%" center :show-close="false">
      <el-table
        :data="goodsList"
        tooltip-effect="dark"
        style="width: 100%"
        border>
        <el-table-column
          label="商品名称">
          <template slot-scope="scope">
            <div class="itemContent">
              <div class="img_wrap" v-if="scope.row.mainImageUrl !== ''|| scope.row.mainImageUrl !== undefined">
                <img v-if="scope.row.mainImageUrl !== ''|| scope.row.mainImageUrl !== undefined" :src="imageDomain + scope.row.mainImageUrl"
                      :onerror="errorImg">
                <img :src="failImg" v-else>
              </div>
              <div class="content">
                <div class="name">{{scope.row.productName}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          label="商品编码"
          width="140">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="商品库存"
          width="120">
        </el-table-column>
        <el-table-column
          prop="price"
          label="商品价格（元）"
          width="100">
        </el-table-column>
      </el-table>
      <div class="block2">
        <el-pagination
          @size-change="handleSubSizeChange"
          @current-change="handleSubCurrentChange"
          :current-page.sync="subCurrentPage"
          :page-sizes="[10]"
          :page-size="subPageSize"
          :pager-count="5"
          layout=" sizes, prev, pager, next, jumper"
          :total="subTotalElements">
        </el-pagination>
        <span class="totalItems">共{{ subTotalPages }}页，{{ subTotalElements }}条记录</span>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button type="info" @click="checkVisible = false">关闭</el-button>
      </div>
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
import userPhoto from "@/assets/404_images/fail.png";
import {
  couponList,
  getUseCoupon,
  getOverCoupon,
  seeCoupon,
  updateContent,
  couponGoodsList
} from "@/api/merchant";
export default {
  name: "goods-coupon-list",
  data() {
    return {
      title: "",
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
      goodsCode: "",
      tableData: [],
      imageDomain: process.env.IMAGE_DOMAIN,
      errorImg: 'this.src="' + userPhoto + '"',
      failImg: userPhoto,
      pageSize: 10,
      currentPage: 1,
      totalPages: 0,
      totalElements: 0,
      // mask: false,
      // bigImg: "",
      loading: false,
      showCouponData: false,
      useCoupon: {},
      useRage:"",
      usePrice:"",
      addCouponData: false,
      form: {
        productResDto: {
          mainImageUrl: "",
          productName: "",
          code: ""
        }
      },
      isOver: false,
      goodsList: [],
      checkVisible: false,
      subTotalElements: 0,
      subTotalPages: 0,
      subCurrentPage: 1,
      subPageSize: 10,
      goodsId: '',
      finishCoupon:false,
      finishCouponId:"",
      finishCouponStatus:""
    };
  },
  mounted() {
    this.time = parseTime(new Date());
    this.getList();
  },
  methods: {
    getMore(id) {
      this.checkVisible = true;
      this.goodsId = id ;
      this.moreList()
    },
    moreList(){
      let formData = new FormData();
      formData.append("EQ_ybCouponActivity.activityId", this.goodsId);
      formData.append("currentPage", this.subCurrentPage);
      formData.append("pageSize", this.subPageSize);

      couponGoodsList(formData).then(res => {
        if (res.data.status === "000000000") {
          this.goodsList = res.data.data;
          this.subTotalPages = res.data.totalPages;
          this.subTotalElements = res.data.totalElements;
        }
        // console.log('res',res)
      });
    },
    // 增加优惠券数量
    amendCoupon(id, num) {
      seeCoupon(id).then(res => {
        if (res.data.status === "000000000") {
          this.title = "增加优惠券";
          this.isOver = false;
          this.addCouponData = true;
          this.form = res.data.data;
          this.totalQuantity = res.data.data.totalQuantity;
        }
      });
      // updateContent(id,200).then(res =>{
      //   // if(res.data.status === "")
      // })
    },
    yesAddCouponData() {
      if (
        this.totalQuantity > this.form.totalQuantity ||
        this.totalQuantity === this.form.totalQuantity
      ) {
        this.$message({
          message: "新增优惠券数必须大于原始优惠券数",
          type: "error",
          center: true
        });
        this.form.totalQuantity = this.totalQuantity;
        return false;
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
    // 修改优惠券状态
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
      getOverCoupon(id, status).then(res => {
        if (res.data.status === "000000000") {
          this.getList();
        }
      });
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
      formData.append("EQ_type", "2");
      formData.append("EQ_activityType", this.listStatus);
      formData.append("EQ_productCode", this.goodsCode);
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

    getData(val) {
      this.showCouponData = true;
      getUseCoupon(val).then(res => {
        if (res.data.status === "000000000") {
          this.useCoupon = res.data.data;
          if(this.useCoupon.totallyGet !== 0 && this.useCoupon.totallyGet !== null && this.useCoupon.totallyUsed !== 0 && this.useCoupon.totallyUsed !== null){
            this.useRage = ((this.useCoupon.totallyUsed-0)/(this.useCoupon.totallyGet-0)).toFixed(2);

          }else{
            this.useRage = "0";

          }
          if(this.useCoupon.totallyPayNum !== 0 && this.useCoupon.totallyPayNum !== null && this.useCoupon.totallyPayMoney !== 0 && this.useCoupon.totallyPayMoney !== null){
            this.usePrice = ((this.useCoupon.totallyPayMoney-0)/(this.useCoupon.totallyPayNum-0)).toFixed(2);
          }else{
            this.usePrice = "0";

          }
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    handleSubSizeChange(val) {
      this.subPageSize = val;
      this.moreList();
    },
    handleSubCurrentChange(val) {
      this.subCurrentPage = val;
      this.moreList();

    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "src/styles/table.scss";

.search {
  margin-bottom: 0.2rem;
  .el-select,
  .el-input {
    margin-right: 0.4rem;
  }
  .el-input {
    width: 3rem;
  }
}
.el-table {
  width: 100% !important;
  margin: 0;
  .status_btn{
    padding: 0.1rem 0.15rem!important;
  }
}
// .el-table {
// width: 100% !important;
// margin: 0;
.goodsWrap {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  img {
    width: 1rem;
    height: 1rem;
    margin-right: 0.2rem;
  }
  .goodsContent {
    display: flex;
    flex: 1;
    flex-direction: column;
    color: #333;
    font-size: 0.14rem;
    line-height: 0.3rem;
  }
}
// }
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
.el-table {
  border-radius: 0.05rem;
  border-color: #aaa;
  margin-bottom: 0.3rem;
  .itemContent {
    margin: 0 auto !important;
    border: 0;
    padding: 0;
    .content {
      margin-bottom: 0 !important;
    }
  }
}
.itemContent {
  margin: 0.5rem 0;
  /*width: 80%;*/
  display: flex;
  flex-direction: row;
  border: 1px solid #aaa;
  padding: 0.2rem;
  .img_wrap {
    width: 1rem;
    height: 1rem;
    display: block;
    margin: auto;
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
  .content {
    /*width: 200px;*/
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 0.3rem;
    margin-bottom: 0 !important;
    justify-content: center;
    align-items: center;
    text-align: left;
    .name,
    .encoding,
    .price {
      width: 100%;
      font-size: 0.18rem;
      line-height: 0.3rem;
    }
  }
  .addGoods {
    width: 1rem;
    height: 1rem;

    .svg-icon {
      width: 100%;
      height: 100%;
    }
  }
}
.tips{
  font-size: 0.14rem ;
  color: #999;
}
</style>
