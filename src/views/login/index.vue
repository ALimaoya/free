<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">丫贝试客商家中心<span>欢迎登录</span></h3>
      <el-form-item prop="mobile">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input type="text" v-model.number="loginForm.mobile" autoComplete="on" placeholder="请输入手机号" @input="checkUser()"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input :type="pwdType" @keyup.enter.native="handleLogin('loginForm')" v-model.trim="loginForm.password" autoComplete="on"
          placeholder="请输入密码"></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eyeopen" v-if="pwdType===''" />
          <svg-icon v-else="pwdType==='password'" icon-class="eyeclose"></svg-icon>
        </span>
      </el-form-item>
      <el-form-item prop="captcha" v-if="examine">
        <span class="svg-container">
          <img src="../../assets/imgs/verify2.png" alt="" />
        </span>
        <el-input style="width : 1.5rem;" v-model="loginForm.captcha" autoComplete="on" placeholder="请输入验证码"></el-input>
        <img class="show-captcha" :src="'data:image/png;base64,'+ imgCode" alt="" @click="changeCaptcha" />

      </el-form-item>
      <el-form-item class="remember">
        <el-checkbox v-model="checked">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin('loginForm')">
          登录
        </el-button>
      </el-form-item>
      <div class="goOther">
        <router-link class="toRes" to="/register">去注册</router-link>
        <router-link class="toPsw" to="/changePsw">忘记密码?</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {
    validatePhone,
    validPassWord,
    validateCaptcha
  } from '@/utils/validate'
  import {
    getCaptcha
  } from "@/api/login"
  import {
    setMobile ,setUser ,getUser ,removeUser
  } from '@/utils/auth'
  export default {
    name: 'login',
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
      const validatePass = (rule, value, callback) => {
        if (!validPassWord(value)) {
          callback(new Error('密码为8-16位的数字、字母组合'))
        } else {

          callback()
        }
      };
      const validCaptcha = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else {
          if( !validateCaptcha(value)){
            callback(new Error('请输入正确格式的图片验证码'))
          }
          callback();

        }
      };
      return {
        loginForm: {
          mobile: '',
          password: '',
          captcha: '',

        },
        loginRules: {
          mobile: [{
            required: true,
            trigger: 'blur',
            validator: validateTel
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePass
          }],
          captcha: [{
            required: this.examine,
            trigger: 'blur',
            validator: validCaptcha
          }]
        },
        imgCode: '',
        userToken: '',
        loading: false,
        pwdType: 'password',
        examine: false ,
        checked : false

      }
    },
    mounted() {
      this.changeCaptcha();
      this.freeLogin();
    },
    methods: {
      freeLogin(){
          if(getUser() !== undefined){
            // if(this.loginForm.mobile === getUser().split('&')[0]*1){
              this.loginForm.mobile = getUser().split('&')[0] ;
              this.checked = true ;
              this.loginForm.password = getUser().split('&')[1];
            }else{

              this.checked = false ;
              this.loginForm.mobile = '';
              this.loginForm.password = ''
            }

          // }

      },
      checkUser(){
        if(this.loginForm.mobile === getUser().split('&')[0]*1){
          this.loginForm.mobile = getUser().split('&')[0] ;
          this.checked = true ;
          this.loginForm.password = getUser().split('&')[1];
        }else{
          this.checked = false ;
          // this.loginForm.mobile = '';
          this.loginForm.password = ''
        }
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      //用户登录
      handleLogin(loginForm) {
        this.$refs[loginForm].validate(valid => {
          if (valid) {
            this.loading = true;
            let formData = new FormData();
            formData.append('mobile', this.loginForm.mobile);
            formData.append('password', this.loginForm.password);
            formData.append('captcha', this.loginForm.captcha);
            formData.append('token', this.userToken);
            this.$store.dispatch('Login', formData).then((res) => {
              // console.log(res);
              this.loading = false;
              if (res.data.status === '000000000') {
                if(this.checked){
                  setUser(this.loginForm.mobile+ '&'+this.loginForm.password)
                }else{
                  removeUser()
                }
                this.$router.push({
                  path: '/'
                });
                setMobile( this.loginForm.mobile)
              } else {
                this.examine = true;

                this.$message({
                    message: res.data.message,
                    type: 'error',
                    center: 'true'
                  })
                }
              this.loginForm.captcha = '' ;
              this.changeCaptcha();
            }).catch(err => {
              this.loginForm.captcha = '' ;
              this.changeCaptcha();
              this.loading = false
            })
          } else {

            this.loginForm.captcha = '' ;
            this.changeCaptcha();

            // console.log('登录失败，请重试');
            return false
          }
        })
      },
      //记住密码
      // rememberPsw(loginForm){
      //
      //   this.$refs[loginForm].validate(valid => {
      //
      //     if(valid){
      //
      //
      //     }else{
      //       console.log(5);
      //
      //       this.$message({
      //         type : 'error',
      //         center : true ,
      //         message : '请输入正确的手机号及登录密码'
      //       })
      //     }
      //   })
      //
      // },
      //更换验证码
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
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/login.scss";

  .svg-container {
    img {
      width: 0.15rem;
      height: 0.15rem;
      position: absolute;
      top: 37%;
    }
  }

</style>
