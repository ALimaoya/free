<template>
    <div class="changeGoods new goods"  v-loading="loading"  element-loading-text="拼命加载中">
    <h1>商品详情</h1>
    <el-form :model="form" ref="form"  label-position="right">
      <h2>商品表单</h2>
      <el-form-item  labelWidth="130px" label="店铺" >
        <div class="inputInfo">{{shopName}}</div>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="商品名称" prop="productName">
        <el-input class="inputInfo" :maxlength="100" :disabled="readOnly" size="small" v-model.trim="form.productName" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="商品品牌" prop="brandId">
        <el-input class="inputInfo"  :disabled="readOnly" size="small" v-model.trim="form.brandCnName" ></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="一级分类" prop="firstType">
        <el-input class="inputInfo"  :disabled="readOnly" size="small" v-model.trim="form.cateGoryMap.categoryName1" ></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="二级分类" prop="secondType">
        <el-input class="inputInfo"  :disabled="readOnly" size="small" v-model.trim="form.cateGoryMap.categoryName2" ></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="三级分类" prop="class3Id">
        <el-input class="inputInfo"  :disabled="readOnly" size="small" v-model.trim="form.cateGoryMap.categoryName3" ></el-input>
      </el-form-item>
      <div class="wrap">
        <label class="tag">商品规格</label>
        <div class="size">
          <div class="itemContent"  v-for="(item,index) in form.productItems" :key="index">
            <el-form-item class="subItem"   :prop="'productItems.'+index+'.size'" :rules="{ message : '请输入商品规格大小', trigger : 'blur' , required: true }">
              <el-input class="key" placeholder="大小"
                        :maxlength="40"  v-model.trim="item.size" size="small" ></el-input>
            </el-form-item>
            <el-form-item class="subItem"  :prop="'productItems.'+ index + '.color'" :rules="{  message : '请输入商品颜色', trigger : 'blur' , required : true }">
              <el-input  class="key" placeholder="颜色"
                         :maxlength="40"  v-model.trim="item.color" size="small" ></el-input>
            </el-form-item>
            <el-form-item class="subItem" :prop="'productItems.'+ index + '.stock'" :rules="{ message : '请输入商品库存', trigger : 'blur' , required : true }">
              <el-input  class="key" placeholder="库存量" type="tel"
                         :maxlength="11"  v-model.trim="item.stock" size="small" ></el-input>
            </el-form-item>
          </div>
        </div>
      </div>

      <el-form-item   labelWidth="130px"  label="售卖价格" prop="price">
        <el-input class="inputInfo" :maxlength="15" size="small" type="number" v-model.number="form.price" placeholder="售卖价格"></el-input>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="市场价格" prop="marketPrice">
        <el-input class="inputInfo" :maxlength="15" size="small" type="number" v-model.number="form.marketPrice" placeholder="市场价格"></el-input>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="运费" prop="carriage">
        <el-input class="inputInfo" :maxlength="2" size="small" v-model.trim="form.carriage" placeholder="运费"></el-input>
      </el-form-item>
      <el-form-item labelWidth="130px" label="图片" prop="productImages">
        <ul class="imgList">
          <li v-for="(item,index) in form.productImages" :key="index">
            <el-upload  class="upload" :auto-upload="false"  :action="imgUrl" :multiple="false" v-model.trim="form.productImages[index].imgUrl"
                        :headers="{'yb-tryout-merchant-token':token}"  :show-file-list="false"  >
              <img v-if="form.productImages[index].imgUrl" :src="imageDomain + form.productImages[index].imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!-- <span  class="deleteImg" @click="deleteImage(item)"></span> -->
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="品牌商品视频" labelWidth="130px" prop="video">
          <img v-if="form.coverUrl" :src="form.coverUrl" class="videoImg" @click="showImg(form.playUrl)">
        <el-upload v-else  class="avatar-uploader uploadvideo" v-model.trim="form.video" :action="videoUrl"
                    :headers="{'yb-tryout-merchant-token':token}"
                    :show-file-list="false"  >
          <!--<video class="mainVideo avatar" v-if="form.video" :src="VideoSrc"  controls></video>-->

          <i class="el-icon-plus avatar-uploader-icon"></i>
         </el-upload>
        <p class="require tips_warn">视频要求：必须宣传本店铺品牌的视频，禁止含有水印广告、黄赌毒等信息,时长为5-30秒</p>
      </el-form-item>
      <el-form-item label="视频介绍" labelWidth="130px" prop="videoDescribe">
        <el-input type="textarea" v-model="form.videoDescribe" placeholder="请输入视频中商品介绍"></el-input>
          <p class="require tips_warn">如果不填写默认为商品名称</p>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="描述" prop="describes">
        <!--<wangeditor >-->
          <div id="wangeditor"   >
            <div  style="text-align:left" v-html="word"></div>
          </div>
        <!-- </wangeditor> -->

      </el-form-item>
      <!-- <el-form-item>
        <el-button class="inputInfo button" type="primary" size="small" @click="changeForm('form')">修改</el-button>

      </el-form-item> -->
    </el-form>
    <div class="mask" v-if="bigImg !== ''" @click="bigImg = '' ">
        <!-- <img v-if="type !== '3'" :src="imageDomain+ bigImg" alt="" /> -->
        <video :src="bigImg"  controls></video>
      </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { shopParticulars } from "@/api/merchant";
import { getStatus } from "@/api/enter";
import E from "wangeditor";
export default {
  data() {
    return {
      token: getToken(),
      imgUrl: process.env.BASE_API + "/file/upload",
      videoUrl: process.env.BASE_API + "/file/video/upload",
      shopName: "",
      lastName: ["旗舰店", "专卖店", "专营店", ""],
      imageDomain: process.env.IMAGE_DOMAIN,
      loading: false,
      form: {
        productName: "",
        brandId: "",
        // firstType: "",
        cateGoryMap: {
          categoryName1: "",
          categoryName2: "",
          categoryName3: ""
        },
        secondType: "",
        class3Id: "",
        price: "",
        marketPrice:"",
        carriage: "",
        productItems: [{ size: "", color: "", stock: "" }],
        // sizeList : [{ size: '', color : '', stock: ''}],
        productImages: [
          { id: "", imgUrl: "" },
          { id: "", imgUrl: "" },
          { id: "", imgUrl: "" },
          { id: "", imgUrl: "" },
          { id: "", imgUrl: "" }
        ],
        video: "",
        introduce: "",
        describes: "",
        coverUrl: "",
        videoDescribe: ""
      },
      readOnly: true,
      word: "",
      editor: "", // 存放实例化的wangEditor对象，在多个方法中使用
      dataInterface: {
        editorUpImgUrl: process.env.BASE_API + "/file/multi/upload" // 编辑器插入的图片上传地址
      },
      bigImg: '',
    };
  },
  mounted() {
    this.getShop();
    this.createEditor();
  },
  methods: {
    //判断是否已有店铺
    getShop() {
      getStatus().then(res => {
        if (res.data.status === "000000000") {
          // this.hasShop = false ;
          this.loading = false;
          this.getParticulars();
          if (res.data.data.belongType === "2") {
            this.shopName =
              res.data.data.name + this.lastName[res.data.data.shopType - 0];
          } else {
            this.shopName = res.data.data.name;
          }
          return true;
        } else {
          // this.tips = res.data.message;
          // this.hasShop = true ;
        }
      });
    },
    getParticulars() {
      let id = this.$route.query.order;
      shopParticulars(id).then(res => {
        if (res.data.status === "000000000") {
          this.form = res.data.data;
        //   console.log("getParticulars", this.form);
          this.word = this.form.describes;
          if (this.form.productImages.length < 5) {
            if (this.form.productImages.length === 0) {
              this.form.productImages = [
                { id: "", imgUrl: "" },
                { id: "", imgUrl: "" },
                { id: "", imgUrl: "" },
                { id: "", imgUrl: "" },
                { id: "", imgUrl: "" }
              ];
            } else {
              for (let i = this.form.productImages.length; i < 5; i++) {
                this.form.productImages.push({ id: "", imgUrl: "" });
              }
            }
          }
        }
      });
    },
    showImg(src) {
      this.bigImg = src;
    },
    createEditor() {
      var editor = new E("#wangeditor"); //创建富文本实例

      editor.customConfig.onchange = html => {
        this.form.describes = html;
        // this.catchData(html)  //把这个html通过catchData的方法传入父组件
      };
      editor.customConfig.uploadImgServer = this.dataInterface.editorUpImgUrl;
      editor.customConfig.uploadFileName = "sourcePic";
      editor.customConfig.showLinkImg = false;
      editor.customConfig.uploadImgMaxLength = 10;
      editor.customConfig.uploadImgHeaders = {
        ContentType: "application/json",
        "yb-tryout-merchant-token": this.token //头部token
      };
      editor.customConfig.uploadImgParams = {
        token: "abcdef12345"
      };
      editor.customConfig.menus = [
        //菜单配置
        "head",
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "bold",
        "fontSize", // 字号
        "italic",
        "underline",
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        "undo", // 撤销
        "redo" // 重复
      ];
      editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {},
        success: function(xhr, editor, result) {
          this.imgUrl = Object.values(result.data.filePath).toString();
        },
        fail: function(xhr, editor, result) {},
        error: function(xhr, editor) {},
        timeout: function(xhr, editor) {},

        customInsert: function(insertImg, result, editor) {
          let url = Object.values(result.data.filePath); //result.data就是服务器返回的图片名字和链接
          // console.log(result.data.filePath,url)
          result.data.filePath.map(i => {
            // let url = Object.values(i)      //result.data就是服务器返回的图片名字和链接
            insertImg(i);
          });
          // }

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
      editor.customConfig.linkImgCallback = function(url) {
        // console.log(url) // url 即插入图片的地址
      };

      editor.create();
      // editor.txt.html(this.getData)
    }
  }
};
</script>
<style scoped lang="scss" rel="stylesheet/scss">
@import "../../../styles/new";
@import "../../../styles/goods";
.videoImg {
  width: 1.5rem;
  height: 1.5rem;
}
.uploadvideo {
  width: 1.5rem;
  height: 1.5rem;
  .mainVideo {
    width: 100%;
    height: 100%;
  }
}
</style>
