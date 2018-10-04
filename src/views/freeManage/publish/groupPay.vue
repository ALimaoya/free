<template>
    <div class="flowPay pay">
        <div class="stepImg"><img src="../../../assets/imgs/u259.png" /></div>
        <p class="tips">您正在支付开团提醒活动款：<span class="money_color">{{ activity.activityTotalAmount }}</span>元</p>
        <div class="note">费用说明：</div>
        <table border="1" bordercolor="#d3d3dd">
            <tr>
                <td>基础佣金</td>
                <td>{{ activity.activityDepositAmount }}元</td>
                <!--{{ form.buyProductAmount}}*{{ form.activityCalendar.buyProductQuantity}}*{{ form.buyProductQuantity}}-->
            </tr>
        </table>
        <div class="result">您当前的押金余额为：<span class="money_color">{{ activity.totalDeposit }}</span> 元，本次总共要支付的金额为：<span class="money_color">{{ activity.activityTotalAmount }}</span> 元。</div>
        <div class="payPsw">
            <span>支付密码：</span>
            <el-input :type="pwdType"  v-model.trim="password" auto-complete="off" placeholder="请输入支付密码" >
                <span slot="suffix" class="show-pwd" @click="showPwd">
                <svg-icon icon-class="eyeopen" v-if="pwdType===''" /><svg-icon v-else="pwdType==='password'" icon-class="eyeclose" />
            </span>
            </el-input>
            <div class="btn">
                <el-button  type="text" @click="goSetting" v-if="!user.bindPayPassword">设置支付密码</el-button>
                <el-button type="text" @click="goSetting" v-else>忘记密码？</el-button>
            </div>
        </div>
        <div class="btn">
            <el-button type="primary" @click="checkPay(activity.activityId , password)">确认支付</el-button>
            <el-button type="info" @click="goRecharge">去充值</el-button>
            <el-button type="text" @click="goActivity">开团提醒活动管理</el-button>
            <el-button type="text" @click="back">返回编辑活动</el-button>
        </div>
    </div>
</template>
<script>
import { activityPay, getPayDetail } from "@/api/activity";
import { getThirdAccount } from "@/api/userInfor";
export default {
  name: "group-pay",
  data() {
    return {
      activity: {},
      pwdType: "password",
      password: "",
      user: {}
    };
  },
  mounted() {
    let order = this.$route.params.id;
    getPayDetail(order).then(res => {
      if (res.data.status === "000000000") {
        this.activity = res.data.data;
        this.getThirdInfo();
        if (res.data.data.payStatus === "1") {
          for (const [
            i,
            v
          ] of this.$store.state.tagsView.visitedViews.entries()) {
            if (v.fullPath === this.$route.fullPath) {
              this.$store.state.tagsView.visitedViews.splice(i, 1);
              // this.$router.push('/freeManage/publish/step3');
              this.$router.push({ name: "Auditing", params: "group" });
            }
          }
        }
      }
    });
  },
  methods: {
    // 获取第三方账号信息
    getThirdInfo() {
      getThirdAccount().then(res => {
        if (res.data.status === "000000000") {
          this.user = res.data.data;
        }
      });
    },
    //  确认支付
    checkPay(id, password) {
      if (this.activity.totalDeposit < this.activity.activityTotalAmount) {
        this.$message({
          message: "您当前的押金余额不足，请充值押金后再支付",
          center: true,
          type: "error"
        });
      } else {
        let reg = /^[0-9]{6}$/;
        if (reg.test(password)) {
          activityPay({ activityId: id + "", payPassword: password }).then(
            res => {
              if (res.data.status === "000000000") {
                for (const [
                  i,
                  v
                ] of this.$store.state.tagsView.visitedViews.entries()) {
                  if (v.fullPath === this.$route.fullPath) {
                    this.$store.state.tagsView.visitedViews.splice(i, 1);
                    // this.$router.push('/freeManage/publish/step3');
                    this.$router.push({
                      name: "Auditing",
                      params: { type: "group" }
                    });
                  }
                }
              }
            }
          );
        } else {
          this.$message({
            message: "请输入六位支付密码",
            type: "error",
            center: true
          });
        }
      }
    },
    //返回修改活动
    back() {
      this.$router.push({
        path: "/freeManage/publish/group_step1",
        query: { editor: "1", order: this.activity.activityId }
      });
    },
    //跳转到开团提醒活动管理
    goActivity() {
      this.$router.push("/freeManage/activity/group");
    },
    //跳转到押金充值页面
    goRecharge() {
      this.$router.push("/accountManage/fund/recharge");
    },
    //跳转到支付密码管理
    goSetting() {
      this.$router.push("/accountManage/accountInfo/settings");
    },
    //切换密码是否可见
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    }
  }
};
</script>
<style scoped lang="scss" rel="stylesheet/scss">
@import "src/styles/pay";
</style>