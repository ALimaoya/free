<template>
  <div class="step">
    <el-form :model="form" ref="form" :rules="formRule">
      <p class="title">第一步：填写活动信息</p>
       <el-form-item label="活动类型：" labelWidth="1.3rem">
         <el-radio-group v-model="type">
           <el-radio  label="1">超级试用</el-radio>
           <el-radio  label="2" disabled>折扣试用（待开放）</el-radio>
         </el-radio-group>
       </el-form-item>
      <el-form-item label="商品来源：" labelWidth="1.3rem" prop="platformType" >
        <el-radio-group v-model="form.platformType"  @change="resetSearch(form.platformType,'change')">
          <el-radio  v-for="(item,index) in platForm"   :key="index" :label="item.id" >{{ item.name }}</el-radio>
          <!--<el-radio  label="2">天猫</el-radio>-->
          <!--<el-radio  label="3">京东</el-radio>-->
          <!--<el-radio  label="4">拼多多</el-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="领取时间：" labelWidth="1.3rem" prop="receiveHours">
        <el-radio v-model="form.receiveHours+''" label="24">24小时内</el-radio>
        <span class="tips">（试客获得资格后会在24小时内下单领取，逾期将终止试用。）</span>
      </el-form-item>
      <p class="title">第二步：填写试用品展示信息</p>
      <el-form-item label="活动标题：" class="activity" labelWidth="1.3rem" prop="activityTitle">
        <el-input placeholder="请输入内容" size="small" type="text" v-model.trim="form.activityTitle" ></el-input>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>写明赠品的数量、规格、属性等，不要复制淘宝商品标题</span>
      </el-form-item>
      <el-form-item label="试用品类型：" labelWidth="1.3rem" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择商品类型" size="small">
          <el-option
            v-for="(item ,index) in options"
            :label="item.name" :key="index"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试用品展示图：" labelWidth="1.3rem" prop="showImageUrl">
        <el-upload class="upload"  :action="imgUrl" :show-file-list="false" v-model.trim="form.showImageUrl"
          :on-success="handleShowSuccess" :before-upload="beforeShowUpload" :headers="{ 'Content-Type': 'multipart/form-data'}">
          <img v-if="showImg"  :src="showImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <span class="imgWarn" v-if="showImgWarn">请上传试用品展示图</span>
        </el-upload>
        <ul class="require">
          <span>展示图要求：</span>
          <li>商品清晰图片即可</li>
          <li>不能出现图片留白、拼接、水印、logo、及其他文字</li>
          <li>800*800以内的正方形</li>
        </ul>
      </el-form-item>
      <p class="title">第三步：选择目标推广宝贝</p>
      <el-form-item label="选择店铺：" labelWidth="1.3rem" prop="shopId">
        <el-select v-model="form.shopId"  placeholder="请选择店铺" size="small" >
          <el-option  v-for="(item,index) in shopOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品链接：" labelWidth="1.3rem" prop="productUrl">
        <el-input size="small" v-model.trim="form.productUrl" placeholder="请输入内容" @blur="getGoodsDetail(form.platformType ,form.productUrl)"></el-input>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>平台会根据您填写的商品链接抓取宝贝信息，试客无法看到此链接</span>
      </el-form-item>
      <el-form-item label="宝贝主图：" labelWidth="1.3rem" prop="mainImageUrl" >
        <el-upload  class="upload"  :action="imgUrl" v-model.trim="form.mainImageUrl"
          :on-success="handleGoodsSuccess"   :show-file-list="false"  :before-upload="beforeMainUpload"
          :headers="{ 'Content-Type': 'multipart/form-data'}">
          <img v-if="mainImg"  :src="mainImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <span class="imgWarn" v-if="goodsImgWarn">请上传宝贝主图</span>
        </el-upload>
        <ul class="require">
          <span>展示图要求：</span>
          <li>目标商品搜索结果页展示的主图</li>
          <li>(淘宝展示主图)</li>
          <li>尺寸要求<span>（800*800）</span></li>
        </ul>
      </el-form-item>
      <el-form-item label="下单规格：" labelWidth="1.3rem" prop="buyProductQuantity">
        <el-input :maxlength="200" placeholder="任意拍" size="small" class="any"  v-model.trim="form.buyProductSpec"></el-input>
        <span>拍：</span><el-input :readonly="readonly" type="number" v-model.number="form.buyProductQuantity"  size="small" class="any anyNum"></el-input><span>件</span>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>如需拍下指定规格，请务必填写此信息，如不填写默认任意拍一件；</span>
      </el-form-item>
      <el-form-item label="下单价格：" labelWidth="1.3rem" prop="buyProductAmount">
        <el-input class="any" size="small" type="number" :readonly="readonly" v-model.number="form.buyProductAmount" placeholder="请输入内容" ></el-input>元
      </el-form-item>
      <el-form-item label="商品运费：" labelWidth="1.3rem" prop="post">
        <div class="post">
          <el-radio-group v-model="form.post">
            <el-radio label="1" >包邮</el-radio>
            <el-radio label="0" :disabled="form.buyProductAmount<100?true:false" >不包邮</el-radio>
          </el-radio-group>
        </div>
        <span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>试客付邮试用必须同时满足：1、商品价值超过100元；2、拍A发A；
          3、淘宝销售邮费合理。若试客申诉因邮费不符导致商品无法下单，本平台有权将单品试用担保金返还给已获资格的试客</span>
      </el-form-item>
      <p class="title">第四步：设置试客找到商品入口</p>
      <el-form-item label="APP关键词：" labelWidth="1.32rem">
        <span >{{ choosePlat }}</span>
      </el-form-item>
      <!--<el-form-item label="商品淘口令：" labelWidth="1.3rem" v-if="form.platformType==='1'||form.platformType==='2'">-->
        <!--<el-input type="textarea" :rows="4" class="textarea" placeholder="请输入内容" @blur="cancelWarn(form.productShareUrl,appKey)" v-model.trim="form.productShareUrl"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item class="size" v-for="(keyItem,index) in form.keyword" :label="'APP端关键词'+(index+1)*1+'：'"
            :key="index" :prop="'keyword.'+ index + '.searchKeyword'" labelWidth="1.3rem">
        <el-select class="search" @focus="getType(form.platformType)" v-model="keyItem.searchId" placeholder="搜索平台" size="small">
          <el-option
            v-for="(item ,index) in searchOptions"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select class="search" v-model="keyItem.sortType" placeholder="综合排序" size="small">
          <el-option v-for="item in topOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input class="key" placeholder="填写搜索关键词" :rule="{ message : '关键词不能为空', trigger : 'blur' , required : true }"
                  :maxlength="100"  v-model.trim="keyItem.searchKeyword" size="small" ></el-input>
        <span>筛选条件：</span>
        <el-input :maxlength="100" class="key" placeholder="如价格区间、销量区间等" size="small" v-model.trim="keyItem.searchCondition" ></el-input>
        <el-button slot size="small" @click="deleteKey(keyItem)">删除</el-button>

      </el-form-item>
      <el-form-item labelWidth="1.3rem" >
        <el-button type="primary" @click="addKey">添加一个APP关键词</el-button>

      </el-form-item>
      <!--<span v-if="appKey==='1'" class="keyWarn">请选择淘口令或者APP端关键词中至少一项进行填写</span>-->
      <!--<div v-if="form.productShareUrl!=''&&appKey">-->
      <div>
        <p class="title">第五步：设置投放信息</p>
        <!--<el-form-item label="每日最多申请人数：">-->
          <!--<el-select class="people" v-model="form.people" placeholder="不限" size="small">-->
            <!--<el-option-->
              <!--v-for="item in peopleOptions"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
          <!--<span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>申请人数达到上限后，则当日不允许试客申请，避免单日进店流量异常突出</span>-->
          <!--<ul class="rules">-->
            <!--<span>投放规则：</span>-->
            <!--<li>1、≥200元的商品，第1天、第2天、第3天的投放量可以为0；100元≤200元的商品，第1天、第2天的投放量可以为0；≤100元的商品，第1天的投放量为0，第2天的投放量至少为1；</li>-->
            <!--<li>2、≥200元的商品，每期活动不低于3份，≤200元的商品，每期活动不低于5份；</li>-->
            <!--<li>3、活动投放时间至少3天起发且必须连续的，不可以间断。</li>-->
            <!--<span>开奖规则：</span>-->
            <!--<li>当日18点前提交担保金的活动，当日审核上架次日10点开奖；18点后提交的活动次日10点上架，隔天10点系统自动开奖</li>-->
          <!--</ul>-->
        <!--</el-form-item>-->
        <el-form-item label="选择活动时间：" labelWidth="1.3rem" prop="startTime">
          <div class="block">
            <el-date-picker v-model="form.startTime"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :picker-options="pickerOptions"
              type="date" clearable placeholder="开始日期" @blur="setRate(form.startTime)" >
            </el-date-picker>
          </div>
        </el-form-item>
        <div class="rate">设置转化率：</div>
        <ul class="rules">
          <span>投放周期建议：</span>
          <li>1、 新品基础优化建议不低于3期活动，每期设置活动3~5天的单量，单量需要做螺旋，新品第一期PC长词+淘口令，第二期PC核心词+淘口令+手淘长词，第三期PC核心词+手淘核心词。</li>
          <li>2、 老品权重提升建议不低于3期活动，每期活动3~5天的单量，配合人气任务模式做收藏加购人气，单量和人气都需要螺旋，加购率做到30%，收藏率20%以上，PC核心词+手淘核心词+猜你喜欢+直通车。</li>
        </ul>
        <div class="datePicker">
          <p>{{ year}} 年{{ month }}月</p>
          <ul class="dayTitle">
            <li v-for="item in week">{{ item.value }}</li>
          </ul>
          <ul class="weeks">
            <li v-for="(daysItem,index) in weekItems">
              <ul>
                <li class="dayDiv" v-for="(item,index) in daysItem">
                  <div v-if="item===''"></div>
                  <!--<div v-else="item == day"><span>{{item }}</span><p>试用展示时间</p></div>-->
                  <div class="setGoods" v-else-if="item.date" >
                    <span class="dateNum">{{ item.num }}</span>
                    <div>
                      <input type="button" class="miniBtn" @click="setNum(1,goodsAmount[item.index],item.index,item.date)" value="-"/>
                      <input v-model.number="goodsAmount[item.index]" :disabled="readonlyKey"  @blur="numIpt(goodsAmount[item.index],item.index,item.date)" placeholder="投放数量" />
                      <input type="button" class="miniBtn" @click="setNum(2,goodsAmount[item.index],item.index,item.date)" value="+">
                    </div>
                  </div>
                  <div class="today" v-else>
                    <span>{{ item }}</span>
                    <p>活动展示时间</p>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <span v-if="warn" class="daysWarn">投放数量请填写不小于1且不大于999的整数！</span>
        <span class="daysWarn" v-if="daysWarn">投放天数不得小于3！</span>
        <span class="daysWarn" v-if="changeNum&& $route.query.payStatus === '1'">投放总量不得更改！</span>

        <div class="situation">投放情况：</div>
        <el-form-item>
          <table border="1" bordercolor="#dcdfe6" >
            <tr>
              <td>投放天数</td>
              <td>投放总量（试用品份数）</td>
            </tr>
            <tr>
              <td v-if="goodsAmount.length">{{ dayNum }}</td>
              <td v-else></td>
              <td v-if="tryoutAmount">{{ tryoutAmount }}</td>
              <td v-else></td>
            </tr>
          </table>
        </el-form-item>
      </div>
      <el-form-item class="submit">
        <el-button type="primary" v-if="editor==='1'" @click="onSubmit('form',2)">修改活动</el-button>
        <el-button type="info" v-else-if="editor==='2'" @click="goTryout">返回试用管理</el-button>
        <el-button type="primary" @click="onSubmit('form',1)" v-else>提交活动报名</el-button>
      </el-form-item>
    <!--</el-form-item>-->
    </el-form>
    <el-dialog  title="提示" top="20%" :visible.sync="activityVisible" width="30%" center
      :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <p>您还没有绑定店铺，请先前往绑定店铺</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goNewShop">绑定新店铺</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import ElFormItem from "element-ui/packages/form/src/form-item";
    import { validateURL ,getQueryString } from '@/utils/validate'
    import { parseTime} from '@/utils'
    import { getToken } from '@/utils/auth'
    import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
    import ElButtonGroup from "element-ui/packages/button/src/button-group";
    import { getCategory ,getShopList ,searchTypeList , uploadImage , publishActivity  , changeDetail , getJDetail} from "@/api/activity"
    import { shopList } from "@/api/shop"
    import $ from '../../../static/js/jquery-3.3.1.min.js'

    export default {
      components: {
        ElButtonGroup,
        ElRadioGroup,
        ElFormItem ,
      },
      name: "step",

      data(){
        const validTitle = (rule , value ,callback) => {
          if(value === ''){
            callback(new Error('请填写活动标题'))
          }else{
            if(value.length > 40 ){
              callback(new Error('活动标题不得超过40个字符'))
            }
            callback();
          }
        };
        const validLink = (rule,value,callback) => {
          if(value === ''){
            callback(new Error('请填写商品链接'))
          }else{
            if(!validateURL(value)){
              callback(new Error('请填写正确格式的商品链接'))
            }else{
              callback();
            }
          }
        };
        const validNum = ( rule ,value,callback ) => {
          if(value === ''){
            callback(new Error('请填写商品件数'))
          }else{
            if(value<1){
              callback(new Error('商品件数最少为1，请重新填写下单件数'))
            }
            if(value > 10000) {
              callback(new Error('商品件数不得超过10000'))

            }
            let reg = /^[0-9]*$/;
            if(!reg.test(value)) {
              callback(new Error('商品件数必须为整数'));

            }
            callback();

          }
        };
        const validMoney = (rule , value, callback ) => {
          if(value === ''){
            callback(new Error('请填写下单价格'))
          }else{
            if(value<0){
              callback(new Error('下单价格不能小于0，请重新填写下单价格'))
            }
            if(value > 9999999){
              callback(new Error('下单价格不能超过9999999'))
            }
              callback();

          }
        };

        return{
          type : '1',
          form : {
            platformType: '1',
            receiveHours : '24',
            categoryId : '',
            productId : '',
            activityTitle : '',
            productUrl: '',
            shopId : '' ,
            mainImageUrl : '',
            showImageUrl : '',
            buyProductSpec:'',
            buyProductQuantity : '1',
            buyProductAmount : '',
            post : '1',
            keyword : [{
              'searchId' : '',
              'sortType' : '',
              'searchKeyword' : '',
              'searchCondition' : ''
            }],
            activityStartTime : '',
            activityCalendar : [],
            productName : '',
            productDetail : '',
            startTime : ''
          },
          platForm : [
            {
              name : '淘宝',
              id : '1',
            },
            {
              name : '天猫',
              id : '2'
            },
            {
              name : '京东',
              id : '3'
            },
            // {
            //   name : '拼多多',
            //   id : '4'
            // }
          ],
          options : [
            // {
            //   label :'潮流女装',
            //   value : '1'
            // },
            // {
            //   label :'精品男装',
            //   value : '2'
            // },
            // {
            //   label :'鞋子箱包',
            //   value : '3'
            // },
            // {
            //   label :'时尚配饰',
            //   value : '4'
            // },
            // {
            //   label :'美食特产',
            //   value : '5'
            // },
            // {
            //   label :'数码家电',
            //   value : '6'
            // },
            // {
            //   label :'家具日用',
            //   value : '7'
            // },
            // {
            //   label :'美容护肤',
            //   value : '8'
            // },
            // {
            //   label :'综合试用',
            //   value : '9'
            // }
          ] ,
          shopOptions : [],
          searchOptions : [],
          topOptions : [
            {
              label : '综合排序',
              value : '1'
            },
            {
              label : '人气排序',
              value : '2',
            },
            {
              label : '销量排序',
              value : '3'
            },
            {
              label : '信用排序',
              value : '4'
            }
          ],
          peopleOptions : [
            {
              label : '',
              value : ''
            }
          ],
          dialogVisible: false ,
          // token : getToken() ,
          imgUrl: 'http://120.27.12.205:8005/tryout/file/upload',   // 上传图片的域名
          imageDomain : 'http://lgf8953.oss-cn-beijing.aliyuncs.com/', //获取图片的外链域名
          // imageDomain : '"http://yabei.oss-cn-beijing.aliyuncs.com/',
          showImg : '',
          mainImg : '',
          showImgWarn : false ,
          goodsImgWarn : false ,
          formRule : {
            // type : [
            //   {
            //     required : true ,message : '请选择活动类型' ,
            //   }
            // ],
            platformType: [
              {
                required : true ,message : '请选择商品来源' , trigger : 'click'
              }
            ],
            receiveHours : [
              {
                required : true ,message : '请选择领取时间' ,trigger : 'change'
              }
            ],
            activityTitle : [
              {
                required : true ,trigger : 'blur' , validator : validTitle
              }
            ],
            categoryId : [
              {
                required : true ,message : '请选择试用品类型'
              }
            ],
            // showImageUrl : [
            //   {
            //     required : true ,message : '请上传试用品展示图'
            //   }
            // ],
            shopId : [
              {
                required : true ,message : '请选择店铺' , trigger : 'change'
              }
            ],
            productUrl : [
              {
                required : true ,validator : validLink ,trigger : 'blur'
              }
            ],
            // mainImageUrl : [
            //   {
            //     required : true ,message : '请上传宝贝主图' ,trigger : 'change'
            //   }
            // ],
            buyProductQuantity : [
              {
                required : true ,validator : validNum ,trigger : 'blur'
              }
            ],
            buyProductAmount : [
              {
                required : true , validator : validMoney ,trigger : 'blur'
              }
            ],

          },
          choosePlat : '',
          week : [
            { value : '日'},
            { value : '一'},
            { value : '二'},
            { value : '三'},
            { value : '四'},
            { value : '五'},
            { value : '六'},
          ] ,
          year : '',
          month : '',
          day : '',
          today : '',
          weekItems : [],
          goodsAmount : [],
          dayNum : '',
          tryoutAmount : '',
          warn : true ,
          daysWarn : true ,
          pickerOptions : {
            disabledDate(time){
              let curDate = (new Date()).getTime() ;
              return time.getTime() < Date.now()  - 2*24*3600*1000 ;
            }
          } ,
          editor : '',
          order : '',
          pickTime : '' ,
          readonly : false ,
          readonlyKey : false ,
          totalNum : '',
          changeNum : false ,
          activityVisible : false
          // pickerOptions: {
          //   disabledDate(time) {
          //     return time.getTime() < Date.now();
          //   }
          // },
        }
      },


      mounted(){
        // this.form = this.$store.state.publishInfo.publishForm ;
        shopList().then( res => {
          if(res.data.status === '000000000'){
            if(res.data.data.length){
              if(this.$route.query.order !== undefined ) {
                this.editor = this.$route.query.editor;
                let order = this.$route.query.order ;
                if( order !== undefined){
                  this.order = order ;
                  this.$store.dispatch('getPublishDetail',order).then( res => {
                    // console.log(res);
                    if (res.data.status === '000000000') {
                      this.form = res.data.data;
                      if(this.$route.query.payStatus === '1'){
                        this.readonly = true ;
                      }
                      if(this.form.productId !== '' ){
                        let num = 0 ;
                        this.resetSearch(this.form.platformType);
                        this.getType(this.form.platformType);
                        this.mainImg = this.imageDomain + this.form.mainImageUrl ;
                        this.showImg = this.imageDomain + this.form.showImageUrl ;
                        if(this.form.activityCalendar.length !== 0){
                          this.form.activityCalendar.forEach((i) => {
                            num = num + i.tryoutQuantity ;
                            this.goodsAmount.push(i.tryoutQuantity);
                          });
                        }
                        this.tryoutAmount = num ;
                        this.totalNum = num ;
                        this.dayNum = this.goodsAmount.length ;
                        this.form['startTime'] = parseTime(new Date(this.form.activityStartTime).getTime() - 24*3600*1000) ;
                        this.setRate(this.form.startTime ,this.tryoutAmount,this.goodsAmount);

                      }else{
                        this.setRate();
                      }

                    } else {
                      this.$message({
                        message: res.data.message,
                        center: true,
                        type: 'error'
                      })
                    }
                  }).catch( err => {
                    alert('服务器开小差啦，请稍等~')
                  })
                }
                // }
              }else{
                this.resetSearch('1');
                this.setRate();
              }
              getCategory().then( res => {
                if(res.data.status === '000000000'){
                  this.options = res.data.data ;
                }
              }).catch( err => {
                alert('服务器开小差啦，请稍等~')
              });
            }else{
              this.activityVisible = true ;
            }
          }else{
            this.$message({
              message : res.data.message ,
              center : true ,
              type : 'error'

            })
          }
        }).catch( err => {
          alert('服务器开小差啦，请稍等~')
        });


      },

      methods: {

        //上传商品展示图
        handleShowSuccess(res, file) {
          // console.log(res,file);
          // this.form.showImageUrl = URL.createObjectURL(file.raw);
          // this.$refs.showImageUrl.resetFields();
          // console.log('sss')
        },

        //判断需要上传的图片的尺寸
        beforeShowUpload(file) {
          let reader = new FileReader();
          let ret = [];
          let _this = this ;
          reader.onload = (e)=>{
            let image = new Image();
            image.onload = function() {
              const isHeight = this.height;
              const isWidth = this.width;
              if (isWidth > 800 || isHeight > 800) {
                _this.$message.error('图片尺寸过大，请重新选择后上传');
                return false;
              }else{
                let formData = new FormData();
                formData.append('image',file);
                  uploadImage(formData).then( res => {
                    if(res.data.status === '000000000'){
                      _this.showImg = res.data.data.filePath ;
                      _this.form.showImageUrl = res.data.data.fileName ;
                      _this.showImgWarn = false ;
                      // _this.$refs['showImageUrl'].validate((valid) => {
                      //   if (valid) {
                      //     _this.$refs.showImageUrl.clearValidate();
                      //
                      //   }
                      // });
                    }else{
                      _this.$message({
                        message : res.data.message ,
                        center : true ,
                        type : 'error'
                      });

                    _this.showImgWarn = false ;

                    }
                  }).catch( err => {

                    _this.showImgWarn = false ;

                    // console.log(err) ;
                  })
                }
            };
            image.src = e.target.result ;
          };
            reader.readAsDataURL(file);



        },

        //上传商品主图
        handleGoodsSuccess(res, file) {
          // this.form.mainImageUrl = URL.createObjectURL(file.raw);
          // this.$refs.mainImageUrl.resetFields();

        },

        beforeMainUpload(file) {
          let reader = new FileReader();
          let ret = [];
          let _this = this ;
          reader.onload = (e)=>{
            let image = new Image();
            image.onload = function() {
              const isHeight = this.height;
              const isWidth = this.width;
              if (isWidth > 800 || isHeight > 800) {
                _this.$message.error('图片尺寸过大，请重新选择后上传');
                return false;
              }else{
                let formData = new FormData();
                formData.append('image',file);
                uploadImage(formData).then( res => {
                  if(res.data.status === '000000000'){
                    _this.mainImg = res.data.data.filePath ;
                    _this.form.mainImageUrl = res.data.data.fileName ;
                    _this.goodsImgWarn = false ;
                  }else{
                    _this.$message({
                      message : res.data.message ,
                      center : true ,
                      type : 'error'
                    }) ;
                    _this.goodsImgWarn = true ;

                  }
                }).catch( err => {
                  // console.log(err) ;
                  _this.goodsImgWarn = true ;

                })
              }
            };

            image.src = e.target.result ;
          };
          reader.readAsDataURL(file);
          },

        //获取对应平台店铺列表
        resetSearch(value,change){
          this.choosePlat = this.platForm[value-1].name ;
          if(change === 'change'){
            this.form.shopId = '';
            this.form.keyword = [{
              'searchId' : '',
              'sortType' : '',
              'searchKeyword' : '',
              'searchCondition': '',
            }];
            this.getType();
          }
          getShopList(value).then( res => {
            if( res.data.status === '000000000'){

              this.shopOptions = res.data.data ;
            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')
          })

        },

         //获取平台类型
        getType(value){
          searchTypeList(value).then( res => {
            if(res.data.status === '000000000'){
              this.searchOptions = res.data.data ;
              // console.log(this.searchOptions);
            }
          }).catch( err => {
            // console.log(err);
          })
        },

        //获取商品详情
        getGoodsDetail(type,url){
          if( type === '3'){
            getJDetail(url).then( res => {
              if( res.data.status === '000000000'){
                this.form.productName = res.data.data.productName ;
                this.form.productDetail = res.data.data.productDetail ;
                this.form.productId = res.data.data.productId ;
              }else{
                this.$message({
                  message : res.data.message ,
                  type : 'error',
                  center : true
                })
              }
            })
          }else{
            if( url.indexOf('?') !== -1 ){
              const num = getQueryString(url,'id');
              this.form.productId = num ;
              let params = {'item_num_id': num };
              let _this = this ;
              $.ajax({
                url: 'https://hws.m.taobao.com/cache/mtop.wdetail.getItemDescx/4.1/?type=jsonp&data=' + JSON.stringify(params),
                dataType: 'jsonp',
                success: function (data) {
                  if (data['ret'][0] === 'SUCCESS::接口调用成功') {
                    _this.form.productDetail = JSON.stringify(data['data']['images']);
                  } else {
                    _this.$message({
                      message : '请输入正确的商品链接' ,
                      center : true ,
                      type : 'error'
                    })

                  }
                }
              });
              let infoParams = {
                jsv: '2.4.8',
                t: new Date().getTime(),
                api: 'mtop.taobao.detail.getdetail',
                v: '6.0',
                H5Request: true,
                type: 'jsonp',
                dataType: 'jsonp',
                data: JSON.stringify({exParams: {id: num, itemNumId: num }})
              };
              $.ajax({
                url: 'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/' ,
                data : infoParams,
                dataType: 'jsonp',
                success: function (data) {
                  if (data['ret'][0] == 'SUCCESS::调用成功') {
                    let _data = data.data;
                    _this.form.productName = _data.item.title ;
                  }else{
                    _this.$message({
                      message : '请输入正确的商品链接' ,
                      center : true ,
                      type : 'error'
                    })                  }
                }
              })
            }

          }

        } ,

        //删除APP端关键词
        deleteKey(item){
            let index = this.form.keyword.indexOf(item);
            if(index !== -1 && this.form.keyword.length> 1){
              this.form.keyword.splice(index,1)
            }


        },

        //添加app端关键词
        addKey(){
          if(this.form.keyword.length <10){
            this.form.keyword.push({
              'searchId' : '',
              'sortType' : '',
              'searchKeyword' : '',
              'searchCondition': '',
            })

          }else{
            this.$message({
              message : '您添加的关键词太多啦，不能再加啦~',
              center : true ,
              type : 'error'
            })
          }
        },

        //转化率日历
        setRate(value,total,dayItem ){
          let date ;
          this.weekItems = [] ;
          if(total !== undefined){
            this.goodsAmount = dayItem;
            this.tryoutAmount = total;

          }else{
            this.goodsAmount = [];
            this.tryoutAmount = '';
            this.form.activityCalendar = [];

          }
          let daysArr = [] ;
          if(value === '' || value === undefined || value === null){
            date = new Date();
          }else{
            date = new Date(Date.parse(value.replace(/-/g,'/'))) ;
            // date = new Date(date.getTime() -24 * 3600 * 1000);
          }
          this.year = date.getFullYear() ;
          this.month = date.getMonth()+1;
          let targetDay = date.getDay() ;
          let startDay = date.getDate()+1;
          let hour = date.getHours() ;
          this.day = startDay ;
          this.today = startDay -1 ;
          let start = 0 ;
          let dayLength = 20;
          let restDay = 0;
          let daysNum = new Date(this.year, this.month, 0);
          let dayLong =  daysNum.getDate() ;
          if(dayLong < dayLength + startDay){
            restDay = dayLength + startDay - dayLong ;
          }
          if(targetDay !== 7){
            start = targetDay  ;
            for(let i = 0 ; i< start; i++){
              daysArr.push('');
            }
          }
          daysArr.push(this.today);

          if(restDay){
            let index = 0 ;
            for(let i = startDay;i<= dayLong ;i++){
              daysArr.push({ date : parseTime(date.getTime()+ (index+1)*24*3600*1000) ,num : i, index : index});
              index ++ ;
            }
            for(let j = 1; j <= restDay ;j ++ ){
              daysArr.push({ date : parseTime(date.getTime()+ (index+1)*24*3600*1000) , num : j,index : index});
              index ++ ;
            }
          }else{
            let index = 0 ;
            for(let i = startDay;i<= startDay +dayLength ;i++){
              daysArr.push({ date : parseTime(date.getTime()+ (index+1)*24*3600*1000) ,num : i, index : index});
              index ++ ;
            }
          }
          let blank = 7 - start ;
          for(let a= 0 ; a < blank ;a++){
            daysArr.push('') ;
          }
          let arr = [] ;
          for(let num = 0; num < 4 ; num ++){
            arr = daysArr.slice(num*7,7*(num+1));
            this.weekItems.push(arr) ;
          }
          // console.log(this.daysArr);
        },

        //按钮修改投放数量
        setNum(type,value,index,date){
          this.editorNum();

            if(value === undefined){
              value = 0 ;
            }

            if(type === 1){

              if(value > 1 ){
                // if(value > 999 ||!reg.test(value)){
                //   this.warn = true ;
                //   return false ;
                // }else{
                //   this.warn = false ;
                //
                // }
                this.goodsAmount[index] = --value ;
              }else if(value == 1){
                this.goodsAmount = this.goodsAmount.slice(0,index);
                this.form.activityCalendar = this.form.activityCalendar.slice(0,index);
              }
            }
            else {
              this.goodsAmount[index] = ++value;
              //   // console.log(this.goodsAmount, this.form.activityCalendar, date);

            }

            this.getProgress(index, date, value);


        },

        //输入框修改投放数量
        numIpt(value,index,date){
          this.editorNum();

          if(value === ''|| value< 1 || isNaN(value)) {
              this.goodsAmount = this.goodsAmount.slice(0, index);
              this.form.activityCalendar = this.form.activityCalendar.slice(0, index);

            }

          this.getProgress(index, date , value);



        },

        //判断投放总量设置投放数量是否可改
        editorNum(){
          if(this.$route.query.payStatus === '1'){
            this.$nextTick(()=> {
              let total = 0 ;

              this.goodsAmount.forEach((i)=> {
                if( i !== ''){
                  total = total + i ;
                }

              });
              if(this.totalNum !== total ){
                this.readonlyKey = 'disabled' ;
                this.changeNum = true ;
              }else{
                this.readonlyKey = false ;
                this.changeNum = false ;

              }

            });



              }
        },

        oneEditor(index,date){
          if( index > this.goodsAmount.length -1 ){

          }else{
            if(this.form.activityCalendar[index] === undefined ){
              this.form.activityCalendar.splice(index ,0,{ activityDate : date , tryoutQuantity :this.goodsAmount[index] });
            }
            else{
              this.form.activityCalendar.splice(index ,1,{ activityDate : date , tryoutQuantity :this.goodsAmount[index] });
            }
          }

        },

        allEditor(index){
          let time ;
          if(this.form.startTime){
            time = this.form.startTime ;
          }else{
            time = new Date().getTime() ;
          }
          for(let j = 0 ; j < index ; j++){
            if(this.goodsAmount[j] === undefined  ){
              this.goodsAmount[j] = 1 ;

              this.form.activityCalendar.splice(j ,0,{ activityDate : (parseTime(new Date(time).getTime()+(j+1)*24*3600*1000)) , tryoutQuantity :1 });
            }else if( this.goodsAmount[j] === '' ){
              this.goodsAmount[j] = 1 ;
              this.form.activityCalendar.splice(j ,1,{ activityDate : (parseTime(new Date(time).getTime()+(j+1)*24*3600*1000)) , tryoutQuantity :1 });

            }
          }
        },

        getProgress(index,date){
          this.allEditor(index);
          this.oneEditor(index,date);
          if(this.form.activityStartTime === ''){
            this.form.activityStartTime = parseTime(new Date().getTime() + 24*3600*1000);

          }else{
            this.form.activityStartTime = this.form.activityCalendar[0].activityDate ;
          }


          // if(this.goodsAmount[this.goodsAmount.length-1].length === 0 ){
          //   this.goodsAmount.splice(this.goodsAmount.length-1,1);
          //   this.form.activityCalendar.splice( this.goodsAmount.length,1);
          // }
          this.hasWarn();

        },

        hasWarn(){
          let dayAmount = 0 ;
          let arr = [] ;
          this.goodsAmount.forEach((i)=> {
            if( i !== ''){
              dayAmount = dayAmount + i ;
              arr.push(i);
            }

          });

          if(this.goodsAmount.indexOf('') === -1  ){
            this.form.activityCalendar.forEach( i => {
              let reg = /^[0-9]*$/ ;
              if(i.tryoutQuantity <= 999 && reg.test(i.tryoutQuantity)){
                this.warn = false ;
              }else{
                this.warn = true ;

              }
            })
           } else{
             this.warn = true ;
           }

          this.tryoutAmount = dayAmount ;
          this.dayNum = arr.length ;
          if(arr.length<3){
            this.daysWarn = true ;
          }else{
            this.daysWarn = false ;
          }
        },

        //提交试用信息
        onSubmit(formName,index){
          console.log(this.form ,this.form.activityCalendar[0]);
          if(this.form.showImageUrl === ''){
            this.showImgWarn = true ;
          }else{
            this.showImgWarn = false ;
          }
          if(this.form.mainImageUrl === ''){
            this.goodsImgWarn = true ;
          }else{
            this.goodsImgWarn = false ;

          }
          this.hasWarn();
          this.$refs[formName].validate((valid) => {
            if (valid  && !this.warn && !this.daysWarn && !this.changeNum && !this.showImgWarn && !this.goodsImgWarn) {

              delete this.form.startTime ;
              if(index === 1){
                  publishActivity(this.form).then( res => {
                    if(res.data.status === '000000000'){
                      this.$message({
                        type: 'success',
                        message: '提交成功',
                        center: true ,
                        duration : 500

                      });
                      this.$router.push({ name: 'Pay', params :{ id : res.data.data.activityId  }  });

                    } else {
                      this.$message({
                        message: res.data.message,
                        center: true,
                        type: 'error'
                      })
                    }
                  }).catch( err => {
                    // console.log(err);
                    alert('服务器开小差啦，请稍等~')
                  });
                }else{
                  if( index === 2){

                    changeDetail(this.form).then( res => {
                      if (res.data.status === '000000000') {
                        this.$message({
                          type: 'success',
                          message: '提交成功',
                          center: true ,
                          duration : 500
                        });
                        this.$router.push({name: 'Pay' , params : { id : this.order } });

                      }else{
                        this.$message({
                          type: 'error',
                          message: res.data.message ,
                          center: true
                        }, 500);
                      }

                    }).catch( err =>{
                      alert('服务器开小差啦，请稍等~')
                    })
                  }
                }
            }else{
              this.$message({
                type : 'error',
                message : '提交失败，请重新确认信息',
                center : true
              });
              return false ;
            }
          })
        },

      //绑定店铺
        goNewShop(){
          this.$router.push('/newshop')
        },

      // 跳转到试用管理
        goTryout(){
          this.$router.push('/activity/approval')
        }

      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .step{
    width : 90% ;
    margin : 0 auto ;
    .title{
      width : 100% ;
      height : 0.5rem ;
      line-height : 0.5rem ;
      font-size : 0.22rem ;
      font-weight : bold ;
      color : #333;
      text-indent : 0.1rem ;
      border-bottom : 1px solid #aaa ;
      margin-bottom : 0.2rem ;
    }
    .el-form-item{
      /*margin : 0;*/
      width : 100% ;
      padding-left : 0.3rem ;
      .upload{
        width : 1.6rem ;
        float : left ;
        margin-top : 0.2rem ;
        position : relative ;

        .avatar {
          width: 1.46rem;
          height: 1.46rem;
          display: block;
        }
        .imgWarn{
          color: #f56c6c;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          position: absolute;
          top: 100%;
          left: 0;
        }
      }
      .require{
        margin-top : 0.2rem ;
        margin-left : 0.3rem ;
        float : left ;
        width : 60% ;
        li{
          height : 0.3rem ;
          line-height : 0.3rem ;
          span{
            color : #ff0000 ;
          }
        }
      }
      .tips{
        width : 50% ;
        height : 0.3rem ;
        line-height : 0.3rem ;
        font-size : 0.12rem ;
        color : #456 ;
        margin-left : 0.2rem ;
        display: inline-block;
        img{
          width : 0.2rem ;
          height : 0.2rem ;
          float : left ;
          margin-top : 0.03rem ;
          margin-right : 0.05rem ;
        }
      }
      .el-input{
        width : 4rem ;
      }
      .activity{
        .el-input{
          width : 3rem ;
        }
      }
      .any{
        width : 1.2rem ;
        margin-right : 0.1rem ;

      }


      .keyTip{
        left: 30% ;
      }
      .conditions{
        left : 50%;
      }

      .anyNum{
        width : 1rem ;
      }
      .post{
        height : 1rem ;
        float : left ;
        margin-right : 1.1rem ;
      }
      .textarea{
        width : 40% ;
      }
      .search{
        width : 1.2rem ;
        margin-right : 0.2rem ;
      }
      .key{
        width : 20% ;
        margin-right : 0.2rem ;
      }
      .block{
        .el-input{
          width : 2rem ;
        }
      }
      /*.keyBtn{*/
        /*!*width : 100% ;*!*/
        /*!*margin-top : 0.2rem ;*!*/
        /*!*padding-left : 2rem ;*!*/
        /*!*box-sizing: border-box;*!*/
      /*}*/
      table{
        border-collapse: collapse;
        width : 60% ;
        margin : auto 1.2rem;
        td{
          width : 2rem ;
          height : 0.3rem ;
          text-align : center;
          color : #456 ;
        }
      }

    }
    .rules{
      width : 90% ;
      padding-left : 0.28rem ;
      font-size : 0.13rem ;
      color : #456 ;
      span{
        font-size : 0.14rem ;
        display: block ;
        line-height : 0.3rem ;
      }
      li{
        padding-left : 0.25rem ;
        line-height : 0.25rem ;
      }
    }
    .datePicker{
      width : 90% ;
      margin : 0.3rem auto ;
      display : flex;
      flex-direction : column;
      justify-content: center;
      border : 1px solid #ccc ;
      p{
        width : 100% ;
        height : 0.4rem ;
        line-height : 0.4rem ;
        font-size : 0.14rem ;
        text-align: center;
        border-bottom : 1px solid #ccc  ;
        color : #666 ;
      }
      .dayTitle{
        width : 100% ;
        height : 0.4rem ;
        display : flex ;
        flex-direction: row;
        li{
          flex : 1 ;
          height : 100% ;
          line-height : 0.4rem ;
          font-size : 0.15rem ;
          font-weight : bold ;
          color : #fff;
          text-align : center;
          background : #8f949b;
          border-right : 1px solid #f1f1f1 ;
          &:nth-last-child(1){
            border-right : 0;
          }
        }
      }
      .weeks{
        width : 100% ;
        display : flex ;
        flex-direction : column ;
        li{
          flex : 1 ;
          height : 1rem ;
          border-top : 1px solid #ccc ;
          ul{
            width : 100% ;
            height : 100% ;
            display : flex;
            flex-direction : row ;
            .dayDiv{
              flex : 1 ;
              border-right : 1px solid #ccc ;
              &:nth-last-child(1){
                border-right : 0;
              }
              div{
                width : 100% ;
                height : 100%;
              }
              .today{
                padding : 0.05rem ;
                background : #D3D3D3 ;
                color : #8f949a;

                span{
                  width : 100% ;
                  height : 0.4rem ;
                  line-height : 0.4rem ;
                  font-size : 0.2rem ;
                  font-weight : bold ;
                  display: inline-block;
                  text-align : center ;
                }
                p{
                  font-size : 0.14rem ;
                  font-weight : bold ;
                  border-bottom : 0 ;
                }
              }
              .setGoods{
                display: flex ;
                flex : 1;
                height : 100% ;
                /*justify-content: center;*/
                align-items: center;
                flex-direction: column;
                .dateNum{
                  width : 100% ;
                  height : 0.3rem ;
                  line-height : 0.3rem ;
                  display : block ;
                  text-align: center;
                  color : #889aa4;
                  font-size : 0.2rem ;
                  font-weight : bold ;
                }
                div{
                  width : 90% ;
                  display : flex ;
                  flex-direction: row ;
                  justify-content: center;
                  margin-top : 0.1rem ;
                  height : 0.22rem ;
                  border : 1px solid #ccc ;
                  border-radius: 0.05rem ;
                  .miniBtn{
                    width : 20% ;
                    height : 100% ;
                    text-align : center ;
                    background : 0;
                    padding : 0;
                    border : 0;
                    &:nth-child(1){
                      border-right : 1px solid #ccc ;
                    }
                    &:nth-last-child(1){
                      border-left : 1px solid #ccc ;
                    }
                  }
                  input{
                    width : 60% ;
                    height : 0.2rem ;
                    font-size : 0.12rem ;
                    padding : 0;
                    border : 0;
                    text-align: center;
                    color : #aaa ;
                  }
                }
                /*.numWarn{*/
                  /*width : 100% ;*/
                  /*height : 0.2rem ;*/
                  /*line-height : 0.2rem ;*/
                  /*text-align : center;*/
                  /*font-size : 0.1rem ;*/
                  /*color : #ff0011 ;*/
                  /*display : inline-block;*/
                  /*margin-top : 0.07rem ;*/
                /*}*/
              }
            }
          }
        }
      }
    }
    .daysWarn,.keyWarn{
      width : 100% ;
      height : 0.3rem ;
      line-height : 0.3rem ;
      display : block ;
      font-size : 0.14rem ;
      color : #f56c6c;
      text-indent : 1.5rem ;
    }

    .rate,.situation{
      font-size : 0.18rem ;
      font-weight : bold ;
      height : 0.6rem ;
      line-height : 0.6rem ;
      color : #333;
      text-indent : 0.1rem ;
    }
    .situation{
      width : 2rem ;
    }
    .submit{
      display : flex ;
      justify-content: center;
      margin-top : 0.5rem ;
    }
    .el-dialog{
      p{
        text-align : center ;
        line-height : 0.4rem ;
        font-size : 0.16rem ;
      }
      .el-button{
        margin : 0.1rem  auto;

      }
    }
  }
</style>
