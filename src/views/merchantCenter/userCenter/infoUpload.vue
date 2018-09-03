<template>
  <div class="infoUpload"  v-loading="loading"  element-loading-text="拼命加载中">
    <h1>资质上传</h1>
    <el-form :model="form" ref="form"  :rules="formRule" center label-position="right" >
      <el-form-item  :labelWidth="labelWidth" label="店铺负责人："  prop="name">
        <el-input class="inputInfo" type="text" size="small" :maxlength="40" :disabled="isRegister" v-model.trim="form.name" placeholder="店铺负责人" ></el-input>
      </el-form-item>
      <el-form-item   :labelWidth="labelWidth"  label="身份证号：" prop="cardId">
        <el-input class="inputInfo" :maxlength="18" size="small" :disabled="isRegister" v-model.trim="form.cardId"  placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item  :labelWidth="labelWidth" label="企业名称：" prop="enterpriseName">
        <el-input class="inputInfo" size="small" :maxlength="40"  :disabled="isRegister" v-model.trim="form.enterpriseName"  placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item  :labelWidth="labelWidth" label="邮箱：" prop="email">
        <el-input class="inputInfo" size="small" :disabled="isRegister" v-model.trim="form.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item :labelWidth="labelWidth" class="imgWrap" label="资质：" v-if="!isRegister" prop="businessImage">
        <ul class="imgList" >
          <li>
            <span class="imeTilte">营业执照</span>
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.businessImage"
                        :headers="{'yb-tryout-merchant-token':token}"      :show-file-list="false"   :http-request="beforeBusinessUpload" >
              <img v-if="form.businessImage" :src="imageDomain + form.businessImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="businessImageWarn">请上传营业执照</span>
            <span class="imgWarn" v-else></span>

          </li>
          <li>
            <span class="imeTilte">授权证书</span>
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.authorizeImage"
                        :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :http-request="beforeAuthorizeUpload">
              <img v-if="form.authorizeImage" :src="imageDomain + form.authorizeImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="authorizeImageWarn">请上传授权证书</span>
            <span class="imgWarn" v-else></span>

          </li>
          <li>
            <span class="imeTilte">身份证正面</span>
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.cardFaceImage"
                        :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :http-request="beforeCardFaceImgUpload">
              <img v-if="form.cardFaceImage" :src="imageDomain + form.cardFaceImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="cardFaceImageWarn">请上传身份证正面照</span>
            <span class="imgWarn" v-else></span>

          </li>
          <li>
            <span class="imeTilte">身份证反面</span>
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.cardBackImage"
                        :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :http-request="beforeCardBackImgUpload">
              <img v-if="form.cardBackImage" :src="imageDomain + form.cardBackImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="cardBackImageWarn">请上传身份证反面照</span>
            <span class="imgWarn" v-else></span>

          </li>
        </ul>
      </el-form-item>
      <el-form-item :labelWidth="labelWidth" class="imgWrap" label="资质：" v-else="isRegister" prop="businessImage">
        <div  class="showImage">
          <dl @click="bigImg(0,form.businessImage)"  >
            <dt class="imeTilte">{{ imgType[0] }}</dt>
            <dd>
              <img v-if="form.businessImage !== ''" :src="imageDomain+form.businessImage" :onerror="errorImg">
              <img :src="failImg" v-else >
            </dd>
          </dl>
          <dl @click="bigImg(1,form.authorizeImage)"  >
            <dt class="imeTilte">{{ imgType[1] }}</dt>
            <dd>
              <img v-if="form.authorizeImage !== ''" :src="imageDomain+form.authorizeImage" :onerror="errorImg">
              <img :src="failImg" v-else >
            </dd>
          </dl>
          <dl @click="bigImg(2,form.cardFaceImage)"  >
            <dt class="imeTilte">{{ imgType[2] }}</dt>
            <dd>
              <img v-if="form.cardFaceImage !== ''" :src="imageDomain+form.cardFaceImage" :onerror="errorImg">
              <img :src="failImg" v-else >
            </dd>
          </dl>
          <dl @click="bigImg(3,form.cardBackImage)"  >
            <dt class="imeTilte">{{ imgType[3] }}</dt>
            <dd>
              <img v-if="form.cardBackImage !== ''" :src="imageDomain+form.cardBackImage" :onerror="errorImg">
              <img :src="failImg" v-else >
            </dd>
          </dl>
        </div>
      </el-form-item>
      <el-form-item class="btnWrap">
        <el-button v-if="!isRegister&&this.status === '3'" type="primary" size="small" @click="submit('form')">修改</el-button>
        <el-button v-if="!isRegister&&this.status === '0'" type="primary" size="small" @click="submit('form')">提交审核</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :title="imgTitle" :visible.sync="dialogVisible" width="60%" center>
      <div class="wrap">
        <img :src="imageDomain+ imgSrc" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {  getToken } from '@/utils/auth'
    import { uploadImage  } from "@/api/activity"
    import { infoUpload , getInfo } from "@/api/userCenter"
    import { validateEmail,validateIDCard,validName } from '@/utils/validate'
    import userPhoto from '@/assets/404_images/fail.png'

    export default {
      name: "info-upload",
      data(){
        const validateName = (rule , value ,callback)=>{
          if(value === ''){
            callback(new Error('请填写店铺负责人姓名'))
          }else{
            if(!validName(value) ){
              callback(new Error('请填写正确格式的店铺负责人姓名'))
            }
            callback();
          }
        };
        const validEmail = (rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入常用邮箱'))
          }else{
            if(!validateEmail(value)){
              callback(new Error('请输入正确格式的邮箱'))
            }
            callback();
          }
        };
        const validCode= (rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入店铺管理人身份证号'))
          }else{
            if(!validateIDCard(value)){
              callback(new Error('请输入正确格式的身份证号码'))
            }
            callback();

          }
        };
          return{
            form : {
              name : '',
              email : '',
              cardId : '',
              enterpriseName : '',
              businessImage : '',
              authorizeImage:'',
              cardFaceImage:'',
              cardBackImage:'',
              id: ''
            },
            formRule: {
              name : [
                {
                  required : true ,trigger : 'blur' , validator : validateName
                }
              ],
              email: [
                {
                  required : true ,trigger:'blur', validator : validEmail
                }
              ],
              cardId: [
                {
                  required : true ,trigger : 'blur', validator: validCode
                }
              ],
              enterpriseName: [
                {
                  required : true ,trigger : 'blur' ,message : '请填写企业名称'
                }
              ],
              // businessImage: [
              //   {
              //     required: true ,trigger: 'change'
              //   }
              // ]

            },
            // readOnly : false,
            imgType : ['营业执照','授权证书','身份证（正面）','身份证（反面）'],
            imgTitle : '',
            dialogVisible: false,
            isRegister: false,
            token : getToken() ,
            autoUpload : true ,
            imgUrl : process.env.BASE_API+'/file/upload',
            businessImageWarn : false ,
            authorizeImageWarn: false ,
            cardFaceImageWarn: false ,
            cardBackImageWarn: false ,
            imageDomain : process.env.IMAGE_DOMAIN ,
            imgSrc:'',
            labelWidth: '150px',
            status: '',
            loading : true ,
            limitImg : false,
            errorImg:'this.src="' + userPhoto + '"',
            failImg: userPhoto,
      }
      },
      mounted(){
        this.getUserInfo();
      },
      methods : {
        getUserInfo(){


          getInfo().then( res =>{
            this.loading = false ;

            if(res.data.data !== null){
                this.form = res.data.data ;
                this.status = res.data.data.status ;
                if(this.status === '2'|| this.status === '1'){
                  this.isRegister = true ;
                }
              }else{
                this.status = '0';

              }

          })
        },


        //查看大图
        bigImg(index,src){

          this.imgTitle = this.imgType[index] ;
          this.imgSrc = src ;
          this.dialogVisible = true ;
        },
        //限制上传图片大小
        limitImage(file,type){
          let reader = new FileReader();
          let _this = this;
          const isImg = file.file.type === 'image/jpeg'|| file.file.type === 'image/png';
          reader.onload = (e) => {
            let image = new Image();
            image.onload = function () {
              const isHeight = this.height;
              const isWidth = this.width;
              if (isWidth > 800 || isHeight > 800) {
                _this.$message.error('图片尺寸过大，请重新选择后上传');
                _this.limitImg = false;

                return false ;

              }else if(!isImg){
                _this.$message.error('图片必须为jpg或者png格式，请重新选择后上传');
                _this.limitImg = false;
                return false ;

              }else{
                let formData = new FormData();
                formData.append('image', file.file);

                uploadImage(formData).then(res => {
                  if (res.data.status === '000000000') {
                    if(type === 1){
                      _this.form.businessImage = res.data.data.fileName;
                      // console.log(_this.form.businessImage,1)
                      _this.businessImageWarn = false;
                    }
                    if(type ===2){
                      _this.form.authorizeImage = res.data.data.fileName;
                      // console.log(_this.form.authorizeImage,2)
                      _this.authorizeImageWarn = false;
                    }
                    if(type ===3){
                      _this.form.cardFaceImage = res.data.data.fileName;
                      // console.log(_this.form.cardFaceImage,3)
                      _this.cardFaceImageWarn = false;
                    }
                    if(type ===4){
                      _this.form.cardBackImage = res.data.data.fileName;
                      // console.log(_this.form.cardBackImage,4)
                      _this.cardBackImageWarn = false;
                    }

                  } else {
                    _this.tipsWarn(type);


                  }
                }).catch(err => {
                  // console.log(err) ;
                  _this.tipsWarn(type);
                })

              }

            };
            image.src = e.target.result;

          };
          reader.readAsDataURL(file.file);
          // console.log(this.limitImg,5)


        },
        tipsWarn(type){
          if(type === 1){
            this.businessImageWarn = true;

          }
          if(type === 2){
            this.authorizeImageWarn = true;

          }
          if(type === 3){
            this.cardFaceImageWarn = true;

          }
          if(type === 4){
            this.cardBackImageWarn = true;

          }
        },
        // 上传图片
        beforeBusinessUpload(file) {

          this.limitImage(file,1);

        },
        beforeAuthorizeUpload(file) {
          this.limitImage(file,2);


        },
        beforeCardFaceImgUpload(file) {

          this.limitImage(file,3);


        },
        beforeCardBackImgUpload(file) {
          this.limitImage(file,4);

        },
        submit(formName){
          if(this.form.businessImage === ''){
            this.businessImageWarn = true
          }else{
            this.businessImageWarn = false ;
          }
          if(this.form.authorizeImage === ''){
            this.authorizeImageWarn = true
          }else{
            this.authorizeImageWarn = false ;
          }
          if(this.form.cardFaceImage === ''){
            this.cardFaceImageWarn = true
          }else{
            this.cardFaceImageWarn = false ;
          }
          if(this.form.cardBackImage === ''){
            this.cardBackImageWarn = true
          }else{
            this.cardBackImageWarn = false ;
          }

          this.$refs[formName].validate((valid) => {
            // console.log(this.form,this.businessImageWarn,this.authorizeImageWarn,this.cardFaceImageWarn,this.cardBackImageWarn);


            if(valid&&!this.businessImageWarn&&!this.authorizeImageWarn&&!this.cardFaceImageWarn&&!this.cardBackImageWarn){
              this.loading = true ;

              infoUpload(this.form).then( res => {
                this.loading = false ;
                if( res.data.status === '000000000'){
                  this.$message({
                    message : '您的资质信息已上传成功，通过审核后即可进行相关操作' ,
                    type : 'success',
                    center : true,
                    duration: 1500,
                  });
                  setTimeout(() => {
                    window.location.reload();

                  },2000)
                }
              })
            }else{

            }
          })
        },

      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  h1{
    margin : 0 ;
    padding : 0.2rem  0.4rem ;
    border-bottom : 1px solid #666 ;
    font-size : 0.22rem ;
    line-height : 0.4rem ;
    height : 0.7rem ;

  }
  .el-form{
    margin-top : 1rem ;
    justify-content: flex-start;
    .el-form-item{
      width : 70% ;
      margin: 0.5rem auto ;
      .imgWarn{
        height: 0.4rem ;
        width: 100% ;
        display: inline-block;
      }
    }
    .imgWrap{
      /*width : 90% ;*/
      /*margin-left : 80px ;*/
      ul{
        width :100% ;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        li{
          flex: 1 ;
          .imeTilte{
            display: inline-block;
            width: 1.5rem ;
          }
          .upload{
            width: 100%;
            img{
              max-width : 100% ;
              max-height: 100%;
            }
          }
          dl{
            width : 100% ;
          }

        }
      }
    }
    .imeTilte{

      height : 0.4rem;
      text-align : center ;
      line-height : 0.4rem ;
      background : #eee ;
      font-size: 0.14rem;
      color: #333;
    }
    .showImage{
      display : flex ;
      flex-direction: row;
      flex-wrap: nowrap;
      /*width: 80%!important;*/
      dl{
        width : 1.5rem;
        /*float:left;*/

        //height : 3rem ;
        margin : auto ;

        dd{
          flex : 1 ;
          height: 1.5rem ;
          img{
            width : 100% ;
            height : 100% ;
          }
        }
      }

    }
  .btnWrap{
      text-align: center;
    }
  }
  .wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      max-width: 80% ;
      max-height: 80% ;
      margin: auto ;
    }
  }

</style>

