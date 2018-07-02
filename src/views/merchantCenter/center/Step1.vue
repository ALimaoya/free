<template>
  <div class="step1">
    <h1>资质上传</h1>
    <el-form ref="form" :model="form" :rules="formRule" center label-position="top">
      <el-form-item label="店铺负责人"  prop="name">
        <el-input type="text" size="small" v-model="form.name" :disabled="isRegister"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input type="text" size="small" :disabled="isRegister" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="cardId">
        <el-input type="text" size="small" v-model="form.cardId" :disabled="isRegister"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input type="text" size="small" v-model="form.enterpriseName" :disabled="isRegister"></el-input>
      </el-form-item>
      <el-form-item class="imgWrap" v-if="!isRegister" label="资质" prop="businessImage">
        <ul class="imgList" >
          <li>
            <span class="imeTitle">营业执照</span>
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.businessImage"
                        :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :before-upload="beforeBusinessUpload">
              <img v-if="form.businessImage" :src="imageDomain + form.businessImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="businessImageWarn">请上传营业执照</span>
          </li>
          <li>
            <span class="imeTitle">授权证书</span>
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.authorizeImage"
                        :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :before-upload="beforeAuthorizeUpload">
              <img v-if="form.authorizeImage" :src="imageDomain + form.authorizeImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="authorizeImageWarn">请上传授权证书</span>
          </li>
          <li>
            <span class="imeTitle">身份证正面</span>
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.cardFaceImage"
                        :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :before-upload="beforeCardFaceImgUpload">
              <img v-if="form.cardFaceImage" :src="imageDomain + form.cardFaceImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="cardFaceImageWarn">请上传身份证正面照</span>
          </li>
          <li>
            <span class="imeTitle">身份证反面</span>
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.cardBackImage"
                        :headers="{'yb-tryout-merchant-token':token}"         :show-file-list="false"  :before-upload="beforeCardBackImgUpload">
              <img v-if="form.cardBackImage" :src="imageDomain + form.cardBackImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="imgWarn tips_warn" v-if="cardBackImageWarn">请上传身份证反面照</span>
          </li>
        </ul>

      </el-form-item>
      <el-form-item class="imgItem" v-else="isRegister" label="资质" prop="businessImage">
        <div  class="showImage">
          <dl @click="bigImg(0,form.businessImage)"  >
            <dt>{{ imgType[0] }}</dt>
            <dd>
              <img v-if="form.businessImage !== ''" :src="imageDomain + form.businessImage" alt="" />
              <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
            </dd>
          </dl>
          <dl @click="bigImg(1,form.authorizeImage)"  >
            <dt>{{ imgType[1] }}</dt>
            <dd>
              <img v-if="form.authorizeImage !== ''" :src="imageDomain + form.authorizeImage" alt="" />
              <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
            </dd>
          </dl>
          <dl @click="bigImg(2,form.cardFaceImage)"  >
            <dt>{{ imgType[2] }}</dt>
            <dd>
              <img v-if="form.cardFaceImage !== ''" :src="imageDomain + form.cardFaceImage" alt="" />
              <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
            </dd>
          </dl>
          <dl @click="bigImg(3,form.cardBackImage)"  >
            <dt>{{ imgType[3] }}</dt>
            <dd>
              <img v-if="form.cardBackImage !== ''" :src="imageDomain + form.cardBackImage" alt="" />
              <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
            </dd>
          </dl>
        </div>
      </el-form-item>
      <div class="tips_warn refuse" v-if="status==='3'">审核未通过原因：{{ form.reason }}</div>
      <el-form-item>
        <el-button v-if="isRegister" type="primary" size="small" @click="goDetail">查看</el-button>
        <el-button v-else-if="!isRegister&&status === '0'" type="primary" size="small" @click="submit('form')">提交</el-button>
        <el-button v-else-if="!isRegister&&status === '3'" type="primary" size="small" @click="submit('form')">修改</el-button>
      </el-form-item>
    </el-form>


    <el-dialog :title="imgTitle" :visible.sync="dialogVisible" width="60%" center>
      <div class="wrap">
        <img :src=" imageDomain + imgSrc" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>

    import {  getToken } from '@/utils/auth'
    import { uploadImage  } from "@/api/activity"
    import { infoUpload , getInfo } from "@/api/userCenter"
    import { validateEmail,validateIDCard,validName } from '@/utils/validate'
    import ElFormItem from "element-ui/packages/form/src/form-item";

    export default {

      components: {ElFormItem},
      name: "step1",
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

        return {
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
              businessImage: [
                {
                  required: true ,trigger: 'change'
                }
              ]

            },
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
            status: '',
          }
      },
      mounted(){
        this.getUserInfo();
      },

      methods: {
        getUserInfo(){

          getInfo().then( res =>{
            if(res.data.status === '000000000'){
              if(res.data.data !== null){
                this.form = res.data.data ;
                this.status = res.data.data.status ;
                if(this.status === '2'|| this.status === '1'){
                  this.isRegister = true ;
                }
              }else{
                this.status = '0';

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
          this.$router.push('/merchantCenter/userCenter/infoUpload') ;
        },
        //查看大图
        bigImg(index,src){

          this.imgTitle = this.imgType[index] ;
          this.imgSrc = src ;
          this.dialogVisible = true ;
        },

        //限制上传图片大小
        limitImg(file){
          let reader = new FileReader();
          let _this = this;
          const isImg = file.type === 'image/jpeg'|| file.type === 'image/png';
          reader.onload = (e) => {
            let image = new Image();
            image.onload = function () {
              const isHeight = this.height;
              const isWidth = this.width;
              if (isWidth > 800 || isHeight > 800) {
                _this.$message.error('图片尺寸过大，请重新选择后上传');
                return false;

              }else if(!isImg){
                _this.$message.error('图片必须为jpg或者png格式，请重新选择后上传');
                return false;

              }
            };

            image.src = e.target.result;
          };
          reader.readAsDataURL(file);
          return true ;
        },
        // 上传图片
        beforeBusinessUpload(file) {
            let that = this ;
          if (this.limitImg(file)) {
            let formData = new FormData();
            formData.append('image', file);
            uploadImage(formData, that.token).then(res => {
              if (res.data.status === '000000000') {

                that.form.businessImage = res.data.data.fileName;

                that.businessImageWarn = false;
              } else {
                that.$message({
                  message: res.data.message,
                  center: true,
                  type: 'error'
                });
                that.businessImageWarn = true;

              }
            }).catch(err => {
              // console.log(err) ;
              that.businessImageWarn = true;

            })
          }

        },
        beforeAuthorizeUpload(file) {
          let that = this ;
          if (this.limitImg(file)) {
            let formData = new FormData();
            formData.append('image', file);
            uploadImage(formData, that.token).then(res => {
              if (res.data.status === '000000000') {

                that.form.authorizeImage = res.data.data.fileName;

                that.authorizeImageWarn = false;
              } else {
                that.$message({
                  message: res.data.message,
                  center: true,
                  type: 'error'
                });
                that.authorizeImageWarn = true;

              }
            }).catch(err => {
              // console.log(err) ;
              that.authorizeImageWarn = true;

            })
          }

        },
        beforeCardFaceImgUpload(file) {
          let that = this ;
          if (this.limitImg(file)) {
            let formData = new FormData();
            formData.append('image', file);
            uploadImage(formData, that.token).then(res => {
              if (res.data.status === '000000000') {

                that.form.cardFaceImage = res.data.data.fileName;

                that.cardFaceImageWarn = false;
              } else {
                that.$message({
                  message: res.data.message,
                  center: true,
                  type: 'error'
                });
                that.cardFaceImageWarn = true;

              }
            }).catch(err => {
              // console.log(err) ;
              that.cardFaceImageWarn = true;

            })
          }

        },
        beforeCardBackImgUpload(file) {
          let that = this ;
          if (this.limitImg(file)) {
            let formData = new FormData();
            formData.append('image', file);
            uploadImage(formData, that.token).then(res => {
              if (res.data.status === '000000000') {

                that.form.cardBackImage = res.data.data.fileName;

                that.cardBackImageWarn = false;
              } else {
                that.$message({
                  message: res.data.message,
                  center: true,
                  type: 'error'
                });
                that.cardBackImageWarn = true;

              }
            }).catch(err => {
              // console.log(err) ;
              that.cardBackImageWarn = true;

            })
          }

        },
        submit(formName){
          if(this.form.businessImage === ''){
            this.businessImageWarn = true;
          }
          if(this.form.authorizeImage === ''){
            this.authorizeImageWarn = true
          }
          if(this.form.cardFaceImage === ''){
            this.cardFaceImageWarn = true
          }
          if(this.form.cardBackImage === ''){
            this.cardBackImageWarn = true
          }

          this.$refs[formName].validate((valid) => {
            console.log(this.form,this.businessImageWarn,this.authorizeImageWarn,this.cardFaceImageWarn,this.cardBackImageWarn);

            if(valid&&!this.businessImageWarn&&!this.authorizeImageWarn&&!this.cardFaceImageWarn&&!this.cardBackImageWarn){

              infoUpload(this.form).then( res => {
                if(res.data.status === '000000000'){
                  this.$message({
                    message : '您的资质信息已上传成功，通过审核后即可进行相关操作' ,
                    type : 'success',
                    center : true,
                    duration: 2000,
                  });
                  window.location.reload();
                }else{
                  this.$message({
                    message : res.data.message ,
                    type : 'error',
                    center : true
                  })
                }
              }).catch( err => {

              })
            }else{

            }
          })
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  .imgList{
    display : flex ;
    flex-direction: row;
    justify-content: center;

    li{
      width : 20% ;
      margin-right : 0.3rem;
      .upload,.upload img{
        width : 100% ;


      }
    }
  }
  .showImage{
    display : flex ;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 80%!important;

  }
  .imgItem, .imgItem .imgWrap{
    width: 100%!important;

  }

  .refuse{
    text-align: left ;
    font-size: 0.24rem ;
    width: 100% ;
    height: 0.8rem ;
    line-height: 0.8rem ;
    text-indent: 0.2rem ;
  }
</style>
