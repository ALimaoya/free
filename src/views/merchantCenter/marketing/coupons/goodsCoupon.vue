<template>
    <div class="goods-coupon new ">
        <h1>商品优惠券信息</h1>
        <el-form :model="form" ref="form" :rules="formRule" label-position="right">
            <el-form-item  labelWidth="130px" label="推广渠道：" >
                <el-radio-group v-model="form.trench" size="small" @change="getTrench">
                    <el-radio  v-for="(item,index) in trenchList" :key="index" :label="item.id" border>{{item.name}}</el-radio>
                </el-radio-group>
                <p >用户可以通过公开渠道主动领取优惠券，如店铺首页、商品详情页等</p>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="优惠券名称：" prop="discountsName">
                <el-input class="inputInfo" :maxlength="15" size="small" v-model.trim="form.discountsName" placeholder="请输入15个字以内的优惠卷名称"></el-input>
            </el-form-item>
            <el-form-item  labelWidth="130px"  label="使用有效期：" prop="receiveEndData">
                <el-date-picker  value-format="yyyy-MM-dd 00:00:00" size="small"
                      v-model="form.activityStartTime" clearable type="date" placeholder="开始时间" 
                      :picker-options="forbidData" >
                </el-date-picker>
                <span class="demonstration2">至</span>
                <el-date-picker size="small" v-model="form.receiveEndData"  clearable
                                type="date"  value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间" 
                                :picker-options="forbidData"  @change="getActivityEndTime(form.receiveEndData)">
                </el-date-picker>
                <p>活动持续{{activityDay}}天</p>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="可用商品：" prop="mayCommodity">
                <el-button v-if="goodsList.length === 0" @click="showDialogVisible">+添加商品</el-button>
                <div v-else-if="goodsList.length < 4">
                  <ul class="shopList">
                    <li v-for="(item,index) in goodsList" :key="index">
                      <div class="itemShop">
                          <div class="img_wrap" v-if="item.mainImageUrl !== ''|| item.mainImageUrl !== undefined">
                            <img v-if="item.mainImageUrl !== ''|| item.mainImageUrl !== undefined" :src="imageDomain + item.mainImageUrl"
                                :onerror="errorImg">
                            <img :src="failImg" v-else>
                          </div>
                          <div class="content">
                            <div class="name">{{item.productName}}</div>
                            <div class="encoding">商品编码：{{item.code}}</div>
                          </div>
                        </div>
                    </li>
                    <span class="goodsCompile" @click="showDialogVisible">编辑</span>
                  </ul>
                </div>
            </el-form-item>
            <el-form-item  labelWidth="130px" label="面额：" prop="denomination">
              <el-select  size="small" clearable v-model="form.denomination"  filterable placeholder="请选择">
                <el-option
                  v-for="item in denominationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="使用条件：" prop="useCondition">
                <span>满 </span><el-input style="width:50%" type="number" :maxlength="10" size="small" v-model.trim="form.useCondition" placeholder="请输入正整数"></el-input><span> 元可用</span>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="发行张数：" prop="ticketNum">
                <el-input style="width:50%" type="number" :maxlength="6" size="small" v-model.trim="form.ticketNum" placeholder="请输入发行张数"></el-input>
            </el-form-item>
            <el-form-item  labelWidth="130px" label="每人限额：" prop="quota">
              <el-select  size="small" clearable v-model="form.quota"  filterable placeholder="请选择">
                <el-option
                  v-for="item in quotaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="inputInfo button" type="primary" size="small" @click="submitForm('form')">创建</el-button>
              <el-button class="inputInfo button"  size="small" @click="resetForm('form')">取消</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" center :show-close="false">
          <div class="search">
            <el-input size="small" :maxlength="40" v-model.trim="search.shopName" placeholder="请输入商品名称"
                      clearable></el-input>
            <el-input size="small" :maxlength="40" v-model.trim="search.goodsCode" placeholder="请输入商品编号"
                      clearable></el-input>
            <el-button type="primary" size="mini" @click="getGoods">搜索</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
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
              label="商品编码："
              width="140">
            </el-table-column>
            <el-table-column
              prop="price"
              label="商品库存："
              width="120">
            </el-table-column>
            <el-table-column
              prop="price"
              label="商品价格："
              width="100">
            </el-table-column>
          </el-table>
          <!-- <el-table :data="tableData"  border>
            <el-table-column prop="activityId"  width="35">
              <template slot-scope="scope">
                <el-checkbox-group v-model="goodsList">
                  <el-checkbox :label='scope.row'></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" >
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
              label="商品编码："
              width="140">
            </el-table-column>
            <el-table-column
              prop="price"
              label="商品库存："
              width="120">
            </el-table-column>
            <el-table-column
              prop="price"
              label="商品价格："
              width="100">
            </el-table-column>
          </el-table> -->

          <div class="block2">
            <el-pagination
              @size-change="handleSubSizeChange"
              @current-change="handleSubCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 15, 20]"
              :page-size="pageSize"
              :pager-count="5"
              layout=" sizes, prev, pager, next, jumper"
              :total="totalElements">
            </el-pagination>
            <span class="totalItems">共{{ totalPages }}页，{{ totalElements }}条记录</span>
          </div>
          <div slot="footer" class="dialog-footer" >
            <p class="tips_warn noteTips">此模块仅展示上架状态商品，可以选择多个商品</p>
            <el-button type="primary" size="mini" @click="chooseGoods">确认选择</el-button>
            <el-button type="text" @click="cancel">取消</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import { int } from "@/utils/validate";
import { getSecondsList } from "@/api/enter";
import userPhoto from "@/assets/404_images/fail.png";
export default {
  data() {
    const validUseCondition = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写优惠券使用条件"));
      } else {
        if (!int(value)) {
          callback(new Error("只能填写正整数"));
        }
        callback();
      }
    };
    const validTicketNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写优惠券发行张数"));
      } else {
        if (!int(value)) {
          callback(new Error("只能填写正整数"));
        }
        if (value > 50000) {
          callback(new Error("优惠券发行张数最多只能有50000张"));
        }
        callback();
      }
    };
    const validValidDeadline = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写优惠券有效期"));
      } else {
        if (!int(value)) {
          callback(new Error("只能填写正整数"));
        }
        if (value > 100) {
          callback(new Error("优惠券有效期最多为100天"));
        }
        if (value < 8) {
          callback(new Error("优惠券有效期最少为7天"));
        }
        callback();
      }
    };
    return {
      imageDomain: process.env.IMAGE_DOMAIN,
      errorImg: 'this.src="' + userPhoto + '"',
      //处理当前时间之前的不能选择
      forbidData: this.endDate(),
      loading: false,
      form: {
        trench: "1",
        discountsName: "",
        activityStartTime: "",
        mayCommodity: [],
        denomination: "",
        useCondition: "",
        ticketNum: "",
        quota: ""
      },
      formRule: {
        discountsName: [
          { required: true, message: "请填写优惠券名称", trigger: "change" }
        ],
        receiveEndData: [
          {
            required: true,
            message: "请选择使用有效期的开始时间和结束时间",
            trigger: "change"
          }
        ],
        denomination: [
          { required: true, message: "请选择没人使用限额", trigger: "change" }
        ],
        useCondition: [
          {
            required: true,
            validator: validUseCondition,
            trigger: "change"
          }
        ],
        ticketNum: [
          {
            required: true,
            validator: validTicketNum,
            trigger: "change"
          }
        ],
        quota: [
          {
            required: true,
            message: "请选择没人使用限额张数",
            trigger: "change"
          }
        ],
        validDeadline: [
          {
            required: true,
            validator: validValidDeadline,
            trigger: "change"
          }
        ]
      },
      activityDay: "0",
      trenchList: [{ name: "公开", id: "1" }],
      denominationList: [
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
      quotaList: [
        { name: "1张", id: "1" },
        { name: "2张", id: "2" },
        { name: "3张", id: "3" }
      ],
      title: "",
      dialogVisible: false,
      search: {
        shopName: "",
        goodsCode: ""
      },
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      goodsList: [],
      // multipleSelection:[]
    };
  },
  methods: {
    handleSelectionChange(val) {
        this.goodsList = val;
        console.log('this.goodsList',this.goodsList)
      },
    //确认选择活动商品
    chooseGoods() {
      if (this.goodsList.length === 0) {
        this.$message({
          message: "请选择活动商品",
          type: "error",
          center: true
        });
      } else {
        for(let i=0; i<this.goodsList.length; i++){
          this.form.mayCommodity.push(this.goodsList[i].id)
        }
        console.log('this.form.mayCommodity',this.form.mayCommodity)
        this.dialogVisible = false;
      }
    },
    cancel() {
      this.dialogVisible = false;
      this.goodsList = [];
      this.search = {
        shopName: "",
        goodsCode: ""
      };
      this.currentPage = 1;
      this.pageSize = 10;
    },
    showDialogVisible() {
      this.title = "选择优惠券商品";
      this.dialogVisible = true;
      this.getGoods();
    },
    getGoods() {
      let formData = new FormData();
      formData.append("EQ_code", this.search.goodsCode);
      formData.append("LIKE_productName", this.search.shopName);
      formData.append("currentPage", this.currentPage);
      formData.append("pageSize", this.pageSize);

      getSecondsList(formData).then(res => {
        if (res.data.status === "000000000") {
          this.tableData = res.data.data;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalElements;
        }
      });
    },
    // 切换方式
    getTrench() {
      this.resetForm("form");
    },
    //提交表格
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.denomination > this.form.useCondition) {
            this.$message({
              message: "使用条件必须大于优惠券面额",
              type: "error",
              center: true
            });
            return false;
          }
        }
      });
    },
    resetForm(formName) {
      this.form.receiveEndData = "";
      this.form.activityStartTime = "";
      this.$refs[formName].resetFields();
    },
    // 计算活动有多少天
    getActivityEndTime() {
      if (this.form.activityStartTime === "") {
        this.$message({
          message: "请先选择活动开始时间",
          type: "error",
          center: true
        });
        this.form.receiveEndData = "";
        return false;
      }
      if (this.form.receiveEndData < this.form.activityStartTime) {
        this.$message({
          message: "结束时间必须晚于开始时间",
          type: "error",
          center: true
        });
        this.form.receiveEndData = "";
        this.form.activityStartTime = "";
        return false;
      }
      let start = new Date(
        this.form.activityStartTime.replace(/-/g, "/")
      ).getTime();
      let end = new Date(this.form.receiveEndData.replace(/-/g, "/")).getTime();
      this.activityDay = Math.ceil((end - start) / 24 / 60 / 60 / 1000);
    },
    //  只能选择当天之后的
    endDate() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      };
    },
    handleSubSizeChange(val) {
      this.pageSize = val;
      this.getGoods();
    },
    handleSubCurrentChange(val) {
      this.currentPage = val;
      this.getGoods();
    }
  }
};
</script>
<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../../styles/new";
.demonstration2 {
  width: 20px;
  margin-right: 0;
  text-align: center;
}
.search {
  width: 100%;
  padding-bottom: 0.2rem;
  height: 50px;
  // border-bottom : 1px solid #aaa ;
  margin-bottom: 0.3rem;
  .el-input {
    width: 30%;
    margin: 0 0.2rem 0.2rem 0;
    float: left;
  }
  .el-button {
    width: 65px;
    margin-bottom: 0.2rem;
    margin-left: 20px;
    float: left;
  }
}

.block2 {
  padding: 0 0.3rem;
  width: 90%;
  margin: 0 auto;
  box-sizing: border-box;
  .totalItems {
    display: block;
    height: 0.3rem;
    color: #666;
    text-align: right;
    margin-top: 0.3rem;
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
.itemShop,
.itemContent {
  margin: 0.5rem 200px;
  width: 80%;
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
    flex: 1;
    margin-left: 0.3rem;
    text-align: left;
    .name,
    .encoding,
    .price {
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
.shopList {
  // width: 80%;
  display: inline-block;
  .itemShop {
    width: 80%;
    margin: 0;
    padding: 10px;
  }
  .goodsCompile {
    vertical-align: top;
  }
}

.dialog-footer {
  text-align: center;

  .noteTips {
    margin-bottom: 0.3rem;
    text-align: center;
  }
}
</style>

