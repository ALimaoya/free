<template>
    <div class="groupRemind step" v-loading="loading"  element-loading-text="拼命加载中">
        <el-form :model="form" ref="form" :rules="formRule" >
            <p class="title">第一步：填写活动信息</p>
            <el-form-item label="活动类型："  :labelWidth="labelWidth" prop="platformType">
                <el-radio-group v-model="form.platformType" :disabled="read" >
                    <el-radio label="4">开团提醒</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="商品来源：" :labelWidth="labelWidth" prop="activityType" >
                <el-radio-group :disabled="read" v-model="form.activityType"  @change="resetSearch(form.activityType,'change')">
                    <el-radio  v-for="(item,index) in platForm"   :key="index" :label="item.id" >{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-col :span="8">
                <el-form-item  label="活动场次：" :labelWidth="labelWidth" prop="receiveData">
                  <el-date-picker class="date-picker"
                      v-model="form.receiveData"
                      type="date"
                      placeholder="请选择活动日期"
                      value-format="yyyy-MM-dd"
                      :picker-options="receiveEndData"
                      :disabled="read" size="small"
                      @change="setReceiveData(form.receiveData)">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="receiveTime">
                  <el-select v-model="form.receiveTime" placeholder="请选择活动时间段" size="small" @change="selectReceiveTime()" :disabled="read">
                      <el-option
                      v-for="item in timeFragment"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <p class="remark">备注：试客会根据此活动场次自行前往查找设置开团提醒</p>
            <p class="title">第二步：选择目标推广宝贝</p>
            <el-form-item label="选择店铺：" :labelWidth="labelWidth" prop="shopId">
                <el-select :disabled="readShop" v-model="form.shopId"  placeholder="请选择店铺" size="small" >
                    <el-option  v-for="(item,index) in shopOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <span v-if="form.shopId==='没有可选店铺'" class="tips" style="color : #f56c6c">该平台下未绑定店铺或绑定店铺未审核通过，请在店铺绑定并审核通过后再进行活动发布</span>
            </el-form-item>
            <el-form-item label="商品链接：" :labelWidth="labelWidth" prop="productUrl">
                <el-input :readonly="readIpt" size="small" v-model.trim="form.productUrl" placeholder="请输入内容" @change="getGoodsDetail(form.activityType,form.productUrl)"></el-input>
                <span class="tips"><img src="../../../assets/imgs/tips3.png" />平台会根据您填写的商品链接抓取宝贝信息，试客无法看到此链接</span>
            </el-form-item>
            <el-form-item label="宝贝主图：" :labelWidth="labelWidth">
                <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.mainImageUrl"
                            :on-success="handleGoodsSuccess"   :show-file-list="false"  :http-request="beforeMainUpload"
                            :headers="{ 'Content-Type': 'multipart/form-data','yb-tryout-merchant-token':token}">
                    <img v-if="mainImg"  :src="mainImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <span class="imgWarn tips_warn" v-if="goodsImgWarn">请上传宝贝主图</span>
                </el-upload>
                <ul class="require">
                    <span>宝贝主图要求：</span>
                    <li>目标商品搜索结果页展示的主图</li>
                    <li>(淘宝展示主图)</li>
                    <li>尺寸要求<span class="tips_warn">（800*800）</span></li>
                </ul>
            </el-form-item>
            <el-form-item label="商品价格：" :labelWidth="labelWidth" prop="buyProductAmount">
                <el-input class="any" size="small" :maxlength="10" type="number" :readonly="readonly" v-model.number="form.buyProductAmount" placeholder="请输入内容" ></el-input>元
            </el-form-item>
            <p class="title">第三步：设置投放信息</p>
            <el-form-item label="投放数量：" :labelWidth="labelWidth" prop="tryoutQuantity">
                <el-input class="any" size="small" :maxlength="10" type="number" :readonly="readonly" v-model.number="form.tryoutQuantity" placeholder="请输入内容" ></el-input><span>个</span><span>&nbsp;&nbsp; {{fee}}元/个</span>
            </el-form-item>
            <el-form-item  size="small" label="任务开始时间：" :labelWidth="labelWidth" prop="activityStartTime" >
                <el-date-picker
                    v-model="form.activityStartTime"
                    type="datetime"
                    placeholder="请选择活动日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="read"
                    :picker-options="receiveEndData"
                    @change="getActivityStartTime(form.activityStartTime)">
                </el-date-picker>
            </el-form-item>
            <p class="remark">备注：若到达活动场次开始时间，本任务还未完成，则会自动下架</p>
            <div class="situation">投放情况：</div>
            <el-form-item>
              <table border="1" bordercolor="#dcdfe6">
                <tr>
                  <td>基础佣金</td>
                  <td>投放数量</td>
                  <td>合计</td>
                </tr>
                <tr>
                  <td>开团提醒{{ fee }}元/个</td>
                  <td v-if="form.tryoutQuantity">{{ form.tryoutQuantity }}单</td>
                  <td v-else></td>
                  <td style="color:red">{{ (form.tryoutQuantity * fee).toFixed(2)}} 元</td>
                </tr>
              </table>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="primary" v-if="editor==='1'" @click="onSubmit('form',2)">修改活动</el-button>
            <el-button type="info" v-else-if="editor==='2'" @click="goTryout">返回开团提醒任务管理</el-button>
            <el-button type="primary" @click="onSubmit('form',1)" v-else>提交活动</el-button>
          </el-form-item>
        </el-form>
        <el-dialog  title="提示" top="20%" :visible.sync="activityVisible" width="30%" center
                  :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
          <p>您还没有绑定店铺，请先前往绑定店铺</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="goNewShop">绑定新店铺</el-button>
          </span>
        </el-dialog>
        <el-dialog  title="提示" top="20%" :visible.sync="vipVisible" width="30%" center
                  :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
          <p>您还不是会员，请先前往购买会员</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="buyVip">购买会员</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import { validateURL, getQueryString, checkFloat, int } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import {
  uploadImage,
  getJDetail,
  getGroupDetail,
  changeGroupDetail
} from "@/api/activity";
import { getMember } from "@/api/userInfor";
import { shopList } from "@/api/shop";
import {
  getShopList,
  publishGroupActivity,
  searchTypeList,
  getServiceFee
} from "@/api/activity";
export default {
  data() {
    const validShop = (rule, value, callback) => {
      if (value === "" || value === "没有可选店铺") {
        callback(new Error("请选择店铺"));
      }
      callback();
    };
    const validLink = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写商品链接"));
      } else {
        if (!validateURL(value)) {
          callback(new Error("请填写正确格式的商品链接"));
        } else {
          callback();
        }
      }
    };
    const validMoney = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写下单价格"));
      } else {
        if (value < 0) {
          callback(new Error("下单价格不能小于0，请重新填写下单价格"));
        }
        if (value > 9999999) {
          callback(new Error("下单价格不能超过9999999"));
        }
        if (!checkFloat(value)) {
          callback(new Error("输入的小数不能超过两位，请重新输入"));
        }

        callback();
      }
    };
    const validPutNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写投放数量"));
      } else {
        if (value < 1) {
          callback(new Error("投放数量不能小于1，请重新填写投放数量"));
        }
        if (value > 9999999) {
          callback(new Error("投放数量不能超过9999999"));
        }
        if (!int(value)) {
          callback(new Error("输入的数量必须为整数"));
        }

        callback();
      }
    };
    return {
      //处理当前时间之前的不能选择
      receiveEndData: this.endDate(),
      loading: false,
      read: false, //查看活动详情时禁止选择
      readShop: false,
      readIpt: false, //查看活动详情时禁止输入
      autoUpload: true,
      readonly: false, //付款后及查看活动详情时不能修改的值
      labelWidth: "140px",
      form: {
        platformType: "4",
        activityType: "5",
        receiveData: "",
        receiveTime: "",
        shopId: "",
        productUrl: "",
        mainImageUrl: "",
        buyProductAmount: "",
        tryoutQuantity: "",
        activityStartTime: "",
        productName: "",
        productDetail: "",
        activityTitle: "开团提醒",
        productId: ""
      },
      formRule: {
        receiveData: [
          { required: true, message: "请选择活动日期", trigger: "change" }
        ],
        receiveTime: [
          { required: true, message: "请选择活动时间段", trigger: "change" }
        ],
        shopId: [
          {
            required: true,
            validator: validShop,
            trigger: "change"
          }
        ],
        productUrl: [
          {
            required: true,
            validator: validLink,
            trigger: "blur"
          }
        ],
        buyProductAmount: [
          {
            required: true,
            validator: validMoney,
            trigger: "blur"
          }
        ],
        tryoutQuantity: [
          {
            required: true,
            validator: validPutNum,
            trigger: "blur"
          }
        ],
        activityStartTime: [
          { required: true, message: "请选择活动开始时间", trigger: "change" }
        ]
      },
      platForm: [
        {
          name: "淘抢购",
          id: "5"
        },
        {
          name: "聚划算",
          id: "6"
        },
        {
          name: "京东秒杀",
          id: "7"
        }
      ],
      timeFragment: [],
      shopOptions: [],
      imgUrl: process.env.BASE_API + "/file/upload", // 上传图片的域名
      token: getToken(),
      imageDomain: process.env.IMAGE_DOMAIN, //获取图片的外链域名
      mainImg: "",
      goodsImgWarn: false,
      editor: "",
      activityVisible: false,
      vipVisible: false,
      fee: ""
    };
  },
  mounted() {
    shopList().then(res => {
      this.loading = false;
      //获取用户是否已绑定店铺
      if (res.data.data.length) {
        getMember().then(res => {
          //判断用户是否是会员身份
          if (res.data.status === "000000000") {
            if (res.data.data.vipLevel * 1) {
              // if(this.$route.query.order !== undefined ) {
              //判断活动是新建还是已存在活动
              this.activityDetail();
            } else {
              this.vipVisible = true;
            }
          }
        });
      } else {
        this.activityVisible = true;
      }
    });
  },
  methods: {
    //  活动时间必须选择当前时间之后的
    getActivityStartTime(val) {
      if (val !== null && val !== "" && val !== undefined) {
        let valTime = new Date(val.replace(/-/g, "/")).getTime();
        let nowTime = new Date().getTime();
        if (valTime < nowTime-2*60*1000) {
          this.$message({
            message: "你选择的时间必须晚于当前时间",
            type: "error",
            center: true
          });
          this.form.activityStartTime = "";
          return false;
        }
      }
    },
    setReceiveData(val) {
      this.$forceUpdate();
    },
    //判断是新建活动还是已存在活动
    activityDetail() {
      this.editor = this.$route.query.editor;
      let order = this.$route.query.order;
      //存在的活动
      if (order !== undefined) {
        this.order = order;
        //获取活动详情
        this.loading = true;
        getGroupDetail(order).then(res => {
          this.loading = false;
          if (res.data.status === "000000000") {
            // console.log("res", res.data.data);
            let activityEndTime = res.data.data.activityEndTime;
            this.form = { ...res.data.data };
            this.form.platformType = "4";
            this.form.receiveData = activityEndTime.split(" ")[0];
            this.form.receiveTime = activityEndTime.split(" ")[1];

            //判断活动是否已支付
            if (this.$route.query.payStatus === "1") {
              this.readonly = true;
            }
            //已存在活动相关操作
            this.activityStatus();
          }
        });
      } else {
        this.resetSearch("5");
      }
      this.getFee();
    },
    //已存在的活动相关操作
    activityStatus() {
      if (this.form.activityId !== "") {
        // let num = 0;
        this.resetSearch(this.form.activityType);
        this.getType(this.form.activityType);
        this.mainImg = this.imageDomain + this.form.mainImageUrl;

        //判断活动编辑状态
        this.editorStatus();
      } else {
        this.form.activityStartTime = "";
      }
    },
    //判断活动编辑状态
    editorStatus() {
      //  如果是新数据  要调用增值服务选择
      if (this.editor !== undefined) {
        //查看活动，该状态下活动内容均不能进行编辑
        if (this.editor === "2") {
          this.read = "disabled";
          this.readShop = "disabled";
          this.readonly = true;
          this.readIpt = true;
          this.readonlyKey = "disabled";
          this.autoUpload = false;
          this.checkBrowse = true;
        }

        // this.form.tryoutQuantity = num;
        // this.totalNum = num;
        // this.dayNum = this.goodsAmount.length;
        // this.form['startTime'] = parseTime(new Date(this.form.activityStartTime.replace(/-/g,"/")).getTime() + 2*24*3600*1000) ;
        // this.serviceType =  this.form.addServiceTypes.split(',');
      } else {
        this.form.activityStartTime = "";
      }
    },
    //获取平台类型
    getType(value) {
      searchTypeList(value).then(res => {
        if (res.data.status === "000000000") {
          this.searchOptions = res.data.data;
        }
      });
    },
    //  选择商品来源获取活动场次   获取对应平台店铺列表
    resetSearch(value, change) {
      if (change === "change") {
        this.form.shopId = "";
        this.form.productUrl = "";
        this.form.receiveTime = "";
        this.form.receiveData = "";
      }
      if (value === "6") {
        this.timeFragment = [];
        this.timeFragment = [
          { value: "00:00:00" },
          { value: "10:00:00" },
          { value: "20:00:00" }
        ];
      } else if (value === "7") {
        this.timeFragment = [];
        this.timeFragment = [
          { value: "00:00:00" },
          { value: "06:00:00" },
          { value: "08:00:00" },
          { value: "10:00:00" },
          { value: "12:00:00" },
          { value: "14:00:00" },
          { value: "16:00:00" },
          { value: "18:00:00" },
          { value: "20:00:00" },
          { value: "22:00:00" }
        ];
      } else if (value === "5") {
        this.timeFragment = [];
        this.timeFragment = [
          { value: "00:00:00" },
          { value: "08:00:00" },
          { value: "10:00:00" },
          { value: "11:00:00" },
          { value: "12:00:00" },
          { value: "13:00:00" },
          { value: "14:00:00" },
          { value: "15:00:00" },
          { value: "17:00:00" },
          { value: "19:00:00" },
          { value: "21:00:00" },
          { value: "22:00:00" },
          { value: "23:00:00" }
        ];
      }
      let num = "";
      this.shopOptions = [];

      if(value === "5"){
        num = "1";
        this.shopList('2');

      }else if(value === "6"){
        num = "2"
      }else if(value === "7"){
        num = "3"

      }
      this.shopList(num);
    },
    shopList(num){
      getShopList(num).then(res => {
        if (res.data.status === "000000000") {
          this.shopOptions = this.shopOptions.concat(res.data.data);
          if (this.shopOptions.length) {
            if (this.editor !== "2") {
              this.readShop = false;
            }
            if (this.form.shopId !== "") {
              let arr = [];
              this.shopOptions.forEach(i => {
                arr.push(i.id);
              });
              if (arr.indexOf(this.form.shopId) === -1) {
                this.form.shopId = "";
              }
            }
          } else {
            this.readShop = "disabled";
            this.form.shopId = "没有可选店铺";
          }
        }
      })
    },
    //获取商品详情
    getGoodsDetail(type, url) {
      this.form.productId = "";
      this.goPlatform(type, url);
    },
    goPlatform(type, url) {
      let that = this;

      if (type === "7") {
        let id = "";
        if (url.indexOf('item.m.jd.com') !==-1 || url.indexOf('item.jd.com') !==-1) {
          if (url.indexOf("product") !== -1) {
            id = url.split("product/")[1];
          } else {
            id = url.split("com/")[1];
          }
          id = id.split(".")[0];
        } else {
          this.$message({
            message: "您输入的商品链接有误，请重新输入",
            center: "true",
            type: "error"
          })
        }

        getJDetail(id).then(res => {
          if (res.data.status === "000000000") {
            that.form.productName = res.data.data.productName;
            that.form.productDetail = res.data.data.productDetail;
            that.form.productId = res.data.data.productId;
            // this.submitDetail(index,form);

            return true;
          } else {
            that.form.productUrl = "";
            that.form.productId = "";
          }
        });
      } else {
        if (url.indexOf("?") !== -1) {
          const num = getQueryString(url, "id");
          if (num === undefined) {
            this.$message({
              message: "您输入的商品链接有误，请重新输入",
              center: "true",
              type: "error"
            });
            this.form.productUrl = "";
            return false;
          }
          this.form.productId = num;
          // let params = {'item_num_id': num };
          let _this = this,
            params = {
              jsv: "2.4.11",
              timeout: "20000",
              api: "mtop.taobao.detail.getdesc",
              v: "6.0",
              // H5Request: true,
              type: "jsonp",
              dataType: "jsonp",
              data: JSON.stringify({ id: num, type: "0" })
            };
          $.ajax({
            url: "http://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/",
            data: params,
            dataType: "jsonp",
            success: function(data) {
              if (data["ret"][0] === "SUCCESS::调用成功") {
                let arr = [];
                data.data.wdescContent.pages.map(i => {
                  i = i.split("//")[1].slice(0, -6);
                  arr.push("https://" + i);
                });
                _this.form.productDetail = JSON.stringify(arr);
              } else {
                alert("服务器开小差啦，请稍等~");
              }
            }
          });
          let infoParams = {
            jsv: "2.4.8",
            t: new Date().getTime(),
            api: "mtop.taobao.detail.getdetail",
            v: "6.0",
            H5Request: true,
            type: "jsonp",
            dataType: "jsonp",
            data: JSON.stringify({ exParams: { id: num, itemNumId: num } })
          };
          $.ajax({
            url:
              "https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/",
            data: infoParams,
            dataType: "jsonp",
            success: function(data) {
              if (data["ret"][0] === "SUCCESS::调用成功") {
                let _data = data.data;
                _this.form.productName = _data.item.title;
              } else {
                alert("服务器开小差啦，请稍等~");
              }
            }
          });
        } else {
          this.$message({
            message: "请重新输入对应平台的商品链接",
            center: true,
            type: "error"
          });
          this.form.productUrl = "";
          this.form.productId = "";
        }
        if (type === "5") {
          if ( url.indexOf("u_channel=qianggou") === -1) {
            this.$message({
              message: "请重新输入对应平台的商品链接",
              center: true,
              type: "error"
            });
            this.form.productUrl = "";
            this.form.productId = "";

            return false;
          }
        } else {
          if (type === "6") {
            if (url.indexOf('tracelog=jubuybigpic')=== -1) {
              this.$message({
                message: "请重新输入对应平台的商品链接",
                center: true,
                type: "error"
              });
              this.form.productUrl = "";
              this.form.productId = "";

              return false;
            }
          }
        }
      }
      // console.log(this.form.productDetail,this.form.productName);
    },
    //获取开团提醒服务费用
    getFee() {
      getServiceFee().then(res => {
        if (res.data.status === "000000000") {
          this.fee = res.data.data.remindService;
        }
      });
    },
    //上传商品主图
    handleGoodsSuccess(res, file) {
      // this.form.mainImageUrl = URL.createObjectURL(file.raw);
      // this.$refs.mainImageUrl.resetFields();
    },
    //判断需要上传的图片的尺寸
    beforeMainUpload(file) {
      let reader = new FileReader();
      let ret = [];
      let _this = this;
      reader.onload = e => {
        let image = new Image();
        image.onload = function() {
          const isHeight = this.height;
          const isWidth = this.width;
          if (isWidth > 800 || isHeight > 800) {
            _this.$message.error("图片尺寸过大，请重新选择后上传");
            return false;
          } else {
            let formData = new FormData();
            formData.append("image", file.file);
            uploadImage(formData)
              .then(res => {
                if (res.data.status === "000000000") {
                  _this.mainImg = res.data.data.filePath;
                  _this.form.mainImageUrl = res.data.data.fileName;
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
    //提交试用信息
    onSubmit(formName, index) {
      // console.log("formName", formName, "index", index);
      if (
        this.form.mainImageUrl === undefined ||
        this.form.mainImageUrl === ""
      ) {
        this.goodsImgWarn = true;
      } else {
        this.goodsImgWarn = false;
      }
      // this.hasWarn();
      this.$refs[formName].validate(valid => {
        if (valid && !this.goodsImgWarn) {
          let activityTime = (
            this.form.receiveData +
            " " +
            this.form.receiveTime
          ).replace(/-/g, "/");
          activityTime = new Date(activityTime).getTime();
          if (activityTime < Date.now()) {
            this.$message({
              message: "你选择的活动场次已经过期，请重新选择",
              type: "error",
              center: true
            });
            return false;
          }
          let taskTime = this.form.activityStartTime.replace(/-/g, "/");
          taskTime = new Date(taskTime).getTime();
          if (activityTime - taskTime < 0.5 * 60 * 60 * 1000) {
            this.$message({

              message: "任务开始时间必须早于活动场次时间半小时，请重新选择",
              type: "error",
              center: true
            });
            return false;
          }
          // this.form.productId = '' ;
          this.goPlatform(this.form.activityType, this.form.productUrl);
          this.submitDetail(index, this.form);
        } else {
          this.$message({
            type: "error",
            message: "提交失败，请重新确认信息",
            center: true
          });
          return false;
        }
      });

      // }
    },
    // 提交活动信息
    submitDetail(index, form) {
      if (index === 1) {
        this.loading = true;
        let formData = Object.assign({}, form);
        formData["activityEndTime"] =
          this.form.receiveData + " " + this.form.receiveTime;
        formData["searchKeyword"] =
          this.form.receiveData + " " + this.form.receiveTime;
        delete formData.receiveData;
        delete formData.receiveTime;
        delete formData.platformType;
        publishGroupActivity(formData).then(res => {
          this.loading = false;
          if (res.data.status === "000000000") {
            this.$message({
              type: "success",
              message: "提交成功",
              center: true,
              duration: 500
            });
            this.$router.push({
              name: "GroupPay",
              params: { id: res.data.data.activityId }
            });
          }
        });
      } else {
        if (index === 2) {
          this.loading = true;
          let formData = Object.assign({}, form);
          formData["activityEndTime"] =
            this.form.receiveData + " " + this.form.receiveTime;
          formData["searchKeyword"] =
            this.form.receiveData + " " + this.form.receiveTime;
          delete formData.receiveData;
          delete formData.receiveTime;
          delete formData.platformType;
          changeGroupDetail(formData).then(res => {
            this.loading = false;
            if (res.data.status === "000000000") {
              this.$message({
                type: "success",
                message: "提交成功",
                center: true,
                duration: 500
              });
              this.$router.push({
                name: "GroupPay",
                params: { id: this.order }
              });
            }
          });
        }
      }
    },
    //处理当前时间之前的不能选择
    endDate() {
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      };
    },
    //  选择时间段不能时
    selectReceiveTime() {
      let activityTime = (
        this.form.receiveData +
        " " +
        this.form.receiveTime
      ).replace(/-/g, "/");
      activityTime = new Date(activityTime).getTime();
      if (activityTime < Date.now()) {
        this.$message({
          message: "你选择的活动场次已经过期，请重新选择",
          type: "error",
          center: true
        });
      }
      this.$forceUpdate();
    },
    //绑定店铺
    goNewShop() {
      this.$router.push("/freeManage/newshop");
    },
    //  购买会员
    buyVip() {
      this.$router.push("/freeManage/userInfor/buyVip");
    },
    // 跳转到试用管理
    goTryout() {
      this.$router.push("/freeManage/activity/group");
    }
  }
};
</script>
<style scoped lang="scss" rel="stylesheet/scss">
@import "src/styles/tryout";
.date-picker {
  width: 3rem !important;
  margin-right: 0.2rem;
}
.remark {
  margin-left: 140px;
  margin-bottom: 0.2rem;
  color: #333;
}

</style>