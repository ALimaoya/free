<template>
    <div class="enterprise1 new tagView">
      <el-form :model="form" ref="form" :rules="formRule" label-position="right">
        <h1 class="h_title">入驻人基本信息</h1>
        <el-form-item  :labelWidth="labelWidth" label="店铺管理人姓名："  prop="name">
          <el-input class="inputInfo" :maxlength="4" size="small" :disabled="readOnly" v-model.trim="form.name" placeholder="请输入店铺管理人的真实姓名" ></el-input>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="店铺管理人邮箱：" prop="email">
          <el-input class="inputInfo" size="small" v-model.trim="form.email" :disabled="readOnly" placeholder="请输入常用邮箱，便于信息及时送达"></el-input>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth " label="店铺管理人手机号：" prop="mobile" >
          <el-input class="inputInfo" size="small" :maxlength="11" v-model.tel="form.mobile" disabled="disabled" placeholder="请输入店铺管理人手机号"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>此手机号为商家首次登陆后台的账号，有最高管理权限，暂不支持修改</span>
        </el-form-item>
        <p class="h_title otherInfo">企业法定代表人基本信息</p>
        <el-form-item  :labelWidth="labelWidth" label="法定代表人姓名："  prop="legalRepName">
          <el-input class="inputInfo" :maxlength="4" size="small" :disabled="readOnly" v-model.trim="form.legalRepName" placeholder="请输入法定代表人的真实姓名" ></el-input>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth " label="法定代表人手机号：" prop="legalRepMobile" >
          <el-input class="inputInfo" size="small" :maxlength="11" v-model.tel="form.legalRepMobile" :disabled="readOnly" placeholder="请输入法定代表人常用手机号，不支持座机号"></el-input>
        </el-form-item>
        <el-form-item   :labelWidth="labelWidth"  label="法定代表人身份证号：" prop="cardId">
          <el-input class="inputInfo" :maxlength="18" size="small" :disabled="readOnly" v-model.trim="form.cardId"  placeholder="请输入法定代表人身份证号码"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>该证件号与证件照片、营业执照法人等一致</span>
        </el-form-item>
        <el-form-item   :labelWidth="labelWidth"  label="身份证有效期：" prop="cardDeadline">
          <el-col :span="9">
            <el-date-picker type="date" size="mini" placeholder="截止日期" :disabled="readOnly" v-model="form.cardDeadline" style="width: 100%;" :readonly="cardType"></el-date-picker>
          </el-col>
          <el-col class="line" :span="20">
            <el-checkbox v-model="cardType" :disabled="readOnly">长期</el-checkbox>
            <span class="tip" style="background: none;border: 0;"><svg-icon icon-class="tips"/>身份证剩余有效期时长必须大于2个月</span>
          </el-col>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="法定代表人身份证件正面：" prop="cardFaceImage">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.cardFaceImage"
                      :headers="{'yb-tryout-merchant-token':token}"          :show-file-list="false"  :before-upload="beforeFront">
            <img v-if="form.cardFaceImage" :src="imageDomain + form.cardFaceImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="cardFaceImageWarn">请上传身份证正面照片</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('1')">查看示例</el-button>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="法定代表人身份证件反面：" prop="cardBackImage">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.cardBackImage"
                      :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforeBack">
            <img v-if="form.cardBackImage" :src="imageDomain + form.cardBackImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="cardBackImageWarn">请上传身份证反面照片</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('2')">查看示例</el-button>
        </el-form-item>
        <!-- <el-form-item class="uploadImg" :labelWidth="labelWidth" label="法定代表人手持身份证半身照：" prop="halfBody">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.halfBody"
                      :headers="{'yb-tryout-merchant-token':token}"        :show-file-list="false"  :before-upload="beforeHalfBody">
            <img v-if="form.halfBody" :src="imageDomain + form.halfBody" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="halfBodyImgWarn">请上传手持身份证半身照照片</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('3')">查看示例</el-button>
          <ul class="intro">
            <li>1、请手持本人身份证件</li>
            <li>2、照片需免冠，建议素颜</li>
            <li>3、必须能够看清证件号码且证件号码不能被遮挡</li>
            <li>4、照片必须支持jpg、png格式</li>
          </ul>

        </el-form-item> -->
        <el-form-item class="bottom">
          <el-button plain @click="goBack">上一步</el-button>
          <el-button type="danger" @click="goNext('form')">下一步</el-button>
        </el-form-item>
      </el-form>

      <el-dialog class="demoBox" :title="demo[showImg]" :visible.sync="dialogVisible" width="60%" center>
        <div class="wrap">
          <img v-if="this.showImg === '1'"  src="../../../assets/imgs/cardFront.png" />
          <img v-else-if="this.showImg === '2'"  src="../../../assets/imgs/card_back.png" />
          <!--<img v-else-if="this.showImg === '3'"  src="../../../assets/imgs/u923.png" />-->
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="close">我知道了</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { uploadImage  } from "@/api/activity"
  import { getToken , getMobile } from '@/utils/auth'
  import { validateEmail,validateIDCard,validName, validatePhone} from '@/utils/validate'
    export default {
      props:['lastStep','editorInfo'],
        name: "enterprise1",
        data() {
          const validateName = (rule,value,callback) => {
            if (value === '') {
              if (rule.field === 'name') {
                callback(new Error('请输入店铺管理人的真实姓名'))
              }else if(rule.field === 'legalRepName'){
                callback(new Error('请输入法定代表人的真实姓名'))
              }
                callback();
            } else {
              if (rule.field === 'name') {
                if (!validName(this.form.name)) {
                  callback(new Error('请输入正确姓名字符'))
                }
              }
              if (rule.field === 'legalRepName') {
                if (!validName(this.form.name)) {
                  callback(new Error('请输入正确姓名字符'))
                }
              }
              callback();
            }
          };
          const validEmail = (rule,value,callback) => {
            if(value === ''){
              callback(new Error('请输入店铺管理人的常用邮箱'))
            }else{
              if(!validateEmail(value)){
                callback(new Error('请输入正确格式的邮箱'))
              }
              callback();
            }
          };
          const validCode= (rule,value,callback) => {
            if(value === ''){
              callback(new Error('请输入法定代表人的身份证号'))
            }else{
              if(!validateIDCard(value)){
                callback(new Error('请输入正确格式的身份证号码'))
              }
              callback()
            }
          };
          const validateTel = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入法定代表人的常用手机号'))
            } else {
              if (!validatePhone(value)) {
                callback(new Error('请输入正确格式的手机号'))
              }
              callback()
            }
          };
            return {
              form: {},
              formRule: {
                name: [
                  {
                    required : true ,trigger: 'blur',validator: validateName
                  }
                ],
                email: [
                  {
                    required : true ,trigger:'blur', validator : validEmail
                  }
                ],
                legalRepName: [
                  {
                    required : true ,trigger: 'blur',validator: validateName
                  }
                ],
                legalRepMobile: [
                  {
                  required: true,
                  trigger: 'blur',
                  validator: validateTel
                  }
                  ],
                cardId: [
                  {
                    required : true ,trigger : 'blur', validator: validCode
                  }
                ],
                cardDeadline: [
                  {  required: true, message: '请选择身份证截止日期', trigger: 'change' }
                ]
              },
              labelWidth: '230px',
              autoUpload : true ,
              imgUrl : process.env.BASE_API+'/file/upload',
              imageDomain : process.env.IMAGE_DOMAIN ,
              dialogVisible: false ,
              cardFaceImageWarn : false ,
              cardBackImageWarn: false ,
              // halfBodyImgWarn: false ,
              token : getToken() ,
              demo: ['','身份证正面照示例','身份证反面照示例'],
              // imgTitle : '',
              showImg: '',
              readOnly: false ,
              cardType: false,
            }
        },
        mounted() {
           // if(this.lastStep === 1 ){
            this.form = this.$store.state.shopInfo.enterForm2;
            if(this.form['0'] !== undefined ){
              delete this.form['0'] ;
            }
            if(this.$store.state.shopInfo.cardType2 ===1){
              this.cardType = true
            }else{
              this.cardType = false
            }

        },
        watch : {
          editorInfo : function(val){
            if(val === 1){
              this.form = this.$store.state.shopInfo.enterForm2;

            }

          }
        },
        methods: {
          //限制上传图片大小
          limitImage(file,type){
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
                  _this.limitImg = false;

                  return false ;

                }else if(!isImg){
                  _this.$message.error('图片必须为jpg或者png格式，请重新选择后上传');
                  _this.limitImg = false;
                  return false ;

                }else{
                  let formData = new FormData();
                  formData.append('image', file);

                  uploadImage(formData).then(res => {
                    if (res.data.status === '000000000') {

                      if(type ===1){
                        _this.form.cardFaceImage = res.data.data.fileName;
                        // console.log(_this.form.cardFaceImage,3)
                        _this.cardFaceImageWarn = false;
                      }
                      if(type ===2){
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
            reader.readAsDataURL(file);
            // console.log(this.limitImg,5)


          },
          tipsWarn(type){
            if(type === 1){
              this.cardFaceImageWarn = true;

            }
            if(type === 2){
              this.cardBackImageWarn = true;

            }
          },
          // 上传图片

          beforeFront(file) {
            this.limitImage(file,1);
          },
          beforeBack(file) {
            this.limitImage(file,2);
          },

          goNext(formName){
            if(this.form.cardFaceImage === ''){
              this.cardFaceImageWarn = true;

            }
            if(this.form.cardBackImage  === ''){
              this.cardBackImageWarn = true;

            }

            if(this.cardType === true){
              this.form.cardDeadline = '9999-12-31'
            }
            this.$refs[formName].validate((valid) => {

              // if(valid&&!this.cardBackImageWarn&&!this.cardBackImageWarn&&!this.halfBodyImgWarn )
              if(valid&&!this.cardFaceImageWarn&&!this.cardBackImageWarn ){
                this.form.cardDeadline = this.form.cardDeadline ===null?'':this.form.cardDeadline ;
                this.$store.commit('addForm2',this.form);
                this.$store.commit('addCardType2',this.cardType-0);
                this.$emit('stepObj',{ index : '2' ,component : 'enterprise2'})

              }else{

              }
            })
          },
          //返回上一步
          goBack(){
            this.$router.push({ name : 'AdmissionShop'})
          },
          //查看示例图
          showDemo(index){
            this.dialogVisible = true ;
            // this.imgTitle = this.demo[index].title ;
            this.showImg = index ;
          },
          close(){
            this.dialogVisible = false ;
            // this.imgTitle = '';
            this.showImg = '' ;
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/new';
  .demoBox img{
    width : 60%!important ;
  }
</style>
