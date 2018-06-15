<template>
  <div class="step1">
    <h1>资质上传</h1>
    <el-form ref="form" :model="form"  center label-position="top">
      <el-form-item label="店铺负责人"  >
        <el-input type="text" size="small" v-model="form.name" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item label="Email" >
        <el-input type="text" size="small" :disabled="readOnly" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input type="text" size="small" v-model="form.id" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input type="text" size="small" v-model="form.enterprise" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item class="imgWrap" v-for="(item,index) in ImgList" :key="index">
        <dl @click="BigImg(index,item.src)">
          <dt>{{ imgType[index] }}</dt>
          <dd>
            <img v-if="item.src !== undefined" :src="item.src" alt="" />
            <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
          </dd>
        </dl>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="goDetail">查看</el-button>
    <el-dialog :title="imgTitle" :visible.sync="dialogVisible" width="60%" center>
      <!--<img :src="ImgSrc" alt="" />-->
    <img src="../../../assets/imgs/logo.png" />
    </el-dialog>
  </div>
</template>

<script>
    import ElFormItem from "element-ui/packages/form/src/form-item";
    import ElUpload from "element-ui/packages/upload/src/index";

    export default {
      components: {
        ElUpload,
        ElFormItem
      },
      name: "step1",
      props : ['getData'],
      data(){
          return {
            // form : this.getData ,
            form : {
              name : '年青人',
              email : '12121',
              id : '1342432423',
              enterprise : '河南年青人电子商务有限公司'
            },
            readOnly : true,
            imgType : ['营业执照','授权证书','身份证（正面）','身份证（反面）'],
            ImgList : [
              {
              },
              {

              },
              {

              },
              {

              }
            ],
            imgTitle : '',
            ImgSrc : '',
            dialogVisible: false,
          }
      },
      mounted(){
        // this.form  = (user)
      },
      computed:{
        // form : function(){
        //   return this.$store.state.step.userInfo
        //
        // }
      },
      methods: {
          goDetail(){
            this.$router.push('/merchantCenter/userCenter/infoUpload') ;
          },
        BigImg(index,src){

            this.imgTitle = this.imgType[index] ;
            // this.ImgSrc = src ;
            this.dialogVisible = true ;
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
</style>
