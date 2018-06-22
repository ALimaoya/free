<template>
  <div class="tab4 tab">
    <el-form :model="form" ref="form" label-position="right" >
      <h1>资质信息</h1>
      <div class="check"><svg-icon icon-class="check_ico" /><span>审核通过</span><span @click="dialogVisible = true;">历史审核意见</span></div>
      <div class="infoWrap">
        <h2>店铺主体信息</h2>
        <el-form-item  labelWidth="200px" label="店铺名称：" >
          <div class="inputInfo">{{ form.shopName }}</div>
        </el-form-item>
      </div>
      <div class="infoWrap">
        <h2>法定代表人证件信息</h2>
        <el-form-item  labelWidth="200px" label="法定代表人姓名：" >
          <div class="inputInfo">{{ form.userName }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="法定代表人身份证号：" >
          <div class="inputInfo">{{ form.idCard }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="身份证号有效期：" >
          <div class="inputInfo">{{ form.validity }}</div>
        </el-form-item>
      </div>
      <div class="infoWrap">
        <h2>入驻企业信息</h2>
        <el-form-item  labelWidth="200px" label="公司名称：" >
          <div class="inputInfo">{{ form.companyName }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="公司经营地址：" >
          <div class="inputInfo">{{ form.address }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="营业期限：" >
          <div class="inputInfo">{{ form.companyTime }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="社会信用代码：" >
          <div class="inputInfo">{{ form.creditCode }}</div>
        </el-form-item>
      </div>
      <div class="infoWrap">
        <h2>类目资质</h2>
        <el-form-item labelWidth="200px" :label="imgType[item.type]" v-for="(item,index) in form.imgList" :key="index">
          <el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="item.url"
                      :show-file-list="false"  >
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
        </el-form-item>
      </div>
      <div class="infoWrap">
        <h2>商标信息</h2>
        <p class="tips">注：店铺包含“旗舰、专卖”，商家必须上传品牌授权或独占授权证明，需授权店铺从属人在丫贝网经营该品牌产品</p>
        <el-form-item  labelWidth="200px" label="注册类型：" >
          <div class="inputInfo">{{ form.registrationType }}</div>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="商品注册号：" >
          <div class="inputInfo">{{ form.registrationCode }}</div>
        </el-form-item>
        <el-form-item labelWidth="200px" label="商标注册证明：">
          <el-upload  class="upload"  :action="imgUrl" :multiple="false" v-model.trim="form.registerImg"
                      :show-file-list="false"  >
            <img v-if="form.registerImg" :src="imageDomain + form.registerImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item labelWidth="200px" label="品牌授权证明：">
          <el-upload v-for="(item,index) in grantImgList" :key="index" class="upload"  :action="imgUrl" :multiple="false" v-model.trim="form.grantImgList"
                      :show-file-list="false"  >
            <img v-if="item" :src="imageDomain + item" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item  labelWidth="200px" label="品牌授权有效期：" >
          <div class="inputInfo">{{ form.grantTime }} （截止日期）</div>
        </el-form-item>
      </div>
    </el-form>
    <el-dialog title="历史审核意见" :visible.sync="dialogVisible" width="60%" center >
      <el-table :data="tableData" border fit>
        <el-table-column  label="审核结果">
          <template slot-scope="scope">
            {{ resultType[scope.row.result]}}
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" ></el-table-column>
        <el-table-column prop="changeModal" label="修改模块" ></el-table-column>
        <el-table-column prop="checkTime" label="审核时间" ></el-table-column>
        <el-table-column prop="checkView" label="审核意见" ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "tab4",
    data() {
      return {
        form: {
          shopName:'',
          userName: '',
          idCard: '',
          validity:'',
          license:'',
          imgList: [],
          licenseCode: '',
          publications: '',
          registrationType: '',
          registrationCode: '',
          grantTime: '',
          companyName: '',
          address:'',
          companyTime:'',
          creditCode:'' ,
          registerImg: '',
          grantImgList: ''
        },
        imageDomain : process.env.IMAGE_DOMAIN , //获取图片的外链域名
        imgUrl: process.env.BASE_API+'/tryout/file/upload',   // 上传图片的域名
        imgType: [],
        tableData: [],
        dialogVisible: false ,
        resultType: ['','审核通过','审核拒绝']
      }
    },
    mounted() {
      // this.form =
    },
    methods: {

    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/tab';

</style>
