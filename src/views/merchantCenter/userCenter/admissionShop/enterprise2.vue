<template>
    <div class="enterprise2  new tagView">
      <el-form :model="form" ref="form" :rules="formRule" label-position="right">
        <h1 class="h_title">店铺基本信息</h1>
        <el-form-item  :labelWidth="labelWidth" label="主营类目："  prop="shopType">
          <span class="tip" style="margin-bottom: 0.2rem;">入驻后，主营类目不可修改，请谨慎选择</span>
          <el-checkbox-group v-model="form.shopType" size="mini">
            <el-checkbox-button v-for="(item,index) in shopTypeList" :key="index" :label="item.value" border>{{ item.name }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="店铺名称：" prop="shopName">
          <el-input class="inputInfo" size="small" v-model.trim="form.shopName" :disabled="readOnly" placeholder="请输入店铺名称"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>入驻后店铺名称不可修改，请谨慎填写</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="名称预览：" >
          <div class="inputInfo showShop" >{{ form.shopName }}</div>
          <span class="tip" style="margin-top: 0.2rem;">入驻成功后店铺的名称</span>
        </el-form-item>
        <p class="h_title otherInfo">入驻企业信息</p>
        <el-form-item  :labelWidth="labelWidth" label="是否是国内企业证件照：" prop="inner">
          <el-radio label="1" v-model="form.inner">是</el-radio>
        </el-form-item>
        <el-form-item :labelWidth="labelWidth" label="是否三证合一：" prop="all">
          <el-radio label="1" v-model="form.all">是</el-radio>
          <span class="tip" style="margin-left: 0.2rem;">注：目前仅支持三证合一</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="公司名称：" prop="companyName">
          <el-input class="inputInfo" size="small" v-model.trim="form.companyName" :disabled="readOnly" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="公司经营地址：" prop="companyAddr">
          <el-select v-model="form.companyAddr.provice" clearable placeholder="请选择" size="mini">
            <el-option
              v-for="item in proviceList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="blank"></div>
          <el-input class="inputInfo" size="small" v-model.trim="form.companyAddr.detail" :disabled="readOnly" placeholder="请输入精确到门牌号的具体地址"></el-input>
          <span class="tip">注：请填写公司实际经营地址</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="社会信用代码：" prop="social_credit_code">
          <el-input class="inputInfo" size="small" v-model.trim="form.social_credit_code" :disabled="readOnly" placeholder="请输入社会统一信用代码"></el-input>
          <el-button type="text" @click="showDemo('1')">示例</el-button>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="营业执照：" prop="back">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.business_license"
                      :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforeLicense">
            <img v-if="form.business_license" :src="imageDomain + form.business_license" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="licenseWarn">请上传营业执照</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('2')">查看示例</el-button>
        </el-form-item>
        <el-form-item   :labelWidth="labelWidth"  label="营业期限：" prop="licenseDate">
          <el-col :span="9">
            <el-date-picker type="date" size="mini" placeholder="截止日期" :disabled="readOnly" v-model="form.licenseDate" style="width: 100%;" :readonly="long"></el-date-picker>
          </el-col>
          <el-col class="line" :span="20">
            <el-checkbox v-model="long" :disabled="readOnly">长期</el-checkbox>
            <span class="tip" style="background: none;border: 0;"><svg-icon icon-class="tips"/>注：营业期限剩余有效期时长必须大于2个月</span>
          </el-col>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="开户许可证：" prop="back">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.opening_permit"
                      :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforePermit">
            <img v-if="form.opening_permit" :src="imageDomain + form.opening_permit" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="permitWarn">请上传开户许可证</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('3')">查看示例</el-button>
          <span class="tip" style="background: none;border: 0;"><svg-icon icon-class="tips"/>开户许可证是指入驻企业在银行开设基本存款账户时取得的凭证，应由银行开具</span>
        </el-form-item>
        <p class="h_title otherInfo">商标信息上传<span class="note">（注：上传的图片大小在5M以内，仅支持jpg、png格式）</span></p>
        <el-form-item  :labelWidth="labelWidth" label="注册类型：" prop="registerType">
          <el-radio label="1" v-model="form.registerType">自有商标</el-radio>
          <el-radio label="2" v-model="form.registerType">授权商标</el-radio>
        </el-form-item>
        <el-form-item :labelWidth="labelWidth" label="商标注册号：" prop="registerCode">
          <el-input class="inputInfo" size="small"  v-model.trim="form.registerCode" :disabled="readOnly" placeholder="请输入商标注册号"></el-input>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="商标注册证明：" prop="certification">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.certification"
                      :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforeCertification">
            <img v-if="form.certification" :src="imageDomain + form.certification" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="certificationtWarn">请上传商标注册证明</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('4')">查看示例</el-button>
          <ul class="intro">
            <li>注:</li>
            <li>1、请上传《商标注册证》或《注册申请受理通知书》；</li>
            <li>2、变更中的商标请同时上传《变更受理通知书》和《注册申请受理通知书》；</li>
            <li>3、转入/已转让的商标需上传《转让受理通知书》或者《转让证明》；</li>
            <li>4、《商标注册证》续证完成，而原《商标注册证》已经过期，需同时上传《核准续展注册证明。》</li>
          </ul>
        </el-form-item>
        <p class="h_title otherInfo">其他信息</p>
        <el-form-item style="width: 95%;margin-top:0.5rem;"  :labelWidth="labelWidth" label="第三方店铺链接：" prop="shopLink">
          <el-input class="inputInfo" size="small"  v-model.trim="form.shopLink" :disabled="readOnly" placeholder="请填写真实的第三方平台店铺链接可增加入驻成功率，没有可不填"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>入驻后店铺名称不可修改，请谨慎填写</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" >
          <el-checkbox class="inputInfo" size="small" v-model="agree">我已阅读并同意<el-button type="text" @click="readRule = true">《丫贝网合作协议》</el-button></el-checkbox>
        </el-form-item>
        <el-form-item class="bottom">
          <el-button plain @click="goBack">上一步</el-button>
          <el-button type="warning" @click="goNext('form')">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="80%" center>
        <el-form :model="form" ref="form"  label-position="right">
          <span class="tip dialogTip"><svg-icon icon-class="tips"/>以下信息至关重要，请您再次确认后提交</span>
          <el-form-item  :labelWidth="labelWidth" label="店铺类型：" >
            <div class="inputInfo" >企业店铺</div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="店铺名称：" >
            <div class="inputInfo" >{{ form.shopName }}
              <span class="tips_warn">入驻后店铺名称不可修改</span>
            </div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="店铺名称：">
            <div class="inputInfo" ><span v-for="(item,index) in form.shopType" :key="index">{{ item }}</span>
              <span class="tips_warn">入驻后主营类目不可修改</span>
            </div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="店铺管理人姓名：" >
            <div class="inputInfo" >{{ form.name }}</div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="店铺管理人手机号：" >
            <div class="inputInfo" >{{ form.tel }}
              <span class="tips_warn">该手机号将拥有店铺经营最高管理权限</span>
            </div>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="confirm">准确无误</el-button>
          <el-button plain @click="dialogVisible = false ;">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="丫贝网合作协议" :visible.sync="readRule" width="60%" center>
        <div class="wrap">
          <img src="../../../../assets/imgs/logo.png" />
          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="readRule = false;">我知道了</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="示例" :visible.sync="imgVisible" width="60%" center>
        <div class="wrap">
          <img v-if="showImg === '1'" src="../../../../assets/imgs/u923.png" />
          <img v-else-if="showImg === '2'" src="../../../../assets/imgs/u922.png" />
          <img v-else-if="showImg === '3'" src="../../../../assets/imgs/u924.png" />
          <img v-else-if="showImg === '4'" src="../../../../assets/imgs/u1810.png" />
          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="imgVisible = false ;">我知道了</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { validateURL ,validCreditCode } from '@/utils/validate'
  import { uploadImage  } from "@/api/activity"
  import { getToken } from '@/utils/auth'
  export default {
        name: "enterprise2",
        data() {
          const validAddress = (rule,value ,callback) => {
            if(this.form.companyAddr.provice === ''){
              callback(new Error('请选择公司所在省市'))
            }else if(this.form.companyAddr.detail === ''){
              callback(new Error('请填写公司具体经营地址'))
            }
            callback();
          };
              const validLink = (rule,value,callback) => {

                if(value !== ''){
                  if(!validateURL(value)){
                    callback(new Error('请填写正确格式的商品链接'))
                  }else{
                    callback();
                  }
                }else{
                  callback();
                }


              };
              const validCredit = (rule,value,callback) => {
                if(value === ''){
                  callback(new Error('请输入统一社会信用代码'))
                }else{
                  if(!validCreditCode(value)){
                    callback(new Error('请输入正确格式的社会信用代码'))
                  }
                  callback();
                }
              };
          return {
            labelWidth: '200px',
            form: {
              shopType: [],
              shopName:'',
              shopLink:'',
              inner: '1',
              all: '1',
              companyName:'',
              companyAddr:{ provice : '', detail: ''},
              social_credit_code:'',
              business_license: '',
              opening_permit: '',
              licenseDate: '',
              registerType:'1',
              registerCode:'',
              certification: ''
            },
            shopTypeList: [],
            formRule:{
              shopType:[
                {
                  type: 'array', required: true ,trigger : 'change',message: '请选择入驻店铺主营类目'
                }
              ],
              shopName:[
                {
                  required : true ,trigger: 'blur',message : '请输入入驻店铺名称'
                }
              ],
              inner:[
                {
                  required: true ,trigger: 'change',message: '该选项必填'
                }
              ],
              all:[
                {
                  required: true ,trigger: 'change',message: '该选项必填'
                }
              ],
              companyName:[
                {
                  required: true ,trigger: 'blur',message: '请输入公司名称'
                },
              ],
              companyAddr: [
                  {
                    required: true, trigger: 'blur', validator: validAddress
                  }


              ],
              social_credit_code: [
                {
                  required: true ,trigger : 'blur', validator : validCredit
                }
              ],
              registerType: [
                {
                  required : true , trigger: 'change', message : '请选择注册类型'
                }
              ],
              registerCode: [
                {
                  required : true ,trigger: 'blur' ,message : '请输入商标注册号'
                }
              ],
              shopLink:[
                {
                  required:false ,trigger: 'blur',validator: validLink
                }
              ]

            },
            readOnly: false ,
            agree: false,
            dialogVisible : false ,
            readRule: false ,
            imgVisible: false ,
            proviceList: [],
            autoUpload : true ,
            imgUrl : process.env.BASE_API+'/file/upload',
            imageDomain : process.env.IMAGE_DOMAIN ,
            licenseWarn : false ,
            permitWarn: false ,
            certificationtWarn: false ,
            long: false,
            showImg: '',
            token: getToken(),
          }

        },
        mounted() {
          this.getTypeList();
          this.getProviceList();
        },
        methods: {
          getTypeList(){
            this.shopTypeList =  [{
              value: '1',
              name: '王小虎',
            }, {
              value: '2',
              name: '小虎',
            }, {
              value: '3',
              name: '土豆粉',
            }, {
              value: '4',
              name: '家具生活',
            }]
          },
          getProviceList(){
            // this.proviceList = []
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
          //  上传营业执照
          beforeLicense(file) {
            let that = this;
            if(this.limitImg(file)){

              let formData = new FormData();
              formData.append('image', file);
              uploadImage(formData,that.token).then(res => {
                if (res.data.status === '000000000') {
                  // console.log(_this.form.imgList)
                  that.form.business_license = res.data.data.fileName ;
                  that.licenseWarn = false;
                } else {
                  that.licenseWarn = true;
                  that.form.business_license = '';
                }
              }).catch(err => {
                // console.log(err) ;
                that.form.business_license = '';
                that.licenseWarn = true;

              })
            }



          },
          // 上传开户许可照
          beforePermit(file) {
            let that = this;

            if (this.limitImg(file)) {
              let formData = new FormData();
              formData.append('image', file);
              uploadImage(formData,that.token).then(res => {
                if (res.data.status === '000000000') {
                  // console.log(_this.form.imgList)
                  that.form.opening_permit = res.data.data.fileName ;
                  that.permitWarn = false;
                } else {
                  that.permitWarn = true;
                  that.form.opening_permit = '' ;

                }
              }).catch(err => {
                // console.log(err) ;
                that.permitWarn = true;
                that.form.opening_permit = '' ;
              })
            }

          },
          //上传商标注册证明
          beforeCertification(){
            let that = this;

            if (this.limitImg(file)) {
              let formData = new FormData();
              formData.append('image', file);
              uploadImage(formData,that.token).then(res => {
                if (res.data.status === '000000000') {
                  // console.log(_this.form.imgList)
                  that.form.certification = res.data.data.fileName ;
                  that.certificationtWarn = false;
                } else {
                  that.certificationtWarn = true;
                  that.form.certification = '' ;

                }
              }).catch(err => {
                // console.log(err) ;
                that.certificationtWarn = true;
                that.form.certification = '' ;
              })
            }

          },
          showDemo(index){
            this.imgVisible = true ;
            // this.imgTitle = this.demo[index].title ;
            this.showImg = index ;
          },

          //返回上一步
          goBack(){
            this.$emit('stepObj',{ index : '1' ,component : 'enterprise1'})

          },
          //下一步操作
          goNext(formName){
            this.dialogVisible = true ;

            this.$refs[formName].validate((valid) => {


              if(valid){
                console.log(this.agree,1);
                if(!this.agree){
                  this.$message({
                    message : '请先阅读并同意《丫贝网合作协议》',
                    type: 'error',
                    center: true
                  })
                }else{
                  this.dialogVisible = true ;
                }

              }else{

              }
            })
          },
          //  确认提交
          confirm(){
            this.dialogVisible = false ;
            this.$emit('stepObj',{ index : '3' ,component : 'successAdd'})

          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../../styles/new';
  .el-form-item{
    width : 90%!important;
  }

  .blank{
    width : 50% ;
    height : 40px;
  }
  .el-select,.inputInfo,.blank{
    float: left;
    /*width : 80%!important ;*/
  }
  .tips_warn{
    float: right ;
    font-size : 0.12rem;
  }
  .dialogTip{
    margin : 0.5rem auto!important ;
    display: block!important;
  }
  .tip{
    width : 50%!important;
  }
  .note{
    font-size : 0.16rem;
    color : #666 ;
    font-weight : 100;
  }
  .intro{
    width : 60% !important;
  }
</style>
