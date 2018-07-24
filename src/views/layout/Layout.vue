<template>
  <div class="app-wrapper" >
    <top></top>
    <main-container></main-container>
  </div>
</template>

<script>
  import Top from "@/components/top";
  import   { MainContainer }  from '@/views/layout/components'

  export default {
  name: 'layout',
  components: {
    Top,
    MainContainer
  },

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  /*display: flex;*/
}
</style>
