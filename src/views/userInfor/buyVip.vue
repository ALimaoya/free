<template>
  <div class="buyVip">
    <div class="title">
      <p>商家开通VIP</p>
      <span class="tips">充值到账可能会有延时，若
        <b>30分钟</b>内未到账请联系在线客服</span>
      <div class="vipInfo">
        <span>账号：</span>
        <b>{{ userTel }}</b>
        <span v-if="statusData.vipLevel>0">
          <span>，当前为</span>
          <b>vip:{{ statusData.vipLevel }}商家会员</b>
          <span v-if="statusData.isOverdue=='0'">，会员到期时间：{{ statusData.vipTime }}</span>
          <span v-else>，会员有效期已过,请续费</span>
        </span>
        <span v-else>,您当前不是vip会员，快购买vip会员享受活动优惠。</span>
      </div>
    </div>
    <el-form :model="choose" ref="choose">
      <div class="step1">
        <el-form-item prop="money">
          <p class="choiceDate">1.选择开通会员的时长</p>
          <ul class="payTime">
            <li class="timeImg " :class="{active:item.vipId==choose.vipId}" v-for="item in vipInfo" @click="chooseVip(item)">
              <div class="type">{{item.name}}</div>
              <div>
                <span class="money_color f18 ml40">{{item.usefulMonth}}个月</span>vip会员
                <span class="money_color f18">￥{{item.price}}</span>
                <span class="c666 ml40 f14">原价:
                  <span class="line_through ">{{item.originalPrice}}</span>
                </span>
              </div>
              <div class="text-center">赠送：
                <span class="money_color">{{item.giveMonth}}</span>个月的会员时长</div>
            </li>
          </ul>
          <div class="choose">
            <p>您已选择购买会员
              <span>{{ choose.usefulMonth }}</span>个月，赠送：
              <span>{{ choose.giveMonth }}</span>个月</p>
            <p>支付金额：
              <span>{{ choose.price }}</span>元</p>
          </div>
        </el-form-item>

      </div>
      <div class="step2">
        <p class="payType">2.请选择支付方式</p>
        <ul>
          <el-form-item prop="radio">
            <el-radio-group v-model="chooseWay">
              <!-- <li><el-radio :label="2"><img src="../../assets/imgs/pay2.png" alt="" /><p>微信支付</p></el-radio></li> -->
              <li>
                <el-radio label="1">
                  <img src="../../assets/imgs/pay3.png" alt="" />
                  <p>支付宝支付</p>
                </el-radio>
              </li>
              <li>
                <el-radio label="3">
                  <img src="../../assets/imgs/pay1.png" alt="" />
                  <p>押金支付（可用押金：
                    <span class="money_color">{{deposit.deposit}}</span>元）</p>
                </el-radio>
              </li>
              <!--<li><el-radio :label="4"><img src="../../assets/imgs/pay4.png" alt="" /><p>银行支付</p></el-radio></li>-->
            </el-radio-group>
          </el-form-item>
          <span class="total" v-if="target!=''">支付：
            <b>{{ choose.money }}</b>元</span>
        </ul>
      </div>
      <el-form-item class="submitOrder">
        <el-button type="primary" @click="submit()">确定</el-button>
        <el-button type="info" @click="cancel('choose')">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="28%" :before-close="handleClose" style="margin-top:20vh">
      <span style="text-align:center;width: 70%; display: block; margin: 0 auto;">请在新窗口完成支付，支付成功后请点击“已完成支付” 若支付遇到问题请点击“支付遇到问题”</span>
      <span slot="footer" class="dialog-footer" style="text-align:center;display:block">
        <el-button style="background:#3a8ee6;;color:white;margin-rigth:20px" @click="finishPay()">已完成支付</el-button>
        <el-button style="background:#3a8ee6;;color:white;" @click="hasQuestion()">支付遇到问题</el-button>
      </span>
    </el-dialog>
    <el-dialog title="支付遇到问题" :visible.sync="dialogVisibleQuestion" width="28%" :before-close="handleClose" style="margin-top:20vh">
      <span style="width: 80%; display: block; margin: 0 auto;">付款遇到问题支付未成功，付款遇到问题了？先看看是不是由于下面的原因:
        <br> 1、所需支付的金额超过了银行支付限额？建议您登录网上银行提高上限额度，或者先分诺干次充值到新试客余额，即能轻松支付。
        <br> 2、支付宝或网银页面显示错误或空白？部分网银对不同浏览器的兼容性有限，导致无法正常支付，建议您使用IE7及以上版本浏览器进行支付操作！
        <br> 3、网上银行已扣款，但仍显示支付未成功？可能由于银行的数据没有即时传输，请不要担心，稍后刷新页面查看。如较长时间仍显示未付款，可联系丫贝试客商家客服为您解决。
      </span>
      <span slot="footer" class="dialog-footer" style="text-align:center;display:block">
        <el-button style="background:#3a8ee6;;color:white;" @click="dialogVisibleQuestion = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="请输入支付密码" :visible.sync="dialogPswVisible" width="28%" :before-close="handleClose" style="margin-top:20vh;text-align:center">
      <el-form ref="pswForm" :model="pswForm" :rules="pswRule">
        <el-form-item label="支付密码：" class="payPsw" prop="payPsw">
          <el-input class="pswIpt" :type="pwdType" placeholder="请输入支付密码" v-model.trim="pswForm.payPsw"></el-input>
          <div class="getNum" style="width : 1.5rem ;float : right ;"></div>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eyeopen" v-if="pwdType===''" />
            <svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon>
          </span>
        </el-form-item>
        <el-form-item class="paynum" style="margin-top:10px;">
          <el-button type="primary" @click="onSubmitPsw('pswForm')" style="margin-right:60px">确 认</el-button>
          <el-button @click="handleClose()">取 消</el-button>
          <div class="getNum" style="width : 1.2rem ;float : right ;"></div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    validateCode
  } from '@/utils/validate'
  import {
    parseTime,
    DateAdd,
    GetTimeByTimeStr
  } from '@/utils/index'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import {
    getVipType,
    buyVip,
    getMember
  } from "@/api/userInfor"
  import {
    getDeposit
  } from "@/api/fund"
  import {
    getMobile
  } from '@/utils/auth'
  export default {
    components: {
      ElFormItem
    },
    name: "buy-vip",
    data() {
      const validPsw = (rule, value, callback) => {
        console.log(1)
        if (value === '') {
          callback(new Error('请输入支付密码'))
        } else {
          if (rule.field === 'payPsw') {
            if (!validateCode(this.pswForm.payPsw)) {
              callback(new Error('请输入6位数字组合的支付密码'))
            }
            callback();
          }
        }
      };
      return {
        userTel: getMobile(),
        userType: '普通商家',
        target: '',
        choose: {},
        vipInfo: [],
        chooseWay: '1',
        dialogVisible: false,
        dialogVisibleQuestion: false,
        dialogPswVisible: false,
        vipTime: [{
            time: '12',
            date: '',
            money: '3988'
          },
          {
            time: '24',
            date: '',
            money: '7199'
          },
          {
            time: '36',
            date: '',
            money: '9572'
          }
        ],
        isVip: {

        },
        deposit: '',
        pwdType: 'password',
        pswForm: {
          payPsw: ''
        },
        statusData: {},
        pswRule: {
          payPsw: [{
            validator: validPsw,
            trigger: 'blur',
            required: true
          }],
        },
      }
    },
    mounted() {
      this.isVip = this.$route.params
      this.getDepositMoney()
      this.getVipList();
      this.getVipInfo();
    },
    methods: {
      getVipInfo() {
        getMember().then(res => {
          if (res.data.status == '000000000') {
            this.statusData = res.data.data;
            console.log(this.statusData)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            });
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      getDepositMoney() {
        getDeposit().then(res => {
          if (res.data.status == '000000000') {
            this.deposit = res.data.data
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      getVipList() {
        getVipType().then(res => {
          if (res.data.status == '000000000') {
            this.vipInfo = res.data.data;
            this.choose = this.vipInfo[0];
            console.log(this.vipInfo)
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            });
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      chooseVip(item) {
        this.choose = item;
      },

      //  支付提交
      submit() {
        console.log(window.location.href)
        let _data = {
          payType: this.chooseWay - 0,
          vipId: this.choose.vipId,
          returnUrl: window.location.href
        }
        if (this.chooseWay == '3') {
          if (this.choose.price > this.deposit) {
            this.$message({
              message: '押金不足，请更换支付方式',
              type: 'error',
              center: true
            });
            return
          }
          this.dialogPswVisible = true;
        } else {
          this.goPay(_data)
        }


      },
      onSubmitPsw(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _data = {
              payType: this.chooseWay - 0,
              vipId: this.choose.vipId,
              payPassword: this.pswForm.payPsw
            }
            this.goPay(_data);
          }
        })
      },
      goPay(_data) {
        buyVip(_data).then(res => {
          if (res.data.status == '000000000') {
            if (this.chooseWay == '1') {
              const _div = document.createElement('div');
              _div.setAttribute('id', 'myForm')
              _div.innerHTML = res.data.data;
              document.body.appendChild(_div);
              document.getElementById('myForm').getElementsByTagName("form")[0].setAttribute('target',
                "_blank")
              document.getElementById('myForm').getElementsByTagName("form")[0].submit()
              const __div = document.getElementById('myForm')
              document.body.removeChild(__div)
              this.dialogVisible = true;
            } else {
              this.$message({
                message: "恭喜您成功购买会员",
                type: 'success',
                center: true
              });
              this.$router.push('/userInfor/vip')
            }

          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
              center: true
            });
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      handleClose() {
        this.dialogVisible = false;
        this.dialogVisibleQuestion = false;
        this.dialogPswVisible = false;
        this.pswForm.payPsw = "";
      },
      //  取消选择
      cancel(formName) {
        this.$router.push('/userInfor/vip')
      },
      finishPay() {
        this.dialogVisible = false;
        this.$router.push("/userInfor/vip")
      },
      hasQuestion() {
        this.dialogVisible = false;
        this.dialogVisibleQuestion = true;
        this.getDepositMoney();
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .buyVip {
    padding: 0.4rem 0.5rem;
    .title {
      width: 95%;
      padding: 0.15rem 0;
      height: 0.6rem;
      margin: 0 auto;
      box-sizing: border-box;
      border-bottom: 1px solid #d3d3d3;
      p {
        font-size: 0.2rem;
        color: #b9271a;
        margin-right: 0.1rem;
        float: left;
        height: 0.3rem;
        line-height: 0.3rem;
        font-weight: bold;
      }
      .payPsw {
        .el-form-item__label {
          width: 1.5rem;
          text-align: right;
        }
      }
      .tips,
      .vipInfo {
        font-size: 0.14rem;
        color: #666;
        float: left;
        line-height: 0.3rem;
      }
      .tips {
        margin-right: 0.6rem;
        b {
          color: #ff0000;
          font-weight: 100;
        }

      }
      .vipInfo {
        float: left;
        span {
          float: left;
        }

        b {
          color: #ff0000;
          float: left;
          font-weight: 100;

        }
      }
    }
    .step1,
    .step2 {
      width: 80%;
      margin: 0.4rem auto;
    }
    .payTime {
      width: 100%;
      overflow: hidden;

      margin: 0.2rem auto;
      .active {
        border: 1px solid #f18531;
      }
      li {
        margin-top: 20px;
        width: 30%;
        height: 1.4rem;
        border: 1px solid #D3D3D3;
        position: relative;
        padding: 0.1rem;
        margin-right: .2rem;
        box-sizing: border-box;
        float: left;
        img {
          width: 100%;
          height: 100%;

        }
        .type {
          font-size: .18rem
        }
        .king {
          width: 9%;
          height: 17%;
          background: url('../../assets/imgs/king.png') no-repeat center;
          background-size: 100%;
          position: absolute;
          top: -0.12rem;
          left: -0.12rem;
          z-index: 1000;
        }
        .percent1,
        .percent2 {
          width: 22%;
          height: 40%;
          display: block;
          position: absolute;
          top: 0;
          left: 0;

        }
        .percent1 {
          background: url('../../assets/imgs/nine.png') no-repeat left top;
          background-size: 90%;
        }
        .percent2 {
          background: url('../../assets/imgs/eight.png') no-repeat left top;
          background-size: 90%;
        }
        .target {
          width: 13%;
          height: 30%;
          position: absolute;
          bottom: 0;
          right: 0;
          background: url('../../assets/imgs/right.png') no-repeat right bottom;
          display: block;
          background-size: 95%;

        }
      }
    }
    .choiceDate,
    .payType {
      width: 100%;
      font-size: 0.18rem;
      color: #66686b;
      line-height: 0.3rem;
      height: 0.3rem;
      font-weight: bold;
    }
    .choose {
      width: 100%;
      height: 0.5rem;
      padding: 0 0.3rem;
      box-sizing: border-box;
      line-height: 0.5rem;
      font-size: 0.17rem;
      color: #666;
      background: #f5f4f9;
      p:nth-child(1) {
        width: 60%;
        float: left;
      }
      p:nth-child(2) {
        float: right;
        margin-right: 0.2rem;
      }
      span {
        color: #ea5a4c;
        font-size: 0.18rem;
      }
    }
    .step2 {
      ul {
        width: 100%;
        height: auto;
        margin-top: 0.2rem;
        background: #f5f4f9;
        padding: 0 0.1rem;
        box-sizing: border-box;
        position: relative;
        .el-radio-group {
          width: 100%;
        }
        li {
          width: 100%;
          height: 0.6rem;
          line-height: 0.6rem;
          float: left;
          padding-left: 0.2rem;
          border-bottom: 1px solid #aaa;
          &:nth-last-child(1) {
            border-bottom: none;
          }
          img,
          p {
            float: left;
          }
          p {
            /*display : block ;*/
            line-height: 0.3rem;
            height: 100%;
          }
          img {
            width: 0.3rem;
            height: 0.3rem;
            margin: 0 0.2rem;
          }
        }
        .el-radio {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;

        }
        .total {
          position: absolute;
          bottom: 0.1rem;
          right: 0.2rem;
          font-size: 0.14rem;
          b {
            color: #fd4200;
          }
        }
      }
    }
    .submitOrder {
      width: 25%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .el-dialog {
      .el-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-form-item__label {
          width: 1.5rem;
          text-align: right;
        }
      }
      .pswIpt {
        position: relative;
      }
      .show-pwd {
        position: absolute;
        right: .2rem;
        top: 0.03rem;
        font-size: 0.16rem;
        color: #889aa4;
        cursor: pointer;
        user-select: none;
      }
      .paynum {
        padding-left: 1.2rem;
      }


      .getNum {
        width: 1.1rem;
        margin-left: 0.3rem;
        padding: 0.12rem 0.15rem;

      }
      .contactInfo {
        .el-form-item {
          width: 80%;
        }
      }
      .el-input {
        width: 2rem;
      }
      /*}*/
    }
  }

</style>
