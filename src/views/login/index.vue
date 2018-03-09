<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">丫贝试客商家中心</h3>
      <el-form-item prop="mobile">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input type="text" v-model.number="loginForm.mobile" autoComplete="on" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input :type="pwdType" @keyup.enter.native="handleLogin('loginForm')" v-model.trim="loginForm.password" autoComplete="on"
          placeholder="请输入密码"></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item prop="captcha" v-if="examine">
        <span class="svg-container">
          <img src="../../assets/imgs/verify2.png" alt="" />
        </span>
        <el-input style="width : 1.5rem;" v-model="loginForm.captcha" autoComplete="on" placeholder="请输入验证码"></el-input>
        <img class="show-captcha" :src="'data:image/png;base64,'+ imgCode" alt="" @click="changeCaptcha" />

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
    validPassWord
  } from '@/utils/validate'
  import {
    getCaptcha
  } from "@/api/login"
  import {
    setMobile
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
        examine: false

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
              console.log(res);
              this.loading = false;
              if (res.data.status === '000000000') {
                this.$router.push({
                  path: '/'
                });
                // this.$router.push('/activity/approval') 
                setMobile( this.loginForm.mobile)
              } else {
                this.examine = true;
                if (res.data.status === '001003006') {
                  this.$message({
                    message: '登录密码输入错误，请确认后重新输入',
                    type: 'error',
                    center: 'true'
                  })
                } else if (res.data.status === '001003003') {
                  this.$message({
                    message: res.data.message,
                    type: 'error',
                    center: 'true'
                  })
                }
              }

            }).catch(err => {

              this.loading = false
            })
          } else {
            console.log('登录失败，请重试');
            return false
          }
        })
      },

      //更换验证码
      changeCaptcha() {
        getCaptcha().then(res => {
          console.log(res);
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
  .goOther {
    margin-top: 7px;
    font-size: 12px;
    color: #fefefe;
    .toRes {
      float: left;
    }
    .toPsw {
      float: right;
    }
  }

  .svg-container {
    img {
      width: 0.15rem;
      height: 0.15rem;
      position: absolute;
      top: 37%;
    }
  }

</style>
