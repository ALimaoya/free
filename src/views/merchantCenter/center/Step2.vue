<template>
  <div class="step2">
    <h1>绑定账号</h1>
    <el-form ref="form" :model="form"  center label-position="top">
      <el-form-item label="结算渠道"  >
        <el-input type="text" size="small" v-model="form.name" :disabled="readOnly"></el-input>
      </el-form-item>
      <el-form-item label="账号" >
        <el-input type="text" size="small" :disabled="readOnly" v-model="form.account"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="goDetail">查看</el-button>

  </div>
</template>

<script>
    export default {
        name: "step2",
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
          this.$router.push('/merchantCenter/userCenter/postSetting') ;
        }
      }

    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
</style>
