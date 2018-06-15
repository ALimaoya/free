<template>
  <div class="step4">
    <h1>我要开店</h1>
    <el-form ref="form" :model="form"  center label-position="top">
      <el-form-item label="店铺名称"  >
        <el-input type="text" size="small" v-model="form.shopName" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item label="主营" >
        <el-input type="text" size="small" :disabled="readOnly" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input type="text" size="small" v-model="form.type" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="text" size="small" v-model="form.enterprise" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item class="imgWrap">
        <dl >
          <dt>店铺LOGO</dt>
          <dd>
            <img v-if="form.src !== undefined" :src="item.src" alt="" />
            <img  src="../../../assets/imgs/logo.png"  alt="" v-else/>
          </dd>
        </dl>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="goDetail">查看</el-button>
  </div>

</template>

<script>
    export default {
      name: "step4",
      data(){
        return {
          form : {},
          readOnly : true
        }
      },
      computed:{
        // form : function(){
        //   return this.$store.state.step.userInfo
        //
        // }
      },
      methods : {
        goDetail(){
          this.$router.push('/merchantCenter/userCenter/OpenShop') ;
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
</style>
