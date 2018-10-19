<template>
  <section class="app-main">
    <!--<keep-alive>-->
      <transition name="fade" mode="out-in">
        <router-view class="content" :key="key" ></router-view>
        <!--<router-view></router-view>-->
      </transition>
    <!--</keep-alive>-->

    <back-top :visibilityHeight="300" :backPosition="50"></back-top>

  </section>

</template>

<script>
  import BackTop from "@/components/BackTop"

  export default {
    name: 'AppMain',

    components: {
      BackTop

    },
    computed: {
      key() {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      },
      keepAlive(){
          if(this.$route.meta.keepAlive!==undefined){
            return this.$route.meta.keepAlive
          } else {
            return true
          }
  }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .app-main {
    width: 100%;
    margin: 143px auto;
    padding: 0.3rem 0.2rem;
    box-sizing: border-box;
    font-size: 0.14rem;
    .content {
      margin-bottom: 0.5rem;
    }
  }
</style>

