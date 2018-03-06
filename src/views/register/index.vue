<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="RegForm" :rules="RegRules" ref="RegForm" label-position="left" label-width="0px"
             class="card-box login-form">
      <h3 class="title">丫贝试客商家中心</h3>
      <el-form-item prop="mobile">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input  type="text" v-model="RegForm.mobile" autoComplete="on" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="imgNum" class="validateCode">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input type="text"  v-model="RegForm.imgNum" autoComplete="on" placeholder="请输入图形验证码" />
        <img class="show-captcha" :src="'data:image/png;base64,'+imgCode" alt="" @click="changeCaptcha"/>
      </el-form-item>
      <el-form-item prop="message" class="validateCode" v-if="phoneMessaage">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input type="text" v-model="RegForm.message" autoComplete="on" placeholder="请输入短信验证码" />
        <el-button class="show-captcha codeBtn" size="mini" plain @click="getMessage" :disabled="disabled">{{ btntext }}</el-button>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType"  v-model.trim="RegForm.password" autoComplete="on"
                  placeholder="请输入密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eyeopen" v-if="pwdType===''" /><svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon></span>
      </el-form-item>
      <el-form-item prop="checkPsw">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model.trim="RegForm.checkPsw" autoComplete="on"
                  placeholder="请再次确认密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eyeopen" v-if="pwdType===''" /><svg-icon v-else="pwdType==='password'" icon-class="eyeclose" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { validatePhone } from '@/utils/validate'
  import { getCaptcha , getMessageCode } from "@/api/login"
  import SvgIcon from "../../components/SvgIcon/index";
  export default {
    components: {SvgIcon},
    name: 'register',
    data() {
      const validateTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else {
          if (!validatePhone(value)) {
            callback(new Error('请输入正确格式的手机号'))
          }
          callback()
        }
      };
      const validCaptcha = ( rule, value ,callback) =>{
        if(value === ''){
          callback(new Error('请输入图片验证码'))
        }else{
          this.getPhoneCode(value);

        }
      };
      const validMessage = ( rule,value ,callback) => {
        if(value === ''){
          callback(new Error('请输入短信验证码'))
        }else{
          if( value !== this.mobileCode ){
            callback(new Error('验证码输入错误，请重新输入'))
          }
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          if(this.RegForm.checkPsw !== ''){
            this.$refs.RegForm.validateField('checkPsw') ;
          }
          callback()
        }
      };
      const validateCheck = (rule, value ,callback) => {
        if(value === ''){
          callback(new Error('请再次输入密码'));
        }else{
          if(value !== this.RegForm.password){
            callback(new Error('两次输入密码不一致！'))
          }
          callback()
        }
      };
      return {
        RegForm: {
          mobile: '',
          imgNum : '',
          message : '',
          password: '',
          checkPsw: ''
        },
        RegRules: {
          mobile: [{ required: true, trigger: 'blur', validator: validateTel }],
          imgNum : [{ required : true ,trigger :' blur' ,validator : validCaptcha}],
          message : [{ required : true ,trigger :' blur' ,validator : validMessage}],
          password: [{ required: true, trigger: 'blur', validator: validatePass }],
          checkPsw: [{ required: true, trigger: 'blur', validator: validateCheck }]

        },
        loading: false,
        pwdType: 'password',
        mobileCode : '',
        imgCode : '' ,
        userToken : '',
        btntext : '获取验证码',
        disabled : false ,
        phoneMessaage : false
      }
    },
    mounted(){
      this.changeCaptcha();
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      //图片验证码
      changeCaptcha(){
        getCaptcha().then( res => {
          console.log(res);
          if(res.data.status === '000000000'){
            this.imgCode = res.data.data.image ;
            this.userToken = res.data.data.token ;
          }
        }).catch( err =>{
          alert('服务器开小差啦，请稍等~')
        })
      },
      //获取短信验证码
      getMessage(){
        let num = 60 ;
        this.getPhoneCode(this.RegForm.imgNum);
          let timer = setInterval(()=>{
            this.btntext = `重新发送(${num}s)` ;
            num-- ;
            this.disabled = true ;

            if( !num ){
              this.btntext = "获取验证码" ;
              clearInterval(timer) ;
              this.disabled = false ;

            }

          },1000);

      },
      getPhoneCode(value){
        getMessageCode(this.RegForm.mobile,{ captcha : value , token : this.userToken}).then( res => {
          if(res.data.status === '000000000'){
            this.phoneMessaage = true ;
            this.mobileCode = res.data.data ;
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        });
      },
      handleLogin() {
        this.$refs.RegForm.validate(valid => {

          if (valid) {
            this.loading = true ;

            this.$store.dispatch('Register', {mobile :this.RegForm.mobile,password : this.RegForm.password}).then(() => {
              this.loading = false;
              this.$message({
                title: '注册成功',
                message: '注册成功',
                type: 'success',
              });
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message({
              title: '错误',
              message: '提交失败',
              type: 'error',

            });
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/login.scss";
  .pop{
    width : 10% ;
    height : 10% ;
  }
  .el-message__content{
    text-align : center;
    width : 100% ;
  }
  .validateCode{
    .el-input{
      width : 1.6rem ;
    }
  }
</style>
