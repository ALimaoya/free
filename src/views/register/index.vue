<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="RegForm" :rules="RegRules" ref="RegForm" label-position="left" label-width="0px"
             class="card-box login-form">
      <h3 class="title">丫贝试客商家中心</h3>
      <el-form-item prop="mobile">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="RegForm.mobile" autoComplete="on" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType"  v-model.trim="RegForm.password" autoComplete="on"
                  placeholder="请输入密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="checkPsw">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model.trim="RegForm.checkPsw" autoComplete="on"
                  placeholder="请再次确认密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
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
  import '@/api/login'
  export default {
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
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          if(this.RegForm.checkPsw !== ''){
            this.$refs.RegForm.validateField('checkPsw') ;
          }
          callback()
        }
      }
      const validateCheck = (rule, value ,callback) => {
        if(value === ''){
          callback(new Error('请再次输入密码'));
        }else{
          if(value !== this.RegForm.password){
            callback(new Error('两次输入密码不一致！'))
          }
          callback()
        }
      }
      return {
        RegForm: {
          mobile: '',
          password: '',
          checkPsw: ''
        },
        RegRules: {
          mobile: [{ required: true, trigger: 'blur', validator: validateTel }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }],
          checkPsw: [{ required: true, trigger: 'blur', validator: validateCheck }]

        },
        loading: false,
        pwdType: 'password',

      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
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
</style>
