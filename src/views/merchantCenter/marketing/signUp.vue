<template>
    <div class="sign-up">
      <el-button type="danger" @click="signNow" size="mini" v-if="!goOther">立即报名</el-button>
      <component  :is="tabView" @getContent="signContent"></component>

    </div>

</template>

<script>
  import chooseDate from "@/views/merchantCenter/marketing/chooseDate";
  import signContent from "@/views/merchantCenter/marketing/signContent"

  export default {
      name: "sign-up",
      components: {
        chooseDate,
        signContent
      },
        data() {
            return {
              type : '1',
              tabView: '',
              goOther: false ,
            }
        },
        mounted() {
          //获取活动类型
          // this.type = this.$route.query.type ;

        },
        methods: {
          signNow(){
            this.tabView = 'chooseDate';
            this.goOther = true ;
          }
        }
    }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
