<template>
    <div class="shop-coupon new ">
        <h1>店铺优惠券信息</h1>
        <el-form :model="form" ref="form" :rules="formRule" label-position="right">
            <el-form-item  labelWidth="130px" label="推广渠道：" prop="channel">
                <el-radio-group v-model="form.channel" size="small" @change="getChannel(form.channel)">
                    <el-radio  v-for="(item,index) in channelList" :key="index" :label="item.id">{{item.name}}</el-radio>
                </el-radio-group>
                <p v-if="form.channel === '1' " class="tips">用户可以通过公开渠道主动领取优惠券，如商品详情页等</p>
                <p v-if="form.channel === '2' " class="tips">用户领券时必须收藏店铺，为店铺积累粉丝</p>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="优惠券名称：" prop="name">
                <el-input class="inputInfo" :maxlength="15" size="small" v-model.trim="form.name" placeholder="请输入15个字以内的优惠卷名称"></el-input>
            </el-form-item>
            <el-form-item v-if="form.channel === '1'"   labelWidth="130px" label="使用有效期：" required>
              <el-col :span="10">
                <el-form-item prop="useStartTime" class="date-label">
                  <el-date-picker  value-format="yyyy-MM-dd 00:00:00" size="small"
                        v-model="form.useStartTime" clearable type="date" placeholder="开始时间"
                        :picker-options="forbidData" @change="getActivityDay">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align:center">
                <span> 至 </span>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="useEndTime" class="date-label">
                  <el-date-picker size="small" v-model="form.useEndTime"  clearable
                                  type="date"  value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间"
                                  :picker-options="forbidData"  @change="getActivityDay">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          <el-form-item v-if="form.channel === '1'"   labelWidth="130px" style="margin: 0 auto ;">
            <p v-if="activityDay!==''" class="tips">活动持续{{activityDay}}天</p>
          </el-form-item>
            <el-form-item v-if="form.channel === '2'"   labelWidth="130px"  label="活动时间：" required>
              <el-col :span="10">
                <el-form-item prop="activityStartTime" class="date-label">
                  <el-date-picker  value-format="yyyy-MM-dd 00:00:00" size="small"
                        v-model="form.activityStartTime" clearable type="date" placeholder="开始时间"
                        :picker-options="forbidData" @change="getActivityDay">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align:center">
                <span> 至 </span>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="activityEndTime" class="date-label">
                  <el-date-picker size="small" v-model="form.activityEndTime"  clearable
                                  type="date"  value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间"
                                  :picker-options="forbidData"  @change="getActivityDay">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          <el-form-item labelWidth="130px" v-if="form.channel === '2'" style="margin: 0 auto ;" >
            <p  v-if="activityDay!==''" class="tips">活动持续{{activityDay}}天，活动期间，用户领取优惠券后，自动收藏店铺</p>
          </el-form-item>
            <el-form-item v-if="form.channel === '2'"  labelWidth="130px"  label="有效期限：" prop="useDays">
              <el-col :span="16">
                <span>领取后 </span><el-input style="width:50%" type="number" :maxlength="6" size="small" v-model.trim="form.useDays" placeholder="请输入优惠券有限期"></el-input><span> 天内有效</span>
              </el-col>

            </el-form-item>
            <el-form-item  labelWidth="130px" label="面额：" prop="parValue">
              <el-col :span="8">
              <el-select  size="small" clearable v-model="form.parValue"  filterable placeholder="请选择">
                <el-option
                  v-for="item in parValueList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-col>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="使用条件：" prop="needAmount">
              <el-col :span="14">
                <span>满 </span><el-input style="width:50%" type="number" :maxlength="10" size="small" v-model.trim="form.needAmount" placeholder="请输入正整数"></el-input><span> 元可用</span>
              </el-col>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="发行张数：" prop="totalQuantity">
              <el-col :span="8">
                <el-input type="number" :maxlength="6" size="small" v-model.trim="form.totalQuantity" placeholder="请输入发行张数"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item v-if="form.channel === '1'"  labelWidth="130px" label="每人限额：" prop="limitQuantity">
              <el-col :span="8">
              <el-select  size="small" clearable v-model="form.limitQuantity"  filterable placeholder="请选择">
                <el-option
                  v-for="item in limitQuantityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-col>
            </el-form-item>
            <el-form-item labelWidth="130px">
              <el-button class="inputInfo button" type="primary" size="small" @click="submitForm('form')">创建</el-button>
              <el-button class="inputInfo button"  size="small" @click="resetForm('form')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { parseTime } from "@/utils";
import { addCoupon } from "@/api/merchant";
import { int ,validateName} from "@/utils/validate";
export default {
  data() {
    const validName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写优惠券名称"));
      } else {
        if (!validateName(value)) {
          callback(new Error("名称只允许中文、英文大小写，数字，下划线"));
        }
        callback();
      }
    };
    const validUseStartTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择优惠券开始使用时间"));
      } else {
        if (this.form.useEndTime !== "") {
          this.$refs.form.validateField("useEndTime");
        }
        callback();
      }
    };
    const validUseEndTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择优惠券结束使用时间"));
      } else {
        if (this.form.useStartTime >= value) {
          callback(new Error("优惠券开始使用时间要早于结束时间"));
        }
        callback();
      }
    };
    const validActivityStartTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择活动开始时间"));
      } else {
        if (this.form.activityEndTime !== "") {
          this.$refs.form.validateField("activityEndTime");
        }
        callback();
      }
    };
    const validActivityEndTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择活动结束时间"));
      } else {
        if (this.form.activityStartTime >= value) {
          callback(new Error("活动开始时间要早于活动结束时间"));
        }
        callback();
      }
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
    const validTotalQuantity = (rule, value, callback) => {
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
    const validUseDays = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写优惠券有效期"));
      } else {
        if (!int(value)) {
          callback(new Error("只能填写正整数"));
        }
        if (value > 100) {
          callback(new Error("优惠券有效期最多为100天"));
        }
        if (value < 7) {
          callback(new Error("优惠券有效期最少为7天"));
        }
        callback();
      }
    };
    return {
      //处理当前时间之前的不能选择
      forbidData: this.endDate(),
      loading: false,
      form: {
        type: "1",
        channel: "1",
        name: "",
        useStartTime: "",
        useEndTime: "",
        parValue: "",
        needAmount: "",
        totalQuantity: "",
        limitQuantity: "",
        activityStartTime: "",
        activityEndTime: "",
        useDays: ""
      },
      formRule: {
        name: [
          { required: true, validator: validName, trigger: "change" }
        ],
        useStartTime: [
          { required: true, validator: validUseStartTime, trigger: "change" }
        ],
        useEndTime: [
          { required: true, validator: validUseEndTime, trigger: "change" }
        ],
        parValue: [
          { required: true, message: "请选择每人使用限额", trigger: "change" }
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
            validator: validTotalQuantity,
            trigger: "change"
          }
        ],
        limitQuantity: [
          {
            required: true,
            message: "请选择每人使用限额张数",
            trigger: "change"
          }
        ],
        useDays: [
          {
            required: true,
            validator: validUseDays,
            trigger: "change"
          }
        ],
        activityStartTime: [
          {
            required: true,
            validator: validActivityStartTime,
            trigger: "change"
          }
        ],
        activityEndTime: [
          { required: true, validator: validActivityEndTime, trigger: "change" }
        ]
      },
      activityDay: "",
      channelList: [{ name: "公开", id: "1" }, { name: "店铺收藏", id: "2" }],
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
  methods: {
    getChannel(val) {
      this.resetForm("form");
      this.form.channel = val;
    },
    // 计算活动有多少天
    getActivityDay() {
      this.activityDay = "";
      if (this.form.useStartTime !== "" && this.form.useEndTime !== "" &&
        this.form.useStartTime !== undefined && this.form.useEndTime !== undefined &&
        this.form.useStartTime !== null && this.form.useEndTime !== null) {
        // let start = new Date().getTime();
        let start = new Date(this.form.useStartTime.replace(/-/g, "/")).getTime();
        let end = new Date(this.form.useEndTime.replace(/-/g, "/")).getTime();
        this.activityDay = Math.ceil((end - start) / 24 / 60 / 60 / 1000);
      }
      if (this.form.activityEndTime !== "" && this.form.activityStartTime !== "" &&
        this.form.activityEndTime !== undefined && this.form.activityStartTime !== undefined &&
        this.form.activityEndTime !== null && this.form.activityStartTime !== null) {
        let start = new Date(this.form.activityStartTime.replace(/-/g, "/")).getTime();
        let end = new Date(this.form.activityEndTime.replace(/-/g, "/")).getTime();
        if (this.form.channel === '2') {
          this.activityDay = Math.ceil((end - start) / 24 / 60 / 60 / 1000);

        }
      }
    },
    //提交表格
    submitForm(formName) {

      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.parValue - 0 > this.form.needAmount - 0 || this.form.parValue === this.form.needAmount ) {
            this.$message({
              message: "使用条件必须大于优惠券面额",
              type: "error",
              center: true
            });
            return false;
          }
          if (this.form.activityStartTime === '') {
            let now = new Date();
            this.form.activityStartTime = parseTime(now);
            if (now.getDay() === new Date(this.form.useStartTime).getDay()) {
              this.form.useStartTime = this.form.activityStartTime
            }

          }
          if (this.form.activityEndTime === '') {
            this.form.activityEndTime = this.form.useEndTime
          }

          if(this.form.channel === '2'){
            this.form.limitQuantity = "1"
          }
          let formData = Object.assign({}, this.form);
          addCoupon(formData).then(res => {
            if(res.data.status === "000000000"){
              this.$message({
                message: "新增店铺优惠券成功",
                type: "success",
                center: true,
                duration: 2000
              });
              for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
                if (v.fullPath === this.$route.fullPath) {
                  this.$store.state.tagsView.visitedViews.splice(i, 1);
                  this.$router.push('/merchantCenter/marketing/coupons?type=0')

                }
              }
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.activityDay = "";
      this.form.useStartTime = "";
      this.form.useEndTime = "";
      this.form.activityStartTime = "";
      this.form.activityEndTime = "";
    },

    //  只能选择当天之后的
    endDate() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      };
    }
  }
};
</script>
<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../../styles/new";
.tips{
  font-size: 0.14rem ;
  color: #999;
}
  .el-form{
    color: #333;
    font-size: 0.14rem ;
    .el-button:nth-child(1){
      margin-left: 0!important;
    }
    .date-label{
      margin: 0 !important;
      width: 100%!important;
      .el-date-editor{
        width: 100%;
      }

    }
  }
</style>
