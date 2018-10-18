<template>
    <div class="goods-coupon new">
        <h1>商品优惠券信息</h1>
        <el-form :model="form" ref="form" :rules="formRule" label-position="right">
            <el-form-item  labelWidth="130px" label="推广渠道：" prop="channel">
                <el-radio-group v-model="form.channel" size="small" >
                    <el-radio  v-for="(item,index) in trenchList" :key="index" :label="item.id">{{item.name}}</el-radio>
                </el-radio-group>
                <p class="tips">用户可以通过公开渠道主动领取优惠券，如商品详情页等</p>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="优惠券名称：" prop="name">
                <el-input class="inputInfo" :maxlength="15" size="small" v-model.trim="form.name" placeholder="请输入15个字以内的优惠券名称"></el-input>
            </el-form-item>
            <el-form-item  labelWidth="130px"  label="使用有效期：" required>
              <el-col :span="10">
                <el-form-item class="date-label" prop="useStartTime">
                <el-date-picker  value-format="yyyy-MM-dd 00:00:00" size="small"
                      v-model="form.useStartTime" clearable type="date" placeholder="开始时间"
                      :picker-options="forbidData" @change="getActivityEndTime">
                </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">至</el-col>
              <el-col :span="10">
                <el-form-item prop="useEndTime"  class="date-label">
                <el-date-picker size="small" v-model="form.useEndTime"  clearable
                                type="date"  value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间"
                                :picker-options="forbidData"  @change="getActivityEndTime">
                </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          <el-form-item labelWidth="130px">
            <p v-if="expireDays!== ''">活动持续{{expireDays}}天</p>
          </el-form-item>
            <el-form-item   labelWidth="130px"  label="可用商品：" required>
                <el-button v-if="showList.length === 0" size="small" @click="showDialogVisible">+添加商品</el-button>
                <div v-else>
                  <ul class="shopList">
                    <li v-for="(item,index) in showList" :key="index" class="itemShop">
                          <div class="img_wrap" v-if="item.mainImageUrl !== ''|| item.mainImageUrl !== undefined">
                            <img v-if="item.mainImageUrl !== ''|| item.mainImageUrl !== undefined" :src="imageDomain + item.mainImageUrl"
                                :onerror="errorImg">
                            <img :src="failImg" v-else>
                          </div>
                          <div class="content">
                            <div class="name">{{item.productName}}</div>
                            <div class="encoding">商品编号：{{item.code}}</div>
                          </div>
                    </li>
                    <el-button type="text" class="goodsCompile" @click="editorProduct">编辑</el-button>
                    <el-button type="text" class="goodsCompile" @click="checkProduct" v-if="this.goodsList.length>3">查看更多</el-button>
                  </ul>
                </div>
              <span class="tips_warn" v-if="noProduct">请选择优惠券可用商品</span>
            </el-form-item>
            <el-form-item  labelWidth="130px" label="面额：" prop="parValue">
              <el-select  size="small" clearable v-model="form.parValue"  filterable placeholder="请选择">
                <el-option
                  v-for="item in denominationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="使用条件：" prop="needAmount">
                <span>满 </span><el-input style="width:30%" type="number" :maxlength="10" size="small" v-model.trim="form.needAmount" placeholder="请输入正整数"></el-input><span> 元可用</span>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="发行张数：" prop="totalQuantity">
                <el-input style="width:30%" type="number" :maxlength="6" size="small" v-model.trim="form.totalQuantity" placeholder="请输入发行张数"></el-input><span> 张</span>
            </el-form-item>
            <el-form-item  labelWidth="130px" label="每人限额：" prop="limitQuantity">
              <el-select  size="small" clearable v-model="form.limitQuantity"  filterable placeholder="请选择">
                <el-option
                  v-for="item in quotaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item labelWidth="130px" >
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
            border :row-key="getRowKeys"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection" :reserve-selection="true"
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
              label="商品编号"
              width="140">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="商品库存"
              width="120">
            </el-table-column>
            <el-table-column
              prop="price"
              label="商品价格"
              width="100">
            </el-table-column>
          </el-table>
          <div class="block2">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10]"
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
      <el-dialog title="查看已选择优惠券" :visible.sync="checkVisible" width="70%" center :show-close="false">
        <el-table
          :data="goodsList.slice((subCurrentPage-1)*subPageSize,subCurrentPage*subPageSize)"
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
            label="商品编号"
            width="140">
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="商品库存"
            width="120">
          </el-table-column>
          <el-table-column
            prop="price"
            label="商品价格"
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
          <el-button type="info" size="small" @click="checkVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  import { parseTime } from "@/utils";
  import { int, validateName} from "@/utils/validate";
import { getSecondsList } from "@/api/enter";
import { addCoupon } from "@/api/merchant";
import userPhoto from "@/assets/404_images/fail.png";
import ElFormItem from "element-ui/packages/form/src/form-item";
export default {
  components: {ElFormItem},
  data() {
    const validName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写优惠券名称'))
      }else if (!validateName(value)){
        callback(new Error('优惠券名称只允许输入中文、英文大小写、数组、下划线字符，请重新输入'))
      }
      callback();

    };
    const validNeedAmount = (rule, value, callback) => {
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

    return {
      imageDomain: process.env.IMAGE_DOMAIN,
      errorImg: 'this.src="' + userPhoto + '"',
      failImg: userPhoto,
      //处理当前时间之前的不能选择
      forbidData: this.endDate(),
      loading: false,
      form: {
        channel: "1",
        name: "",
        activityStartTime: "",
        activityEndTime: "",
        useStartTime: "",
        useEndTime: "",
        productIds: [],
        parValue: "",
        needAmount: "",
        totalQuantity: "",
        limitQuantity: "",
      },
      formRule: {
        name: [
          { required: true, trigger: "blur", validator: validName }
        ],

        useStartTime: [
          {
            required: true ,
            message: "请选择使用有效期的开始时间",
            trigger: "change"
          }
        ],
        useEndTime: [
          {
            required: true,
            message: "请选择使用有效期的结束时间",
            trigger: "change"
          }
        ],
        parValue: [
          { required: true, message: "请选择优惠券面额", trigger: "change" }
        ],
        needAmount: [
          {
            required: true,
            validator: validNeedAmount,
            trigger: "change"
          }
        ],
        totalQuantity: [
          {
            required: true,
            validator: validTicketNum,
            trigger: "change"
          }
        ],
        limitQuantity: [
          {
            required: true,
            message: "请选择每人限额张数",
            trigger: "change"
          }
        ],

      },
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
      checkVisible: false ,
      search: {
        shopName: "",
        goodsCode: ""
      },
      expireDays:'',
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
      subTotalElements: 0,
      subTotalPages: 0,
      subCurrentPage: 1,
      subPageSize: 10,
      tableData: [],
      goodsList: [],
      showList: [],
      noProduct: false,
      checkList: false,
      getRowKeys(row) {
        return row.id;
      },
      // multipleSelection:[]
    };
  },
  methods: {
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
    handleSelectionChange(rows) {
      this.goodsList = [];
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.goodsList.push(row);
          }
        });
      }
    },

    showDialogVisible() {
      this.title = "选择优惠券商品";
      this.dialogVisible = true;
      this.getGoods();
    },
    editorProduct(){
      this.title = "编辑优惠券商品";
      this.dialogVisible = true;
      // this.handleSelect(this.goodsList)

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
        this.form.productIds = [];
        this.goodsList.map( i => {
          this.form.productIds.push(i.id)

        });

        if(this.goodsList.length>3){
          this.showList = this.goodsList.slice(0,3);
        }else{
          this.showList = this.goodsList ;
        }
        this.dialogVisible = false;
      }
    },
    cancel() {
      this.dialogVisible = false;
      if(this.title === "选择优惠券商品"){
        this.goodsList = [];
        this.showList = [];
      }

      this.search = {
        shopName: "",
        goodsCode: ""
      };
      this.currentPage = 1;
      this.pageSize = 10;
    },
    checkProduct(){
      this.subTotalElements = this.goodsList.length ;
      if(this.subTotalElements>10){
        this.subTotalPages = Math.ceil(this.subTotalElements/10);
      }else{
        this.subTotalPages = 1 ;
      }

        this.checkVisible = true;

    },

    //提交表格
    submitForm(formName) {

        this.$refs[formName].validate(valid => {
          if (valid) {

            if (this.goodsList.length === 0) {
              this.noProduct = true ;
              return false ;
            } else{
              this.noProduct = false ;
            }
            if (parseInt(this.form.parValue) > this.form.needAmount || this.form.parValue === this.form.needAmount) {

              this.$message({
                message: "使用条件面额必须大于优惠券面额",
                type: "error",
                center: true
              });
              return false;
            }
            else {
              let now = new Date();
              this.form.activityStartTime = parseTime(now);
              this.form.activityEndTime = this.form.useEndTime;
              if (now.getDay() === new Date(this.form.useStartTime).getDay()) {
                this.form.useStartTime = this.form.activityStartTime
              }
              let data = this.form ;
              data.type = '2';


              addCoupon(data).then( res => {
                if ( res.data.status === '000000000') {
                  this.$message({
                    message: '商品优惠券创建成功，请前往优惠券列表查看',
                    type: 'success',
                    center: true,
                    duration: 2000
                  });
                  for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
                    if (v.fullPath === this.$route.fullPath) {
                      this.$store.state.tagsView.visitedViews.splice(i, 1);
                      this.$router.push('/merchantCenter/marketing/coupons?type=1')

                    }
                  }
                }
              })

            }

          }
        });


    },
    resetForm(formName) {

      this.$refs[formName].resetFields();
    },
    // 计算活动有多少天
    getActivityEndTime() {
      if(this.form.useEndTime !== '' && this.form.useEndTime !== undefined && this.form.useEndTime !== null &&
        this.form.useStartTime !== '' && this.form.useStartTime !== undefined && this.form.useStartTime !== null ){

      if (this.form.useEndTime < this.form.useStartTime) {
        this.$message({
          message: "结束时间必须晚于开始时间",
          type: "error",
          center: true
        });
        this.form.useEndTime = "";
        this.form.useStartTime = "";
        return false;
      }
      let start = new Date(this.form.useStartTime.replace(/-/g, "/")).getTime();
      let end = new Date(this.form.useEndTime.replace(/-/g, "/")).getTime();
      this.expireDays = Math.ceil((end - start) / 24 / 60 / 60 / 1000);

      // if (this.expireDays < 7 || this.expireDays > 100) {
      //   this.$message({
      //     message : '优惠券有效期限制在7~100天内',
      //     center: true,
      //     type: 'error',
      //     duration: 2000
      //   });
      //   this.form.useEndTime = "";
      //   this.expireDays = "";
      //
      // }
      } else {
        return false ;

      }
    },
    //  只能选择当天之后的
    endDate() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      };

    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoods();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoods();
    },
    handleSubSizeChange(val) {
      this.subPageSize = val;

    },
    handleSubCurrentChange(val) {
      this.subCurrentPage = val;
    }
  }
};
</script>
<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../../styles/new";
.el-form{
  color: #606266;
  font-size: 0.14rem ;

  .tips{
    color: #999;
    font-size: 0.14rem ;
    line-height: 0.4rem;
  }
  .date-label{
    margin: 0 !important;
    width: 100%!important;
    .el-date-editor{
      width: 100%;
    }

  }
  .line{
    text-align: center;
  }
  .el-button:nth-child(1){
    margin-left: 0!important;
  }
}
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
.shopList {
  display: inline-block;
  .itemShop {
    /*width: 80%;*/
    margin: 0 0 0.2rem;
    /*padding: 10px;*/
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

