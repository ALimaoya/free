<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="changePswForm" :rules="pswRules" ref="changePswForm" label-position="left" label-width="0px"
             class="card-box login-form">
      <h3 class="title">丫贝试客商家中心</h3>
      <el-form-item prop="phone">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input  type="text" v-model.trim="changePswForm.phone"  placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" v-model.trim="changePswForm.password" autoComplete="on"
                  placeholder="请输入新密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="checkPsw">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter="handleLogin" v-model.trim="changePswForm.checkPsw" autoComplete="on"
                  placeholder="请再次确认新密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click="handleLogin">
          确认提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { validatePhone } from '@/utils/validate'

  export default {
    name: 'changePsw',
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
        if (value.length < 6) {
          callback(new Error('密码不能小于6位'))
        } else {
          if(this.changePswForm.checkPsw !== ''){
            this.$refs.changePswForm.validateField('checkPsw') ;
          }
          callback()
        }
      };
      const validatePass2 = (rule, value ,callback) => {
        if(value === ''){
          callback(new Error('请再次输入密码'));
        }else{
          if(value !== this.changePswForm.password){
            callback(new Error('两次输入密码不一致！'))
          }
          callback()
        }
      };
      return {
        changePswForm: {
          phone: '',
          password: '',
          checkPsw : ''
        },
        pswRules: {
          phone: [{ required: true, trigger: 'blur', validator: validateTel }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }],
          checkPsw: [{ required: true, trigger: 'blur', validator: validatePass2 }]
        },
        loading: false,
        pwdType: 'password'
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
        this.$refs.changePswForm.validate(valid => {
          if(valid) {
            this.loading = true;
            // this.$store.dispatch('ChangePsw', this.changePswForm).then(() => {
              this.loading = false;
              this.$router.push({ path: '/login' })
            // }).catch(() => {
            //   this.loading = false;
            // })
          } else {
            console.log('修改失败，请确认填写信息后重新提交!!');
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/login.scss";

</style>
