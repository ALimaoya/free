<template>
  <div class="settlement ">
    <h1 class="h_title">结算账户</h1>
    <el-form :model="form" ref="form" label-position="right" :rules="formRule" >
      <el-form-item   labelWidth="130px"  label="姓名" prop="name">
        <el-input class="inputInfo"  size="small" v-model.trim="form.name" :disabled="readOnly" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="身份证号" prop="id">
        <el-input class="inputInfo" size="small" v-model.trim="form.id" :disabled="readOnly" placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item labelWidth="130px" label="结算渠道">
        <div class="inputInfo">支付宝</div>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="结算账户" prop="account">
        <el-input class="inputInfo" size="small" v-model.trim="form.account"  placeholder="结算账户"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="验证码" prop="verify">
        <el-input class="inputInfo" size="small" v-model.trim="form.verify"  placeholder="验证码"></el-input>
        <el-button type="primary" class="verifyBtn" size="mini" @click="getVerify" :disabled="disabled">{{ message }}</el-button>
      </el-form-item>
      <el-form-item>
        <div class="btnWrap">
          <el-button type="primary" size="small" v-if="hasAccount" @click="changeForm('form')">换绑</el-button>
          <el-button type="primary" size="small" v-else-if="!hasAccount" @click="submitForm('form')">绑定</el-button>

        </div>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="isRegister" width="60%" center  :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <!--<img :src="ImgSrc" alt="" />-->
        <p class="tips">您还未上传资质信息，请先前往上传资质信息</p>
      <div slot="footer">
        <el-button plain @click="goUpload">前往资质上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import ElButton from "element-ui/packages/button/src/button";
    import ElFormItem from "element-ui/packages/form/src/form-item";
    import { getCaptcha } from "@/api/userInfor";
    import { validatePhone, validateEmail} from '@/utils/validate'
    export default {
      components: {
        ElFormItem,
        ElButton
      },
      name: "settlement",
      data() {
        const validAccount = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入结算账户'))
          }else{
            if(!validatePhone.test(value) || !validateEmail.test(value)){
              callback(new Error('请输入正确格式的结算账户'))
            }
            callback()
          }
        };
        return {
          form: {
            name:'',
            id : '',
            account : '',
            verify : ''
          },
          readOnly: true,
          message : '发送验证码',
          disabled : false,
          hasAccount:  false ,
          formRule : {
            account: [
              {
               required : true ,trigger : 'blur',validator : validAccount
              }
            ],
            verify : [
              { message : '请输入验证码',required : true ,trigger : 'blur'}
            ]
          },
          isRegister: false
        }
      },
      mounted(){
        this.getInfo();
        // this.isRegister =
      },
      methods : {
        getInfo(){
          // this.form =
        },
        getVerify(){
          var num = 60;
          this.getNew = false;
          var timer = setInterval(() => {
            this.message = `重新发送(${num}s)`;
            num--;
            this.disabled = true;

            if (this.getNew == true || num === 0) {
              this.message = "获取验证码";
              clearInterval(timer);
              this.disabled = false;

            }

          }, 1000)
          getCaptcha().then(
            res => {
              if (res.data.status == '000000000') {
                this.$message({
                  message: '短信验证码发送成功',
                  type: 'success',
                  center: true
                });
                return
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                });
                clearInterval(timer);
                this.disabled = false;
              }
            }
          ).catch(err => {
            clearInterval(timer);
            this.disabled = false;
            alert('服务器开小差啦，请稍等~')
          })
        },
        //绑定
        submitForm(formName){

          // console.log(this.form);
          this.$refs[formName].validate((valid) => {
            if(valid){

            }else{

            }
          })
        },
        //换绑
        changeForm(formName){

          // console.log(this.form);
          this.$refs[formName].validate((valid) => {
            if(valid){

            }else{

            }
          })
        },
        goUpload(){
          this.$router.push('/merchantCenter/userCenter/infoUpload')
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  h1{
    margin : 0 ;
    padding : 0.2rem  0.4rem ;
    border-bottom : 1px solid #666 ;
    font-size : 0.22rem ;
    line-height : 0.4rem ;
    height : 0.7rem ;
  }
  .el-form{
    margin : 0.5rem auto ;
    .el-form-item{
      width : 55% ;
      margin : 0.3rem  auto 0;
      .btnWrap{
        width : 60%;
        margin : auto ;
      }
      .inputInfo{
        width : 50% ;
      }
      .verifyBtn{
        margin-left : 0.2rem ;
        padding : 0.1rem ;
      }
    }
  }
  .el-dialog{
    /*height : 50%!important;*/
    p{
       height : 10vh;
       font-size : 0.3rem ;
       text-align : center ;
       line-height : 10vh ;
     }
  }
</style>
