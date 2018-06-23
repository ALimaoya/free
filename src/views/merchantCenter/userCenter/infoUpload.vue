<template>
  <div class="infoUpload">
    <h1>资质上传</h1>
    <el-form :model="form" ref="form" label-position="right" >
      <!--<h2>账户表单</h2>-->
      <el-form-item  labelWidth="130px" label="店铺负责人"  prop="name">
        <el-input class="inputInfo" size="small" v-model.trim="form.name" placeholder="店铺负责人" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item   labelWidth="130px"  label="身份证号" prop="idCard">
        <el-input class="inputInfo" :maxLength="20" size="small" v-model.trim="form.realName" :disabled="readOnly" placeholder="144242342"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="企业名称" prop="password">
        <el-input class="inputInfo" size="small" v-model.trim="form.password" :disabled="readOnly" placeholder="企业名称"></el-input>
      </el-form-item>
      <el-form-item  labelWidth="130px" label="邮箱" prop="email">
        <el-input class="inputInfo" size="small" v-model.trim="form.email" :disabled="readOnly" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item class="imgWrap"  label="资质" prop="imgList">
        <ul >
          <li v-for="(item,index) in form.imgList" :key="index" @click="bigImg(index,item.src)" >
              <span class="img_Title">{{ imgType[index] }}</span>
              <img  v-if="item.src !== undefined" :src="item.src" alt="" />
              <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
            <!--</dl>-->
          </li>
        </ul>
      </el-form-item>

    </el-form>
    <el-dialog :title="imgTitle" :visible.sync="dialogVisible" width="60%" center>
      <div class="wrap">
        <!--<img :src="ImgSrc" alt="" />-->
        <img src="../../../assets/imgs/logo.png" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import ElFormItem from "element-ui/packages/form/src/form-item";

    export default {
      components: {ElFormItem},
      name: "info-upload",
      data(){
          return{
            form : {
              imgList : [
                {
                },
                {

                },
                {

                },
                {

                }
              ],
            },
            readOnly : true,
            imgType : ['营业执照','授权证书','身份证（正面）','身份证（反面）'],

            imgTitle : '',
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
          this.imgTitle = this.imgType[index] ;
          // this.ImgSrc = src ;
          this.dialogVisible = true ;
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
  h1{
    margin : 0 ;
    padding : 0.2rem  0.4rem ;
    border-bottom : 1px solid #666 ;
    font-size : 0.22rem ;
    line-height : 0.4rem ;
    height : 0.7rem ;

  }
  .el-form{
    margin-top : 0.5rem ;
    justify-content: flex-start;
    .el-form-item{
      width : 40% ;
    }
    .imgWrap{
      width : 90% ;
      margin-left : 80px ;
      ul{
        width :70% ;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        li{
          width : 20% ;

          img{
            width : 100% ;
          }
        }
      }
    }
  }
</style>

