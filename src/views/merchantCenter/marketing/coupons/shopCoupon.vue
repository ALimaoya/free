<template>
    <div class="shop-coupon new ">
        <h1>店铺优惠券信息</h1>
        <el-form :model="form" ref="form" :rules="formRule" label-position="right">
            <el-form-item  labelWidth="130px" label="推广渠道：" >
                <el-radio-group v-model="form.channel" size="small" @change="getChannel">
                    <el-radio  v-for="(item,index) in channelList" :key="index" :label="item.id" border>{{item.name}}</el-radio>
                </el-radio-group>
                <p v-if="form.channel === '1' ">用户可以通过公开渠道主动领取优惠券，如店铺首页、商品详情页等</p>
                <p v-if="form.channel === '2' ">用户领券时必须收藏店铺，为店铺积累粉丝</p>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="优惠券名称：" prop="name">
                <el-input class="inputInfo" :maxlength="15" size="small" v-model.trim="form.name" placeholder="请输入15个字以内的优惠卷名称"></el-input>
            </el-form-item>
            <el-form-item v-if="form.channel === '1'"   labelWidth="130px"  label="使用有效期：" prop="useEndTime">
                <el-date-picker  value-format="yyyy-MM-dd 00:00:00" size="small"
                      v-model="form.useStartTime" clearable type="date" placeholder="开始时间" 
                      :picker-options="forbidData" >
                </el-date-picker>
                <span class="demonstration2">至</span>
                <el-date-picker size="small" v-model="form.useEndTime"  clearable
                                type="date"  value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间" 
                                :picker-options="forbidData"  @change="getActivityEndTime(form.useEndTime)">
                </el-date-picker>
                <p>活动持续{{activityDay}}天</p>
            </el-form-item>
            <el-form-item v-if="form.channel === '2'"   labelWidth="130px"  label="活动时间：" prop="receiveEndData">
                <el-date-picker  value-format="yyyy-MM-dd 00:00:00" size="small"
                      v-model="form.activityStartTime" clearable type="date" placeholder="开始时间" 
                      :picker-options="forbidData" >
                </el-date-picker>
                <span class="demonstration2">至</span>
                <el-date-picker size="small" v-model="form.receiveEndData"  clearable
                                type="date"  value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间" 
                                :picker-options="forbidData"  @change="getActivityEndTime(form.receiveEndData)">
                </el-date-picker>
                <p>活动持续时间:{{activityDay}}天，活动期间，用户领取优惠券后，自动收藏店铺</p>
            </el-form-item>
            <el-form-item v-if="form.channel === '2'"  labelWidth="130px"  label="有效期限：" prop="validDeadline">
                <span>领取后 </span><el-input style="width:50%" type="number" :maxlength="6" size="small" v-model.trim="form.validDeadline" placeholder="请输入优惠券有限期"></el-input><span> 天内有效</span>
            </el-form-item>
            <el-form-item  labelWidth="130px" label="面额：" prop="parValue">
              <el-select  size="small" clearable v-model="form.parValue"  filterable placeholder="请选择">
                <el-option
                  v-for="item in parValueList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="使用条件：" prop="needAmount">
                <span>满 </span><el-input style="width:50%" type="number" :maxlength="10" size="small" v-model.trim="form.needAmount" placeholder="请输入正整数"></el-input><span> 元可用</span>
            </el-form-item>
            <el-form-item   labelWidth="130px"  label="发行张数：" prop="totalQuantity">
                <el-input style="width:50%" type="number" :maxlength="6" size="small" v-model.trim="form.totalQuantity" placeholder="请输入发行张数"></el-input>
            </el-form-item>
            <el-form-item  labelWidth="130px" label="每人限额：" prop="limitQuantity">
              <el-select  size="small" clearable v-model="form.limitQuantity"  filterable placeholder="请选择">
                <el-option
                  v-for="item in limitQuantityList"
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
    </div>
</template>
<script>
import { addCoupon } from "@/api/merchant";
import { int } from "@/utils/validate";
export default {
  data() {
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
      //处理当前时间之前的不能选择
      forbidData: this.endDate(),
      loading: false,
      form: {
        type:'1',
        channel: "1",
        name: "",
        useStartTime: "",
        useEndTime:"",
        parValue: "",
        needAmount: "",
        totalQuantity: "",
        limitQuantity: "",
        // validDeadline:""
      },
      formRule: {
        name: [
          { required: true, message: "请填写优惠券名称", trigger: "change" }
        ],
        useEndTime: [
          { required: true, message: "请选择使用有效期的开始时间和结束时间", trigger: "change" }
        ],
        parValue: [
          { required: true, message: "请选择没人使用限额", trigger: "change" }
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
        ],
      },
      activityDay: "0",
      channelList:[
        { name: "公开", id: "1" },
        { name: "店铺收藏", id: "2" },
      ],
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
    getChannel(){
      this.resetForm('form')
    },
    //提交表格
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.form.parValue > this.form.needAmount){
            this.$message({
              message: "使用条件必须大于优惠券面额",
              type: "error",
              center: true
            });
            return false
          }
          addCoupon(this.form).then(res =>{
            console.log('111')
          })
          

        }
      });
    },
    resetForm(formName) {
      this.form.useEndTime = "";
      this.form.useStartTime = "";
      this.$refs[formName].resetFields();
    },
    // 计算活动有多少天
    getActivityEndTime() {
      if (this.form.useStartTime === "") {
        this.$message({
          message: "请先选择活动开始时间",
          type: "error",
          center: true
        });
        this.form.useEndTime = "";
        return false;
      }
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
      let start = new Date(
        this.form.useStartTime.replace(/-/g, "/")
      ).getTime();
      let end = new Date(this.form.useEndTime.replace(/-/g, "/")).getTime();
      this.activityDay = Math.ceil((end - start) / 24 / 60 / 60 / 1000);
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
.demonstration2 {
  width: 20px;
  margin-right: 0;
  text-align: center;
}
</style>
