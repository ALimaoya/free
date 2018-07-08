<template>
  <div class="tryoutActivity step"  v-loading="loading"  element-loading-text="拼命加载中">
    <el-form :model="form" ref="form" :rules="formRule" >
      <p class="title">第一步：填写活动信息</p>
       <el-form-item label="活动类型："  :labelWidth="labelWidth" prop="activityType"  >
         <el-radio-group v-model="form.activityType" :disabled="read" @change="form.activityStartTime = '';setRate()">
           <el-radio  v-for="item in typeList" :label="item.value" :key="item.value">{{ item.name }}</el-radio>
         </el-radio-group>
       </el-form-item>
      <el-form-item label="商品来源：" :labelWidth="labelWidth" prop="platformType" >
        <el-radio-group :disabled="read" v-model="form.platformType"  @change="resetSearch(form.platformType,'change')">
          <el-radio  v-for="(item,index) in platForm"   :key="index" :label="item.id" >{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="领取时间：" :labelWidth="labelWidth" prop="receiveHours">
        <el-radio :disabled="read" v-model="form.receiveHours+''" label="24">24小时内</el-radio>
        <span class="tips">（试客获得资格后会在24小时内下单领取，逾期将终止试用。）</span>
      </el-form-item>
      <div v-if="form.activityType === '3'" class="tips_ul tips_warn">
        <p>注：</p>
        <ul  class="tips tips_warn">
          <li>（1）商家设定好开团所需人数，及开奖次数，满足条件后立即开奖，无需等到第二日</li>
          <!--<li v-if="form.activityType!=='3'">（2）新用户参与试用100%中奖，且再从该用户邀请的申请此商品的好友中，选择一名用户中奖</li>-->
          <!--<li v-if="form.activityType === ''">（3）用户同一时间能且仅能参与一个此类商品的试用活动</li>-->
        </ul>

      </div>
      <p class="title">第二步：填写试用品展示信息</p>
      <!--<el-form-item label="活动品牌：" :labelWidth="labelWidth" prop="activityBrand">-->
        <!--<el-input :readonly="readIpt" placeholder="请输入内容" size="small" type="text" v-model.trim="form.activityBrand"></el-input>-->
        <!--<span class="tips"><img src="../../assets/imgs/tips3.png" alt=""/>所填写的商品品牌内容将在APP中展示在商品名称前</span>-->
      <!--</el-form-item>-->
      <el-form-item label="活动标题：" class="activity" :labelWidth="labelWidth" prop="activityTitle">
        <el-input :readonly="readIpt" placeholder="请输入内容" size="small" type="text" v-model.trim="form.activityTitle" ></el-input>
        <span class="tips"><img src="../../../assets/imgs/tips3.png" alt=""/>写明赠品的数量、规格、属性等，不要复制淘宝商品标题</span>
      </el-form-item>
      <el-form-item label="试用品类型：" :labelWidth="labelWidth" prop="categoryId">
        <el-select :disabled="read" v-model="form.categoryId" placeholder="请选择商品类型" size="small">
          <el-option
            v-for="(item ,index) in options"
            :label="item.name" :key="index"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试用品展示图：" :labelWidth="labelWidth" prop="showImageUrl">
        <el-upload class="upload"  :auto-upload="autoUpload" :action="imgUrl" :show-file-list="false" v-model.trim="form.showImageUrl"
          :on-success="handleShowSuccess" :before-upload="beforeShowUpload"
          :headers="{ 'yb-tryout-merchant-token':token}">
          <!--:auto-upload="false" :http-request="beforeShowUpload"-->

          <img v-if="showImg"  :src="showImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <span class="imgWarn tips_warn" v-if="showImgWarn">请上传试用品展示图</span>
        </el-upload>
        <ul class="require">
          <span>展示图要求：</span>
          <li>商品清晰图片即可</li>
          <li>不能出现图片留白、拼接、水印、logo、及其他文字</li>
          <li>800*800以内的正方形</li>
        </ul>
      </el-form-item>
      <p class="title">第三步：选择目标推广宝贝</p>
      <el-form-item label="选择店铺：" :labelWidth="labelWidth" prop="shopId">
        <el-select :disabled="readShop" v-model="form.shopId"  placeholder="请选择店铺" size="small" >
          <el-option  v-for="(item,index) in shopOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <span v-if="form.shopId==='没有可选店铺'" class="tips" style="color : #f56c6c">该平台下未绑定店铺或绑定店铺未审核通过，请在店铺绑定并审核通过后再进行活动发布</span>

      </el-form-item>
      <el-form-item label="商品链接：" :labelWidth="labelWidth" prop="productUrl">
        <el-input :readonly="readIpt" size="small" v-model.trim="form.productUrl" placeholder="请输入内容" @change="getGoodsDetail(form.platformType,form.productUrl)"></el-input>
        <span class="tips"><img src="../../../assets/imgs/tips3.png" alt=""/>平台会根据您填写的商品链接抓取宝贝信息，试客无法看到此链接</span>
      </el-form-item>
      <el-form-item label="宝贝主图：" :labelWidth="labelWidth">
        <el-upload  class="upload" :auto-upload="autoUpload"  :action="imgUrl" :multiple="false" v-model.trim="form.mainImageUrl"
          :on-success="handleGoodsSuccess"   :show-file-list="false"  :before-upload="beforeMainUpload"
          :headers="{ 'yb-tryout-merchant-token':token}">
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
      <el-form-item label="下单规格：" :labelWidth="labelWidth" prop="buyProductQuantity">
        <el-input :readonly="readIpt" :maxlength="200" placeholder="任意拍" size="small" class="any"  v-model.trim="form.buyProductSpec"></el-input>
        <span>拍：</span><el-input :readonly="readonly" type="number" :maxlength="5" v-model.number="form.buyProductQuantity"  size="small" class="any anyNum"></el-input><span>件</span>
        <span class="tips"><img src="../../../assets/imgs/tips3.png" alt=""/>如需拍下指定规格，请务必填写此信息，如不填写默认任意拍一件；</span>
      </el-form-item>
      <el-form-item label="下单价格：" :labelWidth="labelWidth" prop="buyProductAmount">
        <el-input class="any" size="small" :maxlength="10" type="number" :readonly="readonly" v-model.number="form.buyProductAmount" placeholder="请输入内容" ></el-input>元
      </el-form-item>
      <el-form-item v-if="form.activityType!=='1'&&  form.activityType !== undefined" label="每次开奖份数：" :labelWidth="labelWidth" prop="groupProductQuantity">
      <el-input class="any" size="small" :maxlength="10" v-model.num="form.groupProductQuantity" type="number" min="1" :readonly="readonly" placeholder="请输入内容"></el-input>次
      <span class="tips"><img src="../../../assets/imgs/tips3.png" alt=""/>开奖份数为：满足开团条件时的中奖人数</span>
      </el-form-item>
      <el-form-item v-if="form.activityType!=='1'&&form.activityType !== undefined" label="参团人数：" :labelWidth="labelWidth" prop="groupPeopleQuantity" style="margin-bottom:22px;">
        <el-input class="any" size="small" :maxlength="10" v-model.num="form.groupPeopleQuantity" type="number" min="1" :readonly="readonly" placeholder="请输入内容"></el-input>人
        <span class="tips" ><img src="../../../assets/imgs/tips3.png" alt=""/>参团人数：申请人数满足此条件时，立即开奖</span>
      </el-form-item>
      <span v-if="form.activityType!=='1'&&form.activityType !== undefined" class="tips tips_warn" style="margin-left :120px ;margin-bottom : 22px;" >注：参团人数需在1 ~ 下单价格/2 之间的整数范围内，且不能小于每次开奖份数的输入值，最低人数为1</span>

      <el-form-item :label="this.payWay" :labelWidth="labelWidth" prop="isCredit" style="float : left ;">
        <el-radio-group :disabled="read"  v-model="form.isCredit">
          <el-radio label="1" >支持</el-radio>
          <el-radio label="0" >不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="post">
      <el-form-item label="商品运费：" :labelWidth="labelWidth" prop="post" style="width : 40% ;float : left ;">
          <el-radio-group :disabled="read"  v-model="form.post">
            <el-radio label="1" >包邮</el-radio>
            <el-radio label="0" :disabled="form.buyProductAmount<100?true:false" >不包邮</el-radio>
          </el-radio-group>
      </el-form-item>
      <span class="tips"><img src="../../../assets/imgs/tips3.png" alt=""/>试客付邮试用必须同时满足：1、商品价值超过100元；2、拍A发A；
          3、淘宝销售邮费合理。若试客申诉因邮费不符导致商品无法下单，本平台有权将单品试用担保金返还给已获资格的试客</span>
      </div>

      <p class="title">第四步：设置试客找到商品入口</p>
      <el-form-item label="APP关键词：" :labelWidth="labelWidth">
        <span >{{ choosePlat }}</span>
      </el-form-item>
      <!--<el-form-item label="商品淘口令：" labelWidth="120px" v-if="form.platformType==='1'||form.platformType==='2'">-->
        <!--<el-input type="textarea" :rows="4" class="textarea" placeholder="请输入内容" @blur="cancelWarn(form.productShareUrl,appKey)" v-model.trim="form.productShareUrl"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item class="size" v-for="(keyItem,index) in form.keyword" :label="'APP端关键词'+(index+1)*1+'：'"
            :key="index" :prop="'keyword.'+ index + '.searchKeyword'" labelWidth="150px">
        <el-select :disabled="read" class="search" @focus="getType(form.platformType)" v-model="keyItem.searchId" placeholder="搜索平台" size="small">
          <el-option
            v-for="(item ,index) in searchOptions"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select :disabled="read" class="search" v-model="keyItem.sortType" placeholder="综合排序" size="small">
          <el-option v-for="item in topOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input :readonly="readIpt" class="key" placeholder="填写搜索关键词" :rule="{ message : '关键词不能为空', trigger : 'blur' , required : true }"
                  :maxlength="40"  v-model.trim="keyItem.searchKeyword" size="small" ></el-input>
        <span>筛选条件：</span>
        <el-input :maxlength="100" class="key" :readonly="readIpt"  placeholder="如价格区间、销量区间等" size="small" v-model.trim="keyItem.searchCondition" ></el-input>
        <el-button :disabled="read" slot size="small" @click="deleteKey(keyItem)">删除</el-button>

      </el-form-item>
      <el-form-item :labelWidth="labelWidth" >
        <el-button :disabled="read" type="primary" @click="addKey">添加一个APP关键词</el-button>

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
        <el-form-item label="选择活动开始时间：" labelWidth="160px" prop="activityStartTime">
          <div class="block">
            <el-date-picker :disabled="read" v-model="form.activityStartTime"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :picker-options="pickerOptions"
              type="date" :clearable="autoUpload" placeholder="开始日期" @blur="setRate(form.activityStartTime)" >
            </el-date-picker>
          </div>
        </el-form-item>
        <div class="rate">设置<span v-if="form.activityType ==='1'">转化率：</span><span v-else="form.activityType==='3'">每日开团次数：</span></div>
        <ul class="rules" v-if="form.activityType ==='1'">
          <span>投放周期建议：</span>
          <li>1、 新品基础优化建议不低于3期活动，每期设置活动3~5天的单量，单量需要做螺旋，新品第一期PC长词+淘口令，第二期PC核心词+淘口令+手淘长词，第三期PC核心词+手淘核心词。</li>
          <li>2、 老品权重提升建议不低于3期活动，每期活动3~5天的单量，配合人气任务模式做收藏加购人气，单量和人气都需要螺旋，加购率做到30%，收藏率20%以上，PC核心词+手淘核心词+猜你喜欢+直通车。</li>
        </ul>
        <div class="datePicker">
          <p>{{ year}} 年 {{ month }} 月</p>
          <ul class="dayTitle">
            <li v-for="item in week">{{ item.value }}</li>
          </ul>
          <ul class="weeks">
            <li v-for="(daysItem,index) in weekItems" :key="index">
              <ul>
                <li class="dayDiv" v-for="(item,index) in daysItem" :key="index">
                  <div v-if="item===''"></div>
                  <!--<div v-else="item == day"><span>{{item }}</span><p>试用展示时间</p></div>-->
                  <div class="setGoods" v-else-if="item.date" >
                    <span class="dateNum">{{ item.num }}</span>
                    <div>
                      <input type="button" class="miniBtn" :disabled="read" @click="setNum(1,goodsAmount[item.index],item.index,item.date)" value="-"/>
                      <input v-model.number="goodsAmount[item.index]" :disabled="readonlyKey"  @blur="numIpt(goodsAmount[item.index],item.index,item.date)" :placeholder="form.activityType==='1'?'投放数量':'开团次数'" />
                      <input type="button" class="miniBtn" :disabled="read" @click="setNum(2,goodsAmount[item.index],item.index,item.date)" value="+">
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
        <span v-if="warn" class="daysWarn tips_warn"><span v-if="form.activityType==='1'">投放数量</span><span v-else="form.activityType==='3'">开团次数</span>请填写不小于1且不大于999的整数！</span>
        <span class="daysWarn tips_warn" v-if="daysWarn"><span v-if="form.activityType==='1'">投放天数</span><span v-else="form.activityType==='3'">开团天数</span>不得小于3！</span>
        <span class="daysWarn tips_warn" v-if="changeNum&& $route.query.payStatus === '1'">投放总量不得更改！</span>

        <div class="situation">投放情况：</div>
        <el-form-item>
          <table border="1" bordercolor="#dcdfe6" >
            <tr>
              <td><span v-if="form.activityType==='1'">投放</span><span v-else="form.activityType==='3'">开团</span>天数</td>
              <td><span v-if="form.activityType==='1'">投放</span><span v-else="form.activityType==='3'">开团</span>总量（试用品份数）</td>
            </tr>
            <tr>
              <td v-if="goodsAmount.length">{{ dayNum }}</td>
              <td v-else></td>
              <td v-if="tryoutAmount&&form.activityType==='1'">{{ tryoutAmount }}</td>
              <td v-else-if="tryoutAmount&&form.activityType==='3'">{{ tryoutAmount*form.groupProductQuantity}}</td>
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
    // import ElFormItem from "element-ui/packages/form/src/form-item";
    import { validateURL ,getQueryString , checkFloat } from '@/utils/validate'
    import { parseTime} from '@/utils'
    import { getToken } from '@/utils/auth'
    import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
    import ElButtonGroup from "element-ui/packages/button/src/button-group";
    import { getCategory ,getShopList ,searchTypeList , uploadImage , publishActivity  , changeDetail , getJDetail } from "@/api/activity"
    import { shopList } from "@/api/shop"
    import { getMember } from '@/api/userInfor'
    import $ from '../../../../static/js/jquery-3.3.1.min.js'

    export default {
      components: {
        ElButtonGroup,
        ElRadioGroup,
        // ElFormItem ,
      },
      name: "step",

      data(){
        // const validBrand = (rule,value,callback) => {
        //   if(value === ''){
        //     callback(new Error('请填写商品品牌'))
        //   }else{
        //     if(value.length > 40){
        //       callback(new Error('商品品牌不得超过40个字'))
        //     }
        //     callback();
        //   }
        // };
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
            if( !checkFloat(value)){
              callback( new Error('输入的小数不能超过两位，请重新输入'))
            }
            if(value !==''&&this.form.activityType === '3'){
              this.$refs.form.validateField('groupPeopleQuantity')
            }
              callback();

          }
        };
        const validPost = (rule, value ,callback) =>{
          if(value === '0'){
            if(this.form.buyProductAmount<100){
              callback(new Error('下单价格超过100元才能选择不包邮'))
            }
          }
          callback();

        };
        const validShop = (rule,value,callback) => {
          if(value === ''|| value === '没有可选店铺'){
            callback(new Error('请选择店铺'))
          }

          callback();
        };
        const validOpenNum = (rule,value,callback)=>{
          if(value === ''){
            callback(new Error('请输入每次开奖份数'))
          }else{
            if(!(/^[1-9]\d*$/).test(value) ){
              callback(new Error('请输入不小于1的正整数'))

            }
            if(value  !==''&&this.form.activityType === '3'){
              this.$refs.form.validateField('groupPeopleQuantity');

            }
            callback();
          }
        };
        const validOpenPeople = (rule,value,callback) => {
          if(value === ''){
            callback(new Error('请输入参团人数'))
          }else{
            if(this.form.buyProductAmount<2){
              this.form.groupPeopleQuantity = 1 ;
            }
            if(!(/^[1-9]\d*$/).test(value)||value>this.form.buyProductAmount/2){
              callback(new Error('请输入不小于1 ，且不大于下单价格/2的正整数'))
            }else{
              this.form.groupPeopleQuantity = Math.round(value) ;

            }
            if(value < this.form.groupProductQuantity){
              callback(new Error('输入的参团人数不得小于每次开奖份数'))
            }
            callback();
          }
        };
        return{

          form : {
            activityType: '1',
            platformType: '1',
            receiveHours : '24',
            categoryId : '',
            productId : '',
            // activityBrand : '',
            activityTitle : '',
            productUrl: '',
            shopId : '' ,
            mainImageUrl : '',
            showImageUrl : '',
            buyProductSpec:'',
            buyProductQuantity : '1',
            buyProductAmount : '',
            groupProductQuantity  : 1 ,
            groupPeopleQuantity : 1,
            post : '1',
            isCredit : '1',
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
            // startTime : ''
          },
          labelWidth : '130px',
          payWay : '',
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
          typeList : [
            {
              value : '1',
              name : '超级试用'
            },
            {
              value : '3' ,
              name : '拼团试用'
            },
            // {
            //   value : '3',
            //   name : '流量模式'
            // }
            // ,
            // {
            //   value : '3',
            //   name : '新手试用'
            // },
            // {
            //   value : '4' ,
            //   name : '高价值商品邀请试用'
            // }
          ],
          options : [] ,
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
          token : getToken() ,
          imgUrl: process.env.BASE_API+'/file/upload',   // 上传图片的域名
          imageDomain : process.env.IMAGE_DOMAIN , //获取图片的外链域名
          // imageDomain : '"http://yabei.oss-cn-beijing.aliyuncs.com/',
          showImg : '',
          mainImg : '',
          showImgWarn : false ,
          goodsImgWarn : false ,
          formRule : {

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
            // activityBrand : [
            //   {
            //     required : true ,trigger : 'blur',validator : validBrand
            //   }
            // ],
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
            shopId : [
              {
                required : true ,validator : validShop , trigger : 'change'
              }
            ],
            productUrl : [
              {
                required : true ,validator : validLink ,trigger : 'blur'
              }
            ],

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
            groupProductQuantity : [
              {
                required : true , trigger : 'blur',validator : validOpenNum
              }
            ],
            groupPeopleQuantity : [
              {
                required : true ,trigger : 'blur',validator : validOpenPeople
              }
            ],
            isCredit : [
              {
                required : true , message : '请选择是否允许使用花呗/白条/信用卡' ,trigger : 'click'

              }
            ],
            post : [
              {
                required : true , validator : validPost ,trigger : 'click'
              }
            ]
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
              return time.getTime() < Date.now() - 24*3600*1000 ;
            }
          } ,
          editor : '',
          order : '',
          pickTime : '' ,
          readonly : false ,  //付款后及查看活动详情时不能修改的值
          readonlyKey : false ,  //付款后及查看活动详情时日历输入框禁止修改输入
          totalNum : '',
          changeNum : false ,
          activityVisible : false ,
          read : false ,    //查看活动详情时禁止选择
          readShop : false ,
          readIpt : false ,  //查看活动详情时禁止输入
          autoUpload : true ,
          vipVisible : false ,
          calendarNumType : '',
          loading : true ,


        }
      },


      mounted(){
        shopList().then( res => {
          i //获取用户是否已绑定店铺
            if(res.data.data.length){
              getMember().then( res => {
                //判断用户是否是会员身份
                if(res.data.data.vipLevel*1){
                  // if(this.$route.query.order !== undefined ) {
                  //判断活动是新建还是已存在活动
                  this.activityDetail();

                  //获取商品类型列表
                  getCategory().then( res => {
                    this.options = res.data.data ;
                      if(this.form.categoryId !== ''){
                        let arr = [] ;
                        this.options.forEach( i => {
                          arr.push(i.id) ;

                        });
                        if(arr.indexOf(this.form.categoryId) === -1){
                          this.form.categoryId = '' ;

                        }

                      }
                  })
                }else{
                  this.vipVisible = true ;
                }
              })
            }else{
              this.activityVisible = true ;
            }
        })

      },


      methods: {

        //判断是新建活动还是已存在活动
        activityDetail(){
          this.editor = this.$route.query.editor;
          let order = this.$route.query.order ;
          if( order !== undefined){
            this.order = order ;
            //获取活动详情
            this.loading = true ;

            this.$store.dispatch('getPublishDetail',order).then( res => {
              this.form = res.data.data;
                //判断活动是否已支付
                if(this.$route.query.payStatus === '1'){
                  this.readonly = true ;
                }
                //已存在活动相关操作
                this.activityStatus();

            })
          } else{
            this.resetSearch('1');
            this.setRate();
          }
        },
        //已存在的活动相关操作
        activityStatus(){
          if(this.form.activityId !== '' ){
            let num = 0 ;
            this.resetSearch(this.form.platformType);
            this.getType(this.form.platformType);
            this.mainImg = this.imageDomain + this.form.mainImageUrl ;
            this.showImg = this.imageDomain + this.form.showImageUrl ;

            //判断活动编辑状态
            this.editorStatus(num)

          }else{
            this.form.activityStartTime = '';
            //生成对应日历
            this.setRate();
          }
        },

        //判断活动编辑状态
        editorStatus(num){
        if(this.editor !== undefined){
          //查看活动，该状态下活动内容均不能进行编辑
          if(this.editor === '2'){
            this.read = 'disabled' ;
            this.readShop = 'disabled';
            this.readonly = true ;
            this.readIpt = true ;
            this.readonlyKey = 'disabled' ;
            this.autoUpload = false ;
          }
          //获取活动日历信息
          if(this.form.activityCalendar.length !== 0){
            this.form.activityCalendar.forEach((i) => {
              if(this.form.activityType === '3'){
                num = num + i.groupQuantity ;
                this.goodsAmount.push(i.groupQuantity);
              }else{

                num = num + i.tryoutQuantity ;
                this.goodsAmount.push(i.tryoutQuantity);
              }

            });
          }
          this.tryoutAmount = num ;
          this.totalNum = num ;
          this.dayNum = this.goodsAmount.length ;
          // this.form['startTime'] = parseTime(new Date(this.form.activityStartTime.replace(/-/g,"/")).getTime() + 2*24*3600*1000) ;
          this.setRate(this.form.activityStartTime ,this.tryoutAmount,this.goodsAmount);
        }
        else{
          this.form.activityStartTime = '';
          this.setRate();

        }
    },
        //上传商品展示图
        handleShowSuccess(res, file) {
          // console.log(res,file);
          // this.form.showImageUrl = URL.createObjectURL(file.raw);
          // this.$refs.showImageUrl.resetFields();
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
                  uploadImage(formData,_this.token).then( res => {
                    if(res.data.status === '000000000'){
                      _this.showImg = res.data.data.filePath ;
                      _this.form.showImageUrl = res.data.data.fileName ;
                      _this.showImgWarn = false ;

                    }else{

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
                uploadImage(formData,_this.token).then( res => {
                  if(res.data.status === '000000000'){
                    _this.mainImg = res.data.data.filePath ;
                    _this.form.mainImageUrl = res.data.data.fileName ;
                    _this.goodsImgWarn = false ;
                  }else{
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
          if(value === '1'|| value === '2'){
            this.payWay = '花呗/信用卡：';
          }
          if(value === '3'){
            this.payWay = '白条/信用卡：';

          }
          if(change === 'change'){
            this.form.shopId = '';
            this.form.productUrl = '' ;
            this.form.isCredit = '1' ;
            this.form.keyword = [{
              'searchId' : '',
              'sortType' : '',
              'searchKeyword' : '',
              'searchCondition': '',
            }];
            this.getType();
          }
          getShopList(value).then( res => {
            this.shopOptions = res.data.data ;
              if(this.shopOptions.length){
                if(this.editor!=='2'){
                  this.readShop = false;
                }

                if(this.form.shopId !== ''){
                  let arr = [] ;
                  this.shopOptions.forEach( i => {
                    arr.push(i.id) ;

                  });
                  if(arr.indexOf(this.form.shopId) === -1){
                    this.form.shopId = '' ;

                  }
                }

              }else{
                this.readShop = 'disabled';
                this.form.shopId = '没有可选店铺';
              }
          })

        },

         //获取平台类型
        getType(value){

          searchTypeList(value).then( res => {
            this.searchOptions = res.data.data ;
          })
        },

        //获取商品详情
        getGoodsDetail(type,url){
          this.form.productId = '' ;

          this.goPlatform(type,url);
        } ,
        goPlatform(type,url){
          var that = this ;

          if( type === '3'){
            getJDetail(url).then( res => {
              if( res.data.status === '000000000'){
                that.form.productName = res.data.data.productName ;
                that.form.productDetail = res.data.data.productDetail ;
                that.form.productId = res.data.data.productId ;
                // this.submitDetail(index,form);

                return true ;
              }else{
                that.form.productUrl = '' ;
                that.form.productId = '' ;

              }

            })
          }else{

            if( url.indexOf('?') !== -1 ){

              const num = getQueryString(url,'id');
              if(num === undefined){

                this.$message({
                  message : '您输入的商品链接有误，请重新输入',
                  center : 'true',
                  type : 'error'
                });
                this.form.productUrl = '';
                return false ;
              }
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

                    alert('服务器开小差啦，请稍等~');

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

                    alert('服务器开小差啦，请稍等~')

                  }
                }
              });


            }else {
              this.$message({
                message : '请重新输入对应平台的商品链接' ,
                center : true ,
                type : 'error'
              });
              this.form.productUrl = '' ;
              this.form.productId = '' ;


            }
            if(type === '1'){
              if(url.indexOf('item.taobao.com') === -1){
                this.$message({
                  message : '请重新输入对应平台的商品链接' ,
                  center : true ,
                  type : 'error'
                });
                this.form.productUrl = '' ;
                this.form.productId = '' ;

                return false;
              }
            }else{
              if(type === '2'){
                if(url.indexOf('detail.tmall.com') === -1){
                  this.$message({
                    message : '请重新输入对应平台的商品链接' ,
                    center : true ,
                    type : 'error'
                  });
                  this.form.productUrl = '' ;
                  this.form.productId = '' ;

                  return false;

                }
              }
            }


          }
          // console.log(this.form.productDetail,this.form.productName);

        },
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

        // //获取对应活动日历传输数据字段
        // getActivityCalendar(){
        //
        //     if(this.form.activityType === '1'){
        //      this.calendarNumType =  'tryoutQuantity'
        //     }
        //     if(this.form.activityType === '3'){
        //       this.calendarNumType = 'groupQuantity'
        //     }
        //
        // },
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
            date = new Date(new Date().getTime()+ 2* 24*3600*1000) ;
          }else{
            date = new Date(Date.parse(value.replace(/-/g,'/'))) ;
          }
          this.year = date.getFullYear() ;
          this.month = date.getMonth()+1;
          let targetDay = date.getDay() ;
          let startDay = date.getDate();
          let hour = date.getHours() ;
          this.day = startDay ;
          this.today = new Date(parseTime(date.getTime()- 2* 24*3600*1000) ).getDate();
          let afterday =  new Date(parseTime(date.getTime()- 24*3600*1000)).getDate();
          // console.log(date.getDate(),startDay,this.today,afterday);

          let start = 0 ;
          let dayLength = 21;
          let restDay = 0;
          let daysNum ;
          if(this.day === 1|| this.day === 2){
            if(this.month === 1){
              daysNum = new Date(this.year-1, 12, 0);
            }else{
              daysNum = new Date(this.year, this.month-1, 0);
            }

          }else{
            daysNum = new Date(this.year, this.month, 0);

          }
          let dayLong =  daysNum.getDate() ;
          if(dayLong < dayLength + afterday ){
            restDay =   dayLength + afterday - dayLong  ;
          }

          if(targetDay !== 0 && targetDay !== 1){
            start = targetDay -2  ;
            for(let i = 0 ; i< start; i++){
              daysArr.push('');
            }
          }else{
            if(targetDay === 0){
              for(let i = 0 ; i< 5; i++){
                daysArr.push('');
              }
            }
            if(targetDay === 1){
              for(let i = 0 ; i< 6; i++){
                daysArr.push('');
              }
            }

          }
          daysArr.push(this.today);
          daysArr.push(afterday);
          // console.log(restDay);
          if(restDay){
            let index = 0 ;
            for(let i = afterday;i< dayLong ;i++){
              daysArr.push({ date : parseTime(date.getTime()+ index*24*3600*1000) ,num : new Date(parseTime(date.getTime()+ index*24*3600*1000)).getDate(), index : index});
              index ++ ;
            }
            for(let j = 1; j <= restDay ;j ++ ){
              daysArr.push({ date : parseTime(date.getTime()+ index*24*3600*1000) , num : j,index : index});
              index ++ ;
            }
          }else{
            let index = 0 ;
            for(let i = 0 ;i< dayLength ;i++){
              daysArr.push({ date : parseTime(date.getTime()+ index*24*3600*1000) ,num : new Date(parseTime(date.getTime()+ index*24*3600*1000)).getDate(), index : index});
              index ++ ;
            }
          }
          let blank = 7+ 6 - start ;
          for(let a= 0 ; a < blank ;a++){
            daysArr.push('') ;
          }
          let arr = [] ;
          for(let num = 0; num < 5 ; num ++){
            arr = daysArr.slice(num*7,7*(num+1));
            this.weekItems.push(arr) ;
          }
        },

        //按钮修改投放数量
        setNum(type,value,index,date){
          this.editorNum();

            if(value === undefined){
              value = 0 ;
            }

            if(type === 1){

              if(value > 1 ){

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

            this.getProgress(index, date);


        },

        //输入框修改投放数量
        numIpt(value,index,date){

          this.editorNum();

          if(value === ''|| value< 1 || isNaN(value)) {
              this.goodsAmount = this.goodsAmount.slice(0, index);
              this.form.activityCalendar = this.form.activityCalendar.slice(0, index);

            }

          this.getProgress(index, date );



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
              if(this.form.activityType === '3'){
                this.form.activityCalendar.splice(index ,0,{ activityDate : date , groupQuantity :this.goodsAmount[index] });

              }else{
                this.form.activityCalendar.splice(index ,0,{ activityDate : date , tryoutQuantity :this.goodsAmount[index] });

              }
            }
            else{
              if(this.form.activityType === '3') {
                this.form.activityCalendar.splice(index ,1,{ activityDate : date , groupQuantity :this.goodsAmount[index] });

              }else{
                this.form.activityCalendar.splice(index ,1,{ activityDate : date , tryoutQuantity :this.goodsAmount[index] });

              }
            }
          }

        },

        allEditor(index){
          let time ;
          if(this.form.activityStartTime){
            time = new Date(this.form.activityStartTime.replace(/-/g,"/")).getTime();
          }else{
            time = new Date().getTime() + 2* 24*3600*1000 ;

          }
          for(let j = 0 ; j < index ; j++){
            if(this.goodsAmount[j] === undefined  ){
              this.goodsAmount[j] = 1 ;
              if(this.form.activityType === '3'){
                this.form.activityCalendar.splice(j ,0,{ activityDate : (parseTime(new Date(time).getTime()+j*24*3600*1000)) , groupQuantity :1 });

              }else{
                this.form.activityCalendar.splice(j ,0,{ activityDate : (parseTime(new Date(time).getTime()+j*24*3600*1000)) , tryoutQuantity :1 });

              }
            }else if( this.goodsAmount[j] === '' ){
              this.goodsAmount[j] = 1 ;
              if(this.form.activityType === '3'){
                this.form.activityCalendar.splice(j ,1,{ activityDate : (parseTime(new Date(time).getTime()+j*24*3600*1000)) ,groupQuantity :1 });

              }else{
                this.form.activityCalendar.splice(j ,1,{ activityDate : (parseTime(new Date(time).getTime()+j*24*3600*1000)) , tryoutQuantity :1 });

              }

            }
          }
        },

        getProgress(index,date){
          this.allEditor(index);
          this.oneEditor(index,date);
          // console.log(this.form.activityStartTime)
          if(this.form.activityStartTime === ''){
            this.form.activityStartTime = parseTime(new Date().getTime() + 2*24*3600*1000);

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

            this.form.activityCalendar.every( i => {
              let reg = /^[1-9]{1}[0-9]{0,2}$/ ;
              let canlenderNum = '';

              if(this.form.activityType === '3'){

                canlenderNum = reg.test(i.groupQuantity)

              }else{

                canlenderNum = reg.test(i.tryoutQuantity)

              }
              if(canlenderNum){
                this.warn = false ;
                return !this.warn ;
              }else{

                this.warn = true ;
                return !this.warn ;
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
          // console.log(this.form,this.warn,this.daysWarn,this.changeNum,this.showImgWarn,this.goodsImgWarn);

          this.$refs[formName].validate((valid) => {

            if (valid && !this.warn && !this.daysWarn && !this.changeNum && !this.showImgWarn && !this.goodsImgWarn) {
                // this.form.productId = '' ;

                this.goPlatform(this.form.platformType,this.form.productUrl);
                this.submitDetail(index,this.form)

              } else {
                this.$message({
                  type: 'error',
                  message: '提交失败，请重新确认信息',
                  center: true
                });
                return false;
              }
            })

          // }


        },

      // 提交活动信息
        submitDetail(index,form){
          //试用类型不为拼团类时删除拼团相关参数字段

          if (index === 1) {
            this.loading = true ;

            publishActivity(form).then(res => {
              this.$message({
                  type: 'success',
                  message: '提交成功',
                  center: true,
                  duration: 500

                });
                this.$router.push({name: 'TryoutPay', params: {id: res.data.data.activityId}});

            })
          } else {
            if (index === 2) {
              this.loading = true ;

              changeDetail(form).then(res => {
                this.$message({
                    type: 'success',
                    message: '提交成功',
                    center: true,
                    duration: 500
                  });
                  this.$router.push({name: 'TryoutPay', params: {id: this.order}});

              })
            }
          }

        },

      //绑定店铺
        goNewShop(){
          this.$router.push('/freeManage/newshop')
        },

      //  购买会员
        buyVip(){
          this.$router.push('/freeManage/userInfor/buyVip')

        },

      // 跳转到试用管理
        goTryout(){
          this.$router.push('/freeManage/activity/approval')
        }

      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import 'src/styles/tryout';

</style>
