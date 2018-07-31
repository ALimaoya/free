<template>
    <div class="enterprise2  new tagView">
      <el-form :model="form" ref="form" :rules="formRule" label-position="right">
        <h1 class="h_title">店铺基本信息</h1>
        <el-form-item  :labelWidth="labelWidth" label="主营类目："  prop="mainBusiness">
          <span class="tip" style="margin-bottom: 0.2rem;"><svg-icon icon-class="tips"/>入驻后，主营类目不可修改，请谨慎选择</span>
          <!-- <el-checkbox-group v-model="form.mainBusiness" size="mini">
            <el-checkbox-button v-for="(item,index) in mainBusinessList" :key="index" :label="item.value" border>{{ item.name }}</el-checkbox-button>
          </el-checkbox-group> -->
          <div>
            <el-radio-group size="mini" fill="#f56c6c" v-model="form.mainBusiness"  >
              <el-radio-button border v-for="(item,index) in shopTypeList" :key="index" :label="item.name">{{ item.name }}</el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="店铺名称：" prop="shopName">
          <el-input class="inputInfo" size="small" :maxlength="37" v-model.trim="form.shopName" @change="haveShop(form.shopName)" :disabled="readOnly" placeholder="请输入店铺名称"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>入驻后店铺名称不可修改，请谨慎填写</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="名称预览：" >
          <div class="inputInfo showShop" ><span v-if="form.shopName !== ''">{{ form.shopName + lastName[brandInfo]}} </span></div>
          <span class="tip" style="margin-top: 0.2rem;"><svg-icon icon-class="tips"/>入驻成功后店铺的名称</span>
        </el-form-item>
        <p class="h_title otherInfo">入驻企业信息</p>
        <el-form-item  :labelWidth="labelWidth" label="是否是国内企业证件照：" prop="licenseCountryType">
          <el-radio label="1" v-model="form.licenseCountryType">是</el-radio>
        </el-form-item>
        <el-form-item :labelWidth="labelWidth" label="是否三证合一：" prop="licenseMergeType">
          <el-radio label="1" v-model="form.licenseMergeType">是</el-radio>
          <span class="tip" style="margin-left: 0.2rem;"><svg-icon icon-class="tips"/>注：目前仅支持三证合一</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="公司名称："  prop="enterpriseName">
          <el-input class="inputInfo" size="small" :maxlength="40" v-model.trim="form.enterpriseName" :disabled="readOnly" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item v-if="form.companyAddress !== undefined" :labelWidth="labelWidth" label="公司经营地址：" prop="companyAddress">
          <el-select v-if="form.companyAddress !== undefined" v-model="form.companyAddress.province" clearable placeholder="请选择" size="mini">
            <el-option
              v-for="item in provinceList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <div class="blank"></div>
          <el-input class="inputInfo" size="small" :maxlength="200" v-model.trim="form.companyAddress['detail']" :disabled="readOnly" placeholder="请输入精确到门牌号的具体地址"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>注：请填写公司实际经营地址</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="社会信用代码：" prop="socialCreditCode">
          <el-input class="inputInfo" size="small" v-model.trim="form.socialCreditCode" :disabled="readOnly" placeholder="请输入社会统一信用代码"></el-input>
          <el-button type="text" @click="showDemo('1')">示例</el-button>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="营业执照：" prop="businessImage">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.businessImage"
                      :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforeLicense">
            <img v-if="form.businessImage" :src="imageDomain + form.businessImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="licenseWarn">请上传营业执照</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('2')">查看示例</el-button>
        </el-form-item>
        <el-form-item   :labelWidth="labelWidth"  label="营业期限：" prop="busLicenceDeadline">
          <el-col :span="9">
            <el-date-picker type="date" size="mini" placeholder="截止日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :disabled="readOnly" v-model="form.busLicenceDeadline" style="width: 100%;" :readonly="long"></el-date-picker>
          </el-col>
          <el-col class="line" :span="20">
            <el-checkbox v-model="long" :disabled="readOnly">长期</el-checkbox>
            <span class="tip" style="bubusinessImageground: none;border: 0;"><svg-icon icon-class="tips"/>注：营业期限剩余有效期时长必须大于2个月</span>
          </el-col>
        </el-form-item>
        <el-form-item class="uploadImg" :labelWidth="labelWidth" label="开户许可证：" prop="openLicenceImage">
          <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.openLicenceImage"
                      :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforePermit">
            <img v-if="form.openLicenceImage" :src="imageDomain + form.openLicenceImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="permitWarn">请上传开户许可证</span>
          </el-upload>
          <el-button class="showBtn" type="text" size="mini" @click="showDemo('3')">查看示例</el-button>
          <span class="tip" style="background: none;border: 0;"><svg-icon icon-class="tips"/>开户许可证是指入驻企业在银行开设基本存款账户时取得的凭证，应由银行开具</span>
        </el-form-item>
        <div  v-if="brandInfo !=='3'">
          <p class="h_title otherInfo">商标信息上传<span class="note">（注：上传的图片大小在5M以内，仅支持jpg、png格式）</span></p>
          <div class="itemContent"  v-for="(item,index) in form.merchantBrandinfoReqDtos" :key="index">
          <el-form-item  :labelWidth="labelWidth" label="注册类型：" :prop="'merchantBrandinfoReqDtos.'+index+'.brandRegistType'" :rules="{ message : '请选择注册类型', trigger : 'change' , required: true }">
            <el-radio-group v-model="item.brandRegistType" @change="resetInfo(item.brandRegistType)">
              <el-radio label="1" :disabled="form.merchantBrandinfoReqDtos.length> 1">自有商标</el-radio>
              <el-radio label="2" :disabled="brandInfo === '0'">授权商标</el-radio>
            </el-radio-group>
            <el-button v-if="form.merchantBrandinfoReqDtos.length> 1" style="float: right ;" class="tips_warn" type="text" @click="deleteBrand(item)">删除</el-button>
          </el-form-item>
            <el-form-item :labelWidth="labelWidth" label="商标注册号：" :prop="'merchantBrandinfoReqDtos.'+index+'.brandRegistCode'" :rules="{ message : '请输入商标注册号', trigger : 'blur' , required: true }">
              <el-input class="inputInfo" size="small" :maxlength="100"  v-model.trim="item.brandRegistCode" :disabled="readOnly" placeholder="请输入商标注册号"></el-input>
            </el-form-item>
            <el-form-item class="uploadImg" :labelWidth="labelWidth" label="商标注册证明：" :prop="'merchantBrandinfoReqDtos.'+index+'.brandCertifyImage'">
              <div @click="chooseCer = index ;">
                <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="item.brandCertifyImage"
                            :headers="{'yb-tryout-merchant-token':token}"           :show-file-list="false"  :before-upload="beforeCertification" >
                  <img v-if="item.brandCertifyImage" :src="imageDomain + item.brandCertifyImage" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <span class="imgWarn tips_warn" v-if="certificationtWarn">请上传商标注册证明</span>
                </el-upload>
              </div>
              <el-button class="showBtn" type="text" size="mini" @click="showDemo('4')">查看示例</el-button>
              <ul class="intro">
                <li>注:</li>
                <li>1、请上传《商标注册证》或《注册申请受理通知书》；</li>
                <li>2、变更中的商标请同时上传《变更受理通知书》和《注册申请受理通知书》；</li>
                <li>3、转入/已转让的商标需上传《转让受理通知书》或者《转让证明》；</li>
                <li>4、《商标注册证》续证完成，而原《商标注册证》已经过期，需同时上传《核准续展注册证明》。</li>
              </ul>
            </el-form-item>
            <el-form-item v-if="brandInfo !== '0'&& item.brandRegistType === '2'" class="uploadImg" :labelWidth="labelWidth" label="品牌授权证明：" :prop="'merchantBrandinfoReqDtos.'+index+'.brandAuthImage'">
              <div @click="chooseBrand = index ;">
                <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="item.brandAuthImage"
                            :headers="{'yb-tryout-merchant-token':token}" :show-file-list="false"  :before-upload="beforeBrandAuth" >
                  <img v-if="item.brandAuthImage" :src="imageDomain + item.brandAuthImage" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <span class="imgWarn tips_warn" v-if="brandAuthWarn">请上传品牌授权证明</span>
                </el-upload>
              </div>
              <el-button class="showBtn" type="text" size="mini" @click="showDemo('5')">查看示例</el-button>
              <ul class="intro">
                <li>注:</li>
                <li>1、上传从商标授权人到开店公司的完整授权文件；
                  <el-popover placement="right"
                              width="200"
                              trigger="hover"
                              content="品牌授权证明需上传完整授权链，否则将被驳回，上传无关文件也将被驳回。
                              如：商标权利人A为某公司B授权，B再给入驻商家C授权，则此处需要上传A-B授权文件和B-C授权文件。">
                    <span slot="reference" class="el-icon-question"></span>
                  </el-popover>
                </li>
                <li>2、若商标授权人为自然人，须提交商标授权人亲笔签名；</li>
                <!--<li>3、如果是旗舰店，请点击下载模板填写，加盖授权及开店公司红色公章后上传照片或扫描件。</li>-->
              </ul>
            </el-form-item>
            <el-form-item v-if="brandInfo !== '0'&& item.brandRegistType === '2'" :labelWidth="labelWidth" label="品牌授权截止日期："  :prop="'merchantBrandinfoReqDtos.'+index+'.brandAuthDeadline'" :rules="{ message : '请选择品牌授权截止日期', trigger : 'change' , required: true }">
              <el-col :span="9">
                <el-date-picker type="date" size="mini" placeholder="请选择截止日期" value-format="yyyy-MM-dd" auto-complete="off" :picker-options="pickerOptions2" :disabled="brandInfo==='0'||brandInfo==='3'" v-model="item.brandAuthDeadline" style="width: 100%;" ></el-date-picker>
              </el-col>
            </el-form-item>
          </div>
            <el-form-item :labelWidth="labelWidth">
              <el-button size="small" type="danger" v-if="form.merchantBrandinfoReqDtos !== undefined && form.merchantBrandinfoReqDtos[0].brandRegistType === '2'&& brandInfo === '2'&&form.merchantBrandinfoReqDtos.length< 3" @click="addBrand">添加更多商标信息</el-button>
            </el-form-item>

        </div>

        <p class="h_title otherInfo">其他信息</p>
        <el-form-item v-if="form.thirdShopUrl !== undefined && form.thirdShopUrl[0] !== undefined " style="width: 95%;margin-top:0.5rem;"  :labelWidth="labelWidth" label="第三方店铺链接：" :prop="'thirdShopUrl.'+ 0">
          <el-select class="search" clearable v-model="form.thirdShopUrl[0].platformName" placeholder="请选择第三方平台" size="small" >
            <el-option
              v-for="item in platForm"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-input class="inputInfo urlInput" size="small" :maxlength="200" v-model.trim="form.thirdShopUrl[0].url" :disabled="readOnly" placeholder="请填写真实的第三方平台店铺链接可增加入驻成功率，没有可不填"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>入驻后店铺名称不可修改，请谨慎填写</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" >
          <el-checkbox class="inputInfo" size="small" v-model="agree">我已阅读并同意<el-button type="text" @click="readRule = true">《丫贝网合作协议》</el-button></el-checkbox>
        </el-form-item>
        <el-form-item class="bottom">
          <el-button plain @click="goBack">上一步</el-button>
          <el-button type="danger" @click="goNext('form')">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog class="checkBox" title="温馨提示" :visible.sync="dialogVisible" width="80%" center>
        <el-form :model="form" ref="form"  label-position="right">
          <span class="tip dialogTip"><svg-icon icon-class="tips"/>以下信息至关重要，请您再次确认后提交</span>
          <el-form-item  :labelWidth="labelWidth" label="店铺类型：" >
            <div class="inputInfo" >企业店铺</div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="店铺名称：" >
            <div class="inputInfo" >{{ form.shopName + lastName[brandInfo] }}
              <span class="tips_warn">入驻后店铺名称不可修改</span>
            </div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="主营类目：">
            <div class="inputInfo" ><span >{{ form.mainBusiness  }}</span>
              <span class="tips_warn">入驻后主营类目不可修改</span>
            </div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="店铺管理人姓名：" >
            <div class="inputInfo" >{{ this.$store.state.shopInfo.enterForm2.name }}</div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="店铺管理人手机号：" >
            <div class="inputInfo" ><span style="display: inline-block;">{{ this.$store.state.shopInfo.enterForm2.mobile }}</span>
              <span class="tips_warn">该手机号将拥有店铺经营最高管理权限，暂不支持修改</span>
            </div>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="confirm">准确无误</el-button>
          <el-button plain @click="dialogVisible = false ;">取&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="丫贝网合作协议" :visible.sync="readRule" width="70%" center>
        <div class="wrap">
          <img class="ruleImg" src="../../../assets/imgs/register.png" />
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="readRule = false;">我知道了</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog class="demoBox" title="示例" :visible.sync="imgVisible" width="60%" center>
        <div class="wrap">
          <img v-if="showImg === '1'|| showImg === '2'" src="../../../assets/imgs/bussiness.png" />
          <img v-else-if="showImg === '3'" src="../../../assets/imgs/permission.png" />
          <img v-else-if="showImg === '4'" src="../../../assets/imgs/brandRegister.png" />
          <img v-else-if="showImg === '5'" src="../../../assets/imgs/brandAuth.png" />
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="imgVisible = false ;">我知道了</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { validateURL ,validCreditCode } from '@/utils/validate'
  import { uploadImage  } from "@/api/activity"
  import { getToken } from '@/utils/auth'
  import { firstList } from "@/api/merchant"
  import { getProvinceList } from "@/api/userCenter"
  import { enterApply , haveShopName } from "@/api/enter"
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
  import ElFormItem from "element-ui/packages/form/src/form-item";
  import ElButton from "element-ui/packages/button/src/button";

  export default {
    components: {
      ElButton,
      ElFormItem,
      ElRadioGroup},
    name: "enterprise2",
    props : ['editorInfo'],

    data() {
          const validAddress = (rule,value ,callback) => {
            if(this.form.companyAddress.province === ''){
              callback(new Error('请选择公司所在省市'))
            }
            if(this.form.companyAddress.detail === ''){
              callback(new Error('请填写公司具体经营地址'))
            }
            callback();
          };
              const validLink = (rule,value,callback) => {
                if(value.platformName !== ''&& value.url === ''){
                  callback(new Error('请填写店铺链接'))

                }
                if(value.platformName === ''&& value.url !== ''){

                  callback(new Error('请选择第三方店铺平台'))

                }
                if(value.platformName !== ''&& value.url !== ''){
                  if(!validateURL(value.url)) {
                    callback(new Error('请填写正确格式的店铺链接'))
                  }

                }
                callback();


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
              const validDate = ( rule, value ,callback) => {
                if(value === '' && this.long === false ){
                  callback(new Error('请选择营业执照有效期'))
                }
                callback();
              };
          return {
            labelWidth: '200px',
            form: {},
            shopTypeList: [],
            formRule:{
              mainBusiness:[
                {
                 required: true ,trigger : 'change',message: '请选择入驻店铺主营类目'
                }
              ],
              shopName:[
                {
                  required : true ,trigger: 'blur',message : '请输入入驻店铺名称'
                }
              ],
              licenseCountryType:[
                {
                  required: true ,trigger: 'change',message: '该选项必填'
                }
              ],
              licenseMergeType:[
                {
                  required: true ,trigger: 'change',message: '该选项必填'
                }
              ],
              enterpriseName:[
                {
                  required: true ,trigger: 'blur',message: '请输入公司名称'
                },
              ],
              companyAddress: [
                  {
                    required: true, trigger: 'blur', validator: validAddress
                  }
              ],
              socialCreditCode: [
                {
                  required: true ,trigger : 'blur', validator : validCredit
                }
              ],
              busLicenceDeadline:[
                {
                  required : true ,trigger : 'change',validator: validDate
                }
              ],
              thirdShopUrl:[
                {
                  required:false ,trigger: 'change',validator: validLink
                }
              ]

            },
            readOnly: false ,
            agree: false,
            dialogVisible : false ,
            readRule: false ,
            imgVisible: false ,
            provinceList: [],
            autoUpload : true ,
            imgUrl : process.env.BASE_API+'/file/upload',
            imageDomain : process.env.IMAGE_DOMAIN ,
            licenseWarn : false ,
            permitWarn: false ,
            certificationtWarn: false ,
            brandAuthWarn: false ,
            long: false,
            showImg: '',
            token: getToken(),
            brandInfo: '',
            requiredInput : true,
            chooseCer: '',
            chooseBrand : '',
            lastName : ['旗舰店','专卖店','专营店',''],
            busLicenceType: '',
            shopTypeName:'',
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
            pickerOptions : {
              disabledDate(time){
                let curDate = new Date().getTime() ;
                let endTime = new Date('9999-12-31').getTime();
                return time.getTime() < curDate || time.getTime()> endTime ;
              }
            } ,
            pickerOptions2 : {
              disabledDate(time){
                let curDate = new Date().getTime() ;
                return time.getTime() < curDate  ;
              }
            } ,
          }

        },
        mounted() {
          this.getTypeList();
          this.getProvince();

          this.form = this.$store.state.shopInfo.enterForm2 ;
          let _this = this ;
          if(typeof (this.form.companyAddress) !== 'object' && this.form.companyAddress !== null ){
            let label = this.form.companyAddress.split('-')[0] ;
            let provinceValue = this.form.companyAddress.split('-')[1];
            _this.form.companyAddress = {
              detail:provinceValue,
              province: label
            };


          }else if(this.form.companyAddress === null){
            this.form.companyAddress = { province : '', detail: ''}
          }
          if(this.form.busLicenceDeadline === '9999-12-31'){
            this.long = true ;
          }

          if(typeof(this.form.thirdShopUrl) === 'string'&&this.form.thirdShopUrl !== null&&this.form.thirdShopUrl !== ''){
            this.form.thirdShopUrl = JSON.parse(this.form.thirdShopUrl);

          }
          this.brandInfo = this.$route.query.type ;
          if(this.brandInfo === undefined){
            this.brandInfo = this.form.shopType ;
          }
          if(this.brandInfo !== '3'){
            this.requiredInput = false ;
          }
        },
        methods: {

          getTypeList(){
            firstList().then(res=> {
              if(res.data.status === '000000000'){
                this.shopTypeList = res.data.data;
              }
            })
          },
          // //  获得主营类目名字
          // getMainBusiness(id){
          //   this.shopTypeList.map( i =>{
          //     if(i.id == id){
          //       this.shopTypeName = i.name;
          //     }
          //   });
          //
          // },
          getProvince() {
            getProvinceList().then(res => {
              if (res.data.status === '000000000') {
                this.provinceList = res.data.data;
              }
            })
          },
          haveShop(shopName){

            if(shopName !== ''){
              let id = this.$store.state.shopInfo.shopType ;
              if(id === undefined){
                id = -1;
              }
              haveShopName(shopName,id).then( res =>{
                if(res.data.status === "000000000"){
                  if(res.data.data.status !== "1"){
                    this.form.shopName = '';
                    this.$message.error('店铺名称已存在，请重新输入');
                  }
                }
              })
            }

          },


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
                        _this.form.businessImage = res.data.data.fileName;
                        // console.log(_this.form.cardFaceImage,3)
                        _this.licenseWarn = false;
                      }
                      if(type ===2){
                        _this.form.openLicenceImage = res.data.data.fileName;
                        // console.log(_this.form.cardBackImage,4)
                        _this.permitWarn = false;
                      }
                      if(type === 3){
                        _this.$set(_this.form.merchantBrandinfoReqDtos[_this.chooseCer], 'brandCertifyImage' , res.data.data.fileName);
                        // console.log(_this.chooseCer,_this.form.merchantBrandinfoReqDtos[this.chooseCer]);
                        _this.certificationtWarn = false;
                      }
                      if(type === 4){

                        _this.$set(_this.form.merchantBrandinfoReqDtos[_this.chooseBrand],'brandAuthImage' , res.data.data.fileName);
                        // console.log(_this.form.cardBackImage,4)
                        _this.brandAuthWarn = false;
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
          //  上传营业执照
          beforeLicense(file) {
            this.limitImage(file,1);
          },
          // 上传开户许可照
          beforePermit(file) {
            this.limitImage(file,2);
          },
          //上传商标注册证明
          beforeCertification(file){

            this.limitImage(file,3);
          },
          beforeBrandAuth(file){
            this.limitImage(file,4);
          },
          addBrand(){
            if(this.form.merchantBrandinfoReqDtos.length < 3){
              this.form.merchantBrandinfoReqDtos.push({
                brandRegistType:'2',
                brandRegistCode: '',
                brandCertifyImage:'',
                brandAuthImage:'',
                brandAuthDeadline:'',
                brandAuthType:''
              })
            }else{
              this.$message({
                message : '入驻时最多只能添加3个商标信息，您不能再添加啦~',
                center : true ,
                type : 'error',
              })
            }

          },
          deleteBrand(item){
            if(this.form.merchantBrandinfoReqDtos.length > 1){
              let num = this.form.merchantBrandinfoReqDtos.indexOf(item);
              if( num !== -1){
                this.form.merchantBrandinfoReqDtos.splice(num,1);
              }
            }
          },
          resetInfo(value){
            this.form.merchantBrandinfoReqDtos= [{
              brandRegistType: value,
              brandRegistCode: '',
              brandCertifyImage:'',
              brandAuthImage:'',
              brandAuthDeadline:'',
              brandAuthType:''
            }]
          },
          showDemo(index){
            this.imgVisible = true ;
            // this.imgTitle = this.demo[index].title ;
            this.showImg = index ;
          },


          //返回上一步
          goBack(){
            this.$store.commit('addForm2',this.form);
            this.$emit('stepObj',{ index : '1' ,component : 'enterprise1',status : 1})

          },
          //下一步操作
          goNext(formName){
            if(this.form.businessImage === ''){
              this.licenseWarn = true;

            }
            if(this.form.openLicenceImage  === ''){
              this.permitWarn = true;

            }
            if(this.form.merchantBrandinfoReqDtos !== null){
              this.form.merchantBrandinfoReqDtos.map( i => {
                if(i.brandCertifyImage === ''){
                  this.certificationtWarn = true ;
                }
                if(i.brandAuthImage === ''){
                  this.brandAuthWarn = true ;

                }
              });
            }
            if(this.long){
              this.busLicenceType = '1';
              this.form.busLicenceDeadline = '9999-12-31';
            }else{
              this.busLicenceType = '0';

            }

            this.$refs[formName].validate((valid) => {


              if(valid&&this.form.shopName !== ''){
                // this.getMainBusiness(this.form.mainBusiness);
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
            let thirdShopUrl = JSON.stringify(this.form.thirdShopUrl);

            this.dialogVisible = false ;
            let data = {
              merchantShopReqDto: {
                shopName: this.form.shopName ,
                mainBusiness: this.form.mainBusiness ,
                shopType: this.brandInfo,
                thirdShopUrl: thirdShopUrl,

              },
              merchantAptitudeReqDto: {
                licenseCountryType: '1',
                licenseMergeType: '1',
                enterpriseName: this.form.enterpriseName,
                companyAddress:this.form.companyAddress.province + '-'+ this.form.companyAddress.detail,
                socialCreditCode:this.form.socialCreditCode,
                businessImage: this.form.businessImage ,
                busLicenceDeadline: this.form.busLicenceDeadline===null?'':this.form.busLicenceDeadline,
                openLicenceImage: this.form.openLicenceImage,
                busLicenceType: this.busLicenceType,
                name:this.$store.state.shopInfo.enterForm2.name,
                cardId:this.$store.state.shopInfo.enterForm2.cardId,
                cardType:this.$store.state.shopInfo.cardType2,
                email: this.$store.state.shopInfo.enterForm2.email,
                cardFaceImage: this.$store.state.shopInfo.enterForm2.cardFaceImage,
                cardBackImage: this.$store.state.shopInfo.enterForm2.cardBackImage,
                cardDeadline: this.$store.state.shopInfo.enterForm2.cardDeadline,
                mobile: this.$store.state.shopInfo.enterForm2.mobile,
                legalRepName: this.$store.state.shopInfo.enterForm2.legalRepName ,
                legalRepMobile: this.$store.state.shopInfo.enterForm2.legalRepMobile,
                belongType: 2,
                cardSelfImage:'',
              },
              merchantBrandinfoReqDtos: this.form.merchantBrandinfoReqDtos ,

            };
            if(this.brandInfo ==='0'|| (this.form.merchantBrandinfoReqDtos.length === 1 && this.form.merchantBrandinfoReqDtos[0].brandRegistType === '1')){
              data.merchantBrandinfoReqDtos = [
                {
                  brandRegistType:'1',
                  brandRegistCode: this.form.merchantBrandinfoReqDtos[0].brandRegistCode,
                  brandCertifyImage:this.form.merchantBrandinfoReqDtos[0].brandCertifyImage ,
                  brandAuthImage:'',
                  brandAuthDeadline:'0000-00-00',
                  brandAuthType:''
                }
              ];

            }
            if(this.brandInfo ==='3'){
              data.merchantBrandinfoReqDtos = [
                {
                  brandRegistType:'',
                  brandRegistCode: '',
                  brandCertifyImage:'' ,
                  brandAuthImage:'',
                  brandAuthDeadline:'0000-00-00',
                  brandAuthType:''
                }
              ]
            }
            if(this.editorInfo === 1){
              data.merchantAptitudeReqDto['id'] = this.$store.state.shopInfo.editorId.id1 ;
              data.merchantShopReqDto['id'] = this.$store.state.shopInfo.editorId.id2 ;

              let listArr = this.$store.state.shopInfo.listId ;
              if(listArr !== null && listArr.length > 0){
                if(data.merchantBrandinfoReqDtos.length< listArr.length){
                  data.merchantBrandinfoReqDtos.map( (i,index) => {
                    i['id'] = listArr[index];
                  });
                }else if(data.merchantBrandinfoReqDtos.length>=listArr.length){
                  listArr.map( (i,index) => {
                    data.merchantBrandinfoReqDtos[index]['id'] = i;
                  });
                }

              }



              enterApply(data,'edit').then( res =>{
                if(res.data.status === "000000000"){
                  this.$store.commit('shopName',this.form.shopName);
                  this.$emit('stepObj',{ index : '3' ,component : 'successAdd'})
                }
              })
            }else{
              enterApply(data,'add').then( res =>{
                if(res.data.status === "000000000"){
                  this.$store.commit('shopName',this.form.shopName);
                  this.$emit('stepObj',{ index : '3' ,component : 'successAdd'})
                }
              })
            }


          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/new';
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
    /*width : 50%!important;*/
  }
  .note{
    font-size : 0.16rem;
    color : #666 ;
    font-weight : 100;
  }
  .intro{
    width : 60% !important;
  }
  .el-radio-button{
    margin: 5px;
    border-left: 1px solid #dcdfe6;
  }
  .demoBox img{
    width : 60%!important ;
  }
  .ruleImg{
    width : 90% !important ;
  }
  .search{
    margin-right : 0.2rem ;
    width : 1.8rem ;
  }

  .checkBox .inputInfo {
    width : 80%!important;
  }
  .urlInput{
      width : 50%!important ;
    }


</style>
