<template>
  <div class="step3">
    <h1>缴纳保证金</h1>
    <el-form ref="form" :model="form"  center label-position="top">
      <el-form-item  label="结算渠道"  >
        <el-input type="text" size="small" :disabled="readOnly" placeholder="支付宝"></el-input>
      </el-form-item>
      <el-form-item  label="额度" >
        <el-input type="text" size="small" :disabled="readOnly" v-model="this.deposit" placeholder=""></el-input>
      </el-form-item>

    </el-form>
    <el-button v-if="isBond" type="primary" size="small" @click="goDetail">查看</el-button>
    <el-button v-else-if="!isBond" type="primary" size="small" @click="handleBond">缴纳保证金</el-button>

  </div>

</template>

<script>
  import { rechargeBond } from "@/api/userCenter"
    export default {
      name: "step3",
      props: ['deposit','step3Status'],
      data(){
        return {
          form : {},
          bond : '',
          readOnly : true,
          isBond : false ,
        }
      },
      mounted(){
        if(this.step3Status === '0'){
          this.isBond = false ;

        }else{
          this.isBond = true ;

        }
      },
      methods : {

        goDetail(){
          this.$router.push('/merchantCenter/userCenter/bond') ;
        },
        handleBond(){
          rechargeBond().then(res=> {
            if(res.data.status === '000000000'){
                console.log(res);

            }else{
              this.$message({
                message : res.data.message,
                center: true ,
                type : 'error'
              });

            }
          }).catch( err => {
            alert('服务器开小差啦，请稍等~')

          })
        }
      }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import '../../../styles/step';
</style>
