<template>
  <div class="step2">
    <h1>绑定账号</h1>
    <el-form ref="form" :model="form" :rules="formRule" center label-position="top" v-loading="loading"  element-loading-text="拼命加载中">
      <el-form-item label="结算渠道"  >
        <el-input type="text" size="small" :disabled="readOnly" placeholder="支付宝"></el-input>
      </el-form-item>
      <el-form-item   label="结算账户" prop="account">
        <el-input class="inputInfo" size="small" v-model.trim="form.account"  placeholder=""></el-input>
      </el-form-item>
      <el-form-item v-if="!isRegister" class="verifyItem" label="验证码" prop="verify">
        <el-input class="inputInfo" size="small" v-model.trim="form.verify"  placeholder="验证码"></el-input>
        <el-button type="primary" class="verifyBtn" size="mini" @click="getVerify" :disabled="disabled">{{ message }}</el-button>
      </el-form-item>
    </el-form>
    <el-button v-if="isRegister" type="primary" size="small" @click="goDetail">查看</el-button>
    <el-button v-else="!isRegister" type="primary" size="small" @click="submitForm('form')">提交</el-button>

  </div>
</template>

<script>
  import { getCaptcha } from "@/api/userInfor";
  import { validatePhone ,validateEmail} from '@/utils/validate'
    export default {
        name: "step2",
      data(){
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
            form : {

            },
            readOnly : true,
            message : '发送验证码',
            disabled : false,
            isRegister: '',
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
            loading: true ,

          }
      },
      mounted(){
        this.form = this.$store.state.step.userInfo ;
      },
      methods : {
        goDetail(){
          this.$router.push('/merchantCenter/userCenter/postSetting') ;
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
      }

    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  .el-form{
    margin-bottom: 0.5rem ;
    .verifyItem{
      .el-input{
        width : 60% ;
        margin-right : 0.3rem ;
      }
    }
  }

</style>
