<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="RegForm" :rules="RegRules" ref="RegForm" label-position="left" label-width="0px" class="card-box login-form">
      <h3 class="title">丫贝试客商家中心</h3>
      <el-form-item prop="mobile">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input type="text" v-model="RegForm.mobile" autoComplete="on" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="imgNum" class="validateCode">
        <span class="svg-container">
          <img src="../../assets/imgs/verify2.png" alt="" />
        </span>
        <el-input type="text" v-model="RegForm.imgNum" autoComplete="on" placeholder="请输入图形验证码" />
        <img class="show-captcha" :src="'data:image/png;base64,'+imgCode" alt="" @click="changeCaptcha" />
      </el-form-item>
      <el-form-item prop="message" class="validateCode">
        <span class="svg-container">
          <img src="../../assets/imgs/verify2.png" alt="" />
        </span>
        <el-input type="text" v-model.trim="RegForm.message" autoComplete="on" placeholder="请输入短信验证码" />
        <el-button class="show-captcha codeBtn" size="mini" plain @click="getMessage" :disabled="disabled">{{ btntext }}</el-button>
      </el-form-item>
      <!--<span v-if="messageWarn" class="messageWarn">{{ warnText }}</span>-->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" v-model.trim="RegForm.password" autoComplete="on" placeholder="请输入密码"></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eyeopen" v-if="pwdType===''" />
          <svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon>
        </span>
      </el-form-item>
      <el-form-item prop="checkPsw">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model.trim="RegForm.checkPsw" autoComplete="on"
          placeholder="请再次确认密码"></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eyeopen" v-if="pwdType===''" />
          <svg-icon v-else="pwdType==='password'" icon-class="eyeclose" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          注册
        </el-button>
      </el-form-item>
      <div class="goOther">
        <router-link class="toRes" to="/login">去登录</router-link>
        <router-link class="toPsw" to="/changePsw">忘记密码？</router-link>
      </div>
    </el-form>


  </div>
</template>

<script>
  import {
    validatePhone,
    validPassWord
  } from '@/utils/validate'
  import {
    getCaptcha,
    getMessageCode
  } from "@/api/login"
  import SvgIcon from "../../components/SvgIcon/index";
  export default {
    components: {
      SvgIcon
    },
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
      const validCaptcha = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入图片验证码'))
        } else {
          this.phoneMessaage = true;
          callback();
        }
      };
      const validMessage = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入短信验证码'))
        } else {
          if (this.RegForm.imgNum !== '' && this.RegForm.mobile !== '') {
            callback();
          } else {
            callback(new Error('请输入手机号及图片验证码'))
          }
        }
      };
      const validatePass = (rule, value, callback) => {
        if (!validPassWord(value)) {
          callback(new Error('密码为8-16位的数字、字母组合'))
        } else {
          if (this.RegForm.checkPsw !== '') {
            this.$refs.RegForm.validateField('checkPsw');
          }
          callback()
        }
      };
      const validateCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else {
          if (value !== this.RegForm.password) {
            callback(new Error('两次输入密码不一致！'))
          }
          callback()
        }
      };
      return {
        RegForm: {
          mobile: '',
          imgNum: '',
          message: '',
          password: '',
          checkPsw: ''
        },
        RegRules: {
          mobile: [{
            required: true,
            trigger: 'blur',
            validator: validateTel
          }],
          imgNum: [{
            required: true,
            trigger: ' blur',
            validator: validCaptcha
          }],
          message: [{
            required: true,
            trigger: ' blur',
            validator: validMessage
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePass
          }],
          checkPsw: [{
            required: true,
            trigger: 'blur',
            validator: validateCheck
          }]

        },
        loading: false,
        pwdType: 'password',
        // messageWarn : false ,
        // warnText : '',
        imgCode: '',
        userToken: '',
        btntext: '获取验证码',
        disabled: false,
      }
    },
    mounted() {
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
      changeCaptcha() {
        getCaptcha().then(res => {
          // console.log(res);
          if (res.data.status === '000000000') {
            this.imgCode = res.data.data.image;
            this.userToken = res.data.data.token;
          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        })
      },
      //获取短信验证码
      getMessage() {
        if (this.RegForm.imgNum !== '' && this.RegForm.mobile !== '') {
          this.getPhoneCode(this.RegForm.imgNum);
        } else {
          this.$message({
            message: '请先输入正确的手机号及图片验证码',
            type: 'error',
            center: true
          })
        }


      },
      getPhoneCode(value) {
        let form = new FormData();
        form.append('captcha', value);
        form.append('token', this.userToken);
        getMessageCode(this.RegForm.mobile, form).then(res => {
          // console.log(res);
          if (res.data.status === "000000000") {
            let num = 60;
            let timer = setInterval(() => {
              this.btntext = `重新发送(${num}s)`;
              num--;
              this.disabled = true;
              if (!num) {
                this.btntext = "获取验证码";
                clearInterval(timer);
                this.disabled = false;

              }

            }, 1000);
          } else {
            this.$message({
              message: res.data.message,
              center: true,
              type: 'error'
            });

          }
        }).catch(err => {
          alert('服务器开小差啦，请稍等~')
        });
      },

      handleLogin() {
        this.$refs.RegForm.validate(valid => {
          if (valid) {
            this.loading = true;
            let formData = new FormData();
            formData.append('mobile', this.RegForm.mobile);
            formData.append('password', this.RegForm.password);
            formData.append('captcha', this.RegForm.message);
            this.$store.dispatch('Register', formData).then(res => {
              if (res.data.status === '000000000') {
                this.loading = false;
                this.$message({
                  title: '注册成功',
                  message: '注册成功',
                  type: 'success',
                });
                this.$router.push({
                  path: '/'
                })

              } else {
                this.loading = false;
                this.$message({
                  title: '信息错误',
                  message: res.data.message,
                  type: 'error',
                  center : true
                });
              }

            }).catch(() => {
              this.loading = false
            })
          } else {
            this.loading = false;
            return false
          }
        })
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/login.scss";
  .pop {
    width: 10%;
    height: 10%;
  }

  .el-message__content {
    text-align: center;
    width: 100%;
  }

  .login-container {
    .validateCode {
      .el-input {
        width: 1.6rem;
      }
    }
  }
  .codeBtn{
    margin : 0.1rem 0 ;
  }

  .messageWarn {
    font-size: 0.12rem;
    color: #f56c6c;
    line-height: 1;
    padding-top: 0.04rem;
  }


</style>
