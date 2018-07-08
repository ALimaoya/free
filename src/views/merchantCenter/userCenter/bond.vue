<template>
  <div class="bond"  v-loading="loading"  element-loading-text="拼命加载中">
    <h1>保证金详情</h1>
    <el-form :model="form" ref="form"  label-position="right">
      <h2>您当前已经缴纳保证金{{ form.deposit }}元整</h2>
      <el-form-item  labelWidth="130px" label="姓名：" >
        <div class="inputInfo">{{ form.name }}</div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="身份证号：" >
        <div class="inputInfo">{{ form.cardId }}</div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="缴纳方式：" >
        <div class="inputInfo">支付宝</div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="缴纳额度：" >
        <div class="inputInfo">{{ form.amount }}元</div>
      </el-form-item>
      <div v-if="hasBond">
        <el-form-item  labelWidth="130px" label="当前额度：" >
          <div class="inputInfo tipWrap">
            <span>{{ form.deposit }}元</span>
            <span class="tips">保证金少于{{ form.depositLowest }}元时，所有商品下架，不可售卖</span>
            <el-button type="danger" size="mini" v-if="addAmount>0 && form.status !== '2'" class="tips" @click="addDeposit">补缴{{ addAmount }}元</el-button>

            <!--解冻审核中显示-->
            <span class="tips" v-if="form.status==='2'">解冻提交时间：{{ form.updateTime }}  &nbsp;&nbsp;&nbsp;&nbsp;  当前审核状态： {{ typeList[form.status-1] }}</span>
            <el-button v-if="form.status!=='2'" type="primary" size="mini" @click="dialogVisible= true;">申请解冻（{{form.deposit}}元）</el-button>
          </div>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="缴纳时间：" >
          <div class="inputInfo">{{ form.createTime }}</div>
        </el-form-item>
      </div>
      <!--<el-form-item labelWidth="130px" v-if="!hasBond">-->
        <!--<el-button type="primary" size="mini" @click="handleBond">确定缴纳</el-button>-->
      <!--</el-form-item>-->
    </el-form>
    <el-dialog title="申请解冻保证金" :visible.sync="dialogVisible" width="60%" >
      <div class="dialog_content">
        <h3>确定进行保证金解冻操作？</h3>
        <p>保证金解冻以后，所有商品自动下架，不可售卖。</p>
        <p>只有缴纳保证金以后才可重新上架，解冻操作审核通过以后，金额会转到您的支付宝账户中。</p>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" size="mini" @click="confirmApply">确定</el-button>
        <el-button plain size="mini" @click="dialogVisible= false;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="bondDialog" title="提示" :visible.sync="isBond" width="50%" center  :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <!--<img :src="ImgSrc" alt="" />-->
      <p class="tips">您还未缴纳保证金，请先前往缴纳保证金后方可查看相关信息</p>
      <div slot="footer">
        <el-button plain @click="goBond">前往缴纳保证金</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="payVisible" width="40%" :before-close="handleClose" style="margin-top:20vh" >
      <span style="text-align:center;width: 70%; display: block; margin: 0 auto;">请在新窗口完成支付，支付成功后请点击“已完成支付” 若支付遇到问题请点击“支付遇到问题”</span>
      <span slot="footer" class="dialog-footer" style="text-align:center;display:block">
        <el-button style="background:#3a8ee6;;color:white;margin-rigth:20px" @click="finishPay()">已完成支付</el-button>
        <el-button style="background:#3a8ee6;;color:white;" @click="hasQuestion()">支付遇到问题</el-button>
      </span>
    </el-dialog>
    <el-dialog title="支付遇到问题" :visible.sync="dialogVisibleQuestion" width="40%" :before-close="handleClose" style="margin-top:20vh">
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
  import { getBond, applyBond ,getBondDetail,addBond } from "@/api/userCenter"
    export default {
      name: "bond",
      data(){
          return{
            form : {
              name : '',
              cardId : '',
              amount: '',
              deposit : '',
              createTime: '',
              updateTime: '',
              status : ''
            },
            addAmount:'',
            dialogVisible : false ,
            isBond: false,
            hasBond: true ,
            payVisible: false ,
            dialogVisibleQuestion: false,
            typeList: ['已缴纳','解冻中','已解冻'],
            loading: true
          }
      },
      mounted(){
        this.getForm();
      },
      methods : {
        //  获取保证金详情
        getForm(){
          this.loading= true;

          getBond().then( res => {
            // console.log(res.data);
            this.loading= false;

            if(res.data.status === '000000000'){
              this.form = res.data.data ;
              if(res.data.data.status === '3'){
                this.isBond = true ;

              }else{
                this.isBond = false ;

              }
              this.addAmount = this.form.amount - this.form.deposit ;

            }else{
              if(res.data.data === null ){
                  this.isBond = true ;
                // this.$message({
                //   message : res.data.message,
                //   center : true ,
                //   type : 'error'
                // })
              }

            }
          })
        },
        //确定申请保证金解冻操作
        confirmApply(){
          this.loading= true;

          applyBond().then( res => {
            this.loading= false;

            this.$message({
                message : '您的申请已提交，请稍后确认',
                center : true ,
                type : 'success',
                duration : 1000
              });
              setTimeout(() => {
                window.location.reload();

              },1500)
          })
        },
        goBond(){
          this.$router.push({ name : 'MerchantCenter-home',params: { 'step3' : true}})
        },
        //去缴纳保证金
        // handleBond(){
        //   this.$router.push('/merchantCenter/center/index')
        // },
      //  补缴保证金
        addDeposit(){
          let payStatus = false ;
          let formData = new FormData();
          formData.append('addAmount',this.addAmount);
          formData.append('returnUrl',window.location.href);

          addBond(formData).then( res => {
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
                payStatus = false ;

              }
            __div = document.getElementById('myForm');
            if ( payStatus) {
              this.$message({
                message : '您的申请已提交，请稍后确认',
                center : true ,
                type : 'success',
                duration : 1000
              });

              this.dialogVisible = true;
              document.getElementById('myForm').getElementsByTagName("form")[0].submit()
              document.body.removeChild(__div);
              setTimeout(() => {
                window.location.reload();

              },1500)
            }
          })
        },
        finishPay() {
          this.dialogVisible = false;
          setTimeout(() => {
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
  h1{
    margin : 0 ;
    padding : 0.2rem  0.4rem ;
    border-bottom : 1px solid #666 ;
    font-size : 0.22rem ;
    line-height : 0.4rem ;
  }
  .el-form{
    margin : 0.5rem auto;
    width : 80% ;
    color: #666 ;
    h2{
      font-size : 22px ;
      text-align : center ;
    }
    .el-form-item{
      width : 60% ;
      margin :0.2rem  auto;
      .tipWrap{
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: flex-start;
        span{
          margin-bottom : 0.2rem ;
          display: inline-block;
        }
        .tips{
          display: inline;
          /*height : 0.4rem ;*/
          padding : 0 0.2rem ;
          color : #fff ;
          text-align : center ;
          line-height : 0.4rem ;
          background : #ff0011 ;
          font-size : 0.14rem ;
          border-radius : 0.05rem ;
        }
        .el-button{
          width : 160px ;
          margin-bottom: 0.3rem ;
          margin-left: 0!important;
        }

      }
    }
  }
  .dialog_content{
    h3{
      height : 0.7rem ;

    }
    p{
      font-size : 0.14rem ;
      height : 0.4rem ;
      line-height : 0.4rem ;
    }
  }
  .bondDialog{
    p{
      height : 10vh;
      font-size : 0.3rem ;
      text-align : center ;
      line-height : 10vh ;
    }
  }
</style>
