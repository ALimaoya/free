<template>
    <div class="tab2 tab">
      <el-form :model="form" ref="form" label-position="right" >
        <h1>资质信息</h1>
        <div class="check"><svg-icon icon-class="check_ico" /><span>审核通过</span><span @click="dialogVisible = true;">历史审核意见</span></div>
        <div class="infoWrap">
          <h2>店铺主体信息</h2>
          <el-form-item  labelWidth="200px" label="店铺名称：" >
            <div class="inputInfo">{{ form.shopname }}</div>
          </el-form-item>
        </div>
        <div class="infoWrap">
          <h2>入驻人证件信息</h2>
          <el-form-item  labelWidth="200px" label="入驻人姓名：" >
            <div class="inputInfo">{{ form.name }}</div>
          </el-form-item>
          <el-form-item  labelWidth="200px" label="入驻人身份证号：" >
            <div class="inputInfo">{{ form.cardId }}</div>
          </el-form-item>
          <el-form-item  labelWidth="200px" label="身份证号有效期：" >
            <div class="inputInfo">{{ form.cardDeadline }}</div>
          </el-form-item>
        </div>
        <div class="infoWrap">
          <h2>类目资质</h2>
          <el-form-item v-if="form.surveyReport !== ''|| form.surveyReport !== undefined" label="质检报告：" labelWidth="200px">
            <img v-if="form.surveyReport !== ''|| form.surveyReport !== undefined" :src="imageDomain + form.surveyReport" :onerror="errorImg">
            <img :src="failImg"  v-else>
          </el-form-item>
          <el-form-item v-if="form.foodTradeLicence !== ''|| form.foodTradeLicence !== undefined" label="食品流通许可证：" labelWidth="200px">
            <img v-if="form.foodTradeLicence !== ''|| form.foodTradeLicence !== undefined" :src="imageDomain + form.foodTradeLicence" :onerror="errorImg">
            <img :src="failImg"  v-else>
          </el-form-item>
          <el-form-item v-if="form.drinkTradeLicence !== ''|| form.drinkTradeLicence !== undefined" label="酒类流通备案登记表：" labelWidth="200px">
            <img v-if="form.drinkTradeLicence !== ''|| form.drinkTradeLicence !== undefined" :src="imageDomain + form.drinkTradeLicence" :onerror="errorImg">
            <img :src="failImg"  v-else>
          </el-form-item>
          <el-form-item v-if="form.businessImage !== ''|| form.businessImage !== undefined" label="营业执照：" labelWidth="200px">
            <img v-if="form.businessImage !== ''|| form.businessImage !== undefined" :src="imageDomain + form.businessImage" :onerror="errorImg">
            <img :src="failImg"  v-else>
          </el-form-item>
          <!--<el-form-item labelWidth="200px" :label="imgType[item.type]" v-for="(item,index) in form.imgList" :key="index">-->
            <!--<el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="item.url"-->
                        <!--:show-file-list="false"  >-->
              <!--<img v-if="item.url" :src="imageDomain + item.url" class="avatar">-->
              <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--</el-upload>-->
          <!--</el-form-item>-->
          <el-form-item  labelWidth="200px" label="营业执照有效期：">
            <div class="inputInfo">{{ form.busLicenceDeadline }}</div>
          </el-form-item>
          <el-form-item  labelWidth="200px" label="营业执照编号：" >
            <div class="inputInfo">{{ form.socialCreditCode }}</div>
          </el-form-item>
          <el-form-item v-if="form.paperTradeLicence !== ''|| form.paperTradeLicence !== undefined" label="出版物经营许可证" labelWidth="200px">
            <img v-if="form.paperTradeLicence !== ''|| form.paperTradeLicence !== undefined" :src="imageDomain + form.paperTradeLicence" :onerror="errorImg">
            <img :src="failImg"  v-else>
          </el-form-item>
          <el-form-item v-if="form.paperTradeDeadline !== ''||form.paperTradeDeadline !== undefined" labelWidth="200px" label="出版物经营许可证有效期：">
            <div class="inputInfo">{{ form.paperTradeDeadline }}</div>
          </el-form-item>
        </div>
        <!--<div class="infoWrap">-->
          <!--<h2>商标信息</h2>-->
          <!--<p class="tips">注：店铺包含“旗舰、专卖”，商家必须上传品牌授权或独占授权证明，需授权店铺从属人在丫贝网经营该品牌产品</p>-->
          <!--<el-form-item  labelWidth="200px" label="注册类型：" >-->
            <!--<div class="inputInfo">{{ form.registrationType }}</div>-->
          <!--</el-form-item>-->
          <!--<el-form-item  labelWidth="200px" label="商品注册号：" >-->
            <!--<div class="inputInfo">{{ form.registrationCode }}</div>-->
          <!--</el-form-item>-->
          <!--<el-form-item labelWidth="200px" label="商标注册证明：">-->
            <!--<el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="form.img6"-->
                        <!--:show-file-list="false"  >-->
              <!--<img v-if="form.img6" :src="imageDomain + form.img6" class="avatar">-->
              <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--</el-upload>-->
          <!--</el-form-item>-->
          <!--<el-form-item labelWidth="200px" label="品牌授权证明：">-->
            <!--<el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="form.img7"-->
                        <!--:show-file-list="false"  >-->
              <!--<img v-if="form.img7" :src="imageDomain + form.img7" class="avatar">-->
              <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--</el-upload>-->
          <!--</el-form-item>-->
          <!--<el-form-item  labelWidth="200px" label="品牌授权有效期：" >-->
            <!--<div class="inputInfo">{{ form.grantTime }} （截止日期）</div>-->
          <!--</el-form-item>-->
        <!--</div>-->
      </el-form>
      <el-dialog title="历史审核意见" :visible.sync="dialogVisible" width="60%" center >
        <el-table :data="tableData" border fit>
          <el-table-column  label="审核结果">
            <template slot-scope="scope">
              {{ resultType[scope.row.approvalType]}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" ></el-table-column>
          <!--<el-table-column prop="changeModal" label="修改模块" ></el-table-column>-->
          <el-table-column prop="updateTime" label="审核时间" ></el-table-column>
          <el-table-column prop="reason" label="审核意见" ></el-table-column>
        </el-table>
      </el-dialog>
    </div>
</template>

<script>
  import { getAptitudeInfo ,getApproveList} from "@/api/userCenter"
  import userPhoto from '@/assets/404_images/fail.png'
  import ElFormItem from "element-ui/packages/form/src/form-item";
    export default {
      components: {ElFormItem},
      name: "tab2",
        data() {
            return {
              form: {
              },
              imageDomain : process.env.IMAGE_DOMAIN , //获取图片的外链域名
              imgUrl: process.env.BASE_API+'/file/upload',   // 上传图片的域名
              imgType: [],
              tableData: [],
              dialogVisible: false ,
              resultType: ['审核通过','审核拒绝'],
              errorImg:'this.src="' + userPhoto + '"',
              failImg: userPhoto,


            }
        },
        mounted() {
          this.getInfo() ;
          this.getApproveList();
        },
        methods: {

          getInfo(){
            getAptitudeInfo().then( res => {
              if(res.data.status === '000000000'){
                this.form = res.data.data ;
              }
            })
          },
          // 获取审批历史记录
          getApproveList(){
            getApproveList().then( res =>{
              this.tableData = res.data.data
              // console.log(res)
            })
          },
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../../styles/tab';
img{
    width: 100px;
    height: 100px;
  }
</style>
