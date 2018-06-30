<template>
  <div class="step4">
    <h1>我要开店</h1>
    <el-form ref="form" :model="form" :rules="formRule" center label-position="top">
      <el-form-item label="店铺名称"  prop="name">
        <el-input type="text" size="small" v-model="form.name" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item label="主营" prop="mainBusiness">
        <el-input type="text" size="small" :disabled="readOnly" v-model="form.mainBusiness"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select  size="small" clearable v-model="form.type" :disabled="readOnly" filterable placeholder="请选择店铺类型">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="describes">
        <el-input type="textarea" :rows="4" size="small" v-model="form.describes" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item class="imgWrap" prop="logoImage" v-if="!readOnly" label="店铺LOGO">
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.logoImageImage"
                        :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :before-upload="beforeImgUpload">
              <img v-if="form.logoImage" :src="imageDomain + form.logoImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传店铺LOGO</span>

      </el-form-item>
      <!--<el-form-item class="imgWrap" prop="logo" label="店铺LOGO">-->
       <dl @click="dialogVisible = true;" v-else-if="readOnly" >
          <dt>店铺LOGO</dt>
          <dd>
            <img v-if="form.logoImage !== undefined" :src="imageDomain +form.logoImage" alt="" />
            <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
          </dd>
        </dl>
      <!--</el-form-item>-->
    </el-form>
    <el-button v-if="readOnly" type="primary" size="small" @click="goDetail">查看</el-button>
    <el-button v-if="!readOnly" type="primary" size="small" @click="submit('form',handleType)">{{ handleType}}</el-button>

    <el-dialog title="店铺LOGO" :visible.sync="dialogVisible" width="60%" center>
      <div class="wrap">
        <img :src="imageDomain + form.logoImage" alt="" />
        <!--<img src="../../../assets/imgs/logo.png" />-->
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {  getToken } from '@/utils/auth'
  import { uploadImage  } from "@/api/activity"
  import { shopInfo, getShop, changeShop } from "@/api/userCenter"
    export default {
      name: "step4",
      props : ['step4Status'],
      data(){
        return {
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
          dialogVisible: false,
          token : getToken() ,
          autoUpload : true ,
          imgUrl : process.env.BASE_API+'/file/upload',
          goodsImgWarn : false ,
          imageDomain : process.env.IMAGE_DOMAIN ,
          status: '0',
          handleType: '提交',

        }
      },
      mounted(){
        this.getShopInfo();


      },
      methods : {
        getShopInfo(){

          getShop().then( res => {
            if(res.data.status === '000000000'){
              if(res.data.data !== null){
                this.form = res.data.data ;
                this.status = res.data.data.status ;
                if(this.status === '1' || this.status === '2'){
                  this.readOnly = true ;
                }else{
                  if(this.status === '0'){
                    this. handleType = '提交'

                  }else if( this.status === '3'){
                    this. handleType = '修改'

                  }
                  this.readOnly = false ;
                }
              }else{

              }
            }else{
              this.$message({
                message : res.data.message ,
                type : 'error',
                center : true
              })
            }
          }).catch( err => {

          })

        },
        goDetail(){
          this.$router.push('/merchantCenter/userCenter/OpenShop') ;
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
                      _this.form.logoImageImage = res.data.data.fileName ;

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
        submit(formName,type){
          console.log(this.form,this.step4Status );


            if(this.form.logoImageImage === ''){
              this.goodsImgWarn = true ;
            }


          this.$refs[formName].validate((valid) => {
            if(valid&&!this.goodsImgWarn){
            //  判断资质信息是否已通过审核
              if(this.step4Status === '1'|| this.step4Status === '-1' ){
                this.$message({
                  message : '您上传的资质信息尚未通过，请通过后再进行店铺申请',
                  type : 'error',
                  center : true
                })
              }else if(this.step4Status === '0'){
                this.$message({
                  message : '您还未上传资质信息，请先上传资质信息后方可进行店铺申请',
                  type : 'error',
                  center : true
                })
              }
              else {
                if(type === '提交'){
                  //  提交表单
                  shopInfo(this.form).then( res => {
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

                  })
                }else if( type === '修改'){
                  //  修改表单
                  changeShop(this.form).then( res => {
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

                  })
                }

              }
            }else{

            }
          })
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  .el-form{
    margin-bottom: 0.3rem;
  }
  .el-select{
    width : 100% ;
  }
   dl{
      width : 1.5rem!important ;
      float: left ;
      margin-left: 0!important ;
   }

</style>
