<template>
  <div class="subAccount tableBox">
    <h1 class="h_title">子账号管理<el-button type="danger" size="mini" @click="newSubDialog = true ;">+新增子账号</el-button></h1>
    <el-table  :data="tableData"  border fit  >
      <el-table-column prop="account" label="账号名"></el-table-column>
      <el-table-column prop="note" label="账号备注"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="wechat" label="绑定微信"></el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="changeNote(scope.$index,scope.row.id)">修改备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改备注" :visible.sync="dialogVisible" width="50%" center >
      <div class="dialog_content">
        <span>修改备注：</span><el-input type="text" size="small" v-model.trim="nickName" placeholder="请输入新昵称"></el-input>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button type="danger" size="mini" @click="confirm(nickName)">确认修改</el-button>
        <el-button plain size="mini" @click="dialogVisible= false;nickName = ''">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新建子账号" :visible.sync="newSubDialog" width="50%" center >
      <el-form :model="form" ref="form" :rules="formRule" label-position="right" >
        <el-form-item  labelWidth="150px" label="账号名：" prop="account">
          <el-input class="inputInfo" size="small" v-model.trim="form.account" placeholder="请输入账号名"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="150px"  label="账号备注：" prop="note">
          <el-input class="inputInfo" size="small" v-model.trim="form.note" placeholder="请输入账号备注"></el-input>
        </el-form-item>
        <el-form-item  labelWidth="150px" label="登陆密码：" prop="password">
          <el-input :type="pwdType1" class="inputInfo" size="small" v-model.trim="form.password" placeholder="请输入登录密码"></el-input>
          <!--<ul>-->
            <!--<p>安全程度</p>-->
            <!--<li>8到16位</li>-->
            <!--<li></li>-->
          <!--</ul>-->
          <span class="show-pwd" @click="showPwd('1')">
            <svg-icon icon-class="eyeopen" v-if="pwdType1===''" />
            <svg-icon v-else="pwdType1==='password'" icon-class="eyeclose"></svg-icon>
          </span>
        </el-form-item>
        <el-form-item  labelWidth="150px" label="确认密码：" prop="checkPsw">
          <el-input  :type="pwdType2" class="inputInfo" size="small" v-model.trim="form.checkPsw" placeholder="请再次确认密码"></el-input>
          <span class="show-pwd" @click="showPwd('2')">
            <svg-icon icon-class="eyeopen" v-if="pwdType2===''" />
            <svg-icon v-else="pwdType2==='password'" icon-class="eyeclose" />
          </span>
        </el-form-item>
        <el-form-item  labelWidth="150px" label="拥有的权限：" prop="role">
          <el-checkbox-group v-model="form.role">
            <el-checkbox v-for="(item,index) in roleList" :label="item.value" :key="index" name="role">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item  labelWidth="150px" label="账户绑定手机号：" prop="tel">
          <el-input class="inputInfo" size="small" v-model.trim="form.tel" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button type="danger" size="mini" @click="confirmNew('form')">确认创建</el-button>
        <el-button plain size="mini" @click="cancel('form')">取消</el-button>
      </div>
    </el-dialog>
    <div class="block2">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalElements">
      </el-pagination>
      <span class="totalItems">共{{totalPages }}页，{{ totalElements }}条记录</span>
    </div>

  </div>
</template>

<script>
  import {  validPassWord,validatePhone } from '@/utils/validate'

  export default {
        name: "sub-account",
      data(){
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
        const validTel = ( rule,value,callback) => {
          if(value === ''){
            callback(new Error('请填写联系电话'))
          }else{
            if(!validatePhone(value)){
              callback(new Error('请填写正确格式的联系电话'))
            }
            callback()
          }
        };

        return{
            tableData: [],
            dialogVisible: false ,
            nickName: '',
            dataIndex : '',
            noteId : '',
            totalPages : '',
            totalElements : 0,
            currentPage : 1,
            pageSize : 10,
            newSubDialog: false,
            form:{
              account:'',
              note: '',
              password:'',
              checkPsw:'',
              role:[],
              tel:''
            },
            formRule: {
              account:[
                {
                  required: true, trigger : 'blur',message : '请输入账号名'
                }
              ],
              password: [
                {
                  required: true, trigger: 'blur', validator: validatePass
                }
              ],
              checkPsw: [
                {
                  required: true, trigger: 'blur', validator: validateCheck
                }
              ],
              role: [
                {
                  required : true ,trigger : 'change',message : '请至少选择一个账号权限', type: 'array',
                }
              ],
              tel: [
                {
                  required : true ,trigger : 'blur',validator : validTel
                }
              ]
            },
            roleList: [
              {
                value : '1',
                name : '管理员'
              },
              {
                value : '2',
                name : '客服'
              },
              {
                value : '3',
                name : '运营'
              },
              {
                value : '4',
                name : '客服管理员'
              }
            ],
            pwdType1: 'password',
            pwdType2: 'password',
          }
      },
      mounted(){
        this.tableData = [
          {
            account : '123',
            role: '啊啊啊',
            note : '大多'
          }
        ]
      },
      methods: {
        changeNote(index,id){
          this.dataIndex = index ;
          this.noteId = id ;
          this.dialogVisible = true ;
        },
        //确认修改备注
        confirm(){
          if(this.nickName !==''){
            this.tableData[this.dataIndex].note = this.nickName ;
            // this.noteId  ;
            this.dialogVisible = false  ;
          }else{
            this.$message({
              message : '请输入修改后的备注',
              type : 'error',
              center : true
            })
          }


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

        //提交新建子账号
        confirmNew(formName){
          // console.log(this.form);
          this.$refs[formName].validate((valid) => {
            if(valid){
              this.newSubDialog = false ;

            }else{

            }
          })

        },
        cancel(formName){
          this.$refs[formName].resetFields();
          this.newSubDialog = false ;
        },
        handleSizeChange(val) {

          this.pageSize = val ;
          this.getList();
        },

        handleCurrentChange(val) {

          this.currentPage = val ;
          this.getList();
        },
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/table';
  .h_title{
    .el-button{
      float : right ;
    }
  }
  .dialog_content{

    .el-input{
      width : 40%;
      margin-left : 0.2rem;
    }
  }
  .el-form{
    .el-form-item{
      width : 70% ;
      margin : 0.3rem auto ;
      position: relative;

      .el-input{
        width : 80% ;

      }
      .show-pwd {
          position: absolute;
          left: 70%;
          top: 0;
          font-size: 0.16rem;
          color: $dark_gray;
          cursor: pointer;
          user-select:none;
        }
    }
  }
</style>
