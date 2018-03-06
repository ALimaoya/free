<template>
  <div class="account">
    <div class="title">
      <p>绑定支付宝</p>
      <div v-show="userInfo==false">
        <el-button type="primary" @click="binding">绑定支付宝</el-button>
        <span>支付宝关系到您的资金提现，请认真填写。</span>
      </div>

    </div>
    <div v-if="accountBox" class="form">
      <p>绑定支付宝</p>
        <el-form  ref="payForm" :model="payForm" :rules="payRule" center>
          <el-form-item label="支付宝姓名："  prop="name">
            <el-input v-model.trim="payForm.name"></el-input>
          </el-form-item>
          <el-form-item label="支付宝账号：" label-windth="1.2rem" prop="account">
            <el-input v-model.trim="payForm.account"></el-input>
          </el-form-item>
          <span>温馨提示：如果您填写的支付宝账号不正确，可能无法成功返款，平台不承担由此产生的一切费用。</span>
          <el-form-item class="btn">
            <el-button @click="cancel('payForm')">取消</el-button>
            <el-button type="primary" @click="onSubmit('payForm')">确定</el-button>
          </el-form-item>
        </el-form>
    </div>
    <div v-if="accountBox==false&&payForm.account===''"  class="accountImg">
      <img src="../../assets/imgs/u860.png" alt="" />
    </div>
    <div v-if="userInfo" class="payInfo">
      <div class="alipayImg">
        <img src="../../assets/imgs/u878.png" alt="" />
        <span @click="removeAccount">解绑</span>
      </div>
      <div class="detail">
        <span>支付宝姓名：{{ payForm.name}}</span>
        <span>支付宝账号：{{ payForm.account}}</span>
      </div>
    </div>

  </div>
</template>

<script>
  import ElForm from "element-ui/packages/form/src/form";
  import ElFormItem from "element-ui/packages/form/src/form-item";

  export default {
        name: "account" ,
    components: {
      ElFormItem,
      ElForm,
    },
    data(){
          const validateName = (rule,value,callback) => {
            if(value === ''){
              callback(new Error('请输入支付宝姓名'))
            }
            callback();
          }
          const validateAccount = (rule,value,callback) => {
            if(value === ''){
              callback(new Error('请输入支付宝账号'))
            }
            callback();
          }
          return{
            accountBox : false ,
            userInfo : false ,
            payForm : {
              name : '',
              account : ''
            },
            payRule : {
              name : [{ validator : validateName ,required : true ,trigger : 'blur' }],
              account : [{ validator : validateAccount ,required : true ,trigger : 'blur' }]

            }
          }
    },
    methods : {
      binding(){
        this.accountBox = true ;
      },
      // 添加支付宝账号
      onSubmit(formName){
        this.$refs[formName].validate( (valid) => {
          if(valid){
            this.$message({
              type : 'success' ,
              message : '提交成功',
              center : true
            });
            this.accountBox = false ;
            this.userInfo = true ;
          }else{
            this.$message({
              type : 'error' ,
              message : '提交失败，请确认信息后重新提交',
              center : true
            });
            return false
          }
        })
      },
      //解绑支付宝账号
      removeAccount(){
        this.payForm.name = '';
        this.payForm.account = '';
        this.userInfo = false ;
      },

      cancel(formName){
        this.$refs[formName].resetFields();
        this.accountBox = false ;
      }

    }

  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .account{
    .title{
      width : 100% ;
      height : 0.8rem ;
      padding : 0.15rem 0.3rem ;
      box-sizing: border-box;
      border-bottom : 1px solid #aaa ;
      display : flex;
      p{
        /*width : 55% ;*/
        height : 0.5rem ;
        font-size : 0.22rem ;
        font-weight : bold ;
        line-height : 2em ;
        float : left ;
        flex : 0 2 53%;

      }
      .el-button{
        float : left ;
        width : 1.1rem ;
        height : 0.4rem ;
      }
      span{
        float : left ;
        margin-left : 0.2rem ;
        height : 0.5rem ;
        line-height : 0.5rem ;
        /*display : block ;*/
        flex : 0 1 43%;
        font-size : 0.13rem ;
      }

    }
    .form{
      width : 60% ;
      margin : 0.3rem auto ;
      padding : 0.2rem ;
      border : 1px solid #aaa ;
      border-radius : 0.06rem ;
      p{
        width : 70% ;
        height  : 0.4rem ;
        font-size : 0.18rem ;
        color : #565656 ;
        line-height : 0.4rem ;
        background : rgba(242, 242, 242, 1);
        margin : 0 auto 0.2rem;
        text-align : center ;
      }
      .el-form{
        display : flex ;
        flex-direction: column;
        align-items:  center ;
        .el-form-item{
          flex-direction: row;
          display : flex;
        }
        .btn{
          .el-button:nth-child(1){
            margin-right : 0.3rem ;
          }
        }
        .el-input{
          width : 2.5rem ;
        }
        span{
          width : 100%;
          height : 0.5rem ;
          line-height : 0.5rem ;
          font-size : 0.12rem ;
          color : #4a4a4a;
          display : block ;
          text-align : center ;

        }
      }

    }
    .payInfo{
      width : 2.5rem ;
      margin : 0.3rem 0.5rem ;
      .alipayImg{
        width : 100% ;
        height : 0.5rem ;
        position : relative ;
        margin-bottom : 0.2rem ;
        img{
          width : 100% ;
          height : 100% ;
        }
        span{
          position : absolute ;
          top : 0;
          right : 0;
          width : 0.6rem ;
          height : 0.2rem ;
          line-height : 0.2rem ;
          font-size : 0.1rem ;
          text-align : center;
          display : block ;
          color : #138CDD;
          border : 1px solid #aaa ;
          border-radius : 0.06rem ;
        }
      }
    .detail{
      border : 1px solid #aaa ;
      border-radius : 0.05rem ;
      width : 100% ;
      height : 0.8rem ;
      padding : 0 0.1rem ;
      span{
        width : 100% ;
        line-height : 0.4rem ;
        height : 0.4rem ;
        font-size : 0.14rem ;
        color : #333 ;
        display : block ;

      }
    }
    }
    .accountImg{
      display : flex;
      height : 5rem ;
      justify-content: center;
      align-items: center;

    }
  }
</style>
