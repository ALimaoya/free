<template>
  <div class="step3">
    <h1>缴纳保证金</h1>
    <el-form ref="form" :model="form"  center label-position="top">
      <el-form-item  label="结算渠道"  >
        <el-input type="text" size="small" :disabled="readOnly" placeholder="支付宝"></el-input>
      </el-form-item>
      <el-form-item  label="额度" >
        <el-input type="text" size="small" :disabled="readOnly" v-model="this.deposit" placeholder=""></el-input>
      </el-form-item>

    </el-form>
    <el-button v-if="isBond" type="primary" size="small" @click="goDetail">查看</el-button>
    <el-button v-else-if="!isBond" type="primary" size="small" @click="handleBond">缴纳保证金</el-button>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" style="margin-top:20vh">
      <span style="text-align:center;width: 70%; display: block; margin: 0 auto;">请在新窗口完成支付，支付成功后请点击“已完成支付” 若支付遇到问题请点击“支付遇到问题”</span>
      <span slot="footer" class="dialog-footer" style="text-align:center;display:block">
        <el-button style="background:#3a8ee6;;color:white;margin-rigth:20px" @click="finishPay()">已完成支付</el-button>
        <el-button style="background:#3a8ee6;;color:white;" @click="hasQuestion()">支付遇到问题</el-button>
      </span>
    </el-dialog>
    <el-dialog title="支付遇到问题" :visible.sync="dialogVisibleQuestion" width="40%" :before-close="handleClose" style="margin-top:20vh" >
      <span style="width: 80%; display: block; margin: 0 auto;">付款遇到问题支付未成功，付款遇到问题了？先看看是不是由于下面的原因:
        <br> 1、所需支付的金额超过了银行支付限额？建议您登录网上银行提高上限额度，或者先分若干次充值到新试客余额，即能轻松支付。
        <br> 2、支付宝或网银页面显示错误或空白？部分网银对不同浏览器的兼容性有限，导致无法正常支付，建议您使用IE7及以上版本浏览器进行支付操作！
        <br> 3、网上银行已扣款，但仍显示支付未成功？可能由于银行的数据没有即时传输，请不要担心，稍后刷新页面查看。如较长时间仍显示未付款，可联系丫贝试客商家客服为您解决。
      </span>
      <span slot="footer" class="dialog-footer" style="text-align:center;display:block">
        <el-button style="background:#3a8ee6;;color:white;" @click="dialogVisibleQuestion = false">确定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import { rechargeBond } from "@/api/userCenter"
    export default {
      name: "step3",
      props: ['deposit','step3Status'],
      data(){
        return {
          form : {},
          bond : '',
          readOnly : true,
          isBond : false ,
          dialogVisible: false ,
          dialogVisibleQuestion: false ,
        }
      },
      mounted(){
        if(this.step3Status === '1'||this.step3Status === '2'){
          this.isBond = true ;

        }else{
          this.isBond = false ;

        }
      },
      methods : {

        goDetail(){
          this.$router.push('/merchantCenter/userCenter/bond') ;
        },
        handleBond(){
          let payStatus = false ;
          let formData = new FormData ;
          formData.append('returnUrl',window.location.href)
          rechargeBond(formData).then(res=> {
            var __div = document.getElementById('myForm');
            if(__div){
              document.body.removeChild(__div);
            }
            if(res.data.status === '000000000'){
                // console.log(res);
              var _div = document.createElement('div');
              _div.setAttribute('id', 'myForm');
              _div.innerHTML = res.data.data;
              document.body.appendChild(_div);
              document.getElementById('myForm').getElementsByTagName("form")[0].setAttribute('target',
                "_blank");
              payStatus = true ;

            }else{
              this.$message({
                message : res.data.message,
                center: true ,
                type : 'error'
              });
              payStatus = false ;
            }
             __div = document.getElementById('myForm');
            if ( payStatus) {
              this.$message({
                message : '支付成功，请稍后确认',
                center: true ,
                type : 'success'
              });
              this.dialogVisible = true;
              document.getElementById('myForm').getElementsByTagName("form")[0].submit()
              document.body.removeChild(__div);
            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')

          })
        },
        finishPay() {
          this.dialogVisible = false;
          setTimeout(() =>{
            window.location.reload();

          },1500)
          // this.$router.push("/freeManage/userInfor/vip")
        },
        hasQuestion() {
          this.dialogVisible = false;
          this.dialogVisibleQuestion = true;

          // this.getDepositMoney();
        },
        handleClose() {
          this.dialogVisible = false;
          this.dialogVisibleQuestion = false;
          setTimeout(() => {
            window.location.reload();

          },1500)
        },
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
</style>
