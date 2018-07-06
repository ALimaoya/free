<template>
  <div class="openShop"  v-loading="loading"  element-loading-text="拼命加载中">
    <h1>我要开店</h1>
    <el-form :model="form" ref="form" :rules="formRule" label-position="right" >
      <!--<h2>账户表单</h2>-->
      <el-form-item  labelWidth="130px" label="店铺名称"  prop="name">
        <el-input class="inputInfo" :maxlength="40" size="small" v-model.trim="form.name" placeholder="店铺名称" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item labelWidth="130px" class="imgWrap" prop="logoImage" v-if="!readOnly" label="店铺LOGO">
        <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.logoImage"
                    :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :before-upload="beforeImgUpload">
          <img v-if="form.logoImage" :src="imageDomain + form.logoImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传店铺LOGO</span>

      </el-form-item>
      <el-form-item labelWidth="130px" class="imgWrap" v-else-if="readOnly" prop="logoImage" label="店铺LOGO">
        <!--<dl  @click="dialogVisible = true;"  >-->
          <!--<dt>店铺LOGO</dt>-->
          <!--<dd>-->
            <img v-if="form.logoImage !== ''" :src="imageDomain+ form.logoImage" alt="" />
            <img  src="../../../assets/404_images/fail.png"  alt="" v-else/>
          <!--</dd>-->
        <!--</dl>-->
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="主营" prop="mainBusiness">
        <el-input type="textarea" class="inputInfo" :maxlength="40" :rows="4" size="small" v-model.trim="form.mainBusiness" :disabled="readOnly" placeholder="主营"></el-input>
      </el-form-item>
      <el-form-item labelWidth="130px" label="类型" prop="type">
        <el-select  size="small" clearable v-model="form.type" :disabled="readOnly" filterable placeholder="请选择店铺类型">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="描述" prop="describes">
        <el-input class="inputInfo" :maxlength="200" size="small" type="textarea"  :rows="4" v-model.trim="form.describes" :disabled="readOnly" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item labelWidth="130px" >
        <el-button v-if="!readOnly" type="primary" size="small" @click="submit('form',handleType)">{{ handleType}}</el-button>

      </el-form-item>
    </el-form>
    <el-dialog title="店铺LOGO" :visible.sync="dialogVisible" width="60%" center>
      <div class="wrap">
        <img :src="imageDomain+ form.logoImage" alt="" />
        <!--<img src="../../../assets/404_images/fail.png" />-->
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="infoTip" width="60%" center  :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <!--<img :src="ImgSrc" alt="" />-->
      <p class="tips" v-if="infoStatus === '0'">您还未上传资质信息，请先前往上传资质信息</p>
      <p class="tips" v-else-if="infoStatus === '1'">您上传的资质信息正在审核中，审核通过后即可绑定店铺</p>
      <p class="tips" v-else-if="infoStatus === '3'">您上传的资质信息未通过审核，请先前往修改资质信息，待通过后即可绑定店铺</p>

      <div slot="footer">
        <el-button plain @click="goUpload" >前往资质上传</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {  getToken } from '@/utils/auth'
  import { uploadImage  } from "@/api/activity"
  import { shopInfo, getShop,getInfo, changeShop } from "@/api/userCenter"

  export default {
        name: "open-shop",
      data(){
        return{
          form : {
            id: '',
            name : '',
            mainBusiness: '',
            describes:'',
            logoImage: '',
            type: '',
            status : ''
          },
          formRule: {
            name: [
              {
                required: true ,trigger:'blur',message: '请输入店铺名称'
              }
            ],
            mainBusiness:[
              {
                required : true ,trigger : 'blur',message : '请输入店铺主营类目'
              }
            ],
            type: [
              {
                required: true ,trigger: 'change',message : '请选择店铺类型'
              }
            ],
            describes: [
              {
                required : true ,trigger: 'blur',message : '请填写店铺相关描述'
              }
            ]
          },
          typeList: [

            {
              value: '0',
              name : '旗舰店'
            },
            {
              value : '1',
              name : '专卖店'
            },
            {
              value : '2',
              name: '专营店'
            }
          ],
          readOnly : false ,
          imgTitle : '',
          dialogVisible: false,
          token : getToken() ,
          autoUpload : true ,
          imgUrl : process.env.BASE_API+'/file/upload',
          goodsImgWarn : false ,
          imageDomain : process.env.IMAGE_DOMAIN ,
          handleType: '提交',
          infoStatus: '0',
          infoTip: false ,
          loading: true
        }
      },
      mounted(){
        this.getAccountInfo();
      },
      methods : {
          getAccountInfo(){
            getInfo().then( res =>{
              // console.log(res);
              this.loading= false ;
              if(res.data.status === '000000000'){
                this.infoStatus = res.data.data.status;
                if(this.infoStatus !== '2'){
                  this.infoTip = true;
                }else{
                  this.getShopInfo();
                  this.infoTip = false;

                }
              }else{
                this.$message({
                  message : res.data.message ,
                  type : 'error',
                  center : true
                })
              }
            }).catch( err => {
              alert('服务器开小差啦，请稍等~')

            })
          },
        //获取信息
        getShopInfo(){
          this.loading= true ;

          getShop().then( res => {
            this.loading= false ;

            if(res.data.status === '000000000'){
              if(res.data.data === null){
                this.handleType = '提交'

              }else{
                this.form = res.data.data ;
                this.status = res.data.data.status ;
                if(this.status === '1' || this.status === '2'){
                  this.readOnly = true ;
                }else{
                  this.readOnly = false ;

                    if(this.status === '3'){
                      this.handleType = '修改'
                    }

                }
              }

            }else{
              this.$message({
                message : res.data.message ,
                type : 'error',
                center : true
              })
            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')

          })

        },


        // 上传图片
        beforeImgUpload(file) {
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
                uploadImage(formData,_this.token).then(res => {
                  if (res.data.status === '000000000') {
                    _this.form.logoImage = res.data.data.fileName ;

                    console.log(_this.form.logoImage)
                    _this.goodsImgWarn = false;
                  } else {
                    _this.$message({
                      message: res.data.message,
                      center: true,
                      type: 'error'
                    });
                    _this.goodsImgWarn = true;

                  }
                }).catch(err => {
                  // console.log(err) ;
                  _this.goodsImgWarn = true;

                })
              }
            };

            image.src = e.target.result;
          };
          reader.readAsDataURL(file);
        },

        //提交表单
        submit(formName,type){
          // console.log(this.form);


          if(this.form.logoImage === ''){
            this.goodsImgWarn = true ;
          }


          this.$refs[formName].validate((valid) => {
            if(valid&&!this.goodsImgWarn){
              //  判断资质信息是否已通过审核
              if(this.infoStatus === '1'|| this.infoStatus === '-1' ){
                this.$message({
                  message : '您上传的资质信息尚未通过，请通过后再进行店铺申请',
                  type : 'error',
                  center : true
                })
              }else {
               if(type === '提交'){
                 //  提交表单
                 this.loading= true ;

                 shopInfo(this.form).then( res => {
                   this.loading= false ;

                   if(res.data.status === '000000000'){
                     this.$message({
                       message : '您的店铺信息已提交，通过审核后即可添加商品' ,
                       type : 'success',
                       center : true,
                       duration : 1500
                     });
                     setTimeout(() => {
                       window.location.reload();

                     },2000)

                   }else{
                     this.$message({
                       message : res.data.message ,
                       type : 'error',
                       center : true
                     })
                   }
                 }).catch( err => {
                   alert('服务器开小差啦，请稍等~')

                 })
               }else if( type === '修改'){
                 //  提交表单
                 this.loading= true ;

                 changeShop(this.form).then( res => {
                   this.loading= false ;

                   if(res.data.status === '000000000'){
                     this.$message({
                       message : '您的店铺信息已修改，通过审核后即可添加商品' ,
                       type : 'success',
                       center : true,
                       duration : 1500
                     });
                     setTimeout(() => {
                       window.location.reload();

                     },2000)

                   }else{
                     this.$message({
                       message : res.data.message ,
                       type : 'error',
                       center : true
                     })
                   }
                 }).catch( err => {
                   alert('服务器开小差啦，请稍等~')

                 })
               }
              }
            }else{

            }
          })
        },

        goUpload(){
          this.$router.push('/merchantCenter/userCenter/infoUpload')
        }

      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  h1{
    margin : 0 ;
    padding : 0.2rem  0.4rem ;
    border-bottom : 1px solid #666 ;
    font-size : 0.22rem ;
    line-height : 0.4rem ;
    height : 0.7rem ;

  }
  .el-form{
    margin : 0.5rem auto;
  }
    .el-form-item{
      width : 60%!important;
      margin : 0.5rem auto;

      .upload{
        img{
          width: 100% ;
        }
      }
    }
    .imgWrap{
      width : 1.5rem ;
      float : left ;
      img{
        max-width: 1.5rem ;
        max-height: 1.5rem;
      }
      /*span,img{*/
        /*width : 100% ;*/
      /*}*/
      /*dl{*/
        /*width: 20% ;*/
        /*margin-left : 0!important;*/
        /*height : auto!important;*/
      /*}*/

    }
  .el-dialog{
    /*height : 50%!important;*/
    p{
      height : 10vh;
      font-size : 0.3rem ;
      text-align : center ;
      line-height : 10vh ;
    }
  }
</style>
