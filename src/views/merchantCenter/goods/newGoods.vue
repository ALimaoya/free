<template>
    <div class="newGoods new goods">
      <h1>新增商品</h1>
      <el-form :model="form" ref="form" :rules="formRule" label-position="right">
        <h2>商品表单</h2>
        <el-form-item  labelWidth="130px"  >
          <el-button type="primary" size="small" @click="taoVisible=true">获取淘宝商品信息</el-button>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="店铺" >
          <div class="inputInfo">{{shopName}}</div>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="商品名称" prop="productName">
          <el-input class="inputInfo" :maxlength="100" :disabled="readOnly" size="small" v-model.trim="form.productName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="商品品牌" prop="brandId">
          <el-input class="inputInfo" :disabled="readOnly" size="small" v-model.trim="brandCnName" disabled='disabled'></el-input>
          <div class="showBrand" @click="searchBrand()"><svg-icon icon-class="brand"></svg-icon><span>品牌速查</span></div>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="一级分类" prop="firstType">
          <el-select  size="small" :disabled="readOnly" clearable v-model="form.firstType"  @change="getFirstList()" filterable placeholder="请选择一级分类">
            <el-option
              v-for="item in firstTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="二级分类" prop="secondType">
          <el-select  size="small" :disabled="readOnly" clearable v-model="form.secondType"  @change="getSecondList(form.firstType)" filterable placeholder="请选择二级分类">
            <el-option
              v-for="item in secondTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="三级分类" prop="class3Id">
          <el-select  size="small" :disabled="readOnly" clearable v-model="form.class3Id" @change="getThirdList(form.secondType)" filterable placeholder="请选择三级分类">
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
                <el-input  class="key" placeholder="库存量" type="tel"
                           :maxlength="11"  v-model.trim="item.stock" size="small" ></el-input>
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
            <li v-for="(item,index) in form.imagesList" @change="getImg(index)" :key="index">
              <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.imagesList[index]"
                          :headers="{'yb-tryout-merchant-token':token}"  :show-file-list="false"  :before-upload="beforeImgUpload">
                <img v-if="form.imagesList[index]" :src="imageDomain + form.imagesList[index]" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </li>
            <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传商品图片</span>
          </ul>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="描述" prop="describes">
          <div id="wangeditor"   >
            <div style="text-align:left" v-html="word"></div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!readOnly" class="inputInfo button" type="primary" size="small" @click="submitForm('form')">提交</el-button>

        </el-form-item>
      </el-form>

      <el-dialog class="tableBox" title="品牌速查" :visible.sync="dialogVisible" width="70%" >
        <div class="dialogTop">
          <span>品牌名称：</span><el-input type="text" class="middleInput" v-model.trim="brandName" size="small" @keyup.enter.native="getBrandList()"></el-input>
          <el-button type="primary" size="small" @click="getBrandList()">查询</el-button>
        </div>
        <el-table :data="brandData" border stripe highlight-current-row fit >
          <el-table-column  width="32" >
            <template slot-scope="scope">
              <el-radio :label="scope.$index" v-model="radio" @change.native="handleBrand(scope.$index,scope.row.id,scope.row.brandCnName)"></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="品牌ID"></el-table-column>
          <el-table-column prop="brandCnName" label="品牌名称"></el-table-column>
          <el-table-column prop="brandEnName" label="英文名称"></el-table-column>
        </el-table>
        <div class="block2">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 15, 20]"
            :page-size="pageSize"
            layout=" sizes, prev, pager, next, jumper"
            :total="totalElements">
          </el-pagination>
          <span class="totalItems">共{{totalPages }}页，{{ totalElements }}条记录</span>
        </div>

        <div slot="footer" class="dialog-footer" >
          <el-button type="primary" size="mini" @click="confirmBrand">选择</el-button>
        </div>
      </el-dialog>
      <el-dialog class="shop_dialog" title="提示" top="20%" :visible.sync="hasShop" width="40%" center
                  :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <p>{{ tips }}</p>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applyShop">前往我要开店</el-button>
      </span>
      </el-dialog>
      <el-dialog class="bondDialog" title="提示" :visible.sync="isBond" width="50%" center  :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <!--<img :src="ImgSrc" alt="" />-->
        <p class="tips">您还未缴纳保证金，请先前往缴纳保证金后方可查看相关信息</p>
        <div slot="footer">
          <el-button plain @click="goBond">前往缴纳保证金</el-button>
        </div>
      </el-dialog>
      <el-dialog class="taoDetail" title="获取淘宝商品信息" :visible.sync="taoVisible" width="50%" top="24vh" :before-close="beforeClose">
        <div class="input_wrap"><span>淘宝商品链接：</span><el-input placeholder="商品链接" size="small" v-model.trim="taoLink"></el-input></div>
        <div slot="footer">
          <el-button type="primary" size="mini" @click="getTaoInfo(taoLink)">确定</el-button>
          <el-button plain size="mini" @click="taoVisible=false ;taoLink='';">关闭</el-button>

        </div>
      </el-dialog>
    </div>
</template>

<script>
  // import wangeditor from '@/components/wangeditor'
  import { uploadImage  } from "@/api/activity"
  import { newGoogds,getGoodsDetail, getBrand,changeGoods ,firstList,secondList,thirdList, getShopInfo, getTao} from "@/api/merchant"
  import { getToken,getMobile } from '@/utils/auth'
  import { getBond } from "@/api/userCenter"
  import { checkFloat,validName } from "@/utils/validate"
  import $ from '../../../../static/js/jquery-3.3.1.min.js'
  import E from 'wangeditor'

  export default {
    // components: {
    //   wangeditor
    // },
    name: "new-goods",

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
            if(value< 0 ){
              callback(new Error('商品价格应大于0，请重新输入'))
            }

            if( !checkFloat(value)){
              callback(new Error('商品价格应为数字且最多可有两位小数，请重新输入'))

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
              shopName:'',
              form : {
                id: '',
                productName:'',
                brandId:'',
                firstType : '',
                secondType:'',
                thirdType: '',
                class1Id:'',
                class2Id:'',
                class3Id:'',
                price:'',
                carriage:'',
                ybProductItemReqDto : [{ size: '', color : '', stock: ''}],
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
              totalPages : 0,
              totalElements : 0,
              currentPage : 1,
              pageSize : 10,
              tips: '',
              isBond: false,
              taoVisible: false ,
              taoLink:'',
              dataInterface: {
                editorUpImgUrl: process.env.BASE_API+'/file/multi/upload' // 编辑器插入的图片上传地址
              },
              editor: '',  // 存放实例化的wangEditor对象，在多个方法中使用
              word:'',
              thirdName:'',
            }
        },

        mounted(){
          // window.tinymce.init({});
          this.getBondInfo();

        },

        methods: {

          getBondInfo(){
            getBond().then( res => {
              // console.log(res.data);
              this.loading= true;

              if(res.data.status === '000000000'){

                if(res.data.data.status === '3'){
                  this.isBond = true ;

                }else{
                  this.isBond = false ;
                  this.getShop();

                }
              }else{
                if(res.data.data === null ){
                  this.isBond = true ;

                }

              }
            })
          },
          //判断是否已有店铺
          getShop(){
            getShopInfo().then(res=> {
              if(res.data.status === '000000000'){
                this.hasShop = false ;
                this.shopName = res.data.data.name;
                this.copyGoods();
                this.getFirstList();
                this.createEditor();

                return true ;


              }else{
                this.tips = res.data.message;
                this.hasShop = true ;


              }
            })
          },
          //判断是否是复制商品
          copyGoods(){
            let id = this.$route.query.order ;
            if(id !== undefined){
              getGoodsDetail(id).then(res=>{
                this.loading = false ;

                this.form = {
                  productName: res.data.data.productName ,
                  brandId:res.data.data.brandId,
                  firstType : res.data.data.cateGoryMap.categoryName1,
                  secondType:res.data.data.cateGoryMap.categoryName2,
                  // thirdType:res.data.data.cateGoryMap.categoryName3,
                  class1Id : res.data.data.cateGoryMap.categoryId1,
                  class2Id:res.data.data.cateGoryMap.categoryId2,
                  class3Id:res.data.data.cateGoryMap.categoryName3,
                  price:res.data.data.price,
                  carriage:res.data.data.carriage,
                  ybProductItemReqDto : res.data.data.productItems,
                  imagesList : res.data.data.productImages,
                  describes: res.data.data.describes,
                  id: ''
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
                // this.getFirstList();
                // this.getSecondList(this.form.class1Id);
                // this.getThirdList(this.form.class2Id);
              })
            }else{
              // this.title = '新增商品';
            }
          },
          getBrandList(){

            getBrand(this.brandName, this.currentPage ,this.pageSize).then(res => {
              this.brandData = res.data.data ;
                this.totalPages = res.data.totalPages ;
                this.totalElements = res.data.totalElements ;
            })

          },

          //查询品牌
          searchBrand(){
            this.radio = '';
            this.brandName = '';
            this.currentPage = 1 ;
            this.dialogVisible = true ;
            this.getBrandList();
          },
          //选择品牌
          handleBrand(index,val,name) {
            this.brandName = name;
            this.radio = index ;
          },
          //确认选择的品牌
          confirmBrand(){
            if(this.brandData[this.radio].id  !== undefined){
              this.form.brandId = this.brandData[this.radio].id ;
              this.brandCnName = this.brandData[this.radio].brandCnName ;
              this.dialogVisible = false;
            }else{
              this.$message({
                message: '请选择品牌',
                type: 'error',
                center: true
              })
            }




          },
          //  获取一级分类
          getFirstList(){
            this.clearType('1');

            firstList().then(res=> {
              this.firstTypeList = res.data.data;
              // if(this.form.class1Id!== ''){
              //   this.getSecondList(this.form.class1Id);
              //
              // }
              if(!validName(this.form.firstType)&&this.form.firstType!== ''){
                this.getSecondList(this.form.firstType)
              }
            })
          },
          //  获取二级分类
          getSecondList(type){
            this.clearType('2');
            secondList(type).then(res=> {

              this.secondTypeList = res.data.data;
              // if(this.form.class2Id!== ''){
              //   this.getThirdList(this.form.class2Id);
              //
              // }
              if(!validName(this.form.secondType)&&this.form.secondType!== ''){
                this.getThirdList(this.form.secondType)
              }
            })

          },
          //获取三级分类
          getThirdList(type){
            this.clearType('3');
            thirdList(type).then(res=> {
              this.thirdTypeList = res.data.data
            })
          },
          //重选清除原有分类
          clearType(type){
            if(type==='1'){
              this.form.class2Id = '';
              this.form.secondType = '';
              this.secondTypeList = [];
            }
            if(type !== '3'){
              this.form.class3Id = '';
              this.form.thirdType = '';
              this.thirdTypeList = [];
            }


          },
          getImg(index){
            this.imgIndex = index ;
          },
          // 上传图片
          beforeImgUpload(file) {
            // console.log(file)
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
            if (this.form.ybProductItemReqDto.length < 10) {

              this.form.ybProductItemReqDto.push({
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
          //   this.form.describes=value      //在这里接受子组件传过来的参数，赋值给data里的参数
          // },
          //提交表格
          submitForm(formName){
            // console.log(JSON.stringify(this.form));
            this.$refs[formName].validate((valid) => {
              if(valid){
                let data = {
                  id: '',
                  productName:this.form.productName,
                  brandId:this.form.brandId,
                  class3Id:this.form.class3Id,
                  price:this.form.price,
                  carriage:this.form.carriage,
                  ybProductItemReqDto : this.form.ybProductItemReqDto,
                  imagesList : this.form.imagesList,
                  describes: this.form.describes,
                };
                if(validName(data.class3Id) ){
                  data.class3Id = this.thirdName ;
                }
                // data = JSON.stringify(data);
                // console.log(data,this.form);
                newGoogds(data,this.user).then( res => {

                   this.$message({
                      message : '您添加的商品信息已提交，请稍后确认商品状态',
                      center: true ,
                      type : 'success',
                      duration: 1000
                    });
                    setTimeout(()=>{
                      this.$router.push('/merchantCenter/goods/goodsList')


                    },2000)
                })
              }else{

              }
            })
          },
          createEditor(){

            this.editor = new E('#wangeditor')        //创建富文本实例


            this.editor.customConfig.onchange = (html) => {
              this.form.describes = html ;
              // this.catchData(html)  //把这个html通过catchData的方法传入父组件
            }
            this.editor.customConfig.uploadImgServer = this.dataInterface.editorUpImgUrl
            this.editor.customConfig.uploadFileName = 'sourcePic'
            this.editor.customConfig.showLinkImg = false;
            this.editor.customConfig.uploadImgMaxLength = 10;
            this.editor.customConfig.uploadImgHeaders = {
              'ContentType': 'application/json',
              'yb-tryout-merchant-token':this.token    //头部token
            }
            this.editor.customConfig.uploadImgParams = {
              token : 'abcdef12345'
            }
            this.editor.customConfig.menus = [          //菜单配置
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
            this.editor.customConfig.uploadImgHooks = {
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

                result.data.filePath.map( i => {
                  // let url = Object.values(i)      //result.data就是服务器返回的图片名字和链接
                  insertImg(i)

                });

              },

            }
            this.editor.customConfig.linkImgCallback = function (url) {
              // console.log(url);
            }

            this.editor.create()

          },

          //获取淘宝商品详情
          getTaoInfo(url){
            let that = this ;
            if(url === ''){
              this.$message({
                message: '请输入商品链接！',
                center: true,
                type: 'error'
              });
            }else{
              var startIndex = url.indexOf("&id=");
              if (startIndex < 0) {
                startIndex = url.indexOf("?id=");
              }
              if (startIndex < 0) {
                this.taoLink = '';
                this.$message({
                  message: '您输入的商品链接有误，请重新输入！',
                  center: true,
                  type: 'error'
                });
                return;
              }
              var endIndex = url.indexOf("&", startIndex + 1);
              if (endIndex < 0) {
                endIndex = url.length;
              }
              if (endIndex < 0) {
                this.taoLink = '';
                this.$message({
                  message: '您输入的商品链接有误，请重新输入！',
                  center: true,
                  type: 'error'
                });
                return;
              }
              var productId = '';
              productId = url.substring(startIndex + 4, endIndex);
              if (productId.length <= 0) {
                this.$message({
                  message: '您输入的商品链接有误，请重新输入！',
                  center: true,
                  type: 'error'
                });
                this.taoLink = '';
                return;
              }
              // console.log(productId);
              if( productId!== '' ){

                let _this = this ;
                $.ajax({
                  url: "https://acs.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%7B%22itemNumId%22%3A%22" + productId + "%22%7D&qq-pf-to=pcqq.group",
                  dataType: 'jsonp',
                  type: 'get',
                  contentType: 'application/json',
                  success: function (data) {
                    // var productBase = data;
                    var params = {
                      "productId": productId,
                      "productBaseMap": data
                    };
                    // console.log(params)
                    params = JSON.stringify(params);
                    that.getDetail(params);
                  },
                  error: function(err){
                    // console.log(err);
                  }
                });


              }
            }
          },
          getDetail(params){
            this.form.describe = '';
            this.editor.txt.html('');
            this.form.imagesList = ['','','','',''];
            this.form.productName = '';
            this.form.ybProductItemReqDto = [{ size: '', color : '', stock: ''}];
            getTao(params).then( res => {
              // console.log(res);
              this.taoLink = '';

              if(res.data.data.sizeColor!== undefined){
                let sizeLength = res.data.data.sizeColor.length ;
                if(sizeLength> 0){
                  if(sizeLength< 10){
                    this.form.ybProductItemReqDto = res.data.data.sizeColor ;

                  }else{
                    this.form.ybProductItemReqDto = res.data.data.sizeColor.slice(0,10) ;

                  }

                }
              };
              if( res.data.data.productName!==''){
                this.form.productName = res.data.data.productName ;

              }
              if(res.data.data.showImages!== null &&res.data.data.showImages.length > 0){
                this.form.imagesList = res.data.data.showImages ;
                if(this.form.imagesList.length < 5){
                  if(this.form.imagesList.length === 0){
                    this.form.imagesList =   ['','','','','']

                  }else {
                    for(let i = this.form.imagesList.length ; i< 5;i++){
                      this.form.imagesList.push('');
                    }
                  }
                };
              }

              if(res.data.data.detailImages!== undefined &&res.data.data.detailImages.length > 0){
                this.form.describes = res.data.data.detailImages ;
                res.data.data.detailImages.map( i => {
                  this.editor.uploadImg.insertLinkImg(i)
                })
              }
              this.taoVisible = false;

            })
          },
          beforeClose(){
            this.taoLink ='';
            this.taoVisible = false;

          },
          goBond(){
            this.$router.push({ name : 'MerchantCenter-home',params: { 'step3' : true}})
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
  @import "../../../styles/goods";


  .bondDialog{
    p{
      height : 10vh;
      font-size : 0.3rem ;
      text-align : center ;
      line-height : 10vh ;
    }
  }
  .taoDetail{
    .input_wrap{
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      width: 80%;
      margin : 0.5rem auto ;
      span{
        display: inline-block;
        width: 120px;
        color: #666;
        text-align: right;
        font-size: 0.14rem;
      }
      .el-input{
        flex: 1;
        margin-left: 0.15rem;
      }
    }
  }
</style>
