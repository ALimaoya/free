<template>
  <div class="step3">
    <h1>缴纳保证金</h1>
    <el-form ref="form" :model="form"  center label-position="top">
      <el-form-item  label="结算渠道"  >
        <el-input type="text" size="small" :disabled="readOnly" placeholder="支付宝"></el-input>
      </el-form-item>
      <el-form-item  label="额度" >
        <el-input type="text" size="small" :disabled="readOnly" v-model="bond" placeholder=""></el-input>
      </el-form-item>

    </el-form>
    <el-button v-if="isBond" type="primary" size="small" @click="goDetail">查看</el-button>
    <el-button v-else-if="!isBond" type="primary" size="small" @click="handleBond">缴纳保证金</el-button>

  </div>

</template>

<script>
    export default {
      name: "step3",
      data(){
        return {
          form : {},
          bond : '',
          readOnly : true,
          isBond : false ,
        }
      },
      mounted(){
        this.form = this.$store.state.step.userInfo ;
        // this.getBond =
      },
      methods : {
        getBond(){
          // this.bond =
        },
        goDetail(){
          this.$router.push('/merchantCenter/userCenter/bond') ;
        },
        handleBond(){

        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
</style>
