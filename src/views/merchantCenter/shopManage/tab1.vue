<template>
    <div class="tab1 tab">
      <el-form :model="form" ref="form" :rules="formRule" label-position="right" >
        <h1>基本信息</h1>
        <el-form-item  labelWidth="160px" label="店铺名称：" >
          <div class="inputInfo">{{ form.shopName }}</div>
        </el-form-item>
        <el-form-item  labelWidth="160px" label="店铺类型：" >
          <div class="inputInfo">个人入驻</div>
        </el-form-item>
        <el-form-item  labelWidth="160px" label="主营类目：" >
          <div class="inputInfo">{{ form.goodsType }}</div>
        </el-form-item>
        <el-form-item   labelWidth="160px"  label="招商对接联系方式：">
          <el-button size="small" type="text">查看</el-button>
        </el-form-item>
        <el-form-item   labelWidth="160px"  label="第三方平台店铺：">
          <div v-if="form.shopUrl === ''">
            <span>无</span>
            <el-button size="small" type="text" @click="dialogVisible=true;">添加第三方平台店铺链接</el-button>
          </div>
          <div v-else>{{ form.shopUrl }}</div>
        </el-form-item>
        <el-form-item labelWidth="160px" label="店铺LOGO：" prop="logo">
              <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.logo"
                          :show-file-list="false"  :before-upload="beforeImgUpload">
                <img v-if="form.logo" :src="imageDomain + form.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          <p class="require">请上传尺寸为300px×300px，500k以内的图片</p>
          <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传店铺LOGO</span>
        </el-form-item>
        <el-form-item   labelWidth="160px"  label="店铺详情：" prop="shopDetail">
          <el-input class="inputInfo" type="textarea" :rows="4" size="small" v-model.trim="form.shopDetail" placeholder=""></el-input>
        </el-form-item>
        <el-form-item   labelWidth="160px"  label="入驻人邮箱：" prop="email">
          <el-input class="inputInfo telInput"  size="small" v-model.trim="form.email" placeholder="请输入入驻人邮箱"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="160px" label="入驻人手机号：" prop="tel">
          <el-input class="inputInfo telInput"  size="small" v-model.trim="form.tel" disabled="disabled"></el-input>
          <el-button type="text" size="mini" @click="goChange">修改</el-button>
        </el-form-item>
        <el-form-item class="ruleDetail">
          <el-checkbox class="inputInfo"  size="small" v-model.trim="agree"></el-checkbox>
          <span>我声明，此页面内容由本店铺自行填写和发布，内容真实有效，如有相关法律法规，平台协议及平台规则之规定冲突的，以法律法规、平台协议及平台规则规定为准。</span>
        </el-form-item>
        <el-form-item labelWidth="160px">
          <el-button @click="submitForm('form')" type="primary" >保存</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="添加第三方平台店铺" :visible.sync="dialogVisible" width="50%" center >
        <div class="dialog_content">
          <el-select class="search" v-model="form.platformType" placeholder="请选择第三方平台" size="small">
            <el-option
              v-for="(item ,index) in platForm"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input type="text" size="small" v-model.trim="shopLink" placeholder="请输入第三方店铺链接"></el-input>
        </div>
        <div slot="footer" class="dialog-footer" >
          <el-button type="primary" size="mini" @click="confirm(shopLink)">确定</el-button>
          <el-button plain size="mini" @click="dialogVisible= false;shopLink = ''">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { uploadImage  } from "@/api/activity"
  import { getToken } from '@/utils/auth'
  import  { validatePhone , validateZipCode,validateURL} from '@/utils/validate';

  export default {
        name: "tab1",
        data() {
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
            return {
              form : {
                shopName: '',
                shopType: '',
                platformType: '',
                shopUrl: '',
                goodsType: '',
                logo : '',
                shopDetail: '',
                email: '',
                tel: '',
              },
              agree: false ,
              formRule: {
                shopDetail: [
                  {
                    required : true ,trigger: 'blur',message : '请填写店铺详情'
                  }
                ],
                email: [
                  {
                    required : true ,trigger: 'blur', validator: validZipCode
                  }
                ],
                tel: [
                  {
                    required : true ,trigger : 'blur',validator : validTel
                  }
                ]
              },
              autoUpload : true ,
              imgUrl : process.env.BASE_API+'/file/upload',
              imageDomain : process.env.IMAGE_DOMAIN ,
              token : getToken() ,
              goodsImgWarn: false,
              dialogVisible: false ,
              shopLink: '',
              platForm : [
                {
                  name : '淘宝',
                  id : '1',
                },
                {
                  name : '天猫',
                  id : '2'
                },
                {
                  name : '京东',
                  id : '3'
                },
                // {
                //   name : '拼多多',
                //   id : '4'
                // }
              ],
            }
        },
        mounted() {
          // this.form=
        },
        methods: {
          //提交第三方平台链接
          confirm(link){
            if(!validateURL(link)){
              this.$message({
                message : '请输入正确格式的店铺链接',
                center : true ,
                type : 'error'
              })
            }else{
              this.form.shopUrl = this.shopLink ;
              this.dialogVisible = false ;
            }
          },
          //跳转修改手机号
          goChange(){

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
                if (isWidth > 300 || isHeight > 300) {
                  _this.$message.error('图片尺寸过大，请重新选择后上传');
                  return false;

                } else {
                  let formData = new FormData();
                  formData.append('image', file);
                  uploadImage(formData,_this.token).then(res => {
                    if (res.data.status === '000000000') {

                        _this.form.logo = res.data.data.fileName;
                        // console.log(_this.form.imgList)

                    } else {
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
          submitForm(formName){
            if(this.form.logo === ''){
              this.goodsImgWarn = true ;
            }else{
              this.goodsImgWarn = false ;

            }
            this.$refs[formName].validate((valid) => {

              if(valid&&!this.goodsImgWarn&&this.agree){

              }else{
                if(!this.agree){
                  this.$message({
                    message : '请先阅读并勾选声明',
                    type: 'error',
                    center : true
                  })
                }
              }
            })
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/tab';

</style>
