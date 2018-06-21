<template>
    <div class="tab1 tab">
      <el-form :model="form" ref="form" :rules="formRule" label-position="right" >
        <h2>商品表单</h2>
        <el-form-item  labelWidth="130px" label="店铺名称：" >
          <div class="inputInfo">{{ form.shopName }}</div>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="店铺类型：" >
          <div class="inputInfo">{{ form.shopType }}</div>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="主营类目：" >
          <div class="inputInfo">{{ form.goodsType }}</div>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="招商对接联系方式：">
          <el-button size="small" type="text">查看</el-button>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="招商对接联系方式：">
          <el-button size="small" type="text">添加第三方平台店铺链接</el-button>
        </el-form-item>
        <el-form-item labelWidth="130px" label="店铺LOGO：" prop="logo">
              <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.logo"
                          :headers="{ 'yb-tryout-merchant-token':token}"
                          :show-file-list="false"  :before-upload="beforeImgUpload">
                <img v-if="form.logo" :src="imageDomain + form.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          <p class="require">请上传尺寸为300px×300px，500k以内的图片</p>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="店铺详情：" prop="shopDetail">
          <el-input class="inputInfo" type="textarea" :rows="4" size="small" v-model.trim="form.shopDetail" placeholder=""></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="入驻人邮箱：" prop="email">
          <el-input class="inputInfo"  size="small" v-model.trim="form.email" placeholder="请输入入驻人邮箱"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="入驻人手机号：" prop="tel">
          <el-input class="inputInfo"  size="small" v-model.trim="form.tel" disabled="disabled" placeholder=""></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px" prop="rule">
          <el-checkbox class="inputInfo"  size="small" v-model.trim="form.rule"></el-checkbox>
          <span>我声明，此页面内容由本店铺自行填写和发布，内容真实有效，如有相关法律法规，平台协议及平台规则之规定冲突的，以法律法规、平台协议及平台规则规定为准。</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('form')" type="primary" >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import { uploadImage  } from "@/api/activity"
  import { getToken } from '@/utils/auth'

  export default {
        name: "tab1",
        data() {
            return {
              form : {
                rule : false
              },
              formRule: {

              },
              autoUpload : true ,
              imgUrl : process.env.BASE_API+'/tryout/file/upload',
              imageDomain : process.env.IMAGE_DOMAIN ,
              token : getToken() ,

            }
        },
        mounted() {
        },
        methods: {
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

                        _this.form.logo = res.data.data.fileName;
                        // console.log(_this.form.imgList)

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
          submitForm(formName){
            this.$refs[formName].validate((valid) => {
              if(valid){

              }else{

              }
            })
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/tab';
</style>
