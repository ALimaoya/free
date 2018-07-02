<template>
    <div class="newGoods new">
      <h1>{{ title }}</h1>
      <el-form :model="form" ref="form" :rules="formRule" label-position="right" >
        <h2>商品表单</h2>
        <el-form-item  labelWidth="130px" label="店铺" >
          <div class="inputInfo">丫贝自营</div>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="商品名称" prop="productName">
          <el-input class="inputInfo" :disabled="readOnly" size="small" v-model.trim="form.productName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="商品品牌" prop="brandId">
          <el-input class="inputInfo" :disabled="readOnly" size="small" v-model.trim="brandCnName" disabled='disabled'></el-input>
          <div class="showBrand" @click="searchBrand()"><svg-icon icon-class="brand"></svg-icon><span>品牌速查</span></div>
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
                           :maxlength="40"  v-model.number="item.stock" size="small" ></el-input>
                <el-button slot type="primary" size="mini" @click="addSize">添加</el-button>
                <el-button  slot plain size="mini" @click="deleteSize(item)">删除</el-button>
              </el-form-item>
            </div>
          </div>
        </div>

        <el-form-item   labelWidth="130px"  label="价格" prop="price">
          <el-input class="inputInfo" :maxLength="20" size="small" v-model.trim="form.price" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="运费" prop="carriage">
          <el-input class="inputInfo" :maxLength="20" size="small" v-model.trim="form.carriage" placeholder="运费"></el-input>
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
            <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传商品图片</span>
          </ul>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="描述" prop="describes">
          <editor :id="tinymceId" v-model="form.describes" :init="init"></editor>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!readOnly" class="inputInfo button" type="primary" size="small" @click="submitForm('form')">提交</el-button>
          <el-button v-else-if="readOnly" class="inputInfo button" type="primary" size="small" @click="changeForm('form')">修改</el-button>

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
        <el-button type="primary" @click="applyShop">申请店铺</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
  import { uploadImage  } from "@/api/activity"
  import { newGoogds,getGoodsDetail, getBrand,changeGoods ,firstList,secondList,thirdList, getShopInfo} from "@/api/merchant"
  import { getToken,getMobile } from '@/utils/auth'
  import tinymce from 'tinymce/tinymce'
  import 'tinymce/themes/modern/theme'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'
  import Editor from '@tinymce/tinymce-vue'
  // import ElFormItem from "element-ui/packages/form/src/form-item";
  // import SvgIcon from "../../../components/SvgIcon/index";
  // import ElButton from "element-ui/packages/button/src/button";
  // import ElFormItem from "element-ui/packages/form/src/form-item";
  export default {
    components: {
      // ElFormItem,
      // ElButton,
      // ElTable,
      // SvgIcon,
      // ElFormItem,
      Editor},
    name: "new-goods",
    // props: {
    //   id: {
    //     type: String
    //   },
    //   value: {
    //     type: String,
    //     default: ''
    //   },
    //   toolbar: {
    //     type: Array,
    //     required: false,
    //     default() {
    //       return ['bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image media | removeformat']
    //     }
    //   },
    //   // menubar: {
    //   //   default: ''
    //   // },
    //   height: {
    //     type: Number,
    //     required: false,
    //     default: 560
    //   },
    //   // language:{
    //   //   default : '/static/tinymce/zh_CN.js'
    //   // },
    //   // skin : {
    //   //   default : '/static/tinymce/skins/lightgray'
    //   // }
    //
    // },
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
            if(!(/^[0-9]{1,9}$/).test(value)){
              callback(new Error('运费应不小于0且不超过9位数，请重新输入'))
            }
            callback();

          }
        };

            return {
              form : {
                id: '',
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
              title: '新增商品',
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
              hasInit:false,
              hasChange:false,
              tinymceId: this.id || 'vue-tinymce'+ Date.parse(new Date()),
              init: {
                language_url : '/static/tinymce/zh_CN.js',
                language: 'zh_CN',
                skin_url: '/static/tinymce/skins/lightgray',
                plugins: 'link lists image media table colorpicker textcolor wordcount contextmenu',
                toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image media | removeformat',
                automatic_uploads: true, //开启点击图片上传时，自动进行远程上传操作
                // image_advtab: true, //开启图片上传的高级选项功能
                height: 300,
                body_class: 'panel-body ',
                object_resizing: false,
                branding: false,
                media_live_embeds: true,
                default_link_target: '_blank',
                convert_newlines_to_brs:false,
                force_br_newlines: false,
                link_title: false,
                menubar: "insert",
                paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
                paste_convert_word_fake_lists: false, // 插入word文档需要该属性
                paste_webkit_styles: 'all',
                // image_advtab: true, //开启图片上传的高级选项功能
                imagetools_toolbar: 'watermark',
                images_upload_base_path: process.env.BASE_API, // 图片上传的基本路径
                images_upload_url: process.env.BASE_API + '/file/upload', // 图片上传的具体地址，该选项一定需要设置，才会出现图片上传选项
                images_upload_handler: function (blobInfo, success, failure) {
                  let file = blobInfo.blob();
                  if (blobInfo.blob().size > self.maxSize) {
                    failure('文件体积过大')
                  }

                  if (file.type !== undefined || file.type !== '') {

                    let formData = new FormData();
                    let token = getToken();
                    formData.set('upload_file', file);
                    uploadImage(formData, token).then(res => {

                      if (res.data.status === '000000000') {

                        success(res.data.data.filePath);


                      } else {
                        this.$message({
                          message: res.data.message,
                          center: true,
                          type: 'error'
                        });

                      }
                    }).catch(err => {
                      // console.log(err) ;

                      failure('图片上传失败')

                    })
                  } else {
                    failure('图片格式错误')
                  }
                  //
                  //
                },
                init_instance_callback: editor => {
                  if (this.value) {
                    console.log(this.value);
                    editor.setContent(this.value)
                  }
                  this.hasInit = true;
                  editor.on('NodeChange Change input KeyUp', () => {
                    //change触发watch去setContent，光标变化了，
                    this.hasChange = true;
                    this.$emit('input', editor.getContent({format: 'raw'}))
                  })
                }
              },
              dialogVisible: false,
              // currentRow : null,
              hasShop : false ,
              readOnly : false ,
              totalPages : '',
              totalElements : 0,
              currentPage : 1,
              pageSize : 10,
              tips: ''
            }
        },
        mounted(){
          this.getFirstList();
          window.tinymce.init({});
          this.getShop();
          this.isNewGoods();


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

                  return true ;


              }else{
                this.$message({
                  message : res.data.message,
                  center: true ,
                  type : 'error'
                });
                this.tips = res.data.message;
                this.hasShop = true ;


              }
            }).catch( err => {
              alert('服务器开小差啦，请稍等~')

            })
          },
          isNewGoods(){
            let id = this.$route.query.order ;

            if(!this.hasShop){
              //判断是新增还是修改商品
              if(id !== undefined){
                //获取已有商品信息
                getGoodsDetail(id).then(res=>{
                  if(res.data.status === '000000000'){
                    this.form = {
                      id: res.data.data.id,
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
                    this.thirdName = res.data.data.cateGoryMap.categoryId3;
                    this.brandCnName = res.data.data.brandCnName ;
                    this.readOnly = true ;
                    this.title = '修改商品'
                  }else{
                    this.$message({
                      message : res.data.message ,
                      center : true ,
                      type : 'error'
                    })
                  }
                }).catch( err => {
                  alert('服务器开小差啦，请稍等~')

                })
              }else{
                this.title = '新增商品';
              }
            }
          },
          getBrandList(){

            getBrand(this.brandName, this.currentPage ,this.pageSize).then(res => {
              if(res.data.status === '000000000'){
                // this.brandData =
                this.brandData = res.data.data ;
                this.totalPages = res.data.totalPages ;
                this.totalElements = res.data.totalElements ;
              }
            }).catch( err => {
              alert('服务器开小差啦，请稍等~')

            });

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
            this.form.brandId = this.brandData[this.radio].id ;
            this.brandCnName = this.brandData[this.radio].brandCnName ;
            this.dialogVisible = false;


          },
          //  获取一级分类
          getFirstList(){
            firstList().then(res=> {
              if(res.data.status === '000000000'){
                this.firstTypeList = res.data.data

              }else{
                this.$message({
                  message : res.data.message,
                  center: true ,
                  type : 'error'
                })
              }
            }).catch( err => {
              alert('服务器开小差啦，请稍等~')

            })
          },
          //  获取二级分类
          getSecondList(type){
            this.form.secondType = '';
            this.form.class3Id = '';

            secondList(type).then(res=> {

              if(res.data.status === '000000000'){
                this.secondTypeList = res.data.data

              }else{
                this.$message({
                  message : res.data.message,
                  center: true ,
                  type : 'error'
                })
              }
            }).catch( err => {
              alert('服务器开小差啦，请稍等~')

            })

          },
          //获取三级分类
          getThirdList(type){
            this.form.class3Id = '';

            thirdList(type).then(res=> {
              if(res.data.status === '000000000'){
                this.thirdTypeList = res.data.data

              }else{
                this.$message({
                  message : res.data.message,
                  center: true ,
                  type : 'error'
                })
              }
            }).catch( err => {

              alert('服务器开小差啦，请稍等~')

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
                  uploadImage(formData,_this.token).then(res => {
                    if (res.data.status === '000000000') {
                       _this.$set(_this.form.imagesList,_this.imgIndex,  res.data.data.fileName);
                       console.log(_this.form.imagesList,_this.imgIndex, )
                      // _this.goodsImgWarn = false;
                    } else {
                      _this.$message({
                        message: res.data.message,
                        center: true,
                        type: 'error'
                      });

                    }
                  }).catch(err => {
                    alert('服务器开小差啦，请稍等~')


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
            if (this.form.ybProductItemReqDto.length < 5) {
              // let index = this.form.ybProductItemReqDto.length ;
              // this.$set(this.form.ybProductItemReqDto,index,{
              //   'size': '',
              //   'color': '',
              //   'stock': '',
              //
              // })
              this.form.ybProductItemReqDto.push({
                'size': '',
                'color': '',
                'stock': '',

              });
              console.log(this.form.ybProductItemReqDto)

            } else {
              this.$message({
                message: '您添加的规格参数太多啦，不能再加啦~',
                center: true,
                type: 'error'
              })
            }
          },

          // //  富文本
          // initTinymce() { // editor组件传过来的值赋给content
          //   const _this = this ;
          //   window.tinymce.init({
          //     ..._this.init,
          //   selector: `#${_this.tinymceId}`,
          //     // setup: (editor)=> {
          //
          //
          //   })
          //   // console.log(content)
          // },
          // setContent(val){
          //   console.log(val);
          //   if(val.indexOf('/tryout/images')!== -1){
          //     val = this.imageDomain+ val
          //   }
          //
          //   window.tinymce.get(this.tinymceId).setContent(val)
          // },
          // getContent(){
          //   window.tinymce.get(this.tinymceId).getContent()
          // },
          // destroyTinymce() {
          //   if (window.tinymce.get(this.tinymceId)) {
          //     window.tinymce.get(this.tinymceId).destroy()
          //   }
          // },
          //提交表格
          submitForm(formName){

            // this.form.images.every((i)=> {
            //
            //   if(i === ''){
            //     this.goodsImgWarn = true ;
            //     return this.goodsImgWarn ;
            //   }else{
            //     this.goodsImgWarn = false ;
            //     return this.goodsImgWarn ;
            //   }
            // });
            console.log(this.form);

            this.$refs[formName].validate((valid) => {
              if(valid){
                delete this.form.firstType ;
                delete this.form.secondType ;

                // let item = [];
                // this.form.ybProductItemReqDto.map( i => {
                //   let arr = [];
                //   for(let k in i){
                //     arr.push(i[k]);
                //
                //   }
                //   item.push(arr);
                // });
                // item = item.join(';');
                // this.form.ybProductItemReqDto = item ;
                // console.log(item,this.form.ybProductItemReqDto);
                // let imgList = [];
                // this.form.images.map( i => {
                //   if( i !== ''){
                //     imgList.push(i);
                //   }
                // });
                // if(imgList.length > 0){
                //   this.form.images = imgList.join(',');
                //
                // }else{
                //   this.form.images = '';
                // }

                console.log(this.form);
                // delete this.form.ybProductItemReqDto ;

                newGoogds(this.form,this.user).then( res => {
                  if(res.data.status === '000000000') {
                    this.$message({
                      message : '您添加的商品信息已提交，请稍后确认商品状态',
                      center: true ,
                      type : 'success',
                      duration: 1000
                    });
                    setTimeout(()=>{
                      window.location.reload();

                    },2000)
                  }else{
                    this.$message({
                      message : res.data.message,
                      center: true ,
                      type : 'error'
                    })
                  }
                }).catch( err => {
                  alert('服务器开小差啦，请稍等~')

                });
              }else{

              }
            })
          },

        //  修改商品信息
          changeForm(formName){

            // this.form.images.every((i)=> {
            //
            //   if(i === ''){
            //     this.goodsImgWarn = true ;
            //     return this.goodsImgWarn ;
            //   }else{
            //     this.goodsImgWarn = false ;
            //     return this.goodsImgWarn ;
            //   }
            // });
            console.log(this.form);


            this.$refs[formName].validate((valid) => {
              if(valid&& !this.goodsImgWarn){
                delete this.form.firstType ;
                delete this.form.secondType ;
                console.log(this.form);
                this.form.class3Id = this.thirdName;

                changeGoods(this.form,this.user).then( res => {
                  if(res.data.status === '000000000') {
                    this.$message({
                      message : '您修改的商品信息已提交，请稍后确认商品状态',
                      center: true ,
                      type : 'success',
                      duration: 1000
                    });
                    window.location.reload();
                  }else{
                    this.$message({
                      message : res.data.message,
                      center: true ,
                      type : 'error'
                    })
                  }
                }).catch( err => {
                  alert('服务器开小差啦，请稍等~')

                });
              }else{

              }
            })
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
