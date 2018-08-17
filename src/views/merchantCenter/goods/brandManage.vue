<template>
    <div class="brandManage activityTable" v-loading="loading"  element-loading-text="拼命加载中">
      <h1 class="h_title">品牌管理</h1>
      <div class="search">
        <div class="inputWrap">
          <el-input size="small" clearable :maxlength="40" v-model.trim="brand.brandCnName" placeholder="中文名称"></el-input>
          <el-input size="small" clearable :maxlength="40" v-model.trim="brand.brandEnName" placeholder="英文名称"></el-input>
          <el-select  size="small" clearable v-model="brand.EQ_status" filterable placeholder="审核状态">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button  size="mini" type="primary"  @click="getList()" class="searchOrder">搜索</el-button>
          <el-button  size="mini" type="danger"  @click="dialogVisible = true;" class="searchOrder">新增</el-button>
        </div>
      </div>
      <el-table  :data="tableData"  border  align="center">
        <el-table-column label="序号"  width="50" prop="id"></el-table-column>
        <el-table-column  label="品牌中文名称" prop="brandCnName"></el-table-column>
        <el-table-column  label="品牌英文名称" prop="brandEnName"></el-table-column>
        <el-table-column  label="品牌图片" >
          <template slot-scope="scope">
            <img v-if="scope.row.brandImage!== ''||scope.row.brandImage !== undefined || scope.row.brandImage !== null" class="showImg"
                 @click="bigImg = scope.row.brandImage ;mask = true ;" :src=" imageDomain + scope.row.brandImage" alt="" :onerror="errorImg"  />
            <img  :src="failImg" v-else />
          </template>
        </el-table-column>
        <el-table-column  label="审核状态">
          <template slot-scope="scope">
            {{ typeList[(scope.row.status+1)*1].name }}
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.status == '0'" @click="checkRefuse(scope.$index,scope.row.reason)">拒绝原因</el-button>
            <el-button type="text" v-if="scope.row.status == '0'" @click="handleDelete(scope.$index,scope.row.id)">删除</el-button>
          </template>

        </el-table-column>

      </el-table>
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
      <el-dialog title="新增品牌" :visible.sync="dialogVisible" width="70%"  :show-close="false" center>
        <el-form :model="brandForm" ref="brandForm" :rules="brandFormRule" label-position="right" class="brandForm">
          <el-form-item  labelWidth="130px" label="中文名称：" prop="brandCnName">
            <el-input class="inputInfo" size="small" v-model.trim="brandForm.brandCnName" :maxlength="40"
                 @change="checkCn(brandForm.brandCnName)"     placeholder="请输入品牌中文名称"></el-input>
          </el-form-item>
          <el-form-item   labelWidth="130px"  label="英文名称：" prop="brandEnName">
            <el-input class="inputInfo" size="small" v-model.trim="brandForm.brandEnName" :maxlength="40"
                      @change="checkEn(brandForm.brandEnName)"      placeholder="请输入品牌英文名称"></el-input>
          </el-form-item>
          <el-form-item labelWidth="130px"  label="品牌图片：" prop="brandImage">
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="brandForm.brandImage"
                        :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforeImgUpload">
              <img v-if="brandForm.brandImage" :src="imageDomain + brandForm.brandImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="brandImageWarn">请上传品牌图片</span>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button type="primary" size="mini" @click="confirm('brandForm')">确认</el-button>
          <el-button plain size="mini" @click="close('brandForm')">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog  title="审核拒绝原因" top="20%" :visible.sync="refuseDialog" width="60%" center>
        <p>拒绝原因： {{ refuseReason }}</p>
        <span slot="footer" class="dialog-footer">
        <el-button plain size="small" @click="refuseDialog= false ;">关闭</el-button>
      </span>
      </el-dialog>
      <div v-if="mask" @click="mask = false ;" class="mask">
        <img :src=" imageDomain + bigImg" alt="" />
      </div>
    </div>
</template>

<script>
    import { getToken } from "@/utils/auth";
    import { uploadImage  } from "@/api/activity"
    import { getBrandList , deleteBrand, addBrand ,checkCnName, checkEnName} from "@/api/merchant"
    import userPhoto from '@/assets/404_images/fail.png'

    export default {
      name: "brand-manage",
        data() {
        const validCnName = (rule,value,callback) => {
          if( value === ''){
            callback( new Error('请输入品牌中文名称'))
          }else{
            let reg = /^[0-9\u4e00-\u9fa5\.\&\s\•]+$/ ;
            if( !reg.test(value)){
              callback( new Error('请输入正确的中文字符'))
            }
            callback();
          }
        };
        const validEnName = ( rule, value ,callback) => {
          if( value === ''){
            callback( new Error('请输入品牌英文名称'))
          }else{
            let reg = /^[0-9A-Za-z\.\&\s\•]+$/;
            if( !reg.test(value)){
              callback( new Error('请输入正确的英文字符'))
            }
            callback();
          }
        };
            return {
              brand : {},
              typeList: [
                {
                  value : '',
                  name : '全部状态'
                },
                {
                  value : '0',
                  name : '审核拒绝'
                },
                {
                  value : '1',
                  name : '审核通过'
                },
                {
                  value : '2',
                  name : '审核中'
                }

              ],
              tableData : [],
              totalPages : 0,
              totalElements : 0,
              currentPage : 1,
              pageSize : 10,
              loading : false ,
              dialogVisible: false ,
              autoUpload : true ,
              imgUrl : process.env.BASE_API+'/file/upload',
              imageDomain : process.env.IMAGE_DOMAIN ,
              errorImg:'this.src="' + userPhoto + '"',
              failImg: userPhoto,
              mask : false ,
              bigImg : '',
              token: getToken(),
              brandImageWarn: false ,
              brandForm: {
                brandCnName: '',
                brandEnName: '',
                brandImage:''
              },
              brandFormRule: {
                brandCnName: [
                  {
                    required : true ,trigger : 'blur',validator : validCnName
                  }
                ],
                brandEnName: [
                  {
                    required : true ,trigger : 'blur',validator : validEnName
                  }
                ]
              },
              refuseDialog: false ,
              refuseReason: '',
            }
        },
        mounted() {
          // let type = this.$route.query.getNew ;
          // if( type !== undefined ){
          //   this.dialogVisible = true ;
          // }
          this.brand = this.$store.state.searchBar.brandList.brand ;
          this.getList();
        },
        methods: {
          getList(){
            this.loading = true ;

            let formData = new FormData();
            formData.append('currentPage',this.currentPage);
            formData.append('pageSize',this.pageSize);
            formData.append('EQ_status',this.brand.EQ_status);
            formData.append('LIKE_brandCnName',this.brand.brandCnName);
            formData.append('LIKE_brandEnName',this.brand.brandEnName);
            let data = {
              brand : { ...this.brand },
              currentPage : this.currentPage ,
              pageSize: this.pageSize
            };
            this.$store.commit('saveBrandList',data);
            getBrandList(formData).then( res => {
              this.loading = false ;
              if( res.data.status === '000000000'){
                this.tableData = res.data.data ;
                this.totalElements = res.data.totalElements;
                this.totalPages = res.data.totalPages;
              }
            })
          },
          beforeImgUpload(file) {
            // console.log(file)
            let reader = new FileReader();
            let ret = [];
            let _this = this;
            reader.onload = (e) => {
              let image = new Image();
              image.onload = function () {
                const isHeight = this.height;
                const isWidth = this.width;
                if (isWidth > 800 || isHeight > 800) {
                  _this.$message.error('图片尺寸过大，请重新选择后上传');
                  return false;

                } else {
                  let formData = new FormData();
                  formData.append('image', file);
                  uploadImage(formData).then(res => {
                    if( res.data.status === '000000000'){
                      _this.brandForm.brandImage = res.data.data.fileName ;
                      _this.brandImageWarn = false ;

                    }else{
                      _this.brandImageWarn = true ;
                    }
                  })
                }
              };

              image.src = e.target.result;
            };
            reader.readAsDataURL(file);
          },
          checkCn(value){
            checkCnName(value).then( res => {
              if( res.data.status === '000000000'){
                if(!res.data.data){
                  this.$message({
                    message: '您输入的中文品牌名称已存在，请重新输入',
                    type : 'error',
                    center : true
                  });
                  this.brandForm.brandCnName = '';

                }
              }
            })
          },
          checkEn(value){
            checkEnName(value).then( res => {
              if( res.data.status === '000000000'){
                if(!res.data.data){
                  this.$message({
                    message: '您输入的英文品牌名称已存在，请重新输入',
                    type : 'error',
                    center : true
                  });
                  this.brandForm.brandEnName = '';

                }
              }
            })
          },
          //查看品牌审核拒绝原因
          checkRefuse(index,reason){
            this.refuseReason = reason ;
            this.refuseDialog = true ;
          },
          //删除品牌
          handleDelete(index,id){
            deleteBrand(id).then( res => {
              if( res.data.status === '000000000'){
                this.$message( {
                  message : '该品牌已成功删除~',
                  type : 'success',
                  center : true
                });
                this.getList();
              }
            })
          },
          confirm(formName){
            if( this.brandForm.brandImage === ''){
              this.brandImageWarn = true ;
            }
            this.$refs[formName].validate((valid) => {
              if(valid&& !this.brandImageWarn){
                addBrand(this.brandForm).then( res => {
                  if( res.data.status === '000000000'){
                   this.$message({
                     message : '新增品牌成功，请稍后查看',
                     type : 'success',
                     center : true,
                     duration: 1500
                   });
                   setTimeout( ()=> {
                     this.dialogVisible = false ;
                     this.getList();


                   },2000)
                  }
                });

              }
            });
          },
          close(formName){
            this.$refs[formName].resetFields();
            this.dialogVisible = false ;
            this.brandImageWarn = false ;
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
  @import "../../../styles/activityTable";
  .brandManage{
    .search{
      height : 100px!important;
    }
    .el-table{
      img{
        width: 50% !important ;
        margin : auto!important ;
        display: block;
      }
    }
    .brandForm{
      .el-input{
        width : 60% ;
      }
      img{
        width : 100% ;
        height : 100% ;
      }
    }
  }
</style>
