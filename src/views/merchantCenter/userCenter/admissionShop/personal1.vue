<template>
    <div class="personal1 new tagView">
      <el-form :model="form" ref="form" :rules="formRule" label-position="right">
        <h1 class="h_title">入驻人基本信息</h1>
        <el-form-item  :labelWidth="labelWidth" label="入驻人姓名："  prop="name">
          <el-input class="inputInfo" :maxLength="4" size="small" :disabled="readOnly" v-model.trim="form.name" placeholder="请输入入驻人的真实姓名" ></el-input>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="入驻人邮箱：" prop="email">
          <el-input class="inputInfo" size="small" v-model.trim="form.email" :disabled="readOnly" placeholder="请输入常用邮箱，便于信息及时送达"></el-input>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth " label="入驻人手机号：" prop="tel" >
          <el-input class="inputInfo" size="small" v-model.trim="form.tel" disabled="disabled" placeholder="请输入入驻人手机号"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>此手机号为商家首次登陆后台的账号，有最高管理权限</span>
        </el-form-item>
        <el-form-item   :labelWidth="labelWidth"  label="店铺管理人身份证号：" prop="idCard">
          <el-input class="inputInfo" :maxLength="18" size="small" :disabled="readOnly" v-model.trim="form.idCard"  placeholder="请输入身份证号码"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>该证件号与证件照片、营业执照法人等一致</span>
        </el-form-item>
        <el-form-item   :labelWidth="labelWidth"  label="身份证有效期：" prop="idCardDate">
          <el-col :span="9">
            <el-date-picker type="date" size="mini" placeholder="截止日期" :disabled="readOnly" v-model="form.idCardDate" style="width: 100%;" :readonly="long"></el-date-picker>
          </el-col>
          <el-col class="line" :span="20">
            <el-checkbox v-model="long" :disabled="readOnly">长期</el-checkbox>
            <span class="tip" style="background: none;border: 0;"><svg-icon icon-class="tips"/>身份证剩余有效期时长必须大于2个月</span>
          </el-col>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="身份证件正面：" prop="front">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.front"
                      :headers="{'yb-tryout-merchant-token':token}"          :show-file-list="false"  :before-upload="beforeFront">
            <img v-if="form.front" :src="imageDomain + form.front" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="frontImgWarn">请上传身份证正面照片</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('1')">查看示例</el-button>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="身份证件反面：" prop="back">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.back"
                      :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforeBack">
            <img v-if="form.back" :src="imageDomain + form.back" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="backImgWarn">请上传身份证反面照片</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('2')">查看示例</el-button>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="手持身份证半身照：" prop="halfBody">
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

        </el-form-item>
        <el-form-item class="bottom">
          <el-button plain @click="goBack">上一步</el-button>
          <el-button type="warning" @click="goNext('form')">下一步</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :title="demo[showImg]" :visible.sync="dialogVisible" width="60%" center>
        <div class="wrap">
          <img v-if="this.showImg === '1'"  src="../../../../assets/imgs/logo.png" />
          <img v-else-if="this.showImg === '2'"  src="../../../../assets/imgs/u922.png" />
          <img v-else-if="this.showImg === '3'"  src="../../../../assets/imgs/u923.png" />
          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="close">我知道了</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { uploadImage  } from "@/api/activity"
    import { getToken } from '@/utils/auth'
    import { validateEmail,validateIDCard,validName} from '@/utils/validate'

    export default {

      name: "personal1",
        data() {
        const validateName = (rule,value,callback) => {
          if (value === '') {
            callback(new Error('请输入入驻人的真实姓名'))
          } else {
            if (!validName(value)) {
              callback(new Error('请输入正确姓名字符'))
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
          }
        };
            return {
              form: {
                name: '',
                email: '',
                tel: '',
                idCard:'',
                front: '',
                back : '',
                halfBody: '',
                idCardDate: ''
              },
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
                idCard: [
                  {
                    required : true ,trigger : 'blur', validator: validCode
                  }
                ],
                idCardDate: [
                  {  required: true, message: '请选择身份证截止日期', trigger: 'change' }
                ]
              },
              labelWidth: '180px',
              long: false,
              autoUpload : true ,
              imgUrl : process.env.BASE_API+'/file/upload',
              imageDomain : process.env.IMAGE_DOMAIN ,
              frontImgWarn : false ,
              backImgWarn: false ,
              halfBodyImgWarn: false ,
              token : getToken() ,
              dialogVisible: false ,
              demo: ['','身份证正面照示例','身份证反面照示例', '手持身份证半身照示例'],
              // imgTitle : '',
              showImg: '',
              readOnly: false ,
            }

        },
        mounted() {

        },
        methods: {
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
          // 上传身份证正面照
          beforeFront(file) {
            let that = this;
            if(this.limitImg(file)){

                  let formData = new FormData();
                  formData.append('image', file);
                  uploadImage(formData,that.token).then(res => {
                    if (res.data.status === '000000000') {
                        // console.log(_this.form.imgList)
                      that.form.front = res.data.data.fileName ;
                      that.frontImgWarn = false;
                    } else {
                      that.$message({
                        message: res.data.message,
                        center: true,
                        type: 'error'
                      });
                      that.frontImgWarn = true;
                      that.form.front = '';
                    }
                  }).catch(err => {
                    // console.log(err) ;
                    that.form.front = '';
                    that.frontImgWarn = true;

                  })
                }



          },
        //  上传身份证反面照
          beforeBack(file) {
            let that = this;

                if (this.limitImg(file)) {
                  let formData = new FormData();
                  formData.append('image', file);
                  uploadImage(formData,that.token).then(res => {
                    if (res.data.status === '000000000') {
                      // console.log(_this.form.imgList)
                      that.form.back = res.data.data.fileName ;
                      that.backImgWarn = false;
                    } else {
                      that.$message({
                        message: res.data.message,
                        center: true,
                        type: 'error'
                      });
                      that.backImgWarn = true;
                      that.form.back = '' ;

                    }
                  }).catch(err => {
                    // console.log(err) ;
                    that.backImgWarn = true;
                    that.form.back = '' ;
                  })
                }

          },
          beforeHalfBody(file){
            let that = this;
            if(this.limitImg(file)){
              let formData = new FormData();
              formData.append('image', file);
              uploadImage(formData,that.token).then(res => {
                if (res.data.status === '000000000') {
                  // console.log(_this.form.imgList)
                  that.form.halfBody = res.data.data.fileName ;
                  that.halfBodyImgWarn = false;
                } else {
                  that.$message({
                    message: res.data.message,
                    center: true,
                    type: 'error'
                  });
                  that.halfBodyImgWarn = true;
                  that.form.halfBody = '' ;
                }
              }).catch(err => {
                // console.log(err) ;
                that.halfBodyImgWarn = true;
                that.form.halfBody = '' ;

              })
            }


          },
          goNext(formName){
            if(this.form.front === ''){
            this.frontImgWarn = true;

            }else if(this.form.back  === ''){
              this.backImgWarn = true;

            }else if(this.form.halfBody === ''){
              this.halfBodyImgWarn = true;
            }else{

            }
            this.$refs[formName].validate((valid) => {

              this.$emit('stepObj',{ index : '2' ,component : 'personal2'});

              if(valid&&!this.backImgWarn&&!this.backImgWarn&&!this.halfBodyImgWarn ){
              this.$emit('stepObj',{ index : '2' ,component : 'personal2'})

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
  @import '../../../../styles/new';

</style>
