<template>
  <div class="changeGoods new"  v-loading="loading"  element-loading-text="拼命加载中">
    <h1>修改商品</h1>
    <el-form :model="form" ref="form" :rules="formRule" label-position="right">
      <h2>商品表单</h2>
      <el-form-item  labelWidth="130px" label="店铺" >
        <div class="inputInfo">丫贝自营</div>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="商品名称" prop="productName">
        <el-input class="inputInfo" :maxlength="100" :disabled="readOnly" size="small" v-model.trim="form.productName" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="商品品牌" prop="brandId">
        <el-input class="inputInfo"  :disabled="readOnly" size="small" v-model.trim="brandCnName" disabled='disabled'></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="一级分类" prop="firstType">
        <el-select  size="small" :disabled="readOnly" clearable v-model="form.firstType" @change="getSecondList(form.firstType)" filterable placeholder="请选择一级分类">
          <el-option
            v-for="item in firstTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="二级分类" prop="secondType">
        <el-select  size="small" :disabled="readOnly" clearable v-model="form.secondType" @change="getThirdList(form.secondType)" filterable placeholder="请选择二级分类">
          <el-option
            v-for="item in secondTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="三级分类" prop="class3Id">
        <el-select  size="small" :disabled="readOnly" clearable v-model="form.class3Id" filterable placeholder="请选择三级分类">
          <el-option
            v-for="item in thirdTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="wrap">
        <label class="tag">商品规格</label>
        <div class="size">
          <div class="itemContent"  v-for="(item,index) in form.ybProductItemReqDto" :key="index">
            <el-form-item class="subItem"   :prop="'ybProductItemReqDto.'+index+'.size'" :rules="{ message : '请输入商品规格大小', trigger : 'blur' , required: true }">
              <el-input class="key" placeholder="大小"
                        :maxlength="40"  v-model.trim="item.size" size="small" ></el-input>
            </el-form-item>
            <el-form-item class="subItem"  :prop="'ybProductItemReqDto.'+ index + '.color'" :rules="{  message : '请输入商品颜色', trigger : 'blur' , required : true }">
              <el-input  class="key" placeholder="颜色"
                         :maxlength="40"  v-model.trim="item.color" size="small" ></el-input>
            </el-form-item>
            <el-form-item class="subItem" :prop="'ybProductItemReqDto.'+ index + '.stock'" :rules="{ message : '请输入商品库存', trigger : 'blur' , required : true }">
              <el-input  class="key" placeholder="库存量" type="number"
                         :maxlength="11"  v-model.number="item.stock" size="small" ></el-input>
              <el-button slot type="primary" size="mini" @click="addSize">添加</el-button>
              <el-button  slot plain size="mini" @click="deleteSize(item)">删除</el-button>
            </el-form-item>
          </div>
        </div>
      </div>

      <el-form-item   labelWidth="130px"  label="价格" prop="price">
        <el-input class="inputInfo" :maxlength="15" size="small" v-model.trim="form.price" placeholder="价格"></el-input>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="运费" prop="carriage">
        <el-input class="inputInfo" :maxlength="2" size="small" v-model.trim="form.carriage" placeholder="运费"></el-input>
      </el-form-item>
      <el-form-item labelWidth="130px" label="图片" prop="imagesList">
        <ul class="imgList">
          <li v-for="(item,index) in form.imagesList" @change="getImg(index)">
            <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.imagesList[index]"
                        :headers="{'yb-tryout-merchant-token':token}"  :show-file-list="false"  :before-upload="beforeImgUpload">
              <img v-if="form.imagesList[index]" :src="imageDomain + form.imagesList[index]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </li>
          <!--<span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传商品图片</span>-->
        </ul>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="描述" prop="describes">
        <!--<wangeditor >-->
          <div id="wangeditor"   >
            <div ref="editorElem" style="text-align:left" v-html="word"></div>
          </div>
        <!--</wangeditor>-->

        <!--<editor :id="tinymceId" v-model="form.describes" :init="init"></editor>-->
      </el-form-item>
      <el-form-item>
        <el-button class="inputInfo button" type="primary" size="small" @click="changeForm('form')">修改</el-button>

      </el-form-item>
    </el-form>


    <el-dialog class="shop_dialog" title="提示" top="20%" :visible.sync="hasShop" width="40%" center
               :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <p>{{ tips }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applyShop">前往我要开店</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { uploadImage  } from "@/api/activity"
  import { newGoogds,getGoodsDetail, getBrand,changeGoods ,firstList,secondList,thirdList, getShopInfo} from "@/api/merchant"
  import { getToken,getMobile } from '@/utils/auth'
  // import wangeditor from '@/components/wangeditor'
  import E from 'wangeditor'

  export default {
    components: {

      // wangeditor
    },
    name: "change-goods",
    // props:['getData'],    //接收父组件的方法

    data() {

      const validGoodsName = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入商品名称'))
        }else{
          if(value.length > 60 ){
            callback(new Error('输入的商品名称不得超过60个字符'))
          }
          callback();
        }

      };
      const validBrand = ( rule, value , callback ) => {
        if(value === ''){
          callback( new Error('请选择商品品牌'))
        }
        callback();
      };
      const validPrice = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入商品价格'))
        }else{
          if(!(/^[1-9][0-9]{0,8}$/).test(value)){
            callback(new Error('商品价格应大于0且不超过9位数，请重新输入'))
          }
          callback();

        }
      };
      const validPost = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请输入运费'))
        }else{
          if(!(/^[0-9]{1,2}$/).test(value)){
            callback(new Error('运费应不小于0且不超过2位数，请重新输入'))
          }
          callback();

        }
      };

      return {
        form : {
          productName:'',
          brandId:'',
          firstType : '',
          secondType:'',
          class3Id:'',
          price:'',
          carriage:'',
          ybProductItemReqDto : [{ size: '', color : '', stock: ''}],
          // sizeList : [{ size: '', color : '', stock: ''}],
          imagesList : ['','','','',''],
          describes: '',
        },
        formRule : {
          productName : [
            {
              required : true ,trigger : 'blur' ,validator : validGoodsName
            }
          ],
          brandId: [
            {
              required : true  ,trigger : 'change',validator: validBrand
            }
          ],
          firstType: [
            {
              required : true ,trigger : 'change' ,message: '请选择一级分类'

            }
          ],
          secondType:[
            {
              required : true ,trigger : 'change' ,message: '请选择二级分类'

            }
          ],
          class3Id:[
            {
              required : true ,trigger : 'change' ,message: '请选择三级分类'
            }
          ],
          price:[
            {
              required : true ,trigger : 'blur' ,validator : validPrice
            }
          ],
          carriage : [
            {
              required : true ,trigger : 'blur' ,validator : validPost
            }
          ],


        },
        thirdName: '',
        // title: '新增商品',
        radio : '',
        brandData: [],
        brandName : '',
        brandCnName: '',
        firstTypeList : [],
        secondTypeList : [],
        thirdTypeList : [],
        token : getToken() ,
        user: getMobile(),
        autoUpload : true ,
        imgUrl : process.env.BASE_API+'/file/upload',
        goodsImgWarn : false ,
        imageDomain : process.env.IMAGE_DOMAIN ,
        imgIndex : '',
        dialogVisible: false,
        // currentRow : null,
        hasShop : false ,
        readOnly : false ,
        totalPages : '',
        totalElements : 0,
        currentPage : 1,
        pageSize : 10,
        tips: '',
        dataInterface: {
          editorUpImgUrl: process.env.BASE_API+'/file/multi/upload' // 编辑器插入的图片上传地址
        },
        editor: '',  // 存放实例化的wangEditor对象，在多个方法中使用
        word: '',
        loading: true ,

      }
    },
    mounted(){
      this.getFirstList();

      // window.tinymce.init({});
      this.getShop();

      this.createEditor();

    },

    // computed:{
    //   showImg(){
    //     console.log(this.form.images);
    //     return this.form.images
    //   }
    //
    // },
    methods: {
      //判断是否已有店铺
      getShop(){
        getShopInfo().then(res=> {
          if(res.data.status === '000000000'){
            this.hasShop = false ;
            this.loading = false ;
            this.isNewGoods();
            return true ;

          }else{
            this.tips = res.data.message;
            this.hasShop = true ;


          }
        })
      },
      isNewGoods(){
        let id = this.$route.query.order ;
        var _this =this;
        if(!this.hasShop){
          if(id !== undefined){
            //获取已有商品信息
            this.loading = true ;

            getGoodsDetail(id).then(res=>{
              this.loading = false ;

                 this.form = {
                  productName: res.data.data.productName ,
                    brandId:res.data.data.brandId,
                    firstType : res.data.data.cateGoryMap.categoryName1,
                    secondType:res.data.data.cateGoryMap.categoryName2,
                    class3Id:res.data.data.cateGoryMap.categoryName3,
                    price:res.data.data.price,
                    carriage:res.data.data.carriage,
                    ybProductItemReqDto : res.data.data.productItems,
                    // sizeList : [{ size: '', color : '', stock: ''}],
                    imagesList : res.data.data.productImages,
                    describes: res.data.data.describes,
                    id: res.data.data.id
                }  ;
                if(this.form.imagesList.length < 5){
                  if(this.form.imagesList.length === 0){
                    this.form.imagesList =   ['','','','','']

                  }else {
                    for(let i = this.form.imagesList.length ; i< 5;i++){
                      this.form.imagesList.push('');
                    }
                  }
                }
                this.word = this.form.describes ;
                this.brandCnName = res.data.data.brandCnName ;
                this.thirdName = res.data.data.cateGoryMap.categoryId3;
                this.readOnly = true ;
            })
          }else{
            // this.title = '新增商品';
          }
        }
      },
      getBrandList(){

        getBrand(this.brandName, this.currentPage ,this.pageSize).then(res => {
          this.brandData = res.data.data ;
            this.totalPages = res.data.totalPages ;
            this.totalElements = res.data.totalElements ;
        })

      },

      //  获取一级分类
      getFirstList(){
        firstList().then(res=> {
          this.firstTypeList = res.data.data
        })
      },
      //  获取二级分类
      getSecondList(type){
        this.form.secondType = '';
        this.form.class3Id = '';

        secondList(type).then(res=> {

          this.secondTypeList = res.data.data
        })

      },
      //获取三级分类
      getThirdList(type){
        this.form.class3Id = '';

        thirdList(type).then(res=> {
          this.thirdTypeList = res.data.data
        })

      },

      getImg(index){
        this.imgIndex = index ;
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
            if (isWidth > 800 || isHeight > 800) {
              _this.$message.error('图片尺寸过大，请重新选择后上传');
              return false;

            } else {
              let formData = new FormData();
              formData.append('image', file);
              uploadImage(formData).then(res => {
                _this.$set(_this.form.imagesList,_this.imgIndex,  res.data.data.fileName);
              })
            }
          };

          image.src = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      //删除商品规格
      deleteSize(item) {
        let index = this.form.ybProductItemReqDto.indexOf(item);
        if (index !== -1 && this.form.ybProductItemReqDto.length > 1) {
          this.form.ybProductItemReqDto.splice(index, 1)
        }


      },

      //添加商品规格
      addSize() {
        let _this = this;
        if (this.form.ybProductItemReqDto.length < 5) {
          let index = this.form.ybProductItemReqDto.length ;
          // _this.$nextTick(() =>{
          // console.log(this.form.ybProductItemReqDto)
            // Vue.set(this.form.ybProductItemReqDto,index,{
            //     'size': '',
            //     'color': '',
            //     'stock': '',
            // })
          // })

          this.form.ybProductItemReqDto.splice(index,1,{
            'size': '',
            'color': '',
            'stock': '',

          });
          // console.log(this.form.ybProductItemReqDto)

        } else {
          this.$message({
            message: '您添加的规格参数太多啦，不能再加啦~',
            center: true,
            type: 'error'
          })
        }
      },

      // catchData(value){
      //   console.log(value);
      //   value =this.form.describes      //在这里接受子组件传过来的参数，赋值给data里的参数
      // },


      //  修改商品信息
      changeForm(formName){

        // console.log(this.form);
        this.$refs[formName].validate((valid) => {
          if(valid){

            let data = {
              id: this.form.id ,
              productName:this.form.productName,
              brandId:this.form.brandId,
              class3Id:this.thirdName,
              price:this.form.price,
              carriage:this.form.carriage,
              ybProductItemReqDto : this.form.ybProductItemReqDto,
              imagesList : this.form.imagesList,
              describes: this.form.describes,
            }
            // data = JSON.stringify(data);
            this.loading = true ;

            changeGoods(data,this.user).then( res => {
              this.loading = false ;

                this.$message({

                  message : '您修改的商品信息已提交，请稍后确认商品状态',
                  center: true ,
                  type : 'success',
                  duration: 1000
                });
                setTimeout(() => {
                  window.location.reload();

                },1500)
            })
          }else{

          }
        })
      },

      createEditor(){

        var editor = new E('#wangeditor')        //创建富文本实例


        editor.customConfig.onchange = (html) => {
          this.form.describes = html ;
          // this.catchData(html)  //把这个html通过catchData的方法传入父组件
        }
        editor.customConfig.uploadImgServer = this.dataInterface.editorUpImgUrl
        editor.customConfig.uploadFileName = 'sourcePic'
        editor.customConfig.showLinkImg = false;
        editor.customConfig.uploadImgMaxLength = 10;
        editor.customConfig.uploadImgHeaders = {
          'ContentType': 'application/json',
          'yb-tryout-merchant-token':this.token    //头部token
        }
        editor.customConfig.uploadImgParams = {
          token : 'abcdef12345'
        }
        editor.customConfig.menus = [          //菜单配置
          'head',
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'bold',
          'fontSize',  // 字号
          'italic',
          'underline',
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'image',  // 插入图片
          'table',  // 表格
          'video',  // 插入视频
          'undo',  // 撤销
          'redo'  // 重复
        ]
        editor.customConfig.uploadImgHooks = {
          before: function (xhr, editor, files) {
          },
          success: function (xhr, editor, result) {

            this.imgUrl= Object.values(result.data.filePath).toString()
          },
          fail: function (xhr, editor, result) {


          },
          error: function (xhr, editor) {

          },
          timeout: function (xhr, editor) {

          },

          customInsert: function (insertImg, result, editor) {

            let url = Object.values(result.data.filePath)      //result.data就是服务器返回的图片名字和链接
            // console.log(result.data.filePath,url)
            result.data.filePath.map( i => {
              // let url = Object.values(i)      //result.data就是服务器返回的图片名字和链接
              insertImg(i)

            })
            // }

            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        }
        editor.customConfig.linkImgCallback = function (url) {
          // console.log(url) // url 即插入图片的地址
        }

        editor.create()
        // editor.txt.html(this.getData)

      },

      //  跳转到申请店铺
      applyShop(){
        this.$router.push('/merchantCenter/userCenter/openShop')
      },
      handleSizeChange(val) {
        this.radio = '';
        this.pageSize = val ;
        this.getBrandList();
      },

      handleCurrentChange(val) {
        this.radio = '';
        this.currentPage = val ;
        this.getBrandList();
      },
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/new';
  @import '../../../styles/table';

  .el-form{
    width  : 90%!important;
    .showBrand{
      width : 100px;
      display: inline-block;
      margin-left : 0.2rem ;

      svg{
        width : 0.3rem ;
        height : 0.3rem ;
      }
      span{
        margin-left : 0.1rem ;
        color : #aaa ;
        font-size : 0.14rem ;
        display : inline-block;
        line-height : 41px;
        height : 41px;
      }
    }
    .wrap{
      width: 70%;
      margin: 0.3rem auto;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      .tag{
        width: 130px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        padding-right: 0.3rem;
        text-align: right;
        font-size: 14px;
        color: #606266;
        position: absolute ;
        /*box-sizing: border-box;*/
      }
      .tag:before{
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
      .size{
        display: flex;
        flex-direction: column;
        /*justify-content: flex-start;*/
        position: relative;
        .itemContent{
          width: 100% ;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          margin-left: 130px!important;

          .el-form-item{

            width : 20% ;
            margin: 0 0.2rem 0 0!important;
            .el-input{

              /*width : 85% ;*/
            }
            .el-button {
              height : 30px;
              margin : 2px 0!important;
            }
          }

          .el-form-item:nth-child(3){
            width: 60%;
            .el-input{
              width: 50%;
              margin-right: 0.1rem ;
            }
          }
        }

      }
    }


    .imgList{
      display : flex ;
      flex-direction: row;
      justify-content: space-around;
      margin-bottom : 0.3rem ;
      position: relative ;
      li{
        width : 20% ;

        .el-upload{
          img{
            width : 100% ;
          }

        }
      }
      .imgWarn{
        position: absolute;
        top: 95%!important;
        left: 0;
        display: inline;
        font-size: 0.12rem ;
      }

    }
  }
  .dialogTop{
    margin : 0 auto 0.3rem ;
    width: 90% ;
    .el-button {
      margin-left : 0.12rem ;
    }
  }
  .shop_dialog{
    p{
      height : 10vh;
      font-size : 0.3rem ;
      text-align : center ;
      line-height : 10vh ;
    }
  }
</style>
