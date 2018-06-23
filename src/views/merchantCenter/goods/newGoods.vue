<template>
    <div class="newGoods new">
      <h1>新增商品</h1>
      <el-form :model="form" ref="form" :rules="formRule" label-position="right" >
        <h2>商品表单</h2>
        <el-form-item  labelWidth="130px" label="店铺" >
          <div class="inputInfo">丫贝自营</div>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="商品名称" prop="goodsName">
          <el-input class="inputInfo" size="small" v-model.trim="form.goodsName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="商品品牌" prop="goodsBrand">
          <el-input class="inputInfo" size="small" v-model.trim="form.goodsBrand" disabled='disabled'></el-input>
          <div class="showBrand" @click="dialogVisible = true ;"><svg-icon icon-class="brand"></svg-icon><span>品牌速查</span></div>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="一级分类" prop="firstType">
          <el-select  size="small" clearable v-model="form.firstType" @change="getSecondList(form.firstType)" filterable placeholder="请选择一级分类">
            <el-option
              v-for="item in firstTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="二级分类" prop="secondType">
          <el-select  size="small" clearable v-model="form.secondType" @change="getThirdList(form.secondType)" filterable placeholder="请选择二级分类">
            <el-option
              v-for="item in secondTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  labelWidth="130px" label="三级分类" prop="thirdType">
          <el-select  size="small" clearable v-model="form.thirdType" filterable placeholder="请选择三级分类">
            <el-option
              v-for="item in thirdTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="size"  label="商品规格"
                      labelWidth="130px" prop="sizeList[0]" :rule="{ color :{ message : '请输入商品规格大小', trigger : 'blur' , required : true },
                      size : { message : '请输入商品颜色', trigger : 'blur' , required : true }, stock : { message : '请输入商品库存', trigger : 'blur' , required : true }}">
          <ul class="sizeList">
            <li v-for="(item,index) in form.sizeList" :key="index" :prop="'keyword.'+ index + '.size'" >
              <el-input class="key" placeholder="大小"
                        :maxlength="40"  v-model.trim="item.size" size="small" ></el-input>
              <el-input  class="key" placeholder="颜色"
                        :maxlength="40"  v-model.trim="item.color" size="small" ></el-input>
              <el-input  class="key" placeholder="库存量" type="number"
                        :maxlength="40"  v-model.number="item.stock" size="small" ></el-input>
              <el-button slot type="primary" size="mini" @click="addSize">添加</el-button>
              <el-button  slot plain size="mini" @click="deleteSize(item)">删除</el-button>
            </li>
          </ul>

        </el-form-item>
        <el-form-item   labelWidth="130px"  label="价格" prop="goodsPrice">
          <el-input class="inputInfo" :maxLength="20" size="small" v-model.trim="form.goodsPrice" placeholder="价格"></el-input>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="运费" prop="goodsPost">
          <el-input class="inputInfo" :maxLength="20" size="small" v-model.trim="form.goodsPost" placeholder="运费"></el-input>
        </el-form-item>
        <el-form-item labelWidth="130px" label="图片" prop="imgList">
          <ul class="imgList">
            <li v-for="(item,index) in form.imgList" @change="getImg(index)">
              <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.imgList[index]"
                          :show-file-list="false"  :before-upload="beforeImgUpload">
                <img v-if="form.imgList[index]" :src="imageDomain + form.imgList[index]" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传商品图片</span>
              </el-upload>
            </li>
          </ul>
        </el-form-item>
        <el-form-item   labelWidth="130px"  label="描述" prop="goodsInfo">
          <editor :id="tinymceId" v-model="form.tinymceHtml" :init="init" ></editor>
        </el-form-item>
        <el-form-item>
          <el-button class="inputInfo button" type="primary" size="small" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>

      <el-dialog title="品牌速查" :visible.sync="dialogVisible" width="60%" >
        <div class="dialogTop">
          <span>品牌名称：</span><el-input type="text" class="middleInput" v-model.trim="inputName" size="small"></el-input>
          <el-button type="primary" size="small" @click="searchBrand(inputName)">查询</el-button>
        </div>
        <el-table :data="brandData" border stripe highlight-current-row fit >
          <el-table-column  width="32" >
            <template slot-scope="scope">
              <el-radio :label="scope.$index" v-model="radio" @change.native="handleCurrentChange(scope.$index,scope.row.date)"></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="品牌ID"></el-table-column>
          <el-table-column prop="name" label="品牌名称"></el-table-column>
          <el-table-column prop="address" label="英文名称"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" >
          <el-button type="primary" size="mini" @click="confirmBrand">选择</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { uploadImage  } from "@/api/activity"
  import { getToken } from '@/utils/auth'
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
  import SvgIcon from "../../../components/SvgIcon/index";
  import ElButton from "element-ui/packages/button/src/button";
  export default {
    components: {
      ElButton,
      // ElTable,
      SvgIcon,
      // ElFormItem,
      Editor},
    name: "new-goods",
    props: {
      id: {
        type: String
      },
      value: {
        type: String,
        default: ''
      },
      // toolbar: {
      //   type: Array,
      //   required: false,
      //   default() {
      //     return ['bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image media | removeformat']
      //   }
      // },
      // menubar: {
      //   default: ''
      // },
      height: {
        type: Number,
        required: false,
        default: 360
      },
      // language:{
      //   default : '/static/tinymce/zh_CN.js'
      // },
      // skin : {
      //   default : '/static/tinymce/skins/lightgray'
      // }

    },
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
        const validPrice = (rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入商品价格'))
          }else{
            if(!(/^[1-9][0-9]{0,8}$/).test(value)){
              callback(new Error('商品价格应大于0且不超过9位数，请重新输入'))
            }

          }
        };
        const validPost = (rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入运费'))
          }else{
            if(!(/^[0-9]{1,9}$/).test(value)){
              callback(new Error('运费应不小于0且不超过9位数，请重新输入'))
            }

          }
        }
            return {
              form : {
                goodsName:'',
                goodsBrand:'',
                firstType : '',
                secondType:'',
                thirdType:'',
                goodsPrice:'',
                goodsPost:'',
                sizeList : [{}],
                imgList : ['','','','',''],
                tinymceHtml : ''
              },
              formRule : {
                goodsName : [
                  {
                    required : true ,trigger : 'blur' ,validator : validGoodsName
                  }
                ],
                goodsBrand: [
                  {
                    required : true  ,message: '请选择商品品牌'
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
                thirdType:[
                  {
                    required : true ,trigger : 'change' ,message: '请选择三级分类'
                  }
                ],
                goodsPrice:[
                  {
                    required : true ,trigger : 'blur' ,validator : validPrice
                  }
                ],
                goodsPost : [
                  {
                    required : true ,trigger : 'blur' ,validator : validPost
                  }
                ]
              },
              radio : '',
              brandData: [],
              brandName : '',
              firstTypeList : [],
              secondTypeList : [],
              thirdTypeList : [],
              token : getToken() ,
              autoUpload : true ,
              imgUrl : process.env.BASE_API+'/tryout/file/upload',
              goodsImgWarn : false ,
              imageDomain : process.env.IMAGE_DOMAIN ,
              imgIndex : '',
              noTinymceImg : false ,
              hasInit:false,
              hasChange:false,
              tinymceId: this.id || 'vue-tinymce'+ Date.parse(new Date()),
              init: {
                language_url : '/static/tinymce/zh_CN.js',
                skin_url: '/static/tinymce/skins/lightgray',
                plugins: 'link lists image media table colorpicker textcolor wordcount contextmenu',
                toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image media | removeformat',
                automatic_uploads: true, //开启点击图片上传时，自动进行远程上传操作

              },
              dialogVisible: false,
              // currentRow : null,
              inputName : ''
            }
        },
        mounted(){


          this.getFirstList();
          tinymce.init({});
          this.initTinymce();
          // tinymce.init({});

          this.getBrandList();
        },
        watch:{
          value(newV,oldV){
            if(this.hasInit&& !this.hasChange){
              this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))

            }
          }
        },
        computed:{
          showImg(){
            console.log(this.form.imgList)
            return this.form.imgList
          }

        },
        methods: {
          getBrandList(){
            this.brandData = [
              {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
              }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
              }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
              }
            ]
          },
          //查询品牌
          searchBrand(key){
            // this.brandData =
          },
          //选择品牌
          handleCurrentChange(index,val) {
            this.brandName = val;
            this.radio = index ;
            console.log(index,val)
          },
          //确认选择的品牌
          confirmBrand(){
            this.form.goodsBrand = this.brandName ;
            this.dialogVisible = false;
            console.log(this.form.goodsBrand)


          },
          //  获取一级分类
          getFirstList(type) {
            this.firstTypeList =[
              {
                value: '选项1',
                name: '黄金糕'
              }, {
                value: '选项2',
                name: '双皮奶',
                disabled: true
              }, {
                value: '选项3',
                name: '蚵仔煎'
              }, {
                value: '选项4',
                name: '龙须面'
              }, {
                value: '选项5',
                name: '北京烤鸭'
              }
            ]
          },
          //  获取二级分类
          getSecondList(type) {
            this.secondTypeList = [
              {
                value: '选项d1',
                name: '黄金糕'
              }, {
                value: '选项dd2',
                name: '双皮奶',
                disabled: true
              }, {
                value: '选项dd3',
                name: '蚵仔煎'
              }, {
                value: '选项dd4',
                name: '龙须面'
              }, {
                value: 'dd',
                name: '北京烤鸭'
              }
            ]
          },
          getThirdList(type) {
            this.thirdTypeList = [
              {
                value: '选项11',
                name: '黄金糕'
              }, {
                value: '选项12',
                name: '双皮奶',
                disabled: true
              }, {
                value: '选项13',
                name: '蚵仔煎'
              }, {
                value: '选项14',
                name: '龙须面'
              }, {
                value: '选项15',
                name: '北京烤鸭'
              }
            ]
          },
          getImg(index){
            this.imgIndex = index ;
            this.noTinymceImg = true ;
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
                  console.log(_this.token)
                  uploadImage(formData,_this.token).then(res => {
                    if (res.data.status === '000000000') {

                      if(_this.noTinymceImg){

                          _this.$set(_this.form.imgList,_this.imgIndex,  res.data.data.fileName);
                          // console.log(_this.form.imgList)
                      }
                      // _this.goodsImgWarn = false;
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
          //删除商品规格
          deleteSize(item) {
            let index = this.form.sizeList.indexOf(item);
            if (index !== -1 && this.form.sizeList.length > 1) {
              this.form.sizeList.splice(index, 1)
            }


          },

          //添加商品规格
          addSize() {
            if (this.form.sizeList.length < 5) {
              this.form.sizeList.push({
                'size': '',
                'color': '',
                'stock': '',

              })

            } else {
              this.$message({
                message: '您添加的规格参数太多啦，不能再加啦~',
                center: true,
                type: 'error'
              })
            }
          },

          //  富文本
          initTinymce() { // editor组件传过来的值赋给content
            const _this = this ;
            window.tinymce.init({
              // ..._this.init,
            selector: `#${_this.tinymceId}`,
              // setup: (editor)=> {
              // language_url: this.language,
              language: 'zh_CN',
              // skin_url: this.skin,
              height: this.height,
              body_class: 'panel-body ',
              object_resizing: false,
              // toolbar: this.toolbar,
              // menubar: this.menubar,
              // plugins: 'link lists image media table colorpicker textcolor wordcount contextmenu',
              // toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image media | removeformat',
              branding: false,
              media_live_embeds: true,
              default_link_target: '_blank',
              link_title: false,
              menubar: "insert",
              paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
              paste_convert_word_fake_lists: false, // 插入word文档需要该属性
              // paste_webkit_styles: 'all',
              // image_advtab: true, //开启图片上传的高级选项功能
              // imagetools_toolbar: 'watermark',
              images_upload_base_path: process.env.BASE_API, // 图片上传的基本路径
              images_upload_url: process.env.BASE_API + '/tryout/file/upload', // 图片上传的具体地址，该选项一定需要设置，才会出现图片上传选项
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
                      success(res.data.data.src);
                      console.log(res.data.data)
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
                console.log(1)
                if (_this.value) {
                  editor.setContent(_this.value)
                }
                _this.hasInit = true
                editor.on('NodeChange Change input KeyUp', () => {
                  //change触发watch去setContent，光标变化了，
                  this.hasChange = true
                  this.$emit('input', editor.getContent({format: 'raw'}))
                })
              }

            })
            // console.log(content)
          },
          setContent(val){
            window.tinymce.get(this.tinymceId).setContent(val)
          },
          getContent(){
            window.tinymce.get(this.tinymceId).getContent()
          },
          //提交表格
          submitForm(formName){

            console.log(this.form);
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
  @import '../../../styles/new';
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
    .sizeList{
      display: flex;
      flex-direction: column;
      li{
        width : 100% ;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .el-input{

          width : 25% ;
        }
        .el-button {
          height : 30px;
          margin : 2px 0!important;
        }
      }
    }
    .imgList{
      display : flex ;
      flex-direction: row;
      justify-content: space-around;
      li{
        width : 20% ;
        .el-upload{
          img{
            width : 100% ;
          }
        }
      }
    }
  }
  .dialogTop{
    margin-bottom : 0.3rem ;
    .el-button {
      margin-left : 0.12rem ;
    }
  }
</style>
