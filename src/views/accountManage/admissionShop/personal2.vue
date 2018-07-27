<template>
    <div class="personal2 new tagView">
      <el-form :model="form" ref="form" :rules="formRule" label-position="right">
        <h1 class="h_title">店铺基本信息</h1>
        <el-form-item  :labelWidth="labelWidth" label="主营类目："  prop="mainBusiness">
          <span class="tip" style="margin-bottom: 0.2rem;"><svg-icon icon-class="tips"/>入驻后，主营类目不可修改，请谨慎选择</span>
          <!-- <div class="items">
              <el-radio v-for="(item,index) in shopTypeList" :key="index" :label="item.id" v-model="form.mainBusiness">{{ item.name }}</el-radio>
          </div> -->
          <div>
            <el-radio-group size="mini" v-model="form.mainBusiness" fill="#f56c6c"  @change="getMainBusiness(form.mainBusiness)">
              <el-radio-button border v-for="(item,index) in shopTypeList" :key="index" :label="item.id">{{ item.name }}</el-radio-button>
            </el-radio-group>

          </div>

        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="店铺名称：" prop="shopName">
          <el-input class="inputInfo" size="small" v-model.trim="form.shopName" :disabled="readOnly" placeholder="请输入店铺名称" @change="haveShop(form.shopName)"></el-input>
          <span class="tip"><svg-icon icon-class="tips"/>入驻后店铺名称不可修改，请谨慎填写</span>
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" label="名称预览：" >
          <div class="inputInfo showShop" >{{ form.shopName }}</div>
          <span class="tip">入驻成功后店铺的名称
            <el-popover placement="right"
                      width="200"
                      trigger="hover"
                      content="1、未经平台许可，店名、电标、店铺详情不得使用含有“丫贝特许”、“丫贝授权”等含义的词句。
                              2、个人卖家店铺名称禁止使用“旗舰”、“专营”“专卖”、“官方”、“直营”、“官方认证”、“官方授权”、“知名品牌名”等表述或内容。">
              <span slot="reference" class="el-icon-question"></span>
            </el-popover>
          </span>

        </el-form-item>
        <p class="h_title otherInfo">其他信息</p>
        <el-form-item style="width: 95%;margin-top:0.5rem;"  :labelWidth="labelWidth" label="第三方店铺链接：" prop="thirdShopUrl">
          <el-input class="inputInfo" size="small"  v-model.trim="form.thirdShopUrl" :disabled="readOnly" placeholder="请填写真实的第三方平台店铺链接可增加入驻成功率，没有可不填"></el-input>
          <!-- <span class="tip"><svg-icon icon-class="tips"/>入驻后店铺名称不可修改，请谨慎填写</span> -->
        </el-form-item>
        <el-form-item  :labelWidth="labelWidth" >
          <el-checkbox class="inputInfo" size="small" v-model="agree">我已阅读并同意<el-button type="text" @click="readRule = true">《丫贝网合作协议》</el-button></el-checkbox>
        </el-form-item>
        <el-form-item class="bottom">
          <el-button plain @click="goBack">上一步</el-button>
          <el-button type="danger" @click="goNext('form')">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="80%" center>
        <el-form :model="form" ref="form"  label-position="right">
          <span class="tip dialogTip"><svg-icon icon-class="tips"/>以下信息至关重要，请您再次确认后提交</span>
          <el-form-item  :labelWidth="labelWidth" label="店铺类型：" >
            <div class="inputInfo" >个人店铺</div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="店铺名称：" >
            <div class="inputInfo" >{{ form.shopName }}
              <span class="tips_warn">入驻后店铺名称不可修改</span>
            </div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="主营类目：">
            <div class="inputInfo" ><span >{{ this.mainBusinessName }}</span>
              <span class="tips_warn">入驻后主营类目不可修改</span>
            </div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="入驻人姓名：" >
            <div class="inputInfo" >{{ this.$store.state.shopInfo.enterForm.name }}</div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="入驻人手机号：" >
            <div class="inputInfo" >{{ mobile }}
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
          <img src="../../../assets/imgs/logo.png" />
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="readRule = false;">我知道了</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { validateURL , validShopName} from '@/utils/validate'
  import { getMobile } from '@/utils/auth'
  import { enterApply , haveShopName } from "@/api/enter"
  import { firstList } from "@/api/merchant"

  export default {
        name: "personal2",
        props : ['editorInfo'],
        data() {
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
          const validShop = (rule,value,callback) => {

            if(value === ''){
              callback(new Error('请输入店铺名称'))

            }else{
              if(validShopName(value)){
                callback(new Error('店铺名不能含有"丫贝特许","丫贝授权","旗舰","专营","专卖","官方","直营","官方认证","官方授权"等文字'))
              }else{
                callback();
              }
            }


          };
          return {
            labelWidth: '160px',
            mobile:getMobile(),
            form: {
              mainBusiness: '',
              shopName:'',
              thirdShopUrl:''
            },
            shopTypeList: [],
            formRule:{
              mainBusiness:[
                {
                 required: true ,trigger : 'change',message: '请选择入驻店铺主营类目'
                }
              ],
              shopName:[
                {
                  required : true ,trigger: 'blur',validator: validShop
                }
              ],
              thirdShopUrl:[
                {
                  required:false ,trigger: 'blur',validator: validLink
                }
              ]

            },
            readOnly: false ,
            agree: false,
            dialogVisible : false ,
            readRule: false ,
            mainBusinessName:''
          }
        },
        // watch:{
        //   editorInfo : function(val){
        //     console.log(val,43432)
        //
        //     // if(val === 1){
        //     //   this.form = this.$store.state.shopInfo.enterForm;
        //     //   console.log(this.form,123)
        //     // }
        //
        //   }
        // },
        mounted() {

          this.getTypeList();
          this.form = this.$store.state.shopInfo.enterForm;

        },

        methods: {
          //  失去焦点的时候 判断是否重名
          haveShop(shopName){
            if(shopName !== ''){
              haveShopName(shopName).then( res =>{
              if(res.data.status === "000000000"){
                if(res.data.data.status !== "1"){
                  this.form.shopName = '';
                  this.$message.error('店铺名称已存在，请重新输入');
                }
              }
            })
            }

          },
          getTypeList(){
            firstList().then(res=> {
          this.shopTypeList = res.data.data
        })

          },
          //  获得主营类目名字
          getMainBusiness(item){
              for( let i = 0; i < this.shopTypeList.length ; i++){
                if(this.shopTypeList[i].id == item){
                  this.mainBusinessName = this.shopTypeList[i].name
                    console.log(this.mainBusinessName)
                }

              }
          },
          //返回上一步
          goBack(){
            this.$store.commit('addForm',this.form);
            this.$emit('stepObj',{ index : '1' ,component : 'personal1',status : 1})

          },
          //下一步操作
          goNext(formName){

            this.$refs[formName].validate((valid) => {

              // this.$emit('stepObj',{ index : '3' ,component : 'personal3'});

              if(valid){
                // console.log(this.agree,1);
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
            if(this.form.cardDeadline === '9999-12-31'){
              this.cardType = true;
            }
            let data = {
              merchantShopReqDto: {
                shopName : this.form.shopName ,
                mainBusiness: this.form.mainBusiness ,
                shopType: '3',
                thirdShopUrl: this.form.thirdShopUrl,

              },
              merchantAptitudeReqDto: {
                name: this.$store.state.shopInfo.enterForm.name,
                cardId:this.$store.state.shopInfo.enterForm.cardId,
                cardType: this.$store.state.shopInfo.cardType,
                email: this.$store.state.shopInfo.enterForm.email,
                cardFaceImage: this.$store.state.shopInfo.enterForm.cardFaceImage,
                cardBackImage: this.$store.state.shopInfo.enterForm.cardBackImage,
                cardSelfImage: this.$store.state.shopInfo.enterForm.cardSelfImage,
                cardDeadline: this.$store.state.shopInfo.enterForm.cardDeadline,
                mobile: this.$store.state.shopInfo.enterForm.mobile,
                belongType: 1,
                busLicenceDeadline:  '0000-00-00',
                busLicenceType: '',
                licenseCountryType:'',
                licenseMergeType:'',
                enterpriseName: '',
                companyAddress:'',
                socialCreditCode:'',
                businessImage: '' ,
                openLicenceImage: '',
                legalRepName:'' ,
                legalRepMobile: '',
              },
              merchantBrandinfoReqDtos :[
                {
                  brandAuthDeadline : '0000-00-00',
                  brandRegistType: '',
                  brandRegistCode: '',
                  brandCertifyImage:'',
                  brandAuthImage:'',
                  brandAuthType:''
                }
              ]


            };
            let type = '';
            if(this.editorInfo === 1){
              type = 'edit';

            }else{
              type = 'add';
            }
            enterApply(data,type).then( res =>{
              if(res.data.status === "000000000"){
                this.$store.commit('shopName',this.form.shopName);
                console.log(this.$store.state.shopInfo);
                this.$emit('stepObj',{ index : '3' ,component : 'successAdd'})
              }
            })


          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/new';
  .inputInfo{
    float: left;
    width : 80%!important ;
  }
  .tips_warn{
    float: right ;
    font-size : 0.12rem;
  }
  .dialogTip{
    margin : 0.5rem auto!important ;
    display: block!important;
  }
  .items{

  }
  .el-radio-button{
    margin: 5px;
    border-left: 1px solid #dcdfe6;
  }
</style>
