<template>
  <section class="app-main">
    <top></top>
    <transition name="fade" mode="out-in">
       <router-view :key="key"></router-view>

      <!--<router-view></router-view>-->
    </transition>
  </section>
</template>

<script>
  import  Top  from '@/components/Top'

  export default {
  name: 'AppMain',
    components : {
      Top
    },
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .app-main{
    width : 100% ;
    margin : 0 auto ;
    padding : 0.3rem 0.2rem ;
    box-sizing: border-box;
    font-size : 0.15rem ;
  }
</style>

