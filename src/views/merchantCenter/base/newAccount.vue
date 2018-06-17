<template>
  <div class="newAccount new">
    <h1>新增账户</h1>
    <el-form :model="form" ref="form" :rules="formRule" label-position="right" >
      <h2>账户表单</h2>
      <el-form-item  labelWidth="130px" label="账户名称"  prop="name">
        <el-input class="inputInfo" size="small" v-model.trim="form.name" placeholder="账户名称 2-20位"></el-input>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="真实姓名" prop="realName">
        <el-input class="inputInfo" :maxLength="20" size="small" v-model.trim="form.realName" placeholder="真实姓名 最长20位"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="账户密码" prop="password">
        <el-input class="inputInfo" size="small" v-model.trim="form.password" placeholder="账户密码 6-12位"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="确认密码" prop="checkPsw">
        <el-input class="inputInfo" size="small" v-model.trim="form.checkPsw" placeholder="确认密码 6-12位"></el-input>
      </el-form-item>
      <el-form-item labelWidth="130px" label="所属商户">
        <div class="inputInfo">年青人</div>
      </el-form-item>
      <el-form-item labelWidth="130px" label="分配角色">
        <el-radio-group class="inputInfo" v-model="form.role">
          <el-radio  label="1">商户平台用户</el-radio>
          <!--<el-radio  label="2">备选项</el-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item labelWidth="120px" >
        <el-button class="inputInfo button" type="primary" size="small" @click="submitForm('form')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import ElFormItem from "element-ui/packages/form/src/form-item";
    import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
    import {  validPassWord } from '@/utils/validate'
    export default {
      components: {
        ElRadioGroup,
        ElFormItem
      },
      name: "new-account",
      data(){
        const validName = (rule , value ,callback)=>{
          if(value === ''){
            callback(new Error('请填写账户名称'))
          }else{
            if(value.length > 20|| value.length < 2 ){
              callback(new Error('账户名称不得超过20个字符且不少于2个字符'))
            }
            callback();
          }
        };
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
            callback(new Error('密码为6-12位的数字、字母组合'))
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
          return{
            form : {
              name : '',
              realName: '',
              password : '',
              checkPsw: '',
              // owner : '',
              role : '',
            },
            formRule : {
              name : [
                {
                  required : true ,trigger : 'blur' , validator : validName
                }
              ],
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
            }
          }
      },
      methods : {
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
