<template>
  <div class="openShop">
    <h1>我要开店</h1>
    <el-form :model="form" ref="form" label-position="right" >
      <!--<h2>账户表单</h2>-->
      <el-form-item  labelWidth="130px" label="店铺名称"  prop="name">
        <el-input class="inputInfo" :maxLength="20" size="small" v-model.trim="form.name" placeholder="店铺名称" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="店铺LOGO" prop="logo">
        <div class="imgWrap">
          <span class="img_Title">LOGO</span>
          <img  v-if="form.src !== undefined" @click="bigImg(index,form.src)" :src="form.src" alt="" />
          <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
          <!--</dl>-->
        </div>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="主营" prop="main">
        <el-input type="textarea" class="inputInfo"  :rows="4" size="small" v-model.trim="form.main" :disabled="readOnly" placeholder="主营"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="类型" prop="type">
        <el-input class="inputInfo" size="small" v-model.trim="form.type" :disabled="readOnly" placeholder="类型"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="描述" prop="intro">
        <el-input class="inputInfo" size="small" type="textarea"  :rows="4" v-model.trim="form.intro" :disabled="readOnly" placeholder="描述"></el-input>
      </el-form-item>


    </el-form>
    <el-dialog title="店铺LOGO" :visible.sync="dialogVisible" width="60%" center>
      <div class="wrap">
        <!--<img :src="ImgSrc" alt="" />-->
        <img src="../../../assets/imgs/logo.png" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "open-shop",
      data(){
        return{
          form : {

          },
          readOnly : true,
          ImgSrc : '',
          dialogVisible: false,
        }
      },
      mounted(){
        this.getInfo();
      },
      methods : {
        //获取信息
        getInfo(){
          // ths.form =
        },
        bigImg(index,src){
          // this.ImgSrc = src ;
          this.dialogVisible = true ;
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  .el-form{
    margin-top : 0.5rem ;
  }
    .el-form-item{
      width : 60%!important; ;
    }
    .imgWrap{
      width : 150px ;
      float : left ;
      span,img{
        width : 100% ;
      }

  }
</style>
