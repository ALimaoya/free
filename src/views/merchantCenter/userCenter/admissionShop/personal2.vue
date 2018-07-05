<template>
    <div class="personal2 new tagView">
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
          <span class="tip">入驻成功后店铺的名称</span>
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
            <div class="inputInfo" >个人店铺</div>
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
          <el-form-item  :labelWidth="labelWidth" label="入驻人姓名：" >
            <div class="inputInfo" >{{ form.name }}</div>
          </el-form-item>
          <el-form-item  :labelWidth="labelWidth" label="入驻人手机号：" >
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
    </div>
</template>

<script>
  import { validateURL } from '@/utils/validate'

  export default {
        name: "personal2",
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
          return {
            labelWidth: '160px',
            form: {
              shopType: [],
              shopName:'',
              shopLink:''
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
          }
        },
        mounted() {
          this.getTypeList();
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

          //返回上一步
          goBack(){
            this.$emit('stepObj',{ index : '1' ,component : 'personal1'})

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
            this.$emit('stepObj',{ index : '3' ,component : 'successAdd'})

          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../../styles/new';
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
</style>
