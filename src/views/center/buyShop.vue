<template>
  <div class="buyShop">
    <!--<div class="stepImg"><img src="../../assets/imgs/u258.png" alt="" /></div>-->

    <p class="tips">您现在为《<span>&nbsp;{{ shop.shopName }}&nbsp;</span>》店铺存入费用（合计总费用）：<span>{{ shop.payAmount }}</span>元</p>
    <!--<div class="note">费用说明：</div>-->
    <!--<table border="1" bordercolor="#d3d3dd">-->
      <!--<tr>-->
        <!--<td>商品担保金</td>-->
        <!--<td>{{ shop.shopDepositAmount }}元</td>-->
        <!--&lt;!&ndash;{{ form.buyProductAmount}}*{{ form.shopCalendar.buyProductQuantity}}*{{ form.buyProductQuantity}}&ndash;&gt;-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td>活动服务费</td>-->
        <!--<td>  {{ shop.shopServiceAmount }} 元</td>-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td>合计</td>-->
        <!--<td>{{ shop.shopTotalAmount }} 元</td>-->
      <!--</tr>-->
    <!--</table>-->
    <div class="result">您当前的押金余额为：<span>{{ shop.totalDeposit }}</span> 元，本次总共要支付的金额为：<span>{{ shop.payAmount }}</span> 元。</div>
    <div class="payPsw">
      <span>支付密码：</span>
      <el-input :type="pwdType"  v-model.trim="password" auto-complete="off" placeholder="请输入支付密码" >
        <span slot="suffix" class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eyeopen" v-if="pwdType===''" /><svg-icon v-else="pwdType==='password'" icon-class="eyeclose" />
      </span>
      </el-input>

    </div>
    <div class="btn">
      <el-button type="primary" @click="checkPay(shop.shopId , password)">确认支付</el-button>
      <el-button type="info" @click="goRecharge">去充值</el-button>
      <el-button type="text" @click="goShop">店铺管理</el-button>
      <el-button type="text" @click="back">返回编辑店铺</el-button>
    </div>
  </div>
</template>

<script>
  import {   shopPayDetail , buyShop } from "@/api/shop"

  export default {
      name: "buyShop" ,
      data(){
          return{

            shop :{},
            pwdType : 'password',
            password : ''
          }
      },

      mounted(){
        let shopId = this.$route.params.id ;
        shopPayDetail(shopId).then( res => {
          if (res.data.status === '000000000') {
            this.shop = res.data.data ;
            if(res.data.data.payStatus === '1'){
              for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
                if (v.path === this.$route.path) {
                  this.$store.state.tagsView.visitedViews.splice(i, 1);
                  this.$router.push('/checkshop');

                }
              }
            }
            // console.log(this.shop);
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
          if( this.shop.totalDeposit < this.shop.payAmount){
            this.$message({
              message : '您当前的押金余额不足，请充值押金后再支付',
              center : true ,
              type : 'error'
            })
          }else{
            let reg = /^[0-9]{6}$/ ;
            if( reg.test(password)){

              buyShop({ shopId : id+'' ,payPassword : password }).then( res => {
                if(res.data.status === '000000000'){
                  for (const [i, v] of this.$store.state.tagsView.visitedViews.entries()) {
                    if (v.path === this.$route.path) {
                      this.$store.state.tagsView.visitedViews.splice(i, 1);
                      this.$router.push('/checkshop');

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

        //跳转到店铺管理
        goShop(){
          this.$router.push('/shop')
        },

        //返回修改店铺
        back(id){
          this.$router.push({ path : '/newshop' , query : { editor : '1' ,id : this.shop.shopId }})

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
  .buyShop{
    width : 80% ;
    margin : 0 auto ;

    .stepImg{
      width : 100% ;
      margin : 0.5rem 0;

      img{
        width : 80% ;
        height : 100% ;
        margin : 0 auto ;
      }
    }
    .tips{
      color : #333 ;
      line-height : 1rem ;

      span{
        color : #ff0011 ;
      }
    }

    .tips,.result{
      color : #333 ;
      font-weight : bold ;
      font-size : 0.18rem ;
      width : 100% ;
      text-align : center ;
      span{
        color : #ff0011 ;
      }
    }
    p{
      width : 80% ;
      text-align : center ;
      /*height : 0.4rem ;*/
      line-height : 0.4rem ;

    }

    .result{
      /*margin-left : 2rem ;*/
      line-height : 1rem;
    }
    .btn{
      display: flex ;
      justify-content: center;
      .el-button:nth-child(1){
        margin-right : 0.3rem ;
      }
      .el-button:nth-child(2){
        width : 98px ;
        margin-right : 0.3rem ;
      }
    }

    .payPsw{
      width : 50% ;
      height : 1.2rem ;
      margin : 0 auto ;
      span{
        display : block;
        width : 27% ;
        height : 0.4rem ;
        line-height : 0.4rem ;
        float : left ;
        text-align : right ;
        color : #456 ;
      }
      .el-input{
        float : left ;
        width : 40% ;
        /*position : relative ;*/

      }
      .show-pwd{
        width : 0.3rem ;
        height : 0.4rem ;
        line-height : 0.4rem ;
        /*text-align : right ;*/
        /*position : absolute ;*/
        /*right : 0.2rem;*/
        /*top : 0.04rem ;*/
      }
    }
  }
</style>
