<template>
  <div class="tab4 tab">
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
        <h2>法定代表人证件信息</h2>
        <el-form-item  labelWidth="200px" label="法定代表人姓名：" >
          <div class="inputInfo">{{ form.legalRepName }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="法定代表人身份证号：" >
          <div class="inputInfo">{{ form.cardId }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="身份证号有效期：" >
          <div class="inputInfo">{{ form.cardDeadline }}</div>
        </el-form-item>
      </div>
      <div class="infoWrap">
        <h2>入驻企业信息</h2>
        <el-form-item  labelWidth="200px" label="公司名称：" >
          <div class="inputInfo">{{ form.companyName }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="公司经营地址：" >
          <div class="inputInfo">{{ form.companyAddress }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="营业期限：" >
          <div class="inputInfo">{{ form.busLicenceDeadline }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="社会信用代码：" >
          <div class="inputInfo">{{ form.socialCreditCode }}</div>
        </el-form-item>
      </div>
      <div class="infoWrap">
        <h2>类目资质</h2>
        <!-- <el-form-item labelWidth="200px" :label="imgType[item.type]" v-for="(item,index) in form.imgList" :key="index">
          <el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="item.url"
                      :headers="{'yb-tryout-merchant-token':token}"          :show-file-list="false"  >
            <img v-if="item.url" :src="imageDomain + item.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="营业执照有效期：" >
          <div class="inputInfo">{{ form.license }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="营业执照编号：" >
          <div class="inputInfo">{{ form.licenseCode }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="出版物经营许可证有效期：" >
          <div class="inputInfo">{{ form.publicationsTime }}</div>
        </el-form-item> -->
        <el-form-item v-if="form.surveyReport !== ''|| form.surveyReport !== undefined" label="质检报告" labelWidth="200px">
            <img :src="imageDomain + form.surveyReport" />
          </el-form-item>
          <el-form-item v-if="form.foodTradeLicence !== ''|| form.foodTradeLicence !== undefined" label="食品流通许可证" labelWidth="200px">
            <img :src="imageDomain + form.foodTradeLicence" />
          </el-form-item>
          <el-form-item v-if="form.drinkTradeLicence !== ''|| form.drinkTradeLicence !== undefined" label="酒类流通备案登记表" labelWidth="200px">
            <img :src="imageDomain + form.drinkTradeLicence" />
          </el-form-item>
          <el-form-item v-if="form.businessImage !== ''|| form.businessImage !== undefined" label="营业执照" labelWidth="200px">
            <img :src="imageDomain + form.businessImage" />
          </el-form-item>
          <el-form-item  labelWidth="200px" label="营业执照有效期：" >
            <div class="inputInfo">{{ form.busLicenceDeadline }}</div>
          </el-form-item>
          <el-form-item  labelWidth="200px" label="营业执照编号：" >
            <div class="inputInfo">{{ form.socialCreditCode }}</div>
          </el-form-item>
          <el-form-item v-if="form.paperTradeLicence !== ''|| form.paperTradeLicence !== undefined" label="出版物经营许可证" labelWidth="200px">
            <img :src="imageDomain + form.paperTradeLicence" />
          </el-form-item>
          <el-form-item v-if="form.paperTradeDeadline !== ''||form.paperTradeDeadline !== undefined" label="出版物经营许可证有效期：" labelWidth="200px">
            <div class="inputInfo">{{ form.paperTradeDeadline }}</div>
          </el-form-item>
      </div>
      <div class="infoWrap">
        <h2>商标信息</h2>
        <p class="tips">注：店铺包含“旗舰、专卖”，商家必须上传品牌授权或独占授权证明，需授权店铺从属人在丫贝网经营该品牌产品</p>
        <div v-for="(item, index ) in form.merchantBrandinfoResDtos" :key="index">
          <el-form-item  label="注册类型：" labelWidth="200px">
            <div class="inputInfo">{{ item.brandRegistType }}</div>
          </el-form-item>
          <el-form-item   label="商品注册号：" labelWidth="200px">
            <div class="inputInfo">{{ item.brandRegistCode }}</div>
          </el-form-item>
          <!-- <el-form-item labelWidth="200px" label="商标注册证明：">
            <el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="item.brandCertifyImage"
                        :show-file-list="false"  >
              <img v-if="item.brandCertifyImage" :src="imageDomain + item.brandCertifyImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item> -->
          <el-form-item v-if="item.brandCertifyImage !== ''|| item.brandCertifyImage !== undefined" label="品牌授权证明：" labelWidth="200px">
            <img :src="imageDomain + item.brandCertifyImage" />
          </el-form-item>
          <el-form-item v-if="item.brandAuthImage !== ''|| item.brandAuthImage !== undefined" label="品牌授权证明：" labelWidth="200px">
            <img :src="imageDomain + item.brandAuthImage" />
          </el-form-item>
          <!-- <el-form-item labelWidth="200px" label="品牌授权证明：">
            <el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="item.brandAuthImage"
                        :show-file-list="false"  >
              <img v-if="item.brandAuthImage" :src="imageDomain + item.brandAuthImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item> -->
          <el-form-item   label="品牌授权有效期：" labelWidth="200px">
            <div class="inputInfo">{{ item.brandAuthDeadline }} （截止日期）</div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog title="历史审核意见" :visible.sync="dialogVisible" width="60%" center >
      <el-table :data="tableData" border fit>
        <el-table-column label="审核结果">
          <template slot-scope="scope">
            {{ resultType[scope.row.approvalType]}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" ></el-table-column>
        <el-table-column prop="updateTime" label="审核时间" ></el-table-column>
        <el-table-column prop="reason" label="审核意见" ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { getAptitudeInfo , getApproveList} from "@/api/userCenter"

  export default {
    name: "tab4",
    data() {
      return {
        labelWidth:'160px',
        form: {
          shopname:'',
          legalRepName: '',
          cardId: '',
          cardDeadline:'',
          license:'',
          imgList: [],
          licenseCode: '',
          publications: '',
          registrationType: '',
          grantTime: '',
          companyName: '',
          companyAddress:'',
          busLicenceDeadline:'',
          socialCreditCode:'' ,
          merchantBrandinfoResDtos:[
            {
              brandRegistType:'',
              brandRegistCode:'',
              brandCertifyImage:'',
              brandAuthImage:'',
              brandAuthDeadline:''
            }
          ]
        },
        imageDomain : process.env.IMAGE_DOMAIN , //获取图片的外链域名
        imgUrl: process.env.BASE_API+'/file/upload',   // 上传图片的域名
        imgType: [],
        tableData: [],
        dialogVisible: false ,
        resultType: ['审核通过','审核拒绝']
      }
    },
    mounted() {
      this.getInfo() ;
      this.getApproveList();
      // this.form =
    },
    methods: {
      // 获取审批历史记录
      getApproveList(){
        getApproveList().then( res =>{
          this.tableData = res.data.data
          console.log(res)
        })
      },
      getInfo(){
        getAptitudeInfo().then( res => {
          console.log('res',res)
          if(res.data.status === '000000000'){
            this.form = res.data.data ;
          }
        })
      }
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
