<template>
  <div class="addressManage"  v-loading="loading"  element-loading-text="拼命加载中">
    <h1 class="h_title">{{this.title }}</h1>
    <div v-if="isNew==='0'|| isNew === '1'" class="formWrap">
       <el-form :model="form" ref="form" label-position="right" :rules="formRule">
        <!--<h2>账户表单</h2>-->
          <el-form-item  labelWidth="130px" label="联系人"  prop="userName">
            <el-input class="inputInfo" :maxlength="40" size="small" v-model.trim="form.userName" placeholder="请填写联系人" ></el-input>
          </el-form-item>
          <el-form-item   labelWidth="130px"  label="省份" prop="province">
            <el-select  size="small" clearable v-model="form.province" @change="changeProvince" filterable placeholder="请选择省份">
              <el-option
                v-for="item in provinceList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  labelWidth="130px" label="详细地址" prop="detailAddress">
            <el-input class="inputInfo" :maxlength="200" type="textarea" :row="4" size="small" v-model.trim="form.detailAddress"  placeholder="详细地址"></el-input>
          </el-form-item>
          <el-form-item  labelWidth="130px" label="邮编" prop="zipCode">
            <el-input class="inputInfo" size="small" v-model.trim="form.zipCode" placeholder="邮编"></el-input>
          </el-form-item>
         <el-form-item  labelWidth="130px" label="电话" prop="mobile">
           <el-input class="inputInfo" size="small" v-model.trim="form.mobile" placeholder="电话"></el-input>
         </el-form-item>
         <el-form-item class="btnWrap">
           <el-button v-if="this.isNew === '0'" type="primary" size="mini" @click="submitFrom('form')">确定</el-button>
           <el-button v-else-if="this.isNew === '1'" type="primary" size="mini" @click="changeFrom('form')">修改</el-button>
           <el-button plain size="mini" @click="cancel('form')">取消</el-button>
         </el-form-item>
       </el-form>
    </div>
    <div class="addressList" v-else >
      <div class="tableTitle">
        <h2>地址列表</h2>isNew
        <el-button type="primary" size="mini" @click="newAddr">新增</el-button>
      </div>

      <el-table :data="tableData" border fit>
        <el-table-column prop="userName" label="联系人"></el-table-column>
        <el-table-column prop="province" label="省份" ></el-table-column>
        <el-table-column prop="detailAddress" label="详细地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zipCode" label="邮编" ></el-table-column>
        <el-table-column prop="mobile" label="联系电话" ></el-table-column>
        <el-table-column prop="type" label="类型" >
          <template slot-scope="scope">
            <span>{{ typeName[scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" >
          <template slot-scope="scope">
            <el-button class="check" size="mini" type="text"  @click="editorAddr(scope.$index,scope.row.id)">修改</el-button>
            <!--<el-button class="check" size="mini" type="text"  @click="deleteAddr(scope.$index,scope.row.id)">删除</el-button>-->
            <el-button class="check" size="mini" v-if="scope.row.type !== '0'"  type="text"  @click="changeType(scope.$index,scope.row.id,'0')">设为发货地址</el-button>
            <el-button class="check" size="mini" v-if="scope.row.type !== '1'"  type="text"  @click="changeType(scope.$index,scope.row.id,'1')">设为收货地址</el-button>

          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog class="shop_dialog" title="提示" top="20%" :visible.sync="changeDialog" width="30%" center
                           :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <p v-if="setType === '0'">确定将该地址设为发货地址吗？</p>
    <p v-else-if="setType === '1'">确定将该地址设为收货地址吗？</p>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmChange">确定</el-button>
        <el-button plain @click="changeDialog = false ">取消</el-button>

      </span>
  </el-dialog>
    <el-dialog class="shop_dialog" title="提示" top="20%" :visible.sync="hasShop" width="40%" center
               :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <p>{{ tips }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applyShop">前往我要开店</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import  { validatePhone , validateZipCode} from '@/utils/validate';
  import { getAddress,getAddrDetail, changeAddrStatus, newAddress, changeAddress, getProvinceList } from "@/api/userCenter"
  import {  getShopInfo} from "@/api/merchant"

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
          };
          return{
            isNew : '',
            form : {
              userName : '',
              province : '',
              detailAddress: '',
              zipCode: '',
              mobile: ''
            },
            formRule : {
              userName : [
                {
                  required : true , trigger : 'blur', message : '请填写联系人'
                }
              ],
              province:[
                {
                  required : true , trigger : 'change', message : '请选择省份'

                }
              ],
              detailAddress : [
                {
                  required : true , trigger : 'blur', message : '请填写详细地址'
                }
              ],
              zipCode : [
                {
                  required : true , trigger : 'blur', validator : validZipCode

                }
              ],
              mobile: [
                {
                  required : true , trigger : 'blur', validator : validTel

                }
              ]
            },
            provinceList : [],
            tableData : [],
            typeName: ['发货地址','收货地址'],
            setType: '',
            changeDialog: false ,
            changeData: {},
            loading: true ,
            tips: '',
            hasShop: false ,
          }
      },
      computed : {
        title: function(){
          if(this.isNew=== '0'){
            return '添加地址'
          }else if(this.isNew === '1'){
            return '修改地址'
          }else{
            return '地址管理'
          }
        }
      },
      mounted(){
        this.getShop();


      },
      methods : {
        //判断是否已有店铺
        getShop(){
          getShopInfo().then(res=> {
            this.loading= false ;

            if(res.data.status === '000000000'){
              this.hasShop = false ;
              this.getAddressList();
              this.getProvince();

              return true ;


            }else{
              // this.$message({
              //   message : res.data.message,
              //   center: true ,
              //   type : 'error'
              // });
              this.tips = res.data.message;
              this.hasShop = true ;


            }
          })
        },
          //获取地址列表
          getAddressList(){
            getAddress().then( res => {
              this.loading= false ;

             this.tableData = res.data.data
            })
          },
        changeProvince(){
          if(this.provinceList.length === 0){
            this.getProvince();

          }
        },
        //修改地址类型
        changeType(index,id,type){

          this.setType = type ;
          this.changeDialog = true ;
          this.changeData = {
            addressId: id,
            addressType: type
          };

        },
        //确定修改
        confirmChange(){
          // this.loading= true ;

          changeAddrStatus(this.changeData).then( res => {
            // this.loading= false ;

            this.$message({
                message : '操作成功，请稍后确认' ,
                center: true ,
                type : 'success',
                duration: 1000
              });
              setTimeout(()=>{

                this.isNew = '' ;
                this.changeDialog = false ;
                this.getAddressList();

              },2000)
          })
        },
        //获取省份列表
        getProvince(){
          getProvinceList().then( res => {
            this.provinceList = res.data.data ;
          })
        },
        editorAddr(index,id){
          this.loading= true ;

          getAddrDetail(id).then( res => {
            this.loading= false ;

           this.form = res.data.data ;
              this.isNew = '1' ;

          })
        },
        deleteAddr(index,id){

        },
        //提交表单
        submitFrom(formName){

          this.$refs[formName].validate((valid) => {
            if(valid){
              this.loading= true ;

              newAddress(this.form).then( res => {
                this.loading= false ;
                this.$message({
                    message : '提交成功，请稍后确认' ,
                    center: true ,
                    type : 'success',
                  });

                  setTimeout(()=>{
                    this.isNew = '' ;
                    this.getAddressList();
                  },1500)
              })

            }else{

            }
          })
        },

        //修改地址信息
        changeFrom(formName){
          this.$refs[formName].validate((valid) => {
            if(valid){
              this.loading= true ;

              changeAddress(this.form).then( res => {
                this.loading= false ;
                this.$message({
                    message : '修改成功，请稍后确认' ,
                    center: true ,
                    type : 'success',
                  });
                  setTimeout(()=>{
                    this.isNew = '' ;
                    this.getAddressList();
                  },1500)

              })

            }else{

            }
          })
        },
        newAddr(){
          this.isNew = '0' ;
          this.form = {
            userName : '',
              province : '',
              detailAddress: '',
              zipCode: '',
              mobile: ''
          }
        },
        // 取消新增
        cancel(formName){
          this.$refs[formName].resetFields();
          this.isNew = '' ;

        },
        //  跳转到申请店铺
        applyShop(){
          this.$router.push('/merchantCenter/userCenter/openShop')
        },
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
      .el-button{
        width: 100% ;
        text-align: center;
        margin: 0;
      }
    }
  }
  .el-dialog{
    p{
      text-align: center ;
      font-size : 0.26rem ;
      color : #333 ;
    }
  }
  .shop_dialog{
    p{
      height : 10vh;
      font-size : 0.3rem ;
      text-align : center ;
      line-height : 10vh ;
    }
  }

</style>
