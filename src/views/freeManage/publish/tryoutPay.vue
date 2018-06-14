<template>
  <div class="tryoutPay pay">
    <div class="stepImg"><img src="../../../assets/imgs/u258.png" alt="" /></div>
    <p class="tips">您现在为《<span>&nbsp;{{ activity.activityTitle }}&nbsp;</span>》试用活动存入试用活动款（合计总费用）：<span class="money_color">{{ activity.activityTotalAmount }}</span>元</p>
    <div class="note">费用说明：</div>
    <table border="1" bordercolor="#d3d3dd">
      <tr>
        <td>商品担保金</td>
        <td>{{ activity.activityDepositAmount }}元</td>
        <!--{{ form.buyProductAmount}}*{{ form.activityCalendar.buyProductQuantity}}*{{ form.buyProductQuantity}}-->
      </tr>
      <tr>
        <td>活动服务费</td>
        <td>  {{ activity.activityServiceAmount }} 元</td>
      </tr>
      <tr>
        <td>合计</td>
        <td>{{ activity.activityTotalAmount }} 元</td>
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

    </div>
    <div class="btn">
      <el-button type="primary" @click="checkPay(activity.activityId , password)">确认支付</el-button>
      <el-button type="info" @click="goRecharge">去充值</el-button>
      <el-button type="text" @click="goActivity">试用活动管理</el-button>
      <el-button type="text" @click="back">返回编辑活动</el-button>
    </div>
  </div>
</template>

<script>
  import {   activityPay , getPayDetail } from "@/api/activity"

  export default {
        name: "tryout-pay" ,
      data(){
          return{

            activity :{},
            pwdType : 'password',
            password : ''
          }
      },

      mounted(){
        let order = this.$route.params.id ;
        getPayDetail(order).then( res => {
          if (res.data.status === '000000000') {
            this.activity = res.data.data ;
            if(res.data.data.payStatus === '1'){
              for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
                if (v.path === this.$route.path) {
                  this.$store.state.tagsView.visitedViews.splice(i, 1);
                  this.$router.push('/publish/step3');

                }
              }
            }
          } else {
            this.$message({
              message: res.data.message,
              center: true,
              type: 'error'
            })
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        });


      },
      methods : {
        //  确认支付
        checkPay(id,password){
          if( this.activity.totalDeposit < this.activity.activityTotalAmount){
            this.$message({
              message : '您当前的押金余额不足，请充值押金后再支付',
              center : true ,
              type : 'error'
            })
          }else{
            let reg = /^[0-9]{6}$/ ;
            if( reg.test(password)){

              activityPay({ activityId : id+'' ,payPassword : password }).then( res => {
                if(res.data.status === '000000000'){

                  for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
                    if (v.path === this.$route.path) {
                      this.$store.state.tagsView.visitedViews.splice(i, 1);
                      this.$router.push('/publish/step3');

                    }
                  }


                }else{
                  this.$message({
                    message : res.data.message ,
                    center : true ,
                    type : 'error'
                  })
                }

              }).catch( err => {
                alert('服务器开小差啦，请稍等~')
              });
            }else{

              this.$message({
                message : '请输入六位支付密码',
                type : 'error',
                center : true
              })

            }

          }

        },

        //跳转到押金充值页面
        goRecharge(){
          this.$router.push('/fund/recharge')

        },

        //跳转到试用活动管理
        goActivity(){
          this.$router.push('/activity/approval')
        },

        //返回修改活动
        back(){
          this.$router.push({ path : '/publish/tryout_step1' ,query : { editor :'1' ,order : this.activity.activityId }})

        },

        //切换密码是否可见
        showPwd(){
          if(this.pwdType === 'password'){
            this.pwdType = ''
          }else{
            this.pwdType  = 'password'
          }
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'src/styles/pay';
</style>
