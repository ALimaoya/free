<template>
  <div class="addressManage">
    <h1 class="h_title">{{title }}</h1>
    <div v-if="isNew" class="formWrap">
       <el-form :model="form" ref="form" label-position="right" :rules="formRule" >
        <!--<h2>账户表单</h2>-->
          <el-form-item  labelWidth="130px" label="联系人"  prop="name">
            <el-input class="inputInfo" :maxLength="20" size="small" v-model.trim="form.name" placeholder="请填写联系人" ></el-input>
          </el-form-item>
          <el-form-item   labelWidth="130px"  label="省份" prop="provice">
            <el-select  size="small" clearable v-model="form.provice" filterable placeholder="请选择省份">
              <el-option
                v-for="item in proviceList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  labelWidth="130px" label="详细地址" prop="address">
            <el-input class="inputInfo" :maxLength="200" type="textarea" :row="4" size="small" v-model.trim="form.address"  placeholder="详细地址"></el-input>
          </el-form-item>
          <el-form-item  labelWidth="130px" label="邮编" prop="zipCode">
            <el-input class="inputInfo" size="small" v-model.trim="form.zipCode" placeholder="邮编"></el-input>
          </el-form-item>
         <el-form-item  labelWidth="130px" label="电话" prop="tel">
           <el-input class="inputInfo" size="small" v-model.trim="form.tel" placeholder="电话"></el-input>
         </el-form-item>
         <el-form-item class="btnWrap">
           <el-button type="primary" size="mini" @click="submitFrom('form')">确定</el-button>
           <el-button plain size="mini" @click="cancel('form')">取消</el-button>

         </el-form-item>
       </el-form>
    </div>
    <div class="addressList" v-else >
      <div class="tableTitle">
        <h2>地址列表</h2>
        <el-button type="primary" size="mini" @click="isNew = true;">新增</el-button>
      </div>

      <el-table :data="tableData" border fit>
        <el-table-column prop="name" label="联系人"></el-table-column>
        <el-table-column prop="province" label="省份" ></el-table-column>
        <el-table-column prop="address" label="详细地址" ></el-table-column>
        <el-table-column prop="zipCodeNum" label="邮编" ></el-table-column>
        <el-table-column prop="tel" label="联系电话" ></el-table-column>
        <el-table-column prop="type" label="类型" ></el-table-column>
        <el-table-column prop="action" label="操作" >
          <template slot-scope="scope">
            <el-button class="check" style="padding : 0 ;" type="primary"  @click="editorAddr(scope.$index,scope.row.addressId)">修改</el-button>
            <el-button class="check" style="padding : 0 ;" type="warning"  @click="deleteAddr(scope.$index,scope.row.addressId)">删除</el-button>

          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
  import  { validatePhone , validateZipCode} from '@/utils/validate';
    export default {
        name: "addressManage",
      data(){
          const validZipCode = (rule,value,callback) => {
            if(value === ''){
              callback(new Error('请填写邮编'))
            }else{
              if(!validateZipCode(value)){
                callback(new Error('请填写正确格式的邮编'))
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
          }
          return{
            isNew : false,
            form : {
              name : '',
              provice : '',
              address: '',
              zipCode: '',
              tel: ''
            },
            formRule : {
              name : [
                {
                  required : true , trigger : 'blur', message : '请填写联系人'
                }
              ],
              provice:[
                {
                  required : true , trigger : 'change', message : '请选择省份'

                }
              ],
              address : [
                {
                  required : true , trigger : 'blur', message : '请填写详细地址'
                }
              ],
              zipCode : [
                {
                  required : true , trigger : 'blur', validator : validZipCode

                }
              ],
              tel: [
                {
                  required : true , trigger : 'blur', validator : validTel

                }
              ]
            },
            proviceList : [],
            tableData : []
          }
      },
      computed : {
        title(){
          if(this.isNew){
            return '添加地址'
          }else{
            return '地址管理'
          }
        }
      },
      mounted(){
        this.getAddressList();
        this.getProvice();
      },
      methods : {
          //获取地址列表
          getAddressList(){
            // this.tableData =
          },
        //获取省份列表
        getProvice(){

        },
        editorAddr(index,id){

        },
        deleteAddr(index,id){

        },
        //提交表单
        submitFrom(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){

            this.isNew = false ;
            this.getAddressList();
            }else{

            }
          })
        },

        // 取消新增
        cancel(formName){
          this.$refs[formName].resetFields();
          this.isNew = false ;

        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/activityTable';
  @import '../../../styles/table';

  .formWrap{
    margin-top : 0.5rem ;
    .el-form{
      width : 70% ;
      margin : 0 auto ;
      .el-form-item{
        width : 60% ;
        /*margin : auto ;*/
      }
      .btnWrap{
        margin : 0 auto;
      }
    }
  }
  .addressList{
    /*width : 90% ;*/
    .el-table{
      border-color : #aaa;
      border-radius: 0.05rem ;
      width : 95% ;
      margin : 0 auto ;
    }
  }

</style>
