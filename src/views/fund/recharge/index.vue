<template>
  <div class="recharge">
    <div class="credit">
      <p class="title">我要充值</p>
      <ul class="step">
        <el-form ref="form" :model="form" :rules="rule">
          <li>
            <p>1、充值方式</p>
            <el-form-item prop="method">
              <el-radio-group v-model="form.method">
                <dl>
                  <dt>
                    <el-radio label="1">支付宝</el-radio>
                  </dt>
                  <dd>
                    <img src="../../../assets/imgs/pay3.png" alt="" />
                  </dd>
                </dl>
                <!-- <dl>
                <dt>
                  <el-radio label="2">微信</el-radio>
                </dt>
                <dd><img src="../../../assets/imgs/pay2.png" alt="" /></dd>
              </dl> -->
              </el-radio-group>
            </el-form-item>

          </li>
          <li>
            <p>2、选择充值类型</p>
            <el-form-item prop="type">
              <el-radio-group v-model="form.type">
                <el-radio label="1">押金充值</el-radio>
                <!-- <el-radio  label="2">金币充值</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </li>
          <li>
            <p>3、填写充值金额</p>
            <span class="rest">可用押金：
              <b v-if="deposit.deposit">{{deposit.deposit}}元</b></span>
            <el-form-item label="充值金额：" prop="money">
              <el-input v-model.trim="form.money" placeholder="请输入内容" size="small"></el-input>
              <span>每次充值不得少于1元</span>
            </el-form-item>
            <el-form-item class="check">
              <el-button type="primary" size="small" @click="confirm('form')">确认充值</el-button>
            </el-form-item>
            <span class="attention">注意：在第三方页面支付时，请在15分钟内完成支付。</span>
          </li>
        </el-form>
      </ul>
    </div>
    <ul class="tips">
      <p>温馨提示：</p>
      <li>1、信用卡支付时银行会自动提示风险安全提醒，可继续支付，请勿担心；</li>
      <li>2、请注意您的银行卡充值限制，以便造成不便；</li>
      <li>3、禁止洗钱、信用卡套现、虚假交易等行为，一经发现并确认，将终止该账号的使用；</li>
      <li>4、如果充值金额没有及时到账，请联系客服。</li>
    </ul>
    <div></div>
    <!-- <form action="http://192.168.0.210:8087/tryout/recharge/deposit" id="" method="POST" target="_blank">
      <input type="hidden" name="amount" >
    </form> -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="28%" :before-close="handleClose" style="margin-top:20vh">
      <span style="text-align:center;width: 70%; display: block; margin: 0 auto;">请在新窗口完成支付，支付成功后请点击“已完成支付” 若支付遇到问题请点击“支付遇到问题”</span>
      <span slot="footer" class="dialog-footer"  style="text-align:center;display:block">
        <el-button style="background:#3a8ee6;;color:white;margin-rigth:20px" @click="finishPay()">已完成支付</el-button>
        <el-button style="background:#3a8ee6;;color:white;" @click="hasQuestion()">支付遇到问题</el-button>
      </span>
    </el-dialog>
    <el-dialog title="支付遇到问题" :visible.sync="dialogVisibleQuestion" width="28%" :before-close="handleClose" style="margin-top:20vh">
      <span style="width: 80%; display: block; margin: 0 auto;">付款遇到问题支付未成功，付款遇到问题了？先看看是不是由于下面的原因: <br>
        1、所需支付的金额超过了银行支付限额？建议您登录网上银行提高上限额度，或者先分诺干次充值到新试客余额，即能轻松支付。<br>
        2、支付宝或网银页面显示错误或空白？部分网银对不同浏览器的兼容性有限，导致无法正常支付，建议您使用IE7及以上版本浏览器进行支付操作！<br>
        3、网上银行已扣款，但仍显示支付未成功？可能由于银行的数据没有即时传输，请不要担心，稍后刷新页面查看。如较长时间仍显示未付款，可联系丫贝试客商家客服为您解决。</span>
      <span slot="footer" class="dialog-footer"  style="text-align:center;display:block">
        <el-button style="background:#3a8ee6;;color:white;" @click="dialogVisibleQuestion = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import ElForm from "element-ui/packages/form/src/form";
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import ElButton from "element-ui/packages/button/src/button";
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
  import {
    handleRecharge,
    handleGold,
    getDeposit,
  } from "@/api/fund"
  export default {
    components: {
      ElRadioGroup,
      ElButton,
      ElFormItem,
      ElForm
    },
    name: "index",
    data() {
      const validMoney = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入充值金额'))
        } else {
          if (!(value - 0)) {
            callback(new Error('请输入正确的充值金额'))
          }
          if (value < 1) {
            callback(new Error('请输入不少于1元的充值金额数值'))
          }
          if (value.indexOf('.') >= 0) {
            callback(new Error('输入的金额数值应该为正整数'))
          }
          if(value > 9999999){
            callback(new Error('输入的金额数值不得超过9999999'))
          }
          callback();
        }
      };
      return {
        dialogVisible: false,
        dialogVisibleQuestion:false,
        form: {
          method: '1',
          type: '1',
          money: ''
        },
        deposit: '',
        rule: {
          method: [{
            required: true,
            message: '请选择充值方式'
          }],
          type: [{
            required: true,
            message: '请选择充值类型'
          }],
          money: [{
            validator: validMoney,
            required: true,
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getDepositMoney()
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = new FormData();
            form.append("amount", this.form.money)
            form.append("returnUrl", window.location.href)
            handleRecharge(form).then(res => {
              if (res.data.status == '000000000') {
                this.dialogVisible=true;
                const _div = document.createElement('div');
                _div.setAttribute('id', 'myForm')
                _div.innerHTML = res.data.data;
                document.body.appendChild(_div);
                document.getElementById('myForm').getElementsByTagName("form")[0].setAttribute('target',
                  "_blank")
                document.getElementById('myForm').getElementsByTagName("form")[0].submit()
              }
              this.form.money = "";
              const __div = document.getElementById('myForm')
              document.body.removeChild(__div)
            }).catch(err => {
              alert('服务器开小差啦，请稍等~')
            })
          }
        })
      },
      finishPay(){
        this.dialogVisible = false;
        this.$router.push("/fund/history/money")
      },
      hasQuestion(){
        this.dialogVisible = false;
        this.dialogVisibleQuestion=true;
        this.getDepositMoney();
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .recharge {
    width: 70%;
    margin: 0 auto;
    .credit {
      width: 100%;
      margin: 0.2rem auto 0;
      border: 1px solid #aaa;
      padding: 0.3rem 0.6rem;
      box-sizing: border-box;
      border-radius: 0.05rem;
      height: auto;
      float: left;
      .title {
        width: 100%;
        height: 0.5rem;
        font-size: 0.2rem;
        font-weight: bold;
        color: #553;
        line-height: 0.5rem;
      }
      .step {
        width: 100%;
        height: auto;
        padding-left: 0.2rem;
        box-sizing: border-box;
        .el-form {
          li {
            width: 100%;
            height: auto;
            margin-bottom: 0.25rem;
            float: left;
            p {
              width: 100%;
              height: 0.4rem;
              line-height: 0.4rem;
              float: left;

            }
            .el-radio-group {
              width: 100%;
            }

            dl {
              width: 15%;
              float: left;
              margin-left: 0.3rem;

              dt {
                width: 100%;
                height: 0.5rem;
                line-height: 0.5rem;
                font-size: 0.14rem;
                float: left;
              }
              dd {
                width: 100%;
                float: left;
                padding-left: 0.2rem;

              }
            }

            &:nth-child(2) {
              .el-radio {
                /*width : 10% ;*/
                /*margin: 0.1rem 0.28rem 0 0.27rem ;*/
                width: 15%;
                float: left;
                margin-left: 0.3rem;
                margin-top: 0.15rem;
              }
            }

            &:nth-child(3) {
              .rest {
                font-size: 0.14rem;
                padding-left: 0.55rem;
                height: 0.4rem;
                line-height: 0.4rem;
                color : #606266 ;
                b {
                  color: #ff0000;
                  font-weight: 500;
                  font-size: 18px ;
                  padding-left: 0.2rem;

                }
              }
              .el-form-item {
                padding: 0 0.45rem;
                .el-input {
                  width: 2rem;
                }
                span {
                  margin-left: 0.2rem;
                  color: #606266;
                  font-size: 0.13rem;
                }

              }
              .check {
                /*display : flex ;*/
                /*justify-content: center;*/
                margin-left: 0.92rem;
              }
              .attention {
                font-size: 0.13rem;
                color: #606266;
                padding-left: 0.2rem;
              }
            }
          }
        }
      }

    }
    .tips {
      width: 100%;
      border: 1px solid #aaa;
      border-top: 0;
      padding: 0.2rem 0.3rem;
      box-sizing: border-box;
      font-size: 0.14rem;
      color: #606266;
      float: left;
      border-radius: 0.05rem;
      margin-bottom: 0.4rem;
      p {
        width: 100%;
        height: 0.4rem;
        line-height: 0.4rem;
        float: left;

      }
      li {
        font-size: 0.13rem;
        height: 0.3rem;
        line-height: 0.3rem;
        padding-left: 0.2rem;
        width: 100%;
        box-sizing: border-box;
        float: left;
      }
    }
  }

</style>
