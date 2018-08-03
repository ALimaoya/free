<template>
    <div class="sign-content">
        <h1 class="h_title">商品报名</h1>
        <div class="main">
            <h3>已选择报名分享购商品</h3>
            <div class="item">
                <div class="img" v-if="shop.shopImgUrl !== ''|| shop.shopImgUrl !== undefined">
                    <img v-if="shop.shopImgUrl !== ''|| shop.shopImgUrl !== undefined" :src="imageDomain + shop.shopImgUrl" :onerror="errorImg">
                    <img :src="failImg"  v-else>
                </div>
                <div class="content">
                    <div class="name">
                        {{shop.name}}
                    </div>
                    <div class="encoding">
                        商品编码：{{shop.code}}
                    </div>
                    <div class="price">
                        ￥:{{shop.price}}
                    </div>
                </div>
                <a href="javascript:void(0);" title="选择商品" @click="getShop"><span></span><i></i></a>
            </div>
            <el-form :model="form" ref="form" :rules="formRule" label-width="80px">
                <el-form-item label="商品白底图" labelWidth="160px" prop="shopImage">
                    <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.shopImage"
                                :headers="{'yb-tryout-merchant-token':token}"          :show-file-list="false"  :before-upload="beforeImgUpload">
                        <img v-if="form.shopImage" :src="imageDomain + form.shopImage" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p class="require">必须白底图，800*800像素，JPG.JPEG格式，大小不超过1M，图片不能有文字，在0.9秒杀相应频道展示</p>
                </el-form-item>
                <el-form-item label="商品分享活动价格" labelWidth="180px" prop="price">
                    <el-input v-model="form.price"></el-input><span>在特价时间内做5-8折的限时活动。不得高于正常售价的8折</span>
                    <p>备注：报名成功——活动结束，不能修改商品信息，活动期间内，价格将会锁定，不能修改价格</p>
                </el-form-item>
                <el-form-item label="商品活动库存数量" labelWidth="180px" prop="number">
                    <el-input v-model="form.number"></el-input><span>报名库存数量不小于10件，且不大于当前商品库存总数量</span>
                    <p>备注：此活动库存数量仅为活动通过排期上线后可被买家购买的上限件数</p>
                </el-form-item>
                <el-form-item  labelWidth="180px" >
                    <el-checkbox class="inputInfo" size="small" v-model="agree">我已阅读并同意<el-button type="text" @click="readRule = true">《丫贝网合作协议》</el-button></el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')">提交报名</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog
            title="选择秒杀报名商品"
            :visible.sync="dialogVisible"
            width="65%"
            center
            :show-close="false">
            <div class="search">
                <el-input size="small" :maxlength="40" v-model.trim="search.shopName" placeholder="请输入商品名称" clearable></el-input>
                <el-input size="small" :maxlength="40" v-model.trim="search.goodsCode" placeholder="请输入商品编号" clearable></el-input>
                <el-button type="primary" size="mini" @click="getGoods">搜索</el-button>
            </div>
            <p class="top">商品名称</p>
            <div class="shopName" v-for="(item , index ) in commodity" :key="index"> 
                <el-radio v-model="radio" :label=item.code @change="selectShop(item.code)">
                    <div class="item">
                        <div class="img" v-if="item.shopImgUrl !== ''|| item.shopImgUrl !== undefined">
                            <img v-if="item.shopImgUrl !== ''|| item.shopImgUrl !== undefined" :src="imageDomain + item.shopImgUrl" :onerror="errorImg">
                            <img :src="failImg"  v-else>
                        </div>
                        <div class="content">
                            <div class="name">
                                {{item.name}}
                            </div>
                            <div class="encoding">
                                商品编码：{{item.code}}
                            </div>
                            <div class="price">
                                ￥:{{item.price}}
                            </div>
                        </div>
                    </div>
                </el-radio>
            </div>
            <div class="block2">
                <el-pagination
                    @size-change="handleSubSizeChange"
                    @current-change="handleSubCurrentChange"
                    :current-page.sync="subCurrentPage"
                    :page-sizes="[10, 15, 20]"
                    :page-size="subPageSize"
                    :pager-count="5"
                    layout=" sizes, prev, pager, next, jumper"
                    :total="subTotalElements">
                </el-pagination>
                <span class="totalItems" >共{{ subTotalPages }}页，{{ subTotalElements }}条记录</span>

            </div>
            <div slot="footer" class="dialog-footer" style="padding-bottom: 0px;height: 0.7rem ;">
                <el-button type="primary" size="mini" @click="dialogVisible = false">确认选择</el-button>
                <el-button plain size="mini" @click="dialogVisible = false">取消</el-button>
                <p>活动单次报名不能超过2款宝贝，且已选择宝贝当前时段未报名任意特价打折活动</p>
            </div>

        </el-dialog>

    </div>
</template>

<script>
  import { uploadImage  } from "@/api/activity"
  import userPhoto from '@/assets/404_images/fail.png'
  import { getToken } from '@/utils/auth'
  import { int ,checkFloat } from '@/utils/validate'
    export default {
        name: "sign-content",
        data() {
            const validPrice = (rule,value,callback) => {
                if(value === ''){
                  callback(new Error('请填写商品分享活动价格'))
                }else{
                  if(!checkFloat(value)){
                    callback(new Error('商品分享活动价格最多有两位小数'))
                  }
                  callback();
                }
              };
              const validNumber = (rule,value,callback) => {
                if(value === ''){
                  callback(new Error('请填写商品分享活动数量'))
                }else{
                  if(!int(value)){
                    callback(new Error('商品分享活动数量只能为整数'))
                  }else{
                      if(value<10){
                          callback(new Error('商品分享活动数量必须大于10件'))
                      }
                      callback();
                  }
                }
              };
            return {
                //  上传图片
                autoUpload : true ,
                imgUrl : process.env.BASE_API+'/file/upload',
                imageDomain : process.env.IMAGE_DOMAIN ,
                token : getToken() ,

                errorImg:'this.src="' + userPhoto + '"',
                failImg: userPhoto,
                // 商品信息
                shop:{
                    shopImgUrl:'',
                    name:'姚明专卖店',
                    code:'20181917',
                    price:'100.00'
                },
                
                dialogVisible: false,
                form:{
                    shopImage:'',
                    price:'',
                    number:''
                },
                //  已阅读协议
                agree: false,
                formRule:{
                    shopImage:[
                        {
                        required: true ,trigger : 'blur',message: '请上传商品活动图'
                        }
                    ],
                    price: [
                        {
                        required: true ,trigger : 'blur', validator : validPrice
                        }
                    ],
                    number: [
                        {
                        required: true ,trigger : 'blur', validator : validNumber
                        }
                    ],
                },
                //  选择
                search:{
                    shopName:'',
                    goodsCode:''
                },
                commodity:[
                    {
                    shopImgUrl:'',
                    name:'姚明专卖店',
                    code:'2018191427',
                    price:'100.00'  
                    },
                    {
                    shopImgUrl:'',
                    name:'姚明专卖店',
                    code:'20181914327',
                    price:'100.00'  
                    },
                    {
                    shopImgUrl:'',
                    name:'姚明专卖店',
                    code:'201819173',
                    price:'100.00'  
                    },
                    {
                    shopImgUrl:'',
                    name:'姚明专卖店',
                    code:'201819172',
                    price:'100.00'  
                    },
                ],
                radio:'',
                subTotalElements: 0,
                subTotalPages: 0,
                subCurrentPage: 1,
                subPageSize: 10,
            }
        },
        mounted() {
        },
        methods: {
        //提交表单
        onSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if(!this.agree){
                    this.$message({
                    message : '请先阅读并同意《丫贝网合作协议》',
                    type: 'error',
                    center: true
                  })
                }else{
                    alert(111)
                }
            })
        },
        selectShop(item){
            alert(item)
        },
        getShop(){
            this.dialogVisible = true;
            
        },
        handleSubSizeChange(val) {

            this.subPageSize = val ;
            this.getGoods();
        },
        handleSubCurrentChange(val) {

            this.subCurrentPage = val ;
            this.getGoods();
        },
        // 选择商品
        getGoods(){
            alert(111)
            // this.commodity = [];
            // formData.append('currentPage',this.subCurrentPage);
            // formData.append('pageSize',this.subPageSize);
            // formData.append('EQ_code',this.goodsCode);
            // formData.append('LIKE_productName',this.shopName);
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
                  uploadImage(formData).then(res => {
                    if (res.data.status === '000000000') {

                        _this.form.shopImage = res.data.data.fileName;
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

        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.sign-content{
  padding : 0.2rem ;
  width : 100% ;
  box-sizing: border-box;
  .main{
      margin-top: 0.4rem;
      border: 1px solid #ccc;
      width: 100%;
      padding: 0px 0.8rem;
      box-sizing: border-box;
      h3{
          font-size: 0.18rem;
          line-height: 0.6rem;
      }
      .item{
          margin-left: 100px;
          width: 80%;
          display: flex;
          .img{
              width: 100px;
              height: 100px;
          }
          .content{
              width: 200px;
              margin-left: 10px;
              .name,.encoding,.price{
                  font-size: 0.18rem;
                  line-height: 30px;
              }
          }
          a{
              display: inline-block;
              width: 100px;
              height: 100px;
              position: relative;
              span,i{
                  display: inline-block;
                  background-color: #2E2E2E;
                  position: absolute;
                  -webkit-border-radius: 3px;
            	 -moz-border-radius: 3px;
                 border-radius: 3px ;
              }
              span{
                 width: 100px;
                 height: 6px; 
                 top: 46px;
              }
              i{
                 width: 6px;
                 height: 100px; 
                 left: 46px;
              }
          }
      }
      .el-form{
          .el-form-item{
              width : 70% ;
              .upload{
                width : 25%;
                display: inline-block;
                vertical-align:bottom;
                // float : left;

                img{
                    max-width : 100%;
                    max-height : 100% ;
                    }
                    .imgWarn{
                    position: absolute;
                    top: 100%;
                    left: 0;
                    display: inline;
                    font-size: 0.12rem ;
                    }
                }
                .el-input{
                    width: 25%;
                }
                .require{
                    display:inline-block;
                    width: 70%;
                }
          }
      }
  }
    .search{
    width : 100% ;
    padding : 0 0.5rem 0.2rem;
    height : 50px ;
    // border-bottom : 1px solid #aaa ;
    margin-bottom : 0.3rem ;
    .el-input{
      width : 20% ;
      margin :0 0.25rem 0.2rem ;
      float : left;
    }
    .el-button {
      width : 65px ;
      margin-bottom : 0.2rem ;
      margin-left : 20px ;
      float : left;

    }
  }
  .top{
      line-height: 30px;
      width: 70%;
      background-color: #ccc;
      padding-left: 30px;
  }
  .shopName{
      width: 100%;
      .el-radio{
          border: 1px solid red;
        .el-radio__input{
            display: inline-block !important;
            width: 14px !important;
            height: 14px !important;
        }
        .el-radio__label{
            display: inline-block !important;
            .item{
                width: 60%;
                display: flex;
                .img{
                    width: 100px;
                    height: 100px;
                }
                .content{
                    width: 200px;
                    margin-left: 10px;
                    .name,.encoding,.price{
                        font-size: 0.18rem;
                        line-height: 30px;
                    }
                }
            }
        }
        
      }
      
      
  }
  .block2{
    padding : 0 0.3rem ;
    width : 90% ;
    margin : 0 auto;
    box-sizing: border-box;
    .totalItems{
      display : block ;
      height : 0.3rem ;
      color : #666 ;
      text-align : right ;
      margin-top : 0.3rem ;
    }
  }
  .dialog-footer{
    text-align: left;
    height : 1rem ;
        .el-button {
        width : 0.9rem ;
        padding : 0;
        text-align : center ;
        line-height : 0.35rem ;
        }
        p{
            display: inline-block;
            margin-left: 1rem;
        }
  }
}
</style>
