<template>
  <div class="sign-content">
    <h1 class="h_title">商品报名</h1>
    <div class="main">
      <h2>已选择报名{{ typeLabel }}商品</h2>
      <div class="itemContent" v-if="goodsId !== ''" @click="dialogVisible = true;">
        <div class="img_wrap" v-if="shop.mainImageUrl !== ''|| shop.mainImageUrl !== undefined">
          <img v-if="shop.mainImageUrl !== ''|| shop.mainImageUrl !== undefined" :src="imageDomain + shop.mainImageUrl"
               :onerror="errorImg">
          <img :src="failImg" v-else>
        </div>
        <div class="content">
          <div class="name">{{shop.productName}}</div>
          <div class="encoding">商品编码：{{shop.code}}</div>
          <div class="price">￥{{shop.price}}</div>
        </div>
      </div>
      <div class="itemContent" v-else="goodsId === ''" style="border : 0;">
        <div class="addGoods" @click="dialogVisible = true;"><svg-icon icon-class="u212"></svg-icon></div>
      </div>
      <el-form :model="form" ref="form" :rules="formRule">
        <el-form-item v-if="type === '1'" label="商品白底图：" :labelWidth="labelWidth" prop="image">
          <el-upload class="upload" :auto-upload="autoUpload" :action="imgUrl" :multiple="false"
                     v-model.trim="form.image"
                     :headers="{'yb-tryout-merchant-token':token}" :show-file-list="false"
                     :http-request="seckillBeforeImgUpload">
            <img v-if="form.image" :src="imageDomain + form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传商品白底图</span>
          </el-upload>
          <p class="require tips_warn">必须为白底图，800*800像素，JPG、JPEG格式，大小不超过1M，图片不能有文字，在{{ typeLabel }}频道展示</p>
        </el-form-item>
        <el-form-item v-else-if="type === '2'" label="商品白底图：" :labelWidth="labelWidth" prop="image">
          <el-upload class="upload" :auto-upload="autoUpload" :action="imgUrl" :multiple="false"
                     v-model.trim="form.image"
                     :headers="{'yb-tryout-merchant-token':token}" :show-file-list="false"
                     :http-request="shareBeforeImgUpload">
            <img v-if="form.image" :src="imageDomain + form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传商品白底图</span>
          </el-upload>
          <p class="require tips_warn">必须为白底图，750*285像素，JPG、JPEG格式，大小不超过1M，图片不能有文字，在{{ typeLabel }}频道展示</p>
        </el-form-item>
        <el-form-item v-else label="商品视频" :labelWidth="labelWidth" prop="video">
          <!-- <el-upload class="upload" :auto-upload="autoUpload" :action="videoUrl" :multiple="false"
                     v-model.trim="form.video"
                     :headers="{'yb-tryout-merchant-token':token}" :show-file-list="false"
                     :before-upload="beforeVideoUpload"
                      > -->

          <el-upload class="avatar-uploader uploadimg" v-model.trim="form.video" :action="videoUrl" :http-request="uploadSectionFile"
                     :headers="{'yb-tryout-merchant-token':token}" :on-change="successUpload"
                     :show-file-list="false"  >
            <video class="mainVideo avatar" v-if="form.video" :src="VideoSrc"  controls></video>
            <!-- <img v-if="form.video" :src="imageDomain + videoImg" class="avatar"> -->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="imgWarn tips_warn" v-if="goodsvideoideoWarn">请上传5-30秒商品视频</span>
          </el-upload>
          <p class="require tips_warn">视频要求：必须宣传本店铺品牌的视频，禁止含有水印广告、黄赌毒等信息,时长为5-30秒</p>
        </el-form-item>
        <el-form-item v-if="type === '3'" label="商品介绍：" :labelWidth="labelWidth" prop="introduce">
          <el-input type="textarea" v-model="form.introduce" placeholder="请输入商品介绍"></el-input>
        </el-form-item>
        <el-form-item v-if="type !== '3'" label="商品活动价格：" :labelWidth="labelWidth" prop="price">
          <el-input size="mini" type="number" v-model.number="form.price"></el-input>
          <span class="note">在特价时间内做5-8折的限时活动；<span v-if="type==='1'">低至0.9元；</span>不得高于正常售价的8折</span>
          <span class="note">备注：报名成功——活动结束，不能修改商品信息，活动期间内，价格将会锁定，不能修改价格</span>
        </el-form-item>
        <el-form-item v-if="type !== '3'" label="商品活动库存数量：" :labelWidth="labelWidth" prop="eachStock">
          <el-input  size="mini" type="number" v-model.number="form.eachStock"></el-input>
          <span class="note">报名库存数量不小于10件，且不大于当前商品库存总数量</span>
          <span class="note">备注：此活动库存数量仅为活动通过排期上线后可被买家购买的上限件数</span>
        </el-form-item>
        <el-form-item :labelWidth="labelWidth">
          <el-checkbox class="inputInfo" size="small" v-model="agree">我已阅读并同意
            <el-button type="text" @click="readRule = true">《丫贝网合作协议》</el-button>
          </el-checkbox>
        </el-form-item>
        <el-form-item :labelWidth="labelWidth">
          <el-button type="primary" @click="onSubmit('form')">提交报名</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" center :show-close="false">
      <div class="search">
        <el-input size="small" :maxlength="40" v-model.trim="search.shopName" placeholder="请输入商品名称"
                  clearable></el-input>
        <el-input size="small" :maxlength="40" v-model.trim="search.goodsCode" placeholder="请输入商品编号"
                  clearable></el-input>
        <el-button type="primary" size="mini" @click="getGoods">搜索</el-button>
      </div>
      <el-table :data="tableData"  border>
        <el-table-column prop="activityId"  width="35">
          <template slot-scope="scope">
            <el-radio v-model="goodsId" :label='scope.row.id' @change="selectShop(scope.$index,scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" >
          <template slot-scope="scope">
            <div class="itemContent">
              <div class="img_wrap" v-if="scope.row.mainImageUrl !== ''|| scope.row.mainImageUrl !== undefined">
                <img v-if="scope.row.mainImageUrl !== ''|| scope.row.mainImageUrl !== undefined" :src="imageDomain + scope.row.mainImageUrl"
                     :onerror="errorImg">
                <img :src="failImg" v-else>
              </div>
              <div class="content">
                <div class="name">{{scope.row.productName}}</div>
                <div class="encoding">商品编码：{{scope.row.code}}</div>
                <div class="price">￥{{scope.row.price}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

       </el-table>
      <div class="block2">
        <el-pagination
          @size-change="handleSubSizeChange"
          @current-change="handleSubCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 15, 20]"
          :page-size="pageSize"
          :pager-count="5"
          layout=" sizes, prev, pager, next, jumper"
          :total="totalElements">
        </el-pagination>
        <span class="totalItems">共{{ totalPages }}页，{{ totalElements }}条记录</span>

      </div>
      <div slot="footer" class="dialog-footer" >
        <p v-if="type !== '3'" class="tips_warn noteTips">活动单次报名已选择的宝贝，当前时段未报名任意特价打折活动</p>
        <el-button type="primary" size="mini" @click="chooseGoods">确认选择</el-button>
        <el-button type="text" @click="cancel">取消</el-button>
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
  </div>
</template>

<script>
import { uploadImage, uploadVideo, getVideo } from "@/api/activity";
import userPhoto from "@/assets/404_images/fail.png";
import { getToken } from "@/utils/auth";
import { int, checkFloat } from "@/utils/validate";
import {
  getSecondsList,
  addSecKill,
  addShare,
  addBrandRecommend
} from "@/api/enter";
export default {
  name: "sign-content",
  data() {
    const validPrice = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写商品" + this.typeLabel + "活动价格"));
      } else {
        if (value < 0) {
          callback(new Error("商品" + this.typeLabel + "活动价格不得小于0"));
        }
        if (!checkFloat(value)) {
          callback(
            new Error("商品" + this.typeLabel + "活动价格最多有两位小数")
          );
        }
        if (value > this.shop.price * 0.8) {
          callback(
            new Error("商品" + this.typeLabel + "活动价格不得大于当前价格的80%")
          );
        }
        callback();
      }
    };
    const validNumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写商品" + this.typeLabel + "活动数量"));
      } else {
        if (!int(value)) {
          callback(
            new Error(
              "商品" + this.typeLabel + "活动数量只能为大于等于10的整数"
            )
          );
        } else {
          if (value < 10) {
            callback(new Error("商品" + this.typeLabel + "活动数量不小于10件"));
          }
          if (value > this.goodsStock) {
            callback(
              new Error(
                "商品" + this.typeLabel + "活动数量不得大于当前库存总量"
              )
            );
          }
          callback();
        }
      }
    };
    return {
      autoUpload: true,
      imgUrl: process.env.BASE_API + "/file/upload",
      videoUrl: process.env.BASE_API + "/file/video/upload",
      VideoSrc: "",
      videoFlag: false,
      videoImg: "",
      imageDomain: process.env.IMAGE_DOMAIN,
      token: getToken(),
      errorImg: 'this.src="' + userPhoto + '"',
      failImg: userPhoto,
      typeLabel: "",
      labelWidth: "200px",
      shop: {
        mainImageUrl: "",
        productName: "",
        code: "",
        price: ""
      },

      dialogVisible: false,
      form: {
        image: "",
        price: "",
        video: "",
        introduce: "",
        eachStock: ""
      },
      //  已阅读协议
      agree: false,
      formRule: {
        image: [
          {
            required: true,
            trigger: "blur",
            message: "请上传商品白底图"
          }
        ],
        price: [
          {
            required: true,
            trigger: "blur",
            validator: validPrice
          }
        ],
        video: [
          {
            required: true,
            trigger: "blur",
            message: "请上传商品视频"
          }
        ],
        introduce: [
          {
            required: true,
            trigger: "blur",
            message: "请填写对商品的介绍"
          }
        ],
        eachStock: [
          {
            required: true,
            trigger: "blur",
            validator: validNumber
          }
        ]
      },
      //  选择
      search: {
        shopName: "",
        goodsCode: ""
      },
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
      type: "",
      goodsImgWarn: false,
      goodsvideoideoWarn: false,
      readRule: false,
      title: "",
      tableData: [],
      goodsId: "",
      goodsStock: ""
    };
  },
  mounted() {
    this.type = this.$route.query.type;
    if (this.type === "1") {
      this.title = "选择秒杀活动报名商品";
      this.typeLabel = "秒杀";
    } else if (this.type === "2") {
      this.title = "选择分享购活动报名商品";
      this.typeLabel = "分享购";
    } else if (this.type === "3") {
      this.title = "选择品牌推荐活动报名商品";
      this.typeLabel = "品牌推荐";
    }
    this.getGoods();
  },
  methods: {
    getGoods() {
      let formData = new FormData();
      formData.append("EQ_code", this.search.goodsCode);
      formData.append("LIKE_productName", this.search.shopName);
      formData.append("currentPage", this.currentPage);
      formData.append("pageSize", this.pageSize);

      getSecondsList(formData).then(res => {
        if (res.data.status === "000000000") {
          this.tableData = res.data.data;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalElements;
        }
      });
    },
    //选择商品
    selectShop(index, item) {
      this.shop = item;
      this.goodsId = item.id;
      this.goodsStock = item.quantity;
    },
    //确认选择活动商品
    chooseGoods() {
      // this.goodsId
      if (this.goodsId === "") {
        this.$message({
          message: "请选择活动商品",
          type: "error",
          center: true
        });
      } else {
        this.dialogVisible = false;
      }
    },
    cancel() {
      this.dialogVisible = false;
      this.goodsId = "";
      this.search = {
        shopName: "",
        goodsCode: ""
      };
      this.currentPage = 1;
      this.pageSize = 10;
    },
    //提交表单
    onSubmit(formName) {
      if (this.type !== "3") {
        if (this.form.image === "") {
          this.goodsImgWarn = true;
          return false;
        }
      } else {
        if (this.form.video === "") {
          this.goodsvideoideoWarn = true;
          return false;
        }
      }

      // console.log(this.goodsId);
      if (this.goodsId === "") {
        this.$message({
          message: "请选择活动商品",
          type: "error",
          center: true
        });
        return false;
      }
      //  0.9秒杀 和  分享购
      if (this.type !== "3") {
        this.$refs[formName].validate(valid => {
          if (valid && !this.goodsImgWarn && this.goodsId !== "") {
            if (!this.agree) {
              this.$message({
                message: "请先阅读并同意《丫贝网合作协议》",
                type: "error",
                center: true
              });
              return false;
            } else {
              let timeObj = this.$store.state.signUp.secondKill;

              if (this.type === "1") {
                let data = {
                  ...this.form,
                  productId: this.goodsId,
                  ...timeObj,
                  status: ""
                };
                // console.log(data);
                addSecKill(data).then(res => {
                  if (res.data.status === "000000000") {
                    this.$message({
                      message: "您已成功报名秒杀活动，请稍后查看",
                      type: "success",
                      center: true
                    });
                    this.$emit("getContent", "success");
                  }
                });
              } else if (this.type === "2") {
                let shareData = {
                  image: this.form.image,
                  price: this.form.price,
                  stock: this.form.eachStock,
                  startTime: timeObj.startDate + " 00:00:00",
                  endTime: timeObj.endDate + " 23:59:59",
                  productId: this.goodsId,
                  status: ""
                };
                addShare(shareData).then(res => {
                  if (res.data.status === "000000000") {
                    this.$message({
                      message: "您已成功报名分享购活动，请稍后查看",
                      type: "success",
                      center: true
                    });
                    this.$emit("getContent", "success");
                  }
                });
              }
            }
          }
        });
      } else {
        // 品牌推荐
        this.$refs[formName].validate(valid => {
          if (valid && !this.goodsvideoideoWarn && this.goodsId !== "") {
            if (valid && this.goodsId !== "") {
              if (!this.agree) {
                this.$message({
                  message: "请先阅读并同意《丫贝网合作协议》",
                  type: "error",
                  center: true
                });
                return false;
              } else {
                let timeObj = this.$store.state.signUp.secondKill;
                let shareData = {
                  videoId: this.form.video,
                  videoDescribe: this.form.introduce,
                  startTime: timeObj.startSevenDay + " 00:00:00",
                  endTime: timeObj.endSevenDay + " 23:59:59",
                  productId: this.goodsId
                };
                addBrandRecommend(shareData).then(res => {
                  if (res.data.status === "000000000") {
                    this.$message({
                      message: "您已成功报名品牌推荐活动，请稍后查看",
                      type: "success",
                      center: true
                    });
                    this.$emit("getContent", "success");
                  }
                });
              }
            }
          }
        });
      }
    },

    // 上传图片
    seckillBeforeImgUpload(file) {
      let reader = new FileReader();
      let ret = [];
      let _this = this;
      const isImg = file.file.type === "image/jpeg" || file.file.type === "image/png";
      const isLt1M = file.file.size / 1024 / 1024 < 1;

      reader.onload = e => {
        let image = new Image();
        image.onload = function() {
          const isHeight = this.height;
          const isWidth = this.width;
          if (isWidth > 800 || isHeight > 800) {
            _this.$message.error("图片尺寸过大，请重新选择后上传");
            return false;
          } else if (!isImg) {
            _this.$message.error("图片必须为jpg或者png格式，请重新选择后上传");
            return false;
          } else if (!isLt1M) {
            _this.$message.error("图片大小不能超过1MB，请重新选择后上传");
            return false;
          } else {
            let formData = new FormData();
            formData.append("image", file.file);
            uploadImage(formData)
              .then(res => {
                if (res.data.status === "000000000") {
                  _this.form.image = res.data.data.fileName;
                  _this.goodsImgWarn = false;
                } else {
                  _this.goodsImgWarn = true;
                }
              })
              .catch(err => {
                // console.log(err) ;
                _this.goodsImgWarn = true;
              });
          }
        };

        image.src = e.target.result;
      };
      reader.readAsDataURL(file.file);
    },
    shareBeforeImgUpload(file) {
      let reader = new FileReader();
      let ret = [];
      let _this = this;

      const isImg = file.file.type === "image/jpeg" || file.file.type === "image/png";
      const isLt1M = file.file.size / 1024 / 1024 < 1;

      reader.onload = e => {
        let image = new Image();
        image.onload = function() {
          const isHeight = this.height;
          const isWidth = this.width;
          if (isWidth > 750 || isHeight > 285) {
            _this.$message.error("图片尺寸过大，请重新选择后上传");
            return false;
          } else if (!isImg) {
            _this.$message.error("图片必须为jpg或者png格式，请重新选择后上传");
            return false;
          } else if (!isLt1M) {
            _this.$message.error("图片大小不能超过1MB，请重新选择后上传");
            return false;
          } else {
            let formData = new FormData();
            formData.append("image", file.file);
            uploadImage(formData)
              .then(res => {
                if (res.data.status === "000000000") {
                  _this.form.image = res.data.data.fileName;
                  _this.goodsImgWarn = false;
                } else {
                  _this.goodsImgWarn = true;
                }
              })
              .catch(err => {
                // console.log(err) ;
                _this.goodsImgWarn = true;
              });
          }
        };

        image.src = e.target.result;
      };
      reader.readAsDataURL(file.file);
    },
    //上传视频
    uploadSectionFile(file) {
      // console.log("file", file);
      let _this = this;
      const isLt20M = file.file.size / 1024 / 1024 < 20;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt20M) {
        this.$message.error("上传视频大小不能超过20MB哦!");
        return false;
      } else {
        let formData = new FormData();
        formData.append("video", file.file);
        uploadVideo(formData)
          .then(res => {
            // console.log("视频id", res);
            if (res.status === 200) {
              _this.form.video = res.data.data.videoId;
              _this.goodsvideoideoWarn = false;
            } else {
              _this.goodsvideoideoWarn = true;
            }
          })
          .catch(err => {
            // console.log(err) ;
            _this.goodsvideoideoWarn = true;
          });
      }
      // this.videoUrl = file.url;
    },
    successUpload(file, fileList) {
      // console.log('successUpload',file)
      this.VideoSrc = file.url;
    },
    handleSubSizeChange(val) {
      this.pageSize = val;
      this.getGoods();
    },
    handleSubCurrentChange(val) {
      this.currentPage = val;
      this.getGoods();
    }
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.sign-content {
  padding: 0.2rem;
  width: 100%;
  box-sizing: border-box;
  color: #333;
  .main {
    margin-top: 0.4rem;
    width: 100%;
    padding: 0 0.8rem;
    box-sizing: border-box;
    h2 {
      font-size: 0.2rem;
      line-height: 1rem;
    }

    .el-form {
      .el-form-item {
        width: 90%;
        margin-bottom: 0.3rem;
        .el-upload {
          width: 50%;
          display: inline-block;
          vertical-align: bottom;
          // float : left;

          img {
            max-width: 100%;
            max-height: 100%;
          }
          .imgWarn {
            position: absolute;
            top: 80%;
            left: 0;
            display: inline;
            font-size: 0.12rem;
          }
          .mainVideo {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .el-input {
          width: 30%;
        }
        .el-textarea {
          width: 30%;
        }
        .tips_warn,
        .note {
          float: right;
          text-align: right;
        }
        .note {
          font-size: 0.12rem;
          line-height: 0.3rem;
          display: inline-block;
          color: #aaa;
          margin-left: 0.2rem;
        }
        /*.note:nth-child(3){*/
        /*margin-top : 0.4rem ;*/
        /*}*/

        .require {
          display: inline-block;
          width: 70%;
        }
      }
    }
  }
  .search {
    width: 100%;
    padding-bottom: 0.2rem;
    height: 50px;
    // border-bottom : 1px solid #aaa ;
    margin-bottom: 0.3rem;
    .el-input {
      width: 30%;
      margin: 0 0.2rem 0.2rem 0;
      float: left;
    }
    .el-button {
      width: 65px;
      margin-bottom: 0.2rem;
      margin-left: 20px;
      float: left;
    }
  }
  .itemContent {
    margin: 0.5rem 200px;
    width: 80%;
    display: flex;
    flex-direction: row;
    border: 1px solid #aaa;
    padding: 0.2rem;
    .img_wrap {
      width: 1rem;
      height: 1rem;
      display: block;
      margin: auto;
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
    .content {
      /*width: 200px;*/
      flex: 1;
      margin-left: 0.3rem;
      text-align: left;
      .name,
      .encoding,
      .price {
        font-size: 0.18rem;
        line-height: 0.3rem;
      }
    }
    .addGoods {
      width: 1rem;
      height: 1rem;

      .svg-icon {
        width: 100%;
        height: 100%;
      }
    }
  }

  .el-table {
    border-radius: 0.05rem;
    border-color: #aaa;
    margin-bottom: 0.3rem;
    .itemContent {
      margin: 0 auto !important;
      border: 0;
      padding: 0;
      .content {
        margin-bottom: 0 !important;
      }
    }
  }

  .top {
    line-height: 30px;
    width: 70%;
    background-color: #ccc;
    padding-left: 30px;
  }
  .shopName {
    width: 100%;
  }
  .block2 {
    padding: 0 0.3rem;
    width: 90%;
    margin: 0 auto;
    box-sizing: border-box;
    .totalItems {
      display: block;
      height: 0.3rem;
      color: #666;
      text-align: right;
      margin-top: 0.3rem;
    }
  }
  .dialog-footer {
    text-align: center;

    .noteTips {
      margin-bottom: 0.3rem;
      text-align: center;
    }
  }
  .ruleImg {
    width: 90% !important ;
    margin: auto;
    display: block;
  }
}
</style>
