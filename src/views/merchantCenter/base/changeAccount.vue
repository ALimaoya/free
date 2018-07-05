<template>
    <div class="change-account new">
      <h1>修改账户</h1>
      <el-form :model="form" ref="form" :rules="formRule" label-position="right" >
        <h2>账户表单</h2>
        <el-form-item  labelWidth="130px" label="账户名称"  prop="name">
          <el-input class="inputInfo" size="small" v-model.trim="form.name" disabled="disabled" placeholder="账户名称 2-20位"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="真实姓名" prop="realName">
          <el-input class="inputInfo" :maxlength="20" size="small" v-model.trim="form.realName" placeholder="真实姓名 最长20位"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="账户编号" prop="code">
          <el-input class="inputInfo" :maxlength="20" size="small" v-model.trim="form.code" disabled="disabled" placeholder="账户编号"></el-input>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="账户密码" prop="password">
          <el-input class="inputInfo" :type="pwdType1" size="small" v-model.trim="form.password" placeholder="账户密码 8-16位"></el-input>
          <span class="show-pwd" @click="showPwd('1')">
            <svg-icon icon-class="eyeopen" v-if="pwdType1===''" />
            <svg-icon v-else="pwdType1==='password'" icon-class="eyeclose" />
          </span>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="确认密码" prop="checkPsw">
          <el-input class="inputInfo" :type="pwdType2" size="small" v-model.trim="form.checkPsw" placeholder="确认密码 8-16位"></el-input>
          <span class="show-pwd" @click="showPwd('2')">
            <svg-icon icon-class="eyeopen" v-if="pwdType2===''" />
            <svg-icon v-else="pwdType2==='password'" icon-class="eyeclose" />
          </span>
          <span class="show-pwd" @click="showPwd('2')">
            <svg-icon icon-class="eyeopen" v-if="pwdType2===''" />
            <svg-icon v-else="pwdType2==='password'" icon-class="eyeclose" />
          </span>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="激活状态：" prop="result">
          <el-select  size="small" clearable v-model="form.activation" filterable>
            <el-option
              v-for="item in activationList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="有效状态：" prop="result">
          <el-select  size="small" clearable v-model="form.effective" filterable>
            <el-option
              v-for="item in effectiveList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item labelWidth="130px" label="所属商户">
          <div class="inputInfo">年青人</div>
        </el-form-item>
        <el-form-item labelWidth="130px" label="分配角色">
            <el-checkbox class="inputInfo" v-model="form.role" label="1">商户平台用户</el-checkbox>
        </el-form-item>
        <el-form-item labelWidth="120px" >
          <el-button class="inputInfo button" type="primary" size="small" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import {  validPassWord } from '@/utils/validate'

  export default {
        name: "change-account",
        data() {
          // const validRealName = (rule,value,callback) => {
          //   if(value === ''){
          //     callback(new Error('请填写真实姓名'))
          //   }else{
          //     if(value.length > 40 ){
          //       callback(new Error('真实姓名不得超过40个字符'))
          //     }
          //     callback();
          //   }
          // };
          const validatePass = (rule, value, callback) => {
            if (!validPassWord(value)) {
              callback(new Error('密码为8-16位的数字、字母组合'))
            } else {
              if (this.form.checkPsw !== '') {
                this.$refs.form.validateField('checkPsw');
              }
              callback()
            }
          };
          const validateCheck = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else {
              if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致！'))
              }
              callback()
            }
          };
            return {
              form : {
                name : '',
                realName: '',
                password : '',
                checkPsw: '',
                activation: '1',
                effective: '1',
                // owner : '',
                role : true,
              },
              formRule : {

                // realName: [
                //   {
                //     required : true , trigger : 'blur' , validator : validRealName
                //   }
                // ],
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
              activationList: [
                {
                  value: '1',
                  name: '未激活'
                },
                {
                  value : '2',
                  name : '已激活'
                },
              ],
              effectiveList: [
                {
                  value : '1',
                  name : '无效'
                },
                {
                  value : '2',
                  name : '有效'
                }
              ],
              pwdType1: 'password',
              pwdType2: 'password',
            }

        },
        mounted() {
          this.getInfo();
        },
        methods: {
          getInfo(){
            // this.form =
          },
          showPwd(type) {
            if(type === '1'){
              if (this.pwdType1 === 'password') {
                this.pwdType1 = ''
              } else {
                this.pwdType1 = 'password'
              }
            }else{
              if (this.pwdType2 === 'password') {
                this.pwdType2 = ''
              } else {
                this.pwdType2 = 'password'
              }
            }
          },

          submitForm(formName){
            this.$refs[formName].validate((valid) => {
              if(valid){

              }else{

              }
            })

          }
        }
    }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/variables';
  @import '../../../styles/new';

</style>
