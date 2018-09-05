<template>
    <div class="tab1 tab">
      <el-form :model="form" ref="form" :rules="formRule" label-position="right"  v-loading="loading"  element-loading-text="拼命加载中">
        <h1>基本信息</h1>
        <el-form-item  labelWidth="160px" label="店铺名称：" >
          <div class="inputInfo">{{ form.shopName }}</div>
        </el-form-item>
        <el-form-item  labelWidth="160px" label="店铺类型：" >
          <div class="inputInfo">个人入驻</div>
        </el-form-item>
        <el-form-item  labelWidth="160px" label="主营类目：" >
          <div class="inputInfo">{{ form.mainBusiness }}</div>
        </el-form-item>
        <el-form-item   labelWidth="160px"  label="招商对接联系方式：">
          <el-tooltip placement="right"  effect="light">
            <div slot="content">400-999-7860</div>
            <el-button size="small" type="text">查看</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item   labelWidth="160px"  label="第三方平台店铺：">
          <div v-if=" form.thirdShopUrl === undefined || form.thirdShopUrl === null">
            <span>无</span>
            <el-button size="small" type="text" @click="dialogVisible=true;">添加第三方平台店铺链接</el-button>
          </div>
          <div v-else="form.thirdShopUrl.length> 0">
            <span>{{ form.thirdShopUrl[0].platformName }}</span>
            <span style="display: block;white-space: pre-wrap;word-break: break-all;">{{ form.thirdShopUrl[0].url }}</span>
            <el-button type="primary" size="mini" @click="dialogVisible=true;">修改</el-button>
            </div>
        </el-form-item>
        <el-form-item labelWidth="160px" label="店铺LOGO：" prop="logoImage">
              <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.logoImage"
                          :headers="{'yb-tryout-merchant-token':token}"          :show-file-list="false"  :http-request="beforeImgUpload">
                <img v-if="form.logoImage" :src="imageDomain + form.logoImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          <p class="require">请上传尺寸为300px×300px，500k以内的图片</p>
          <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传店铺LOGO</span>
        </el-form-item>
        <el-form-item   labelWidth="160px"  label="店铺详情：" prop="describes">
          <el-input class="inputInfo" type="textarea" :rows="4" size="small" :maxlength="200" v-model.trim="form.describes" placeholder=""></el-input>
        </el-form-item>
        <el-form-item labelWidth="165px" label="app店铺首页背景图：" prop="backGroundUrl">
              <el-upload  class="upload" :auto-upload="autoUpload"  :action="appImgUrl" :multiple="false" v-model.trim="form.backGroundUrl"
                          :headers="{'yb-tryout-merchant-token':token}"          :show-file-list="false"  :http-request="appbeforeImgUpload">
                <img v-if="form.backGroundUrl" :src="imageDomain + form.backGroundUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          <p class="require">请上传尺寸为750px×580px，500k以内的图片<br>上传的店铺背景图不要有大面积白色或红色，以免影响店铺首页展示</p>   
          <!-- <span class="imgWarn tips_warn" v-if="appImgWarn">请上传app店铺首页背景图</span> -->
        </el-form-item>
        <el-form-item   labelWidth="160px"  label="入驻人邮箱：" prop="email">
          <el-input class="inputInfo telInput"  size="small" v-model.trim="form.email" placeholder="请输入入驻人邮箱"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="160px" label="入驻人手机号：" prop="mobile">
          <el-input class="inputInfo telInput"  size="small" :maxlength="11" v-model.tel="form.mobile" disabled="disabled"></el-input>
          <!-- <el-button type="text" size="mini" @click="goChange">修改</el-button> -->
          <span class="tip"><svg-icon icon-class="tips"/>此手机号为商家首次登陆后台的账号，有最高管理权限，暂不支持修改</span>
        </el-form-item>
        <el-form-item class="ruleDetail">
          <el-checkbox class="inputInfo"  size="small" v-model.trim="agree"></el-checkbox>
          <span>我声明，此页面内容由本店铺自行填写和发布，内容真实有效，如有相关法律法规，平台协议及平台规则之规定冲突的，以法律法规、平台协议及平台规则规定为准。</span>
        </el-form-item>
        <el-form-item labelWidth="160px">
          <el-button @click="submitForm('form')" type="primary" >保存</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="添加第三方平台店铺" :visible.sync="dialogVisible" width="60%" center >
        <div class="dialog_content">
          <el-select class="search" v-model="platformType" placeholder="请选择第三方平台" size="small" @change="getPlatformType(platformType)">
            <el-option
              v-for="(item ,index) in platForm"
              :key="index"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-input type="text" size="small" :maxlength="1000" v-model.trim="shopLink" placeholder="请输入第三方店铺链接"></el-input>
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
  import { getToken, getMobile } from '@/utils/auth'
  import { getBasicInfo,editorBasicInfo } from "@/api/userCenter"
  import  { validatePhone , validateZipCode,validateURL,validateEmail} from '@/utils/validate';

  export default {
        name: "tab1",
        data() {
          const validZipCode = (rule,value,callback) => {
            if(value === ''){
              callback(new Error('请填写邮箱'))
            }else{
              if(!validateEmail(value)){
                callback(new Error('请填写正确格式的邮箱'))
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
                mainBusiness: '',
                thirdShopUrl: [
                  {
                    platformName:'',
                    url:''
                  }
                ],
                logoImage : '',
                backGroundUrl:'',
                describes: '',
                email: '',
                mobile:'' ,
              },
              agree: false ,
              formRule: {
                describes: [
                  {
                    required : true ,trigger: 'blur',message : '请填写店铺详情'
                  }
                ],
                email: [
                  {
                    required : true ,trigger: 'blur', validator: validZipCode
                  }
                ],
                mobile: [
                  {
                    required : true ,trigger : 'blur',validator : validTel
                  }
                ]
              },
              autoUpload : true ,
              imgUrl : process.env.BASE_API+'/file/upload',
              appImgUrl : process.env.BASE_API+'/file/upload',
              imageDomain : process.env.IMAGE_DOMAIN ,
              token : getToken() ,
              goodsImgWarn: false,
              // appImgWarn: false,
              dialogVisible: false ,
              platformType: '',
              platformTypeName:'',
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
                {
                  name : '拼多多',
                  id : '4'
                },
                {
                  name : '唯品会',
                  id : '5'
                },
                {
                  name : '折800',
                  id : '6'
                },
                {
                  name : '贝贝',
                  id : '7'
                },
                {
                  name : '卷皮',
                  id : '8'
                },
                {
                  name : '蘑菇街',
                  id : '9'
                },
                {
                  name : '聚美优品',
                  id : '10'
                },
                {
                  name : '其他',
                  id : '11'
                },
              ],
              shopLink: '',
              shopTypeList:'',
              loading : false ,
              // shopTypeName:''
            }
        },
        mounted() {
          this.getInfo();
          // this.form=
        },
        methods: {

          //  获取信息
          getInfo(){
            this.loading = true ;
            getBasicInfo().then( res => {
              this.loading = false ;

              if( res.data.status === '000000000'){
                this.form = res.data.data ;
                if(this.form.thirdShopUrl !== null &&this.form.thirdShopUrl !== 'null'&& this.form.thirdShopUrl !== undefined&& this.form.thirdShopUrl !== ''){
                  this.form.thirdShopUrl = JSON.parse(res.data.data.thirdShopUrl);
                  this.platformType = this.form.thirdShopUrl[0].platformName;
                  this.shopLink = this.form.thirdShopUrl[0].url;

                }
                if( this.form.mobile === null ){
                  this.form.mobile = getMobile()
                }
                // this.getTypeList();
              }
            })
          },
          //  选择平台
          getPlatformType(item){
            // for(let i = 0; i<this.platForm.length;i++){
            //   if(this.platForm[i].id === item){
            //     this.platformTypeName = this.platForm[i].name
            //     console.log(this.platformTypeName)
            //   }
            // }
          },
          //提交第三方平台链接
          confirm(link){
            if(!validateURL(link)){
              this.$message({
                message : '请输入正确格式的店铺链接',
                center : true ,
                type : 'error'
              })
            }else{
              let arr = [];

              arr.push({ platformName :this.platformType , url : this.shopLink  });
              this.form.thirdShopUrl = arr;
              this.dialogVisible = false ;

            }
          },
          //跳转修改手机号
          goChange(){

          },

          // 上传店铺logo图片
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
                  formData.append('image', file.file);
                  uploadImage(formData).then(res => {
                    if (res.data.status === '000000000') {

                        _this.form.logoImage = res.data.data.fileName;
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
            reader.readAsDataURL(file.file);
          },
          // 上传app店铺背景图图片
          appbeforeImgUpload(file) {
            let reader = new FileReader();
            let ret = [];
            let _this = this;
            reader.onload = (e) => {
              let image = new Image();
              image.onload = function () {
                const isHeight = this.height;
                const isWidth = this.width;
                if (isWidth > 750 || isHeight > 580) {
                  _this.$message.error('图片尺寸过大，请重新选择后上传');
                  return false;

                } else {
                  let formData = new FormData();
                  formData.append('image', file.file);
                  uploadImage(formData).then(res => {
                    if (res.data.status === '000000000') {

                        _this.form.backGroundUrl = res.data.data.fileName;
                        // console.log(_this.form.imgList)

                    } else {
                      // _this.appImgWarn = true;

                    }
                  }).catch(err => {
                    // console.log(err) ;
                    // _this.appImgWarn = true;

                  })
                }
              };

              image.src = e.target.result;
            };
            reader.readAsDataURL(file.file);
          },
          //提交表单
          submitForm(formName){
            if(this.form.logoImage === ''){
              this.goodsImgWarn = true ;
            }else{
              this.goodsImgWarn = false ;

            }
            // if(this.form.backGroundUrl === ''){
            //   this.appImgWarn = true ;
            // }else{
            //   this.appImgWarn = false ;

            // }
            this.$refs[formName].validate((valid) => {

              if(valid&&!this.goodsImgWarn&&this.agree){
                let newForm = Object.assign({}, this.form);
                newForm.thirdShopUrl = JSON.stringify(this.form.thirdShopUrl);
                editorBasicInfo(newForm).then( res => {
                  if(res.data.status === '000000000'){
                    this.$message({
                      message : '您提交的店铺基本信息已成功保存~',
                      center : true ,
                      type : 'success'
                    });
                    this.getInfo();

                  }
                })
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
  @import '../../../../styles/tab';
  .tip{
      width : 80% ;
      margin : auto;
      display: inline-block;
      font-size : 0.14rem ;
      color : #666;
      min-height : 0.4rem ;
      line-height :0.4rem;
      background : #fdf1ce;
      border : 1px solid #ffe18d ;
      border-radius : 0.05rem;
      padding : 0 0.2rem;
      box-sizing: border-box;
      .svg-icon{
        width : 0.3rem;
        height : 0.3rem;
        margin : 0.04rem 0.05rem;
        float : left;

      }
    }
</style>
